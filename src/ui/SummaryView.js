import SummaryPresenter from '../presenter/SummaryPresenter.js';
import Status from '../logic/Status.js';
import Utils from '../Utils.js';
import SectionView from './SectionView.js';
customElements.define('section-view', SectionView);

const template = `
    <style>
        .container {
            background: white;
            height: 100%;
            width: 100%;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 9;
            transition: .5s transform;
            transform: translateY(100%);
            background: #FAF5FA;
        }

        .container.show {
            transform: translateY(0%);
        }

        h3 {
            position: fixed;
            top: 0;
            margin: 0;
            display: flex;
            justify-content: start;
            padding: 12px 10px;
            width: 100%;
            background: #FAF5FA;
        }
        
        wc-button {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          --button-radius: 0;
          --button-padding: 15px 10px;
          --button-font-size: 1.3rem;
          --color-primary: #2ecc71;
          --color-primary-dark: #27ae60;
          box-shadow: 0px 2px 3px 2px rgba(0,0,0,0.2);
        }
        
        #list { 
        height: 100%;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        scroll-behavior: smooth;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 120px;
        box-sizing: border-box;
        padding-top: 50px;
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
        <h3><---</h3>
        <div id="list"></div>
        <wc-button>Export to excel</wc-button>
        
         <div class="loading">
            <h4>Loading</h4>
         </div>
    </div>
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
        this.list = this.shadowRoot.getElementById('list');
    }
    
    close() {
      this.shadowRoot.querySelector('.container').classList.remove('show');
      window.URL.revokeObjectURL(this.fileUrl);
    }

    show() {
        let loading = this.shadowRoot.querySelector('.loading');
        loading.style.display ='flex';
        this.shadowRoot.querySelector('.container').classList.add('show');
        this.list.innerHTML = "";
        let data = this.summaryPresenter.getSummary();
        for(let [category, statusTypes] of Object.entries(data)) {
          this.createCategory(category, statusTypes);
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
    
    createCategory(category, statusTypes) {
      const itemTemplate = `
        .sub-header {
          margin-top: 10px;
          text-align: center;
          font-weight: 900;
          color: red;
        }
        .item {
         font-weight: 600;
         padding: 5px 15px;
         font-size: 0.9rem;
        }
        .item:last-child {
          padding-top: 5px;
          padding-bottom: 15px;
        }
        
        .bold {
          font-weight: 700;
          color: #EAB543;
        }
      `;
      
      let regCount = 0;
      let nsfCount = 0;
      let sectionView = document.createElement('section-view');
      sectionView.setHeader(category);
      sectionView.addStyle(itemTemplate);
      for (let [status, employees] of Object.entries(statusTypes)) {
        let statusName = Status[status].name;
        let subHeader = document.createElement('div');
        subHeader.classList.add('sub-header');
        subHeader.textContent = statusName;
        sectionView.addItem(subHeader);
        for (let employee of employees) {
          let item = document.createElement('div');
          item.classList.add('item');
          if (employee.remark.length > 0) item.classList.add('bold');
          let info = employee.rank + " " + employee.name;
          if (employee.remark && employee.remark.length > 0)
            info += " - " + employee.remark;
          item.textContent = info;
          sectionView.addItem(item);
          if (employee.isRegular) regCount++;
          else nsfCount++;
        }
      }
      sectionView.setTotal(regCount, nsfCount);
      this.list.appendChild(sectionView);
    }
}