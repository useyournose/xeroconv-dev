import { GetFiles } from "./services/queryService";

export async function renderTable() {
    const tbody = document.querySelector("#table tbody");
    tbody.innerHTML = "";

    // toArray returns a Promise with all matching objects
    const rows = await GetFiles()
    rows.forEach(elem => {
        const tr = document.createElement("tr");
        tr.dataset.fileid = elem.id.toString();
        
        const tdCb = document.createElement("td");
        
        const Cb = document.createElement("input");
        Cb.type="checkbox";
        Cb.className = "checkbox";
        if (elem.checked == 1) {
            Cb.checked = true
        }
        tdCb.appendChild(Cb);
        tr.appendChild(tdCb);

        const tdId = document.createElement("td");
        tdId.textContent = elem.id.toString() ?? "";
        tr.appendChild(tdId);

        const tdName = document.createElement("td");
        tdName.textContent = elem.name ?? "";
        tr.appendChild(tdName);

        const tdTitle = document.createElement("td");
        tdTitle.textContent = elem.title ?? "";
        tr.appendChild(tdTitle);

        const tdShotCount = document.createElement("td");
        tdShotCount.textContent = elem.shotcount.toString() ?? "";
        tr.appendChild(tdShotCount);

        const tdCreated = document.createElement("td");
        tdCreated.textContent = new Date(elem.timestamp * 1000).toLocaleString() ?? "";
        tr.appendChild(tdCreated);
        tbody.appendChild(tr)

        const tdDate = document.createElement("td");
        tdDate.textContent = new Date(elem.added).toLocaleString() ?? "" ;
        tr.appendChild(tdDate);
        tbody.appendChild(tr)
    })
}