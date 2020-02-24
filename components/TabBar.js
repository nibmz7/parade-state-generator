import Utils from '../Utils.js';

const template = tabs => `  
  <style>
    .container {
      position: relative;
      transform: translateX(0px);
      touch-action: none;
      
    }
    .indicator {
      position: absolute;
      height: 2px; 
      width: 10px;
      background: blue;
      bottom: 0;
      left: 0;
      margin-left: 0px;
    }
    .tabs {
      display: flex;
      flex-direction: row;
     } 
    p {
      margin: 0;
      padding: 10px 15px;
      cursor: pointer;
    }
    p.activated {
      color: purple;
      font-weight: 600;
      background: rgba(0,0,0,.1);
    }
    p:active {
      background: rgba(0,0,0,.2);
    }
  </style>
  
  <div class="container">
    <div class="tabs">
      ${tabs}
    </div>
    <div class="indicator"></div>
  </div>

  
`;

const item = (title) => `
   <p>${title}</p>
`;

export default class TabBar extends HTMLElement {
    constructor() {
      super();

      let slots = this.querySelectorAll('slot');

      let content = '';
      for(let slot of slots) {
        let title = slot.innerHTML;
        content += item(title);
      }

      this.attachShadow({mode: 'open'});
      this.shadowRoot.innerHTML = template(content);
      let selected = 0;
      let container = this.shadowRoot.querySelector('.container');
      let indicator = this.shadowRoot.querySelector('.indicator');
      
      let tabs = this.shadowRoot.querySelectorAll('p');
      tabs.forEach((tab, index) => {
        Utils.onclick(tab, e => {
          tabs[selected].classList.toggle('activated');
          tab.classList.toggle('activated');
          let tabPosition = tab.getBoundingClientRect().left;
          let startPosition = container.getBoundingClientRect().left;
          let offset = tabPosition - startPosition;
          indicator.style.marginLeft = `${offset}px`;
          indicator.style.width = `${tab.offsetWidth}px`;
          selected = index;
        });
      });

      tabs[0].classList.toggle('activated');
      indicator.style.width = `${tabs[0].offsetWidth}px`;
      
      let isDragging = false;  
      let startX = 0;
      let offset = 0;
      let distanceMoved = 0;
      let threshold = 30;
      let allowedTime = 200;
      let startTime = 0;
      let maxOffset = document.documentElement.clientWidth - container.scrollWidth;
      console.log(maxOffset);
      container.onpointerdown = e => {
        isDragging = true;
        startX = e.clientX;
        startTime = new Date().getTime();
        container.style.transition = '';
      }
      container.onpointermove = e => {
        if (isDragging) {
          distanceMoved = e.clientX - startX;
          let moveTo = distanceMoved + offset;
          
          if (moveTo > 0) {
            distanceMoved = 0;
            offset = 0;
            moveTo = 0;
          }
          if (moveTo < maxOffset) {
            distanceMoved = 0;
            offset = maxOffset;
            moveTo = maxOffset;
          }
          
          container.style.transform = `translateX(${moveTo}px`;
        }
      }
      
      container.onpointerup = e => {

        if(isDragging) {
          isDragging = false;
          offset += distanceMoved;
          let elapsedTime = new Date().getTime() - startTime;
         if(Math.abs(distanceMoved) >= threshold) {
           if(elapsedTime <= allowedTime) {
             offset += distanceMoved * 2;
           }
           if(distanceMoved > 0) {
             offset += 50;
           }
           if(distanceMoved < 0) {
             offset -= 50;
           }
           if (offset > 0) {
             offset = 0;
           }
           if (offset < maxOffset) {
             offset = maxOffset;
           }
           container.style.transition = 'transform .3s ease-out'
           container.style.transform = `translateX(${offset}px`;
         }
        }
      }
  }

}