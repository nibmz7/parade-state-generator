import Utils from '../Utils.js';
const template = `
  <style>
    .container {
      position: relative;
      width: 200px;
    }
    .menu {
      position: absolute;
      border-bottom-right-radius: 2px;
      top: 0;
      left: 0;
      z-index: 5; 
      color: black;
      width: inherit;
      height: var(--min-height);
      overflow: hidden;
      box-shadow: 0;
      pointer-events: auto;
      transition: height .5s, box-shadow .5s .3s;
      background: white;
    }
    
    .appear {
      transition: height .5s, box-shadow .5s;
      height: var(--max-height);
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    }
   
    p {
      margin: 0;
      padding: 10px 15px;
      font-size: 25px;
      cursor: pointer;
      touch-action: none;
      transition: .2s background;
    }

    p.active {
      background: #909090;
    }

    .appear > #list {
      top: 0;
    }

    #list {
      width: inherit;
      position: absolute;
      top: var(--item-offset);
      left: 0;
      transition: all .5s;
    }



  </style>
  
  <div class="container">
    <p id="title">Empty</p>
    <div class="menu">
      <div id="list">
      
      </div>
    </div>
  
  </div>
`;

let isOpen = false;
let currItem = null;
let count = 0;

export default class DropdownMenu extends HTMLElement {
  
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = template;
   
    this.menu = this.shadowRoot.querySelector('.menu');
    this.list = this.shadowRoot.getElementById('list');
    this.options = [];
 
    let title = this.shadowRoot.getElementById('title');
    this.itemWidth = title.offsetHeight;
    this.menu.style.setProperty('--min-height', `${this.itemWidth}px`);
  }
  
  add(item) {
    count++;
    this.menu.style.setProperty('--max-height', `${count * this.itemWidth}px`);
    let p = document.createElement('p');
    p.textContent = item;
    Utils.onclick(p, e => {
      this.onSelected(item);
    });
    this.list.appendChild(p);
    this.options.push(item);
  }
  
  remove(item) {
    let index = this.options.findIndex(el => el == item);
    this.options.splice(index, 1);
    count--;
    this.list.children[index].remove();
    this.menu.style.setProperty('--max-height', `${count * this.itemWidth}px`);
    currItem = null;
    this.setCurrentItem(this.options[0]);
    let event = new CustomEvent("onChange", { detail: {next: 0 }});
    this.dispatchEvent(event);
  }
  
  onSelected(item) {
    if(count == 1) return;
    if(!isOpen) {
      if(count < 1) return;
      isOpen = true;
      this.menu.classList.add('appear');
    } else {
      isOpen = false;
      this.setCurrentItem(item);
      this.menu.classList.remove('appear');
      let index = this.options.findIndex(el => el == item);
      let data = {next: index};
      let event = new CustomEvent("onChange", { detail: data });
      this.dispatchEvent(event);
    }
  }
  
  setCurrentItem(item) {
    if(currItem != null) {
      let index = this.options.findIndex(el => el == currItem);
      this.list.children[index].classList.remove('selected');
    }
    let index = this.options.findIndex(el => el == item);
    this.list.children[index].classList.add('selected');
    this.list.style.setProperty('--item-offset', `-${index * this.itemWidth}px`);
    currItem = item;
  }
  
}


