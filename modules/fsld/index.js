import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export class Fsld {
  constructor(options = {}) {
    this.options = options;
    this.io = options.io;
    //console.log(this.options)
    console.log("### FSLD ready");
    // aliases
    this.ll = this.ls;
  }
  touch({ socket, args }) {
    console.log("touch", args);
    console.log(socket.workspace);
    let response = {};
    args.forEach(function (file) {
      let chemin = path.join(socket.workspace, file);
      let data = JSON.stringify({ "@id": uuidv4(), "@type": "file" });

      fs.writeFile(chemin, data, { flag: "wx" }, function (err) {
        if (err) {
          console.log(err);
          response[file] = err;
          socket.emit("fsld", { event: "touch", file: file, error: err });
        }
      });
    });
  }
  mkdir({ socket, args }) {
    console.log("mkdir", args);
    console.log(socket.workspace);
    let response = {};
    args.forEach(function (file) {
      let chemin = path.join(socket.workspace, file);

      fs.mkdir(chemin, { recursive: true }, function (err) {
        if (err) {
          console.log(err);
          response[file] = err;
          socket.emit("fsld", { event: "mkdir", file: file, error: err });
        }
      });
    });
  }
  cd({ socket, args }) {
    console.log("cd", args);
  }
  rm({ socket, args }) {
    console.log("rm", args);
  }
  move({ socket, args }) {
    console.log("move", args);
  }
  cat({ socket, args }) {
    console.log("cat", args);
  }
  edit({ socket, args }) {
    console.log("edit", args);
  }
  help({ socket, args }) {
    console.log("help", args);
    let response = Object.getOwnPropertyNames(Fsld.prototype).filter(
      (item) =>
        item != "constructor" && typeof Fsld.prototype[item] === "function"
    );
    socket.emit("fsld", { event: "help", response: response });
  }
  ls({ socket, args }) {
    console.log("ls", args);
    console.log("socket workspace:", socket.workspace);
    let chemin =
      args[0] != undefined
        ? path.join(socket.workspace, args[0])
        : socket.workspace;
    console.log("chemin:", chemin);

    fs.readdir(chemin, (err, files) => {
      let response = { folders: [], files: [] };
      files != undefined &&
        files.forEach((file) => {
          if (!file.startsWith(".")) {
            // todo accept ls -a to show hidden files
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
