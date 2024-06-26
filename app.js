class Package {
  constructor(message, from, to) {
    this.message = message;
    this.from = from;
    this.to = to;
  }
}
class Server {
  constructor() {
    this._packages = [];
    this._cables = [];
  }
  set packages(p) {
    this._packages.push(p);
  }
  set cables(cable) {
    this._cables.push(cable);
  }
  reseiveRequest(client) {
    for (let i = 0; i < this._packages.length; i++) {
      if (this._packages[i].to === client.id && client.cable.isFree) {
        const pack = this._packages[i];
        this._packages.splice(i, 1);
        return pack;
      }
    }
    return null;
  }
}

const server = new Server();
const serverVisual = document.querySelector(".server");

class Cable {
  constructor(client) {
    // this.server = server;
    server.cables = this;
    this.client = client;
    this.isFree = true;
  }
  moveRequest() {
    const pack = server.reseiveRequest(this.client);
    if (pack !== null) {
      this.client.visualPackage.classList.add("receive");
      this.isFree = false;
      setTimeout(() => {
        this.client.visualPackage.classList.remove("receive");
        this.isFree = true;
      }, 3000);
      return pack;
    }
    return null;
  }
  movMessge(pack) {
    this.isFree = false;
    setTimeout(() => {
      server.packages = pack;
      this.isFree = true;
      this.client.visualPackage.classList.remove("send");
    }, 3000);
  }
}

const createId = (() => {
  let id = 1122;
  return () => {
    id++;
    return String(id);
  };
})();

class Client {
  constructor(side) {
    this.id = createId();
    this.side = side;
    this.packages = [];
    this.cable = new Cable(this);
    const clone = document.querySelector(`.${side}`).content.cloneNode(true);
    const h3 = clone.querySelector("h3");
    h3.textContent = `id: ${this.id}`;
    this.mybutton = clone.querySelector("button");
    this.allMassages = clone.querySelector(".allMassages");
    this.visualPackage = clone.querySelector(".package");
    document.querySelector(`.clients${side}`).append(clone);
    this.mybutton.addEventListener("click", this.sendMassge);
    this.sendRequest();
  }
  sendRequest() {
    setInterval(() => {
      let pack = this.cable.moveRequest(this.cable.client);
      if (pack !== null) {
        this.packages.push(pack);
        setTimeout(()=>{
          this.allMassages.textContent += `from: ${pack.from} contant: ${pack.message}`
        },3000)
       ;
      }
    }, 1500);
  }

  sendMassge = (event) => {
    event.preventDefault();
    const masseg = event.target.previousElementSibling;
    const to = masseg.previousElementSibling;
    const pack = new Package(masseg.value, this.id, to.value);
    masseg.value = "";
    to.value = "";
    let sent = false;
    while (!sent) {
      if (this.cable.isFree) {
        this.cable.movMessge(pack);
        sent = true;
        this.visualPackage.classList.add("send");
      }
    }
  };
}

const cl1 = new Client("left");
const cl2 = new Client("left");
const cl3 = new Client("left");
const cl4 = new Client("right");
const cl5 = new Client("right");
const cl6 = new Client("right");
