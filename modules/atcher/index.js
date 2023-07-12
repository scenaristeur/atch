import Watcher from "watcher";

export class Atcher {
  constructor(options = {}) {
    this.options = options;
    //console.log(this.options)
    this.init();
  }
  init() {
    const watcher = new Watcher(this.options.workspace, { recursive: true });

    watcher.on("error", (error) => {
      console.log(error instanceof Error); // => true, "Error" instances are always provided on "error"
    });
    watcher.on("ready", () => {
      console.log("### ATCHER ready");
      // The app just finished instantiation and may soon emit some events
    });
    watcher.on("close", () => {
      console.log("### ATCHER closed");
      // The app just stopped watching and will not emit any further events
    });
    watcher.on("all", (event, targetPath, targetPathNext) => {
      this.options.io.emit("atcher", { event, targetPath, targetPathNext });
      console.log(event); // => could be any target event: 'add', 'addDir', 'change', 'rename', 'renameDir', 'unlink' or 'unlinkDir'
      console.log(targetPath); // => the file system path where the event took place, this is always provided
      console.log(targetPathNext); // => the file system path "targetPath" got renamed to, this is only provided on 'rename'/'renameDir' events
    });
    watcher.on("add", (filePath) => {
      console.log(filePath); // "filePath" just got created, or discovered by the watcher if this is an initial event
    });
    watcher.on("addDir", (directoryPath) => {
      console.log(directoryPath); // "directoryPath" just got created, or discovered by the watcher if this is an initial event
    });
    watcher.on("change", (filePath) => {
      console.log(filePath); // "filePath" just got modified
    });
    watcher.on("rename", (filePath, filePathNext) => {
      console.log(filePath, filePathNext); // "filePath" got renamed to "filePathNext"
    });
    watcher.on("renameDir", (directoryPath, directoryPathNext) => {
      console.log(directoryPath, directoryPathNext); // "directoryPath" got renamed to "directoryPathNext"
    });
    watcher.on("unlink", (filePath) => {
      console.log(filePath); // "filePath" got deleted, or at least moved outside the watched tree
    });
    watcher.on("unlinkDir", (directoryPath) => {
      console.log(directoryPath); // "directoryPath" got deleted, or at least moved outside the watched tree
    });
  }
}
