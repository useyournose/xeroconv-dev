import {test,expect, mock, spyOn, afterEach, beforeAll, setSystemTime} from 'bun:test';
import fit2labradar from './fit2labradar';
import fs from 'node:fs';
import * as Messages from './messages';

async function readFileAsync(filePath:string) {
  try {
      const data = await fs.promises.readFile(filePath, null);
      return new Uint8Array(data)
  } catch (error) {
      console.error('Error reading file:', error.message);
      return null;
  }
}

beforeAll(() => {
  setSystemTime(new Date("2024-01-01T00:00:00.000B"));
  mock.restore();
});

afterEach(function() {
  mock.restore();
})

test('file should be nice', async () => {
  const successmessagespy = spyOn(Messages,'showSuccess');

  const filename = '06-18-2024_15-47-11.fit';
  const expected = fs.readFileSync('src/_tests/assets/06-18-2024_15-47-11.expected.csv', 'utf8');

  const arrayBuffer = await readFileAsync('src/_tests/assets/06-18-2024_15-47-11.fit')
  if (arrayBuffer) {
    const result:Promise<File> = fit2labradar(arrayBuffer.buffer as ArrayBuffer,filename)
    result
    .then((file) => {
      console.log(file)
      file.text().then((text) => {expect(text).toBe(expected)}); // issues with the timeconversion})
      expect(file.name).toBe('06-18-2024_15-47-11-xeroconv.csv');
      expect(successmessagespy.mock.calls[0][0]).toBe('Saved 06-18-2024_15-47-11-xeroconv.csv.');
      expect(successmessagespy).toHaveBeenCalledTimes(1);
    })
    .catch((error) => {
      Messages.showError(error)
    });
  }
});

test('file should fail - currupt', async () => {
  const filename = 'broken.fit';
  const arrayBuffer = await readFileAsync('src/_tests/assets/broken.fit')
  if (arrayBuffer) {
    const result:Promise<File> = fit2labradar(arrayBuffer.buffer as ArrayBuffer,filename)
    expect(result).rejects.toThrow();
  }
});

test('file should fail - currupt 2', async () => {
  const successmessagespy = spyOn(Messages,'showSuccess');

  const filename = 'broken.fit';
  const arrayBuffer = await readFileAsync('src/_tests/assets/broken.fit')
  if (arrayBuffer) {
    const result:Promise<File> = fit2labradar(arrayBuffer.buffer as ArrayBuffer,filename)
    result
    .catch((error) => {
      expect(successmessagespy).not.toHaveBeenCalled();
      expect(error).toBe("Error: broken.fit - not a working fit file.");
    });
  }
});

test('file should fail - no shots data', async () => {
  const successmessagespy = spyOn(Messages,'showSuccess');

  const filename = 'noshots.fit';
  const arrayBuffer = await readFileAsync('src/_tests/assets/noshots.fit')
  if (arrayBuffer) {
    const result:Promise<File> = fit2labradar(arrayBuffer.buffer as ArrayBuffer,filename)
    result.then(
      (file) => {},
      (error) => {
        expect(error).toBe("Error: noshots.fit does not contain shot sessions.")
        expect(successmessagespy).not.toHaveBeenCalled();
    });
  }
});