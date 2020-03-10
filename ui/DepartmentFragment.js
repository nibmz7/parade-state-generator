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
      item.setAttribute('status', employee.status);

      name.textContent = employeeName;
      status.textContent = STATUS[employee.status].name;

      Utils.onclick(item, e => {
        employee.status = item.getAttribute('status');
        this.openDetails(index, employee);
      });

      return clone;
  }
  
  onStatusChanged(itemIndex, statusIndex) {
    let item = this.list.children[itemIndex];
    item.setAttribute('status', statusIndex);
    let status = item.querySelector('#status');
    status.textContent = STATUS[statusIndex];
    this.presenter.updateEmployeeStatus(this.department, itemIndex, statusIndex);
  }

  onDeleteEmployee(itemIndex) {
    this.list.children[itemIndex].remove();
    this.presenter.removeEmployee(this.department, itemIndex);
  }

  onSaveEmployee(itemIndex, input) {
    this.onDeleteEmployee(itemIndex);
    this.presenter.saveEmployeeInfo(input);
  }
  
  openDetails(index, employee) {
    let dialogue = document.createElement('employee-dialogue');
    dialogue.setEmployee(index, employee, this);
    document.body.appendChild(dialogue);
  }

}