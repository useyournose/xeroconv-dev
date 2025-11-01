import Chart from 'chart.js/auto'
import {Colors} from 'chart.js'
import {HistogramDatasetBinned, RawDataset, BinnedDataset, BinningResult} from "./_types"

Chart.register(Colors);

type HistogramData = number[];

function mean(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
function stddev(arr: number[], mu: number): number {
  return Math.sqrt(arr.reduce((s, x) => s + (x - mu) ** 2, 0) / arr.length);
}
function normalPDF(x: number, mu: number, sigma: number): number {
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) *
         Math.exp(-0.5 * ((x - mu) / sigma) ** 2);
}
function gaussianKernel(u: number): number {
  return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * u * u);
}
function kde(xs: number[], data: number[], bandwidth: number): number[] {
  return xs.map(x =>
    data.reduce((sum, xi) => sum + gaussianKernel((x - xi) / bandwidth), 0) /
    (data.length * bandwidth)
  );
}

function binData(data: HistogramData, binSize: number): { labels: string[]; counts: number[] } {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const bins = Math.ceil((max - min) / binSize);
  const counts = new Array(bins).fill(0);
  const labels = new Array(bins).fill("").map((_, i) => {
    const start = min + i * binSize;
    const end = start + binSize;
    return `${start.toFixed(1)}–${end.toFixed(1)}`;
  });

  data.forEach(value => {
    const index = Math.floor((value - min) / binSize);
    counts[index]++;
  });

  return { labels, counts };
}

export function renderHistogram(canvasId: string, data: HistogramData, binSize: number) {
  const { labels, counts } = binData(data, binSize);

  new Chart(document.getElementById(canvasId) as HTMLCanvasElement, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Frequency',
        data: counts,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        x: { title: { display: true, text: 'Bins' } },
        y: { title: { display: true, text: 'Count' }, beginAtZero: true, stacked: false }
      }
    }
  });
}

/** Choose bin count using one of several rules, then bin multiple datasets.
 *  - method: 'fd' | 'sturges' | 'sqrt' (default 'sturges' for small n)
 *  - minBins / maxBins clamp the output to a readable range
 */
export function autoBinDatasets(
  raw: RawDataset[],
  opts?: {
    method?: 'fd' | 'sturges' | 'sqrt';
    minBins?: number;
    maxBins?: number;
  }
): BinningResult {
  const method = opts?.method ?? 'sturges';
  const minBins = Math.max(2, Math.floor(opts?.minBins ?? 3));
  const maxBins = Math.max(minBins, Math.floor(opts?.maxBins ?? 10));

  const allValues = raw.flatMap(r => r.values).filter(v => Number.isFinite(v));
  if (allValues.length === 0) {
    return {
      labels: [],
      edges: [],
      datasets: raw.map(r => ({ label: r.label, data: [], color: r.color }))
    };
  }

  const n = allValues.length;
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const range = Math.max(Number.EPSILON, max - min);

  function sturgesCount(): number {
    return Math.max(1, Math.ceil(Math.log2(n) + 1));
  }

  function sqrtCount(): number {
    return Math.max(1, Math.ceil(Math.sqrt(n)));
  }

  function fdCount(): number {
    // Freedman-Diaconis bin width: 2 * IQR / n^(1/3) -> bins = range / h
    const sorted = [...allValues].sort((a, b) => a - b);
    const q1 = quantile(sorted, 0.25);
    const q3 = quantile(sorted, 0.75);
    const iqr = q3 - q1 || medianAbsoluteDeviation(sorted) || 1e-9;
    const h = 2 * iqr / Math.cbrt(n) || range / Math.max(1, Math.cbrt(n));
    const bins = Math.max(1, Math.ceil(range / h));
    return bins;
  }

  function quantile(sorted: number[], p: number) {
    const idx = (sorted.length - 1) * p;
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    if (hi === lo) return sorted[lo];
    const w = idx - lo;
    return sorted[lo] * (1 - w) + sorted[hi] * w;
  }

  function medianAbsoluteDeviation(sorted: number[]) {
    const med = quantile(sorted, 0.5);
    const devs = sorted.map(v => Math.abs(v - med)).sort((a, b) => a - b);
    return quantile(devs, 0.5);
  }

  let kRaw: number;
  if (method === 'fd') {
    kRaw = fdCount();
  } else if (method === 'sqrt') {
    kRaw = sqrtCount();
  } else {
    kRaw = sturgesCount();
  }

  // For very small n (3-20), force a sensible minimum and maximum
  let k = Math.min(maxBins, Math.max(minBins, kRaw));

  // Additional heuristic: if n is extremely small, prefer fewer bins
  if (n <= 5) k = Math.min(k, Math.max(2, Math.floor(n / 1.5)));
  if (n <= 10) k = Math.min(k, Math.max(3, Math.floor(n / 1.2)));

  // Build equally spaced edges (inclusive last edge)
  const edges: number[] = [];
  if (k === 1) {
    edges.push(min, max);
  } else {
    for (let i = 0; i <= k; i++) {
      edges.push(min + (i / k) * range);
    }
    edges[edges.length - 1] = max;
  }

  const labels = edges.slice(0, -1).map((lo, i) => {
    const hi = edges[i + 1];
    return `${lo.toFixed(3)} - ${hi.toFixed(3)}`;
  });

  function countsFor(values: number[]) {
    const counts = Array(edges.length - 1).fill(0);
    for (const v of values) {
      if (!Number.isFinite(v)) continue;
      // assign to bin (include left edge, exclude right except for last bin)
      for (let i = 0; i < edges.length - 1; i++) {
        const left = edges[i];
        const right = edges[i + 1];
        const isLast = i === edges.length - 2;
        if ((v >= left && v < right) || (isLast && v === right)) {
          counts[i]++;
          break;
        }
      }
    }
    return counts;
  }

  const datasets: BinnedDataset[] = raw.map(r => ({ label: r.label, data: countsFor(r.values), color: r.color }));

  return { labels, edges, datasets };
}

