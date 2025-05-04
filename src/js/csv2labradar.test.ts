import { test, expect, spyOn, afterEach, mock, beforeEach } from "bun:test";
import csv2labradar from './csv2labradar';

import * as fs from 'fs';

afterEach(function() {
  mock.restore();
})

test('file should be nice - android', async () => {
  
  const filename = 'Shotview_a.csv'
  const data = fs.readFileSync('src/_tests/assets/Shotview_a.csv', 'utf8');
  const expected = fs.readFileSync('src/_tests/assets/Shotview_a.expected.csv', 'utf8');
  const buffer = Buffer.from(data);

  const result:Promise<File> = csv2labradar(buffer.buffer as ArrayBuffer,filename);
  result.then((file) => {
    expect(file.name).toBe('Shotview_a_02-07-2024_17-08-00-xeroconv.csv');
    file.text().then((text) => expect(text).toBe(expected))
    
  })
});

test('file should be nice - ios', () => {
  const filename = 'Shotview_i.csv'
  const data = fs.readFileSync('src/_tests/assets/Shotview_i.csv', 'utf8');
  const buffer = Buffer.from(data);

  const result:Promise<File> = csv2labradar(buffer.buffer as ArrayBuffer,filename);
  result.then((file) => {
    expect(file.name).toBe('Shotview_i_06-04-2024_13-36-00-xeroconv.csv');
  })
});

test('file should be nice - ios - de', () => {
  const filename = 'Shotview_i_de.csv'
  const data = fs.readFileSync('src/_tests/assets/Shotview_i_de.csv', 'utf8');
  const expected = fs.readFileSync('src/_tests/assets/Shotview_i_de.expected.csv', 'utf8');
  const buffer = Buffer.from(data);

  const result:Promise<File> = csv2labradar(buffer.buffer as ArrayBuffer,filename);
  result.then((file) => {
    expect(file.name).toBe('Shotview_i_de_08-02-2025_10-08-00-xeroconv.csv');
    file.text().then((text) => expect(text).toBe(expected))
  })
});

test('file should throw', () => {
  const filename = 'Shotview_brokendate.csv'
  const data = fs.readFileSync('src/_tests/assets/Shotview_a_brokendate.csv', 'utf8');
  const buffer = Buffer.from(data);

  const result:Promise<File> = csv2labradar(buffer.buffer as ArrayBuffer,filename);
  result.then((file) => {
    expect(file.name).toBe("false")
  }).catch((error) => {
    expect(error).toBe('Date Quarz 02, 2024 17:08 does not parse. Ping the dev on github.');
  })
});
