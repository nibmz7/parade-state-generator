import SummaryPresenter from '../presenter/SummaryPresenter.js';
import Status from '../logic/Status.js';
import Utils from '../Utils.js';

const template = `
    <style>
        .container {
            background: white;
            height: 100%;
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 9;
            transition: .5s transform;
            transform: translateY(100%);
        }

        .container.show {
            transform: translateY(0%);
        }

        h2 {
            margin: 0;
            display: flex;
            justify-content: center;
            padding: 10px;
            box-shadow: 0px 2px 3px 0px rgba(0,0,0,0.5);
        }
        
        wc-button {
          --button-radius: 0;
          --button-padding: 15px 10px;
          --button-font-size: 1.3rem;
          --color-primary: #2ecc71;
          --color-primary-dark: #27ae60;
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
        
        .loading {
          position: absolute;
          background: white;
          height: 100%;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        @keyframes fade-out {
          to {opacity: 0;}
        }
        
        .fade-out {
          animation: fade-out 1s;
        }
        
    </style>

    <div class="container">
        <h2>Close</h2>
        <div id="list"></div>
        <wc-button>Export to excel</wc-button>
        
         <div class="loading">
            <h4>Loading</h4>
         </div>
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
            this.close();
        }
        this.shadowRoot.querySelector('wc-button').onclick = e => {
          this.downloadFile();
        }
    }
    
    close() {
      this.shadowRoot.querySelector('.container').classList.remove('show');
      window.URL.revokeObjectURL(this.fileUrl);
    }

    show() {
        let loading = this.shadowRoot.querySelector('.loading');
        loading.style.display ='flex';
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
        
        this.summaryPresenter.downloadToExcel()
          .then(file => {
            Utils.animate(loading, 'fade-out' ,() => {
              loading.style.display = 'none';
              loading.classList.remove('fade-out');
            });
            var a = document.createElement('a');
            a.href = file.url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(file.url);
          });
    }
    
    downloadFile() {
      var a = document.createElement('a');
      a.href = this.fileUrl;
      a.download = this.fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
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