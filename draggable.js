class draggable {
  dragsrc;
  orglist

  constructor(options) {
    this.setupList(options);

    this.orglist = options.list
    if(options.update) this.update = options.update

    for (let listitem of options.el.children) {
      this.addDnDlistener(listitem);
    }
  }

  setupList(options) {
    let { el: element, list, template } = options;
    
    if (!element) throw Error("this element not exist");
    if (!list) throw Error("this list not exist");
    if (!Array.isArray(list)) throw Error("the list is not an array");
    if (typeof template !== "function")
    throw Error("template is not a function");
    
 
    list.forEach((item) => {
      element.innerHTML += template(item);
    });
  }

  addDnDlistener(element) {
    element.setAttribute("draggable", true);

    element.addEventListener("dragstart", this.drageventStart.bind(this));
    element.addEventListener("dragend", this.drageventEnd.bind(this));
    element.addEventListener("dragover", this.drageventOver.bind(this));
    element.addEventListener("dragleave", this.drageventLeave.bind(this));
    element.addEventListener("drop", this.drageventDrop.bind(this));
    // element.addEventListener("drag", this.drageventDrop.bind(this));
  }

  drageventStart(e) {
    this.dragsrc = e.target;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);
    // console.log(e.dataTransfer.getData('text/html'));
    e.target.classList.add("dragElem");
  }
  drageventEnd(e) {
    e.target.classList.remove("dragElem");
    let newList = []
    // console.log('thislist' , this.list);
    // console.log('list' , list);
    list.querySelectorAll('.list-item').forEach(elem => newList.push(this.orglist.find(item => elem.id == item.id)) )
    this.update(newList)

  }

  drageventOver(e) {
    if (e.preventDefault) e.preventDefault();
    e.target.classList.add("over");
  }

  drageventLeave(e) {
    e.target.classList.remove("over");
  }

  drageventDrop(e) {
    let tr = e.target.closest(".list-item");
    // console.log(this.dragsrc);
    if (this.dragsrc != tr) {
      tr.parentNode.removeChild(this.dragsrc);
      let data = e.dataTransfer.getData("text/html");
      // console.log(data);

      tr.insertAdjacentHTML("beforebegin", data);

      this.addDnDlistener(tr.previousSibling);
    }
    e.target.classList.remove("over");
  }



}
