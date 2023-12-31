import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export class Fsld {
  constructor(options = {}) {
    this.options = options;
    this.io = options.io;
    this.workspace = options.workspace;
    //console.log(this.options)
    console.log("### FSLD ready");
    // aliases
    this.rename = this.move = this.mv;
    this.ll = this.ls;
    this.edit = this.vi;
  }
  // todo

  mv({ socket, args }) {
    console.log("mv", args);
    socket.emit("fsld", { event: "mv", response: "not implemented yet" });
  }

  vi({ socket, args }) {
    console.log("vi", args);
    let app = this;
    console.log(socket.workspace);
    let response = {};
    args.forEach(function (file) {
      let chemin = app.__chemin(socket, file);
      fs.readFile(chemin, "utf8", (err, data) => {
        if (err) {
          console.log(err);
          response[file] = err;
          socket.emit("fsld", {
            event: "vi",
            file: file,
            error: err,
            path: chemin,
          });
          return;
        } else {
          socket.emit("fsld", {
            event: "vi",
            file: file,
            response: data,
            path: chemin,
          });
        }
      });
    });
  }

  who({ socket, args }) {
    console.log("who", args);
    socket.emit("fsld", { event: "who", response: "not implemented yet" });
  }
  __save({ socket, args }) {
    console.log("save", args);
    let chemin = args.data.msg.path;
    let data = JSON.parse(args.data.msg.response);
    console.log(data);
    data.content = args.data.content;
    fs.writeFile(chemin, JSON.stringify(data), function (err) {
      if (err) {
        console.log(err);
        response[file] = err;
        socket.emit("fsld", { event: "save", file: file, error: err });
        return;
      } else {
        socket.emit("fsld", { event: "saved", response: chemin });
      }
    });
  }
  ////////////////////// done
  cat({ socket, args }) {
    console.log("cat", args);
    let app = this;
    console.log(socket.workspace);
    let response = {};
    args.forEach(function (file) {
      let chemin = app.__chemin(socket, file);
      fs.readFile(chemin, "utf8", (err, data) => {
        if (err) {
          console.log(err);
          response[file] = err;
          socket.emit("fsld", { event: "cat", file: file, error: err });
          return;
        } else {
          socket.emit("fsld", { event: "cat", file: file, response: data });
        }
      });
    });
  }

  rm({ socket, args }) {
    console.log("rm", args);
    let app = this;
    const __dirname = path.resolve();
    let trash = path.join(__dirname, "_trash");
    args.forEach(function (file) {
      let chemin = app.__chemin(socket, file);
      console.log("chemin from", chemin);
      let trash_path = trash + "/" + file;
      console.log(trash_path);
      let response = {};
      if (trash_path.includes("..") || chemin.includes("..")) {
        let err = "can not remove outside workspace";
        socket.emit("fsld", { event: "rm", file: file, error: err });
      } else {
        fs.rename(chemin, trash_path, (err) => {
          if (err) {
            console.log(err);
            response[file] = err;
            socket.emit("fsld", { event: "rm", file: file, error: err });
            return;
          } else {
            socket.emit("fsld", {
              event: "rm",
              file: file,
              response: "removed",
            });
          }
        });
      }
    });
  }
  touch({ socket, args }) {
    let app = this;
    console.log("touch", args);
    console.log(socket.workspace);
    let response = {};
    args.forEach(function (file) {
      let chemin = app.__chemin(socket, file);
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
    let app = this;
    console.log("mkdir", args);
    console.log(socket.workspace);
    let response = {};
    args.forEach(function (file) {
      let chemin = app.__chemin(socket, file);

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
    let chemin =
      args[0] == undefined ? this.workspace : this.__chemin(socket, args[0]);
    console.log("chemin now", chemin);
    socket.workspace = chemin;
  }
  pwd({ socket }) {
    console.log("pwd");
    socket.emit("fsld", { event: "pwd", response: socket.workspace });
  }
  help({ socket, args }) {
    console.log("help", args);
    let response = Object.getOwnPropertyNames(Fsld.prototype).filter(
      (item) =>
        item != "constructor" &&
        !item.startsWith("_") &&
        typeof Fsld.prototype[item] === "function"
    );
    socket.emit("fsld", { event: "help", response: response });
  }
  ls({ socket, args }) {
    console.log("ls", args);
    console.log("socket workspace:", socket.workspace);
    let chemin =
      args[0] != undefined ? this.__chemin(socket, args[0]) : socket.workspace;
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

  __chemin(socket, args) {
    const __dirname = path.resolve();
    console.log("dirname", __dirname);
    console.log("socket_workspace", socket.workspace);
    console.log("args", args);

    let chemin = path.join(socket.workspace, args);
    console.log("chemiin", chemin);
    if (!chemin.startsWith(this.workspace)) {
      chemin = this.workspace;
      socket.emit("fsld", { error: "out of workspace", args: args });
    }

    return chemin;
  }
}
