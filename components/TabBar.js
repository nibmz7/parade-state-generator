const template = tabs => `
    <style>
        .mdc-tab {
            font-family: 'Quicksand' !important;
            font-weight: 500 !Important;
        }
    </style>

  <link href="https://unpkg.com/material-components-web@v4.0.0/dist/material-components-web.min.css" rel="stylesheet"></head>

    <div class="mdc-tab-bar" role="tablist">
        <div class="mdc-tab-scroller">
            <div class="mdc-tab-scroller__scroll-area">
                <div id="tabs" class="mdc-tab-scroller__scroll-content">
                    ${tabs}
                </div>
            </div>
        </div>
    </div>

`;

const item = (title) => `
    <button class="mdc-tab" role="tab" aria-selected="false" tabindex="-1">
        <span class="mdc-tab__content">
            <span class="mdc-tab__text-label">${title}</span>
        </span>
        <span class="mdc-tab-indicator">
            <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
        </span>
        <span class="mdc-tab__ripple"></span>
    </button>
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

        let tabBar = mdc.tabBar.MDCTabBar.attachTo(this.shadowRoot.querySelector('.mdc-tab-bar'));
        tabBar.activateTab(0);

        tabBar.listen('MDCTabBar:activated', activatedEvent => {
            console.log(activatedEvent.detail.index);
        });
    }

}