import { showSuccess } from "./messages";
import { openModal } from "./modals";
import downloadFiles  from "./downloadFiles";

export default function download(files:File[]):Promise<boolean|string> {
  return new Promise((resolve,reject) => {
    if (!(navigator.share === undefined) && navigator.canShare({files})) {
      console.log('Sharing files is supported');
      const target = document.getElementById('modal-download');
      const shareButton = document.getElementById('dl-share');
      const dlButton = document.getElementById('dl-store');
      shareButton.addEventListener('click', async () => {
        try{
          await navigator.share({title : "Open Files", text : "with your preferred app", files : files})
          console.log("[download]: file saved.");
          showSuccess("Saved via fileshare.");
          resolve(true)
        } catch (err) {
          console.error(`The file could not be shared: ${err}`);
        }
      })
        
      dlButton.addEventListener('click', () => {
        downloadFiles(files)
      })
      openModal(target);
    } else {
      console.info('Sharing files is not supported');
      //inspired from https://stackoverflow.com/a/18197341
      return downloadFiles(files)
    }
  })
}