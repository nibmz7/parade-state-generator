import Status from '../logic/Status.js';

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
    this.employees = [];
    this.sortBy = 'rankInt';
  }
  
  addEmployees(list) {
    this.employees = this.employees.concat(list);
    this.sortEmployees();
  }

  sortEmployees() {
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