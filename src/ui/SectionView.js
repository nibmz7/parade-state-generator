const template = `
  <style>
    
    
    #header {
      color: #828282;
      text-transform: capitalize;
    }
        
    #card {
      border-radius: 15px;
      background: white;
      box-shadow: 0px 2px 50px 0px rgba(209, 202, 209, 1);
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
  
  <div>
    <h3 id="header"></h3>
    <div id="card">
      <div id="strength">0 Present</div> 
      <div id="list"></div> 
    </div>
  </div>
`;

export default class SectionView extends HTMLElement {
  
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = template;
    this.header = this.shadowRoot.getElementById('header');
    this.strength = this.shadowRoot.getElementById('strength');
    this.list = this.shadowRoot.getElementById('list');
    this.strength = this.shadowRoot.getElementById('strength');
  }
  
  addStyle(styleText) {
    let tag = document.createElement('style');
    tag.innerHTML = styleText;
    this.shadowRoot.appendChild(tag);
  }
  
  setHeader(text) {
    this.header.textContent = text;
  }
  
  setStrength(presentReg, presentNsf) {
    let total = presentReg + presentNsf;
    let strength = `${total} Present ~ ${presentReg} Reg + ${presentNsf} Nsf`;
    this.strength.textContent = strength;
  }
  
  setTotal(totalReg, totalNsf) {
    let total = totalReg + totalNsf;
    let strength = `${total} Total ~ ${totalReg} Reg + ${totalNsf} Nsf`;
    this.strength.textContent = strength;
  }
  
  addItem(item) {
    this.list.appendChild(item);
  }

}