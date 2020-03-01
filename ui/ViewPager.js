const template = `
    <style>
      .container {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: 100vw;
        height: 50vh;
        touch-action: none;
        width: auto;
        transform: translateX(0px);
        overflow-x: hidden;
        background: blue;
        }
      .disable-scrollbars::-webkit-scrollbar {
        width: 0px;
        background: transparent; /* Chrome/Safari/Webkit */
      }
        
      .disable-scrollbars {
        scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none;  /* IE 10+ */
      }
     
    </style>

    <div class="container disable-scrollbars">
    </div>
`;

export default class ViewPager extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = template;
        this.container = this.shadowRoot.querySelector('.container');
        let container = this.container;
        
        this.numberOfPages = 0;
        this.currentIndex = 0;
        this.pageWidth = window.innerWidth;
        
        /**
        let pageWidth = this.pageWidth;
        let dragLimit = pageWidth / 5;
        this.maxOffset = pageWidth * (1- this.numberOfPages);
        this.currentIndex = 0;
        
        let isDragging = false;
        let startX = 0;
        let distanceMoved = 0;
        let offset = 0;
        container.onpointerdown = e => {
            isDragging = true;
            startX = e.clientX;
            container.style.transition = '';
        }
        container.onpointermove = e => {
          if(this.numberOfPages <= 1) return;
            if(isDragging) {
                distanceMoved = e.clientX - startX;
                let moveTo = distanceMoved + offset;

                if(moveTo > 0) {
                  console.log('jdjd');
                    distanceMoved = 0;
                    offset = 0;
                    moveTo = 0;
                }
                if(moveTo < this.maxOffset) {
                    console.log('nxnxnx');
                    distanceMoved = 0;
                    offset = this.maxOffset;
                    moveTo = this.maxOffset;
                }
                container.style.transform = `translateX(${moveTo}px`;
               
            }
        }
        container.onpointerup = e => {
            let currentIndex = this.currentIndex;
            isDragging = false;
            let finalX = 0;
            if(distanceMoved > dragLimit) {
                finalX = -pageWidth * (currentIndex - 1);
                if(currentIndex !== 0) currentIndex--;
                
            } else if(distanceMoved < -dragLimit) {
                finalX = -pageWidth * (currentIndex + 1);
                if(currentIndex != 3) currentIndex++;
            } else {
                finalX = -pageWidth * currentIndex;
            }
            container.style.transition = 'transform .3s';
            container.style.transform = `translateX(${finalX}px`;
            offset = finalX;
            this.currentIndex = currentIndex;
        } 
        **/
    }

    getPage(selector) {
      return this.container.querySelector(selector);
    }
    
    add(fragmentElement) {
      this.container.appendChild(fragmentElement);
      this.numberOfPages++;
      this.container.style.width = `${this.pageWidth * this.numberOfPages}px`
    }
    
    setCurrentItem(index) {
      this.currentIndex = index;
      let moveTo = index * this.pageWidth;
      this.container.style.transform = `translateX(-${moveTo}px`;
    }
    
}