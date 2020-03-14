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
            scrollbar-width: none;
        }

        .container.show {
            transform: translateY(0%);
        }

        #toolbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            margin: 0;
            display: flex;
            justify-content: space-between;
            flex-direction: row;
            padding: 12px 10px;
            background: rgba(250, 245, 250, 0.9);
            transition: .5s all;
        }
        
        #toolbar > p {
          padding: 0;
          margin: 0;
          font-weight: 900;
        }
        
        #toolbar > h4 {
          padding: 0;
          margin: 0px 10px 0px 0px;
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
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 80px;
        box-sizing: border-box;
        padding-top: 40px;
        scrollbar-width: none;
        }  
        
        #list::-webkit-scrollbar {
            display: none;
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
        <div id="toolbar">
          <p>Total strength</p>
           <h4>X</h4>
         </div>
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
        let toolbar = this.shadowRoot.getElementById('toolbar');
        this.titleText = toolbar.querySelector('p');
        Utils.onclick(toolbar, e => {
          this.close();  
        });
        this.shadowRoot.querySelector('wc-button').onclick = e => {
          this.downloadFile();
        }
        this.list = this.shadowRoot.getElementById('list');
         
        this.list.onscroll = e => {
          if (this.list.scrollTop > 0) {
            toolbar.style.boxShadow = '3px 0px 3px 3px rgba(50,50,50,0.3)';
          } else {
            toolbar.style.boxShadow = '0px 0px 0px 0px rgba(0,0,0,0)';
          }
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
        this.list.innerHTML = "";
        let data = this.summaryPresenter.getSummary();
        let total = 0;
        for(let [category, statusTypes] of Object.entries(data)) {
          let count = this.createCategory(category, statusTypes);
          total += count;
        }
        this.titleText.textContent = `Total strength: ${total}`;
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
      let total = regCount + nsfCount;
      return total;
    }
}