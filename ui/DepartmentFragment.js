const template = `
  <style>
    .page {
      width: 100vw;
      height: 100%;
      background: red;
    }
    p {
      margin: 0;
    }
  </style>
  
  <div class="page">
    <p id="title"></p>
    <div id="list">
    
    </div>
  </div>
  
  <template id="item">
    <div class="item">
      <p id="name"></p>
      <p id="department"></p>
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
  }
  
  connectedCallback() {
    let title = this.shadowRoot.getElementById('title');
    let department = this.getAttribute('name');
    title.textContent = department;
  }
  
  addEmployees(list) {
    for(let {key, employee} of list) {
      let template = this.shadowRoot.getElementById('item');

      let item = template.content.cloneNode(true);
      let name = item.getElementById('name');
      let department = item.getElementById('department');
      let status = item.getElementById('status');
      
      item.id = 'employee-' + key;
      name.textContent = employee.name;
      department.textContent = employee.department;
      this.list.appendChild(item);
    }
    
  }

}