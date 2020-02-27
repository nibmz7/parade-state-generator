import Utils from '../Utils.js';
const template = `
  <style>
    .container {
      position: relative;
      width: 200px;
    }
    .menu {
      position: absolute;
      border-radius: 2px;
      top: 0;
      left: 0;
      z-index: 5;
      background: white;
      color: black;
      width: inherit;
      height: var(--min-height);
      overflow: hidden;
      box-shadow: 0;
      pointer-events: none;
      transition: height .5s, box-shadow .5s .3s;
    }
    
    .appear {
      transition: height .5s, box-shadow .5s;
      pointer-events: auto;
      height: var(--max-height);
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    }
   
    p {
      margin: 0;
      padding: 10px 15px;
      font-size: 25px;
    }

    .appear > #list {
      top: 0;
    }

    #list {
      position: absolute;
      top: var(--item-offset);
      left: 0;
      transition: all .5s;
    }

    #list > p {
      transition: opacity .3s;
      opacity: 0;
    }
    
    #list > .selected {
      opacity: 1;
    }

    .appear > #list > p {
      transition: opacity .5s .5s;
      opacity: 1;
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

let isOpening = false;
let currIdx = 0;
let prevIdx = 0;
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
    
    Utils.onclick(title, e => {
      if(count < 2) return;
      isOpening = true;
      this.menu.classList.add('appear');
    });
  }
  
  add(item) {
    count++;
    this.menu.style.setProperty('--max-height', `${count * this.itemWidth}px`);
    let p = document.createElement('p');
    const index = count - 1;
    p.textContent = item;
    Utils.onclick(p, e => {
      this.onSelected(index);
    });
    this.list.appendChild(p);
    this.options.push(p);
    this.setCurrentItem(index);
  }
  
  onSelected(index) {
    isOpening = false;
    prevIdx = currIdx;
    currIdx = index;
    this.setCurrentItem(index);
    this.menu.classList.remove('appear');
    let data = { next: currIdx, prev: prevIdx };
    let event = new CustomEvent("onChange", { detail: data });
    this.dispatchEvent(event);
  }
  
  setCurrentItem(index) {
    prevIdx = currIdx;
    currIdx = index;
    this.options[prevIdx].classList.remove('selected');
    this.options[currIdx].classList.add('selected');
    this.list.style.setProperty('--item-offset', `-${currIdx * this.itemWidth}px`);

  }
  
}


