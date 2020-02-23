const template = `
    <style>
        .container {
            display: grid;
            grid-auto-flow: column;
            grid-auto-columns: 100vw;
            height: 100%;
            touch-action: none;
            width: 300vw;
            transform: translateX(0px);
        }
        .page {
            background: red;
            color: white;
            width: 100vw;
        }
        .page:nth-child(2) {
            background: green;
        }
        .page:nth-child(3) {
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
        <div class="page">
            <p>Page 1</p>
        </div>

        <div class="page">
            <p>Page 2</p>
        </div>

        <div class="page">
            <p>Page 3</p>
        </div>
    </div>
`;

export default class ViewPager extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = template;
        let container = this.shadowRoot.querySelector('.container');
        let maxWidth = container.clientWidth / 3;
        let dragLimit = container.clientWidth / 3 / 4;
        let maxOffset = container.clientWidth / 3 * -2;
        let pages = this.shadowRoot.querySelectorAll('.page');

        let currentIndex = 0;

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
            if(isDragging) {
                distanceMoved = e.clientX - startX;
                let moveTo = distanceMoved + offset;

                if(moveTo > 0) {
                    distanceMoved = 0;
                    offset = 0;
                    moveTo = 0;
                }
                if(moveTo < maxOffset) {
                    distanceMoved = 0;
                    offset = maxOffset;
                    moveTo = maxOffset;
                }
                container.style.transform = `translateX(${moveTo}px`;
               
            }
        }
        container.onpointerup = e => {
            isDragging = false;
            let finalX = 0;
            if(distanceMoved > dragLimit) {
                finalX = -maxWidth * (currentIndex - 1);
                if(currentIndex != 0) currentIndex--;
                
            } else if(distanceMoved < -dragLimit) {
                finalX = -maxWidth * (currentIndex + 1);
                if(currentIndex != 3) currentIndex++;
            } else {
                finalX = -maxWidth * currentIndex;
            }
            container.style.transition = 'transform .3s';
            container.style.transform = `translateX(${finalX}px`;
            offset = finalX;
            
        }
    }
}