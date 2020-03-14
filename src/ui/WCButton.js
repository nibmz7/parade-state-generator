import Utils from '../Utils.js';

const template = `
  <style>
    :host {
      --button-color: var(--color-primary);
      --button-color-dark: var(--color-primary-dark);
      --button-color-rgb: var(--color-primary-rgb);
      --button-radius: 5px;
    }
    
    :host([type="solid"]) > button {
      background: var(--button-color);
      color: white;
      border: 2px solid var(--button-color);
      border-radius: 2px;
    }
    
    :host([type="outline"]) > button {
      background: white;
      color: var(--button-color);
      border: 2px solid;
      border-radius: 2px;
      border-color: var(--button-color);
    }
    
    :host([type="outline"]) button:active {
      background: rgba(0,0,0,.2);
    }
    
    :host([type="plain"]) > button {
      background: white;
      color: var(--button-color);
      border-radius: 15px;
    }
    
    :host([type="plain"]) > button:active {
      background: rgba(0,0,0,.1);
    }
    
    :host([type="glow"]) > button {
      box-shadow: 0 4px 6px -1px rgba(var(--button-color-rgb), 0.2), 0 2px 4px -1px rgba(var(--button-color-rgb), 0.12);
    }
    
    button {
      font: inherit;
      font-size: var(--button-font-size);
      padding: var(--button-padding);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      outline: none;
      border: none;
      border-radius: var(--button-radius);
      color: white;
      background: var(--button-color);
      width: 100%;
      transition: all .2s;
    }
    
    button:active {
      background: var(--button-color-dark);
    }
  </style>
  
  <button><slot></slot></button>
`;

export default class WCButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = template;
        let button = this.shadowRoot.querySelector('button');
        
        Utils.onclick(button, e => {
          this.dispatchEvent(new Event("onclick"));
        });
    }

    set onclick(callback) {
        this.addEventListener('onclick', e => callback(e));
    }
}