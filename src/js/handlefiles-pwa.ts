import fit2labradar from "./fit2labradar";
import csv2labradar from "./csv2labradar";
//import xls2labradar from "./xls2labradar";
import xls2labradar from "./xls2labradar_v2";
import { showError } from "./messages";

async function fileSystemHandleToArrayBuffer(fileHandle: FileSystemFileHandle):
    Promise<ArrayBuffer> {
        // Get the file from the file handle
        const file = await fileHandle.getFile();
        
        // Read the file as an ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        
        return arrayBuffer;
    }

export async function handleFilesPwa(files:readonly FileSystemFileHandle[]) {
    for (const file of files) {
        const fileData = await fileSystemHandleToArrayBuffer(file)
        if (/\.fit$/g.test(file.name)) {
            const result_f:Promise<string> = fit2labradar(fileData, file.name)
            result_f.then((value) => {console.log("[handlefiles]: success")},(error) => {showError(error)});
        } else if (/\.csv$/g.test(file.name)) {
            const result_c:Promise<string> = csv2labradar(fileData, file.name);
            result_c.then((value) => {console.log("[handlefiles]: success")},(error) => {showError(error)});
        } else if (/\.xlsx?$/g.test(file.name)) {
            const result_x:Promise<string> = xls2labradar(fileData, file.name);
            result_x.then((value) => {console.log("[handlefiles]: success")},(error) => {showError(error)});
        } else {
            console.error('[handlefiles]: what is ' + file.name + ' doing here?');
        }
    }      
}