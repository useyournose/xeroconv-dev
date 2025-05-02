import { showSuccess } from "./messages";

export default function download(files:File[]):Promise<boolean|string> {
  return new Promise((resolve,reject) => {
    //inspired from https://stackoverflow.com/a/18197341
    files.forEach((file) => {
      try {
        file.text().then((value) => {
          const element = document.createElement('a');
          element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(value));
          element.setAttribute('download', file.name);
          element.style.display = 'none';
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
          console.log("[download]: file "+ file.name +" saved.");
          showSuccess("Saved " + file.name + ".");
          resolve(true)
        })
      } catch(err) {
        console.error("[download]: " + err);
        if (Object.hasOwn(err,'message')) {
          reject(err.message)
        } else {
          reject(err);
        }
      }
    })
  })  
}