import Utils from '../Utils.js';
const template = options => `
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
  
    <p class="title">Lorem ipsum</p>
  
    <div class="menu">
      <p id="selected">Lorem ipsum</p>
      <div id="list">
        ${options}
      </div>
      <div class="outerbound"></div>
    </div>
  
  </div>
`;

export default class DropdownMenu extends HTMLElement {
  
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = template(this.innerHTML);
   
    let menu = this.shadowRoot.querySelector('.menu');
    let title = this.shadowRoot.querySelector('.title');
    let list = this.shadowRoot.getElementById('list');
    let selected = this.shadowRoot.getElementById('selected');
    let outerbound = menu.querySelector('.outerbound');
 
    this.prevIdx = 0;
    this.currIdx = 0;
    let opening = false;
    let isAnimating = false;
    menu.style.setProperty('--min-height', title.offsetHeight + 'px');
    menu.style.setProperty('--max-height' ,menu.scrollHeight - title.offsetHeight+ 'px');
    Utils.onclick(title, e => {
      opening = true;
      menu.classList.add('appear');
    });
    
    const onSelected = idx => { 
      opening = false;
      this.prevIdx = this.currIdx;
      this.currIdx = idx;
      title.textContent = options[idx].innerHTML;
      menu.classList.remove('appear');
    }
    
    this.options = list.querySelectorAll('p');
    let options = this.options;
    options.forEach((option, index) => {
      Utils.onclick(option, e => {
        onSelected(index);
      });
    });
    
    Utils.onclick(selected, e => {
      onSelected(this.currIdx);
    });
    
    Utils.onclick(outerbound, e => {
      onSelected(this.currIdx);
    });
    
    menu.addEventListener('transitionend', () => {
        if(!opening) {
          selected.textContent = options[this.currIdx].textContent;
          options[this.prevIdx].classList.toggle('selected');
          options[this.currIdx].classList.toggle('selected');
          let data = { next: this.currIdx, prev: this.prevIdx };
          let event = new CustomEvent("onChange", { detail: data });
          this.dispatchEvent(event);
        }
    });
    
    options[0].classList.toggle('selected');
    
  }
  
  changeSelection(index) {
    this.options[currIdx].textContent;
    this.options[prevIdx].classList.toggle('selected');
    this.options[currIdx].classList.toggle('selected');
    this.prevIdx = this.currIdx;
    this.currIdx = index;
  }
  
}


