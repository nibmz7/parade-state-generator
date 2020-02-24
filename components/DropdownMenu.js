import Utils from '../Utils.js';
const template = options => `
  <style>
    .container {
      position: relative;
      width: 200px;
    }
    .menu {
      position: absolute;
      border-radius: 2px;
      top: 0;
      left: 0;
      z-index: 5;
      background: white;
      color: black;
      opacity: 0;
      display: none;
      width: inherit;
      height: 50px;
      overflow-x: hidden;
      box-shadow: 0;
      transition: all .2s;
    }
    
    .appear {
      height: 500px;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    }
    
    @keyframes fade-in {
      100% {
        opacity: 1;
      }
    }
    
    @keyframes fade-out {
      100% {
        opacity: 0;
      }
    }
    
    p {
      margin: 0;
      padding: 10px 15px;
      font-size: 25px;
    } 
    #list > .selected {
      display: none;
    }
  </style>
  
  <div class="container">
  
    <p class="title">Lorem ipsum</p>
  
    <div class="menu">
      <p id="selected">Lorem ipsum</p>
      <div id="list">
        ${options}
      </div>
    </div>
  
  </div>
`;

export default class DropdownMenu extends HTMLElement {
  
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = template(this.innerHTML);
   
    let menu = this.shadowRoot.querySelector('.menu');
    let title = this.shadowRoot.querySelector('.title');
    let list = this.shadowRoot.getElementById('list');
    let selected = this.shadowRoot.getElementById('selected');
 
    let prevIdx = 0;
    let currIdx = 0;
    let opening = false;
    Utils.onclick(title, e => {
      opening = true;
      menu.style.animation = '.1s fade-in';
      menu.style.display = 'block';
    });
    
    const onSelected = idx => {
      prevIdx = currIdx;
      currIdx = idx;
      title.textContent = options[idx].innerHTML;
      menu.style.height = title.offsetHeight + 'px';
      menu.classList.toggle('appear');
      menu.style.animation = '.1s fade-out .2s';
    }
    
    let options = list.querySelectorAll('p');
    options.forEach((option, index) => {
      Utils.onclick(option, e => {
        onSelected(index);
      });
    });
    
    Utils.onclick(selected, e => {
      onSelected(currIdx);
    });
    
    menu.addEventListener('animationend', () => {
      if(opening) { 
        opening = false;
        menu.style.opacity = '1';
        menu.style.height = menu.scrollHeight + 'px';
        menu.classList.toggle('appear');
      } else {
        menu.style.display = 'none'; 
        selected.textContent = options[currIdx].textContent;
        options[prevIdx].classList.toggle('selected');
        options[currIdx].classList.toggle('selected');
      }
      
    });
    
    options[0].classList.toggle('selected');
    
  }
  
}


