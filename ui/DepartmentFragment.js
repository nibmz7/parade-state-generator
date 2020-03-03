import STATUS from '../logic/Status.js';
import Utils from '../Utils.js';

const template = `
  <style>
    .page {
      width: 100vw;
      height: 100%;
    }
    p {
      margin: 0;
    }
  </style>
  
  <div class="page">
    <div id="list">
    </div>
  </div>
  
  <template id="item">
    <div class="item">
      <p id="name"></p>
      <p id="status"></p>
    </div>
  </template>
`;

export default class DepartmentFragment extends HTMLElement {
  
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = template;
    this.list = this.shadowRoot.getElementById('list');
    this.employees = {};
    this.listItem = [];
  }
  
  addEmployees(list) {
    this.employees['default'] = list;
    for(let i in list) {
      let {key, employee} = list[i];
      let statusType = employee.status ? Status[employee.status] : "Not set";      
      let employeeName = employee.rank + ' ' + employee.name;
      
      let template = this.shadowRoot.getElementById('item');

      let clone = template.content.cloneNode(true);
      let item = clone.querySelector('.item');
      item.id = key;

      let name = clone.getElementById('name');
      let status = clone.getElementById('status');


      name.textContent = employeeName;
      status.textContent = 'Status: ' + statusType;

      Utils.onclick(item, e => {
        this.openDetails(i, employee);
      });
      
      this.listItem.push(item);

      this.list.appendChild(item);
    }
    
    let newList = [...list];
    newList.sort((a, b) => {
      var nameA = a.employee.name; 
      var nameB = b.employee.name; 
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });
  }
  
  onStatusChanged(itemIndex, statusIndex) {
    let status = this.listItem[itemIndex].getElementById('status');
    if(statusIndex != -1) status.textContent = STATUS[statusIndex];
  }
  
  openDetails(index, employee) {
    let dialogue = document.createElement('employee-dialogue');
    dialogue.setEmployee(index, employee, this.onStatusChanged.bind(this));
    document.body.appendChild(dialogue);
  }

  sortEmployees(type) {
    this.employees.sort((a, b) => {
      return a.employee.rank - b.employee.rank;
    });
    for(let {key, employee} of this.employees) {
      let statusType = employee.status ? Status[employee.status] : "Not set";      
      let employeeName = employee.rank + ' ' + employee.name;
      
      let template = this.shadowRoot.getElementById('item');

      let clone = template.content.cloneNode(true);
      let item = clone.querySelector('.item');
      item.id = key;

      let name = clone.getElementById('name');
      let status = clone.getElementById('status');


      name.textContent = employeeName;
      status.textContent = 'Status: ' + statusType;
      
      this.list.appendChild(item);
    }
  }

}