import SummaryPresenter from '../presenter/SummaryPresenter.js';
import Status from '../logic/Status.js';

const template = `
    <style>
        .container {
            background: white;
            height: 100%;
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 99;
            transition: .5s transform;
            transform: translateY(100%);
        }

        .container.show {
            transform: translateY(0%);
        }

        h2 {
            margin: 0;
        }
        
        wc-button {
          --button-radius: 0;
          --button-padding: 15px 10px;
          --button-font-size: 1.3rem;
        }
        
        .container {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        #list {
          flex: 1;
          overflow-y: auto;
        }
        
    </style>

    <div class="container">
        <h2>SUMMARY VIEW</h2>
        <div id="list"></div>
        <wc-button>Export to excel</wc-button>
    </div>
    
    <template id="header">
      <div class="header">
        <h4></h4>
      </div>
    </template>
    
    <template id="item"> 
      <div class="item">
        <p></p>
      </div>
    </template>
`;

export default class SummaryView extends HTMLElement {

    constructor() {
        super();
        this.summaryPresenter = new SummaryPresenter();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = template;
        this.shadowRoot.querySelector('h2').onclick = e => {
            this.shadowRoot.querySelector('.container').classList.remove('show');
        }
        this.shadowRoot.querySelector('wc-button').onclick = e => {
          this.summaryPresenter.downloadToExcel();
        }
    }

    show() {
        this.shadowRoot.querySelector('.container').classList.add('show');
        let list = this.shadowRoot.getElementById('list');
        list.innerHTML = "";
        let data = this.summaryPresenter.getSummary();
        for(let [status, employees] of Object.entries(data)) {
          let header = this.createHeader(Status[status].name);
          list.appendChild(header);
          for(let employee of employees) {
            let item = this.createItem(employee);
            list.appendChild(item);
          }
        }
    }
    
    createHeader(department) {
      let template = this.shadowRoot.getElementById('header');
      let clone = template.content.cloneNode(true);
      let title = clone.querySelector('h4');
      title.textContent = department;
      return clone;
    }
    
    createItem(employee) {
      let template = this.shadowRoot.getElementById('item');
      let clone = template.content.cloneNode(true);
      let name = clone.querySelector('p');
      name.textContent = employee.rank + " " + employee.name;
      return clone;
    }
}