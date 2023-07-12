import fs from "fs";
import path from "path";

export class Fsld {
  constructor(options = {}) {
    this.options = options;
    this.root = options.root || "workspace";
    this.io = options.io;
    //console.log(this.options)
    console.log("### FSLD ready");
  }
  touch(cmd) {
    console.log("touch", cmd.args);
  }
  mkdir(cmd) {
    console.log("mkdir", cmd.args);
  }
  cd(cmd) {
    console.log("cd", cmd.args);
  }
  rm(cmd) {
    console.log("rm", cmd.args);
  }
  move(cmd) {
    console.log("move", cmd.args);
  }
  ls({ socket, args }) {
  
    console.log("ls", args);
    if (socket.current == undefined) {
      socket.current = this.root;
    }
    console.log("socket current:", socket.current);
    let chemin =
      args[0] != undefined
        ? path.join(socket.current, args[0])
        : socket.current;
    console.log("chemin:", chemin);

    fs.readdir(chemin, (err, files) => {
      let response = { folders: [], files: [] };
      files.forEach((file) => {
        if (!file.startsWith(".")) {   // todo accept ls -a to show hidden files
          console.log(file);

          fs.statSync(chemin + "/" + file).isDirectory()
            ? response.folders.push(file)
            : response.files.push(file);
        }
      });

      socket.emit("fsld", { event: "ls", response: response });
    });
  }
}
