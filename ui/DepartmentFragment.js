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
    .item {
      margin-bottom: 15px;
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
  }

  setPresenter(presenter) {
    this.presenter = presenter;
  }
  
  setDepartment(department) {
    this.department = department;
  }
  
  addEmployee(employee, index) {    
    let newNode = this.createItem(employee, index);
    let referenceNode = this.list.children[index];
    this.list.insertBefore(
      newNode,
      referenceNode 
    );
  }
  
  createItem(employee, index) {
      let employeeName = employee.rank + ' ' + employee.name;
      
      let template = this.shadowRoot.getElementById('item');
      let clone = template.content.cloneNode(true);

      let item = clone.querySelector('.item');
      let name = clone.getElementById('name');
      let status = clone.getElementById('status');

      name.textContent = employeeName;
      status.textContent = 'Status: ' + STATUS[employee.status];

      Utils.onclick(item, e => {
        this.openDetails(index, employee);
      });

      return clone;
  }
  
  onStatusChanged(itemIndex, statusIndex) {
    let item = this.list.children[itemIndex];
    let status = item.querySelector('#status');
    status.textContent = STATUS[statusIndex];
    this.presenter.updateEmployeeStatus(this.department, itemIndex, statusIndex);
  }
  
  openDetails(index, employee) {
    let dialogue = document.createElement('employee-dialogue');
    dialogue.setEmployee(index, employee, this.onStatusChanged.bind(this));
    document.body.appendChild(dialogue);
  }

}