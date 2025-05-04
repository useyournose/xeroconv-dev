import XLSX from "xlsx";
import csv2labradar from "./csv2labradar";
import { showError } from "./messages";

export default function xls2labradar(fileData:ArrayBuffer,ofilename:string):Promise<File[]> {
  return new Promise(async (resolve,reject) => {
    const files:File[] = []
    const xlsfile = XLSX.read(fileData, {type:"array"});
    var promises:Promise<boolean>[] = xlsfile.SheetNames.map(async (sheetname) => {
      return new Promise((resolve,reject) => {
        const worksheet = xlsfile.Sheets[sheetname]
        const csvdata = XLSX.utils.sheet_to_csv(worksheet);
        const title = csvdata.split('\n')[0].replace(/,{2,}/g,'').replace(/"/g,'');
        csv2labradar(csvdata,title+'.csv')
        .then((file) => {
          files.push(file)
          console.log("[xls2labradar]: parsed "+sheetname);
          return resolve(true)
        })
        .catch((err) => {
          console.warn("[xls2labradar]: "+err);
          showError(err);
          return reject(err)
        })
      })
    })
    await Promise.allSettled(promises)
    .then((values) => {
      return resolve(files)
    })
    .catch((err) => {
      return reject(err)
    })
  })
}