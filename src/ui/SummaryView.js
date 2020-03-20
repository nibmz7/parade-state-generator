import SummaryPresenter from '../presenter/SummaryPresenter.js';
import Status from '../logic/Status.js';
import Utils from '../Utils.js';
import SectionView from './SectionView.js';
customElements.define('section-view', SectionView);

const template = `
    <style>
        .container {
            position: fixed;
            bottom: 0;
            top: 0;
            left: 0;
            right: 0;
            z-index: 9;
            transition: .5s transform ease-in-out;
            transform: translateY(100%);
            background: #FAF5FA;
            box-shadow: rgba(119, 116, 116, 0.23) -1px 1px 2px 3px;
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
          height: 99%;
          width: 100%;
          overflow-x: hidden;
          overflow-y: scroll;
          padding-left: 20px;
          padding-right: 20px;
          padding-bottom: 70px;
          box-sizing: border-box;
          padding-top: 40px;
        }  
        
        #list::-webkit-scrollbar {
            display: none;
        }
    </style>
    
    <div class="container">
        <div id="toolbar">
          <p>Total strength</p>
           <h4>X</h4>
         </div>
        <div id="list"></div>
        <wc-button>Export to excel</wc-button>
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
        this.shadowRoot.querySelector('.container').classList.add('show');
        this.list.innerHTML = "";
        let summary = this.summaryPresenter.getSummary();
        let list = [];
        for(let status in summary.list) {
          if(!summary.list[status]) continue;
          let currCat = Status[status].category;
          let nextCat = Status[status+1] ? Status[status+1].category : '';
          for(let employee of summary.list[status]) {
            list.push(employee);
          }
          if(currCat != nextCat) {
            if(list.length > 0) {
              this.createCategory(currCat, list);
              list = [];
            }
          }
        }
        this.titleText.textContent = `Total: ${summary.total} ~ Present: ${summary.present}  Current: ${summary.current}`;
        this.summaryPresenter.downloadToExcel(summary.list, summary.total, summary.present)
          .then(file => {
            this.fileUrl = file.url;
            this.fileName = file.name;
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
    
    createCategory(category, employees) {
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
         text-transform: capitalize;
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
      let currStatus = -1;
      for (let employee of employees) {
        let status = employee.status;
        let statusName = Status[status].name;
        if(currStatus != status) {
          let subHeader = document.createElement('div');
          subHeader.classList.add('sub-header');
          subHeader.textContent = statusName;
          sectionView.addItem(subHeader);
          currStatus = status;
        }
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
      sectionView.setTotal(regCount, nsfCount);
      this.list.appendChild(sectionView);
      let total = regCount + nsfCount;
      return total;
    }
}