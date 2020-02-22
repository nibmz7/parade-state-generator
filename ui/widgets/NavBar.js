import Utils from '../Utils.js';

const template = `
  <style>

  :host {
    --navbar-color: var(--primary-blue);
    --navbar-color-rgb: var(--primary-blue-rgb);
  }

    .container {
      display: grid;
      overflow-x: scroll;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none;  /* IE 10+ */
    }

    .container::-webkit-scrollbar {
      width: 0px;
      background: transparent; /* Chrome/Safari/Webkit */
    }
  

    .tabs {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1 0 auto;
      z-index: 2;
    }

    .item {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 10px;
    }
    
    .item:first-child {
      justify-self: start;
      margin-left: 8px;
    }
    .item:last-child {
      justify-self: end;
      margin-right: 8px;
    }
    
    button {
      font: inherit;
      padding: 6px 13px;
      cursor: pointer;
      border-radius: 50px;
      outline: none;
      border: none;
      font-size: 1.2rem;
      color: var(--navbar-color);
      background: transparent;
      //transition: all .3s cubic-bezier(0.4, 0, 1, 1);
      transition: all .3s;
      z-index: 3;
    }

    .indicator {
      background: transparent;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      border-radius: 50px;
      transition: background 1ms;
    }

    .selected > .indicator {
      background: var(--navbar-color);
      transition: background 1ms .3s;
    }

    .selected > button {
      color: white;
    }
    
    button:not(.selected):active {
      background: rgba(0,0,0,.2);
    }

    .bubble {
      display: none;
      height: 40px;
      width: 100px;
      position: absolute;
      background: #b2c5b2;
      transform: translateX(0px);
      border-radius: 50px;
      background: var(--navbar-color);
      box-shadow: 0 4px 6px -1px rgba(var(--navbar-color-rgb), 0.2), 0 2px 4px -1px rgba(var(--navbar-color-rgb), 0.12);
    }

    .animate {
      display: block;
      transition: all .3s;
    }

  </style>


  <div class="container">

    <div class="bubble animate"></div>

    <div class="tabs">
      
    </div>


  </div>

  
`;

export default class NavBar extends HTMLElement {

  constructor() {
    super();
    this.currentSelection = '0';
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = template;
    let bubble = this.shadowRoot.querySelector('.bubble');
    let container = this.shadowRoot.querySelector('.container');
    let tabs = this.shadowRoot.querySelector('.tabs');

    let slots = this.querySelectorAll('slot');
    let i = 0;
    for(let slot of slots) {
      let id = i;
      let item = document.createElement('div');
      item.id = id;
      item.className = 'item';
      let button = document.createElement('button');
      button.textContent = slot.innerHTML;
      item.appendChild(button);
      let indicator = document.createElement('div');
      indicator.className = 'indicator';
      item.appendChild(indicator);

      var hasScrolled = false;

      container.onscroll = e => {
        hasScrolled = true;
        bubble.classList.remove('animate');
      }

      Utils.onclick(button, e => {
        if(hasScrolled) {
          let offset = this.shadowRoot.getElementById(this.currentSelection).offsetLeft;
          bubble.style.transform = `translateX(${offset - 13/2 - 2 - container.scrollLeft}px)`;
          bubble.classList.add('animate');
          hasScrolled = false;
        }
        this.shadowRoot.getElementById(this.currentSelection).classList.toggle("selected");
        bubble.style.transform = `translateX(${item.offsetLeft - 13/2 - 2 - container.scrollLeft}px)`;
        bubble.style.width = `${item.offsetWidth}px`;
        item.classList.toggle("selected");
        this.onSelected(id);
      });

      tabs.appendChild(item);

      i++;
    }

    let firstTab = this.shadowRoot.getElementById('0');
    firstTab.classList.add('selected');

    bubble.style.transform = `translateX(${firstTab.offsetLeft - 13/2 - 2}px)`;
    bubble.style.width = `${firstTab.offsetWidth}px`;
    bubble.style.height = `${firstTab.offsetHeight}px`;
  }
  
  onSelected(id) {
    if(this.currentSelection == id) return;
    this.currentSelection = id;
    let event = new CustomEvent(
      "onSelected", { detail: id }
    );
    this.dispatchEvent(event);
    this.setAttribute("selected", id);
  }

}