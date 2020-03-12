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
      padding: 10px 15px;
      transition: .3s background;
    }
    
    .item:active {
      background: grey;
    }
    
    #name {
      font-weight: 700;
    }
    
    #status {
      font-size: 0.8rem;
      font-weight: 400;
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
  
  addEmployee(key, employee, index) {    
    let newNode = this.createItem(key, employee, index);
    let referenceNode = this.list.children[index];
    this.list.insertBefore(
      newNode,
      referenceNode 
    );
  }
  
  createItem(key, employee, index) {
      let employeeName = employee.rank + ' ' + employee.name;
      let remark = "";
      if(employee.remark && employee.remark.length > 0)
        remark = ` (${employee.remark})`;
      
      let template = this.shadowRoot.getElementById('item');
      let clone = template.content.cloneNode(true);

      let item = clone.querySelector('.item');
      let name = clone.getElementById('name');
      let status = clone.getElementById('status');
      item.setAttribute('key', key);
      item.setAttribute('status', employee.status);
      if(employee.remark)
      item.setAttribute('remark', employee.remark);
    
      name.textContent = employeeName;
      status.textContent = STATUS[employee.status].name + remark;

      Utils.onclick(item, e => {
        employee.status = item.getAttribute('status');
        employee.remark = item.getAttribute('remark');
        this.openDetails(key, employee);
      });

      return clone;
  }
  
  getListItem(key) {
    return this.list.querySelector(`.item[key='${key}']`);
  }
  
  onRemarkChanged(key, remark) {
    let item = this.getListItem(key);
    item.setAttribute('remark', remark);
    let statusIndex = item.getAttribute('status');
    let remarkText = "";
    if (remark && remark.length > 0)
      remarkText = ` (${remark})`;
    let status = item.querySelector('#status');
    status.textContent = STATUS[statusIndex].name + remarkText;
    this.presenter.updateEmployeeRemark(this.department, key, remark);
  }
  
  onStatusChanged(key, statusIndex) {
    let item = this.getListItem(key);
    item.setAttribute('status', statusIndex);
    let status = item.querySelector('#status');
    status.textContent = STATUS[statusIndex].name;
    this.presenter.updateEmployeeStatus(this.department, key, statusIndex);
  }

  onDeleteEmployee(key) {
    let item = this.getListItem(key);
    item.remove();
    this.presenter.removeEmployee(this.department, key);
  }

  onSaveEmployee(key, input) {
    this.onDeleteEmployee(key);
    this.presenter.saveEmployeeInfo(input);
  }
  
  openDetails(key, employee) {
    let dialogue = document.createElement('employee-dialogue');
    dialogue.setEmployee(key, employee, this);
    document.body.appendChild(dialogue);
  }

}