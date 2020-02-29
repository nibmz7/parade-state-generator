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
    <div>
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
    this.employees = [];
  }
  
  connectedCallback() {
    let title = this.shadowRoot.getElementById('title');
    let department = this.getAttribute('dep');
    title.textContent = department;
  }
  
  addEmployee(employee) {
    
  }
}