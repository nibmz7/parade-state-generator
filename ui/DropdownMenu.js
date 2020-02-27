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
      opacity: 0;
      width: inherit;
      height: var(--min-height);
      overflow: hidden;
      box-shadow: 0;
      pointer-events: none;
      transition: height .2s, box-shadow .2s, opacity .1s .2s
    }
    
    .appear {
      transition: opacity .1s, height .2s .1s, box-shadow .2s .1s;
      pointer-events: auto;
      opacity: 1;
      height: var(--max-height);
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    }
   
    p {
      margin: 0;
      padding: 10px 15px;
      font-size: 25px;
    }
    
    #list > .selected {
      display: none;
    }
    
    .outerbound {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
    }
  </style>
  
  <div class="container">
  
    <p class="title">Nil</p>
  
    <div class="menu">
      <p id="selected">Nil</p>
      <div id="list">
       
      </div>
      <div class="outerbound"></div>
    </div>
  
  </div>
`;

let isAnimating = false;
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
    this.titleText = this.shadowRoot.querySelector('.title');
    this.list = this.shadowRoot.getElementById('list');
    this.selected = this.shadowRoot.getElementById('selected');
    this.options = [];
    let outerbound = this.menu.querySelector('.outerbound');
 
    this.itemWidth = this.titleText.offsetHeight;
    this.menu.style.setProperty('--min-height', `${this.itemWidth}px`);
    
    Utils.onclick(this.titleText, e => {
      if(count < 2) return;
      if(!isAnimating) {
        isAnimating = true;
        opening = true;
        this.menu.classList.add('appear');
      }
    });
    
    Utils.onclick(this.selected, e => {
      this.onSelected(currIdx);
    });
    
    Utils.onclick(outerbound, e => {
      this.onSelected(currIdx);
    });
    
    let i = 0;
    this.menu.addEventListener('transitionend', e => {
        if(++i == 3) {
          if (!opening) {
            this.selected.textContent = this .options[this.currIdx].textContent;
            this.options[this.prevIdx].classList.toggle('selected');
            this.options[this.currIdx].classList.toggle('selected');
            let data = { next: this.currIdx, prev: this.prevIdx };
            let event = new CustomEvent("onChange", { detail: data });
            this.dispatchEvent(event);
          }
          i = 0;
          isAnimating = false;
        }
    });
  }
  
  add(item) {
    count++;
    this.menu.style.setProperty('--max-height', `${this.count * this.itemWidth}`);
    let p = document.createElement('p');
    const index = count;
    p.textContent = item;
    Utils.onclick(p, e => {
      this.onSelected(index);
    });
    this.list.appendChild(p);
    this.options.push(p);
    this.setCurrentItem(count-1);
  }
  
  onSelected(index) {
    if(!isAnimating) {
      isAnimating = true;
      opening = false;
      prevIdx = currIdx;
      currIdx = idx;
      this.titleText.textContent = this.options[idx].innerHTML;
         menu.classList.remove('appear');
    }
  }
  
  setCurrentItem(index) {
    prevIdx = currIdx;
    currIdx = index;
    this.titleText.textContent = this.options[this.currIdx].textContent;
    this.selected.textContent = this.options[this.currIdx].textContent;
    this.options[this.prevIdx].classList.toggle('selected');
    this.options[this.currIdx].classList.toggle('selected');
  }
  
}


