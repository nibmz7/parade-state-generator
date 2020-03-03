import Status from '../logic/Status.js';
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
  }
  
  addEmployees(list) {
    this.employees['default'] = list;
    for(let {key, employee} of list) {
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
        let dialogue = document.createElement('employee-dialogue');
        document.body.appendChild(dialogue);
      });

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