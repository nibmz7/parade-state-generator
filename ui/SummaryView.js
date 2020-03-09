const template = `
    <style>
        .container {
            background: aquamarine;
            height: 100%;
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 99;
            transition: .5s transform;
            transform: translateY(100%);
        }

        .container.show {
            transform: translateY(0%);
        }

        h2 {
            margin: 0;
        }
    </style>

    <div class="container">
        <h2>SUMMARY VIEW</h2>
    </div>
`;

export default class SummaryView extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = template;
        this.shadowRoot.querySelector('h2').onclick = e => {
            this.shadowRoot.querySelector('.container').classList.remove('show');
        }
    }

    show() {
        this.shadowRoot.querySelector('.container').classList.add('show');
    }
}