import fit2labradar from "./fit2labradar";
import csv2labradar from "./csv2labradar";
//import xls2labradar from "./xls2labradar";
import xls2labradar from "./xls2labradar_v2";
import download from "./downloadhandler";
import { showError } from "./messages";

async function fileSystemHandleToArrayBuffer(fileHandle: FileSystemFileHandle):Promise<ArrayBuffer> {
  // Get the file from the file handle
  const file = await fileHandle.getFile();

  // Read the file as an ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  return arrayBuffer;
}

function fileToArrayBuffer(file:File):Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
      
    reader.readAsArrayBuffer(file); 
  })
}



export async function handleFilesPwa(files:readonly FileSystemFileHandle[] | FileList):Promise<boolean> {
return new Promise(async (resolve,reject) => {
    var localstoragecount = Number(localStorage.total) || 0
    var outfiles:File[] = []
    var outpromises:Promise<boolean|string|number>[] = []

    async function handleFile (file:FileSystemHandle | File):Promise<boolean> {
        var fileData = new ArrayBuffer()
        if (file instanceof FileSystemFileHandle) {
            fileData = await fileSystemHandleToArrayBuffer(file)
        } else if (file instanceof File) {
            fileData = await fileToArrayBuffer(file)
        } else {
            return Promise.reject(false)
        }
        if (/\.fit$/g.test(file.name)) {
            return fit2labradar(fileData, file.name).then((file) => {outfiles.push(file); return Promise.resolve(true)})
        } else if (/\.csv$/g.test(file.name)) {
            return csv2labradar(fileData, file.name).then((file) => {outfiles.push(file); return Promise.resolve(true)})
        } else if (/\.xlsx?$/g.test(file.name)) {
            return xls2labradar(fileData, file.name).then((xlsfiles) => {outfiles = outfiles.concat(xlsfiles);return Promise.resolve(true)})
        } else {
            console.error('[handlefiles]: what is ' + file.name + ' doing here?');
            return Promise.reject(false)
        }
    }
    
    for (const file of files) {
        outpromises.push(handleFile(file))
    }

    await Promise.allSettled(outpromises)
        .then((counter) => {
        //    console.log(counter)
            if (outfiles.length === 0) {
                console.log("nothing here")
            }
            else {
                download(outfiles)}
            }
        )
        .then((result) => {
            console.log(result)
            localstoragecount += outfiles.length
            localStorage.total = localstoragecount
            outpromises.length=0;
            console.log("total converted Files: ", localstoragecount)
            return resolve(true)
        })
        .catch((err) => {
            return reject(false)
        })
  })
}