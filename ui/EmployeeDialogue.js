import Dialogue from './Dialogue.js';
import STATUS from '../logic/Status.js';
import Employee from '../logic/Employee.js';

const HINT = 'Event, work, pooping etc.';

const template = `
  <style>
    .container {
      position: relative;
    }
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
    input {
      padding: 5px;
      border: 1px solid grey;
      transition: all .3s .3s;
      outline:none;
      font: inherit;
    }
    input:focus {
      outline: none;
      border: 1px solid #FF3838;
    }
    .header {
      display: flex;
      align-items: center;
    }

    .header > h4 {
      flex-grow: 1;
    }

    .header > wc-button {
      --button-padding: 3px 8px;
    }

    #edit-screen {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      background: white;
      display: none;
      flex-direction: column;
      justify-content: space-evenly;
    }

    #edit-screen > input {
      width: 100%;
    }

    #edit-screen > .submit {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .submit > wc-button {
      --button-padding: 5px 8px;
      margin: 15px 10px;
    }
  </style>
  
  <div class="container">
    <div id="main-screen">
      <div class="header">
        <h4></h4>
        <wc-button type="plain" id="edit">edit</wc-button>
      </div>
      
      <div class="status">
        
      </div>
      
      <div class="remark">
        <p>Remarks</p>
        <input id="status-input" type="text" placeholder="${HINT}">
      </div>
    </div>

    <div id="edit-screen">
      <input id="save-input" type="text" placeholder="Rank, Name, Department, isRegular(true)"}>

      <div class="submit">
        <wc-button id="save">Save</wc-button>
        <wc-button id="delete" type="plain">Delete</wc-button>
      </div>

    </div>
  </div>
  
`;

export default class EmployeeDialogue extends Dialogue {
  
  constructor() {
    super(template);
    let editScreen = this.shadowRoot.getElementById('edit-screen');
    let editButton = this.shadowRoot.getElementById('edit');
    let saveButton = this.shadowRoot.getElementById('save');
    let deleteButton = this.shadowRoot.getElementById('delete');
    this.saveInput = this.shadowRoot.getElementById('save-input');
    editButton.onclick = e => {
      editScreen.style.display = 'flex';
    }

    saveButton.onclick = e => {
      this.callback.onSaveEmployee(this.itemIndex, this.saveInput.value);
      this.close();
    }

    deleteButton.onclick = e => {
      this.callback.onDeleteEmployee(this.itemIndex);
      this.close();
    }
  }

  setStatus(index) {
    let statusChooser = this.shadowRoot.querySelector('.status');
    let prevButton; 
    this.statusIndex = index;
    for(let i in STATUS) {
      let button = document.createElement('wc-button');
      button.textContent = STATUS[i];
      if(i == this.statusIndex) {
        button.setAttribute('type', 'solid');
        prevButton = button;
      }
      else button.setAttribute('type', 'outline')
      statusChooser.appendChild(button);
      
      button.onclick = e => {
        if(prevButton == button) return;
        this.statusIndex = i;
        button.setAttribute('type', 'solid');
        if(prevButton) prevButton.setAttribute('type', 'outline');
        prevButton = button;
        this.callback.onStatusChanged(this.itemIndex, this.statusIndex);
      };
    }
  }
  
  setEmployee(index, employee, callback) {
    this.callback = callback;
    this.itemIndex = index;
    this.employee = employee;
    let title = this.shadowRoot.querySelector('h4');
    title.textContent = employee.rank + " " + employee.name;
    this.setStatus(employee.status);
    this.saveInput.value = employee.rank + ", " + employee.name + ", " + employee.department;
  }
  
}