import STATUS from '../logic/Status.js';
import Utils from '../Utils.js';

const template = `
  <style>
    .page {
     
    }
    p {
      margin: 0;
    }
    .item {
      padding: 10px 15px;
      transition: .3s background;
    }
    
    .item:active {
      background: #F0F0F0;
    }
    
    .item:last-child {
      border-bottom-left-radius: 15px;
      border-bottom-right-radius: 15px;
    }
    
    #name {
      text-transform: capitalize;
      color: #323232;
      font-weight: 700;
    }
    
    #status {
      color: #878787;
      font-size: 0.8rem;
      font-weight: 600;
    }
    
    #header {
      color: #828282;
      text-transform: capitalize;
    }
    
    #card {
      border-radius: 15px;
      background: white;
      box-shadow: 0px 2px 50px 0px rgba(209,202,209,1);
    }
    
    #strength {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px;
      font-weight: 900;
      background: #34495e;
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
      color:white;
    }
  </style>
  
  <div class="page">
    <h3 id="header"></h3>
    <div id="card">
      <div id="strength">0 Present</div>
      <div id="list"></div>
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
    this.header = this.shadowRoot.getElementById('header');
    this.list = this.shadowRoot.getElementById('list');
    this.strengthInfo = this.shadowRoot.getElementById('strength');
    this.employees = {};
    this.presentNsf = 0;
    this.presentReg = 0;
    this.present = {};
  }

  setPresenter(presenter) {
    this.presenter = presenter;
  }
  
  setDepartment(department) {
    this.department = department;
    this.header.textContent = department;
  }
  
  addEmployee(key, employee, index) {    
    this.employees[key] = employee;
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
      if(employee.remark.length > 0)
        remark = ` (${employee.remark})`;
      
      let template = this.shadowRoot.getElementById('item');
      let clone = template.content.cloneNode(true);

      let item = clone.querySelector('.item');
      let name = clone.getElementById('name');
      let status = clone.getElementById('status');
      item.setAttribute('key', key);
    
      name.textContent = employeeName;
      status.textContent = STATUS[employee.status].name + remark;

      Utils.onclick(item, e => {
        this.openDetails(key, this.employees[key]);
      });
      
      this.checkPresent(key);

      return clone;
  }
  
  getListItem(key) {
    return this.list.querySelector(`.item[key='${key}']`);
  }
  
  onRemarkChanged(key, remark) {
    let item = this.getListItem(key);
    let employee = this.employees[key];
    employee.remark = remark;
    let remarkText = "";
    if (remark && remark.length > 0)
      remarkText = ` (${remark})`;
    let status = item.querySelector('#status');
    status.textContent = STATUS[employee.status].name + remarkText;
    this.presenter.updateEmployeeRemark(this.department, key, remark);
  }
  
  onStatusChanged(key, statusIndex) {
    let item = this.getListItem(key);
    let employee = this.employees[key];
    employee.status = statusIndex;
    let status = item.querySelector('#status');
    status.textContent = STATUS[statusIndex].name;
    this.presenter.updateEmployeeStatus(this.department, key, statusIndex);
    this.checkPresent(key);
  }

  onDeleteEmployee(key) {
    delete this.employees[key];
    let item = this.getListItem(key);
    item.remove();
    this.presenter.removeEmployee(this.department, key);
  }

  onSaveEmployee(key, input) {
    this.onDeleteEmployee(key);
    this.presenter.saveEmployeeInfo(input);
  }
  
  checkPresent(key) {
    let employee = this.employees[key];
    let isRegular = employee.isRegular;
    let isPresent = employee.status == 1;
      if(!isPresent) {
        if(!this.present[key]) return;
        this.present[key] = false;
        if(isRegular) this.presentReg--;
        else this.presentNsf--;
      } else {
        if(this.present[key]) return;
        this.present[key] = true;
        if(isRegular) this.presentReg++;
        else this.presentNsf++;
      }
      let total = this.presentNsf + this.presentReg;
      let strength = `${total} Present ~ ${this.presentReg} Reg + ${this.presentNsf} Nsf`;
      this.strengthInfo.textContent = strength;
  }
  
  openDetails(key, employee) {
    let dialogue = document.createElement('employee-dialogue');
    dialogue.setEmployee(key, employee, this);
    document.body.appendChild(dialogue);
  }

}