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

        h3 {
            margin: 0;
            display: flex;
            justify-content: start;
            padding: 12px 10px;
            box-shadow: 0px 2px 3px 0px rgba(0,0,0,0.2);
        }
        
        wc-button {
          --button-radius: 0;
          --button-padding: 15px 10px;
          --button-font-size: 1.3rem;
          --color-primary: #2ecc71;
          --color-primary-dark: #27ae60;
          box-shadow: 0px 2px 3px 2px rgba(0,0,0,0.2);
        }
        
        .container {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        #list { height: 100%;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        scroll-behavior: smooth;
       // flex: 1;
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
        
        .header {
          display: flex:
          justify-content: center;
          align-items: center;
          padding: 10px;
          background: #95a5a6;
          margin-top: 5px;
        }
        
        .header:first-child {
          margin-top: 0;
        }
        
        .sub-header {
          padding: 10px 10px 5px 10px;
        }
        
        .item {
          padding: 5px 10px;
          font-size: 0.7rem;
        }
        
        h4, h5, p {
          margin: 0;
        }
        
    </style>

    <div class="container">
        <h3>X Close</h3>
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
    
    <template id="sub-header">
      <div class="sub-header">
        <h5></h5>
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
        let h3 = this.shadowRoot.querySelector('h3');
        Utils.onclick(h3, e => {
          this.close();  
        });
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
        for(let [category, statusTypes] of Object.entries(data)) {
          let header = this.createHeader(category);
          let headerTitle = header.querySelector('h4');
          list.appendChild(header);
          let count = 0;
          for(let [status, employees] of Object.entries(statusTypes)) {
            let subHeader = this.createSubHeader(Status[status].name);
            list.appendChild(subHeader);
            for(let employee of employees) {
              let item = this.createItem(employee);
              list.appendChild(item);
              count++;
            }
          }
          let headerText = category + ' x ' + count;
          headerTitle.textContent = headerText;
        }
        
        this.summaryPresenter.downloadToExcel()
          .then(file => {
            this.fileUrl = file.url;
            this.fileName = file.name;
            Utils.animate(loading, 'fade-out' ,() => {
              loading.style.display = 'none';
              loading.classList.remove('fade-out');
            });
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
    
    createHeader(category) {
      let template = this.shadowRoot.getElementById('header');
      let clone = template.content.cloneNode(true);
      let title = clone.querySelector('h4');
      title.textContent = category;
      return clone;
    }
    
    createSubHeader(status) {
      let template = this.shadowRoot.getElementById('sub-header');
      let clone = template.content.cloneNode(true);
      let title = clone.querySelector('h5');
      title.textContent = status;
      return clone;
    }
    
    createItem(employee) {
      let template = this.shadowRoot.getElementById('item');
      let clone = template.content.cloneNode(true); 
      let name = clone.querySelector('p');
      let text = employee.rank + " " + employee.name;
      if(employee.remark && employee.remark.length > 0) 
       text += " - " + employee.remark
      name.textContent = text;
      return clone;
    }
}