export function renderHistogramOverlay(
  canvasId: string,
  labels: string[],
  datasets: HistogramDatasetBinned[],
): Chart | null {
  const el = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!el) return null;

  // if re-rendering, destroy existing Chart instance bound to canvas
  // @ts-ignore 
  if ((el as any)._chart) { /* eslint-disable-line @typescript-eslint/no-explicit-any */
    // @ts-ignore
    (el as any)._chart.destroy();
  }

  const chart = new Chart(el, {
    type: 'bar',
    data: {
      labels,
      datasets: datasets.map((ds, i) => ({
        label: ds.label,
        data: ds.data,
        backgroundColor: /*ds.color.replace(/rgba?\((.+)\)/, 'rgba($1,0.5)') ?? */ ds.color,
        borderColor: ds.color,
        borderWidth: 1,
        barPercentage: 1.0,
        categoryPercentage: 1.0,
        order: i
      }))
    },
    options: {
      responsive: true,
      scales: {
        x: { stacked: false },
        y: { beginAtZero: true, stacked: false }
      },
      plugins: {
        legend: { position: 'top' },
        tooltip: { mode: 'index', intersect: false }
      }
    }
  });

  // store reference for later cleanup
  // @ts-ignore
  (el as any)._chart = chart;
  return chart;
}

export function renderKDEOverlay(canvasId:string, RawData:RawDataset[]): Chart | null {

  const el = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!el) return null;

  // if re-rendering, destroy existing Chart instance bound to canvas
  // @ts-ignore 
  if ((el as any)._chart) { /* eslint-disable-line @typescript-eslint/no-explicit-any */
    // @ts-ignore
    (el as any)._chart.destroy();
  }

  // Gemeinsame X-Achse für Dichten
  const globalMin = Math.min(...RawData.flatMap(({values}) => values));
  const globalMax = Math.max(...RawData.flatMap(({values}) => values));
  const widener = (globalMax-globalMin) * 0.25
  const xValues: number[] = [];
  for (let x = globalMin - widener; x <= globalMax + widener; x += 0.2) xValues.push(x);

  // Datasets sammeln
  const datasets: any[] = [];

  RawData.forEach((s, idx) => {
    const mu = mean(s.values);
    const sigma = stddev(s.values, mu);

    // Histogramm
    const binCount = 10;
    const binWidth = (globalMax - globalMin) / binCount;
    const bins = Array(binCount).fill(0);
    s.values.forEach(v => {
      const i = Math.min(Math.floor((v - globalMin) / binWidth), binCount - 1);
      bins[i]++;
    });
    const binCenters = bins.map((_, i) => globalMin + (i + 0.5) * binWidth);

    // Normalverteilung
    const normalValues = xValues.map(x => normalPDF(x, mu, sigma));

    // KDE
    const h = 1.06 * sigma * Math.pow(s.values.length, -1 / 5);
    const kdeValues = kde(xValues, s.values, h);

    // Histogramm-Dataset
    /*datasets.push({
      type: "bar",
      label: `${s.label} Histogramm`,
      data: bins,
      backgroundColor: s.color,
      xAxisID: "xBins" + idx,
      yAxisID: "y"
    });*/

    // Normalverteilung
    /*datasets.push({
      type: "line",
      label: `${s.label} Normal`,
      data: normalValues.map(v => v * s.values.length * binWidth),
      borderColor: s.color,
      fill: false,
      tension: 0.2,
      xAxisID: "xDensity",
      yAxisID: "y"
    });*/

    // KDE
    datasets.push({
      type: "line",
      label: `${s.label} KDE`,
      data: kdeValues.map(v => v * s.values.length * binWidth),
      //borderColor: s.color,
      fill: false,
      tension: 0.2,
      xAxisID: "xDensity",
      yAxisID: "y"
    });
  });


  // Chart Config
    const chart = new Chart(el,{
      type: "line",
      data: {
        labels: xValues.map(v => v.toFixed(1)), // für Dichten
        datasets
      },
      options: {
        responsive: true,
        scales: {
          xDensity: {
            type: "linear",
            position: "bottom",
            min: globalMin - widener,
            max: globalMax + widener,
            title: { display: true, text: "Velocity" }
          },
          y: {
            title: { display: true, text: "Density" }
          }
        },
        elements: {
          point: {
            pointStyle: false
          }
        },
        plugins:{
          /*autocolors: {
            mode: 'dataset'
          },*/
          colors: {
            enabled: true
          }
        }
      }
    });

  // store reference for later cleanup
  // @ts-ignore
  (el as any)._chart = chart;
  return chart;

}