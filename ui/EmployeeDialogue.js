import Dialogue from './Dialogue.js';
import STATUS from '../logic/Status.js';

const HINT = 'Event, work, pooping etc.';

const template = `
  <style>
    .status {
      display: flex;
      flex-wrap: wrap;
      width: 70vw;
      --button-padding: 5px;
    }
    .status > wc-button {
      margin-right: 10px;
      margin-bottom: 10px;
    }
    .remark > p {
      margin: 5px 0;
    }
    .remark > input {
      padding: 5px;
      border: 1px solid grey;
      transition: all .3s .3s;
      outline:none;
      font: inherit;
    }
    .remark > input:focus {
      outline: none;
      border: 1px solid #FF3838;
    }
  </style>
  
  <div>
    <div class="info">
      <h4>LCP Thomas Bathowski</h4>
    </div>
    
    <div class="status">
      
    </div>
    
    <div class="remark">
      <p>Remarks</p>
      <input type="text" placeholder="${HINT}">
    </div>
  </div>
  
`;

export default class EmployeeDialogue extends Dialogue {
  
  constructor() {
    super(template);
    let statusChooser = this.shadowRoot.querySelector('.status');
    let prevButton; 
    for(let i in STATUS) {
      let button = document.createElement('wc-button');
      button.textContent = STATUS[i];
      button.setAttribute('type', 'outline');
      statusChooser.appendChild(button);
      
      button.addEventListener('onclick', e => {
        if(prevButton == button) return;
        button.setAttribute('type', 'solid');
        if(prevButton) prevButton.setAttribute('type', 'outline');
        prevButton = button;
      });
    }
  }
}