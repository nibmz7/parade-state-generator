import Utils from '../../Utils.js';

const template = `
  <style>
    :host {
      --button-color: var(--color-primary);
      --button-color-dark: var(--color-primary-dark);
    }
    :host([type="outline"]) > button {
      background: white;
      color: var(--button-color);
      border: 2px solid;
      border-radius: 2px;
      border-color: var (--button-color);
    }
    
    :host([type="outline"]) button:active {
      background: rgba(0,0,0,.2);
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
      border-radius: 5px;
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