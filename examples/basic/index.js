(async () => {
const/**@type {import('../../packages/hyperlight/index')}*/h = await import("hyperlight");
const/**@type {import('../../packages/anonymous/index')}*/a = await import("anonymous");

class CounterComponent extends h.HyperLightComponent {
    static name = "counter";

    constructor() {
        super(CounterComponent.name, 0);

        a.load$("session", this.getUniqueID(), 0, s => {
            s = parseInt(s);
            if(isNaN(s)) s = 0;
            this.state$ = s;
        });

        this.addHandler('increment-button-handler', 'click', _event => {
            this.state$++;
        });
        this.addHandler('decrement-button-handler', 'click', _event => {
            this.state$--;
        });
    }
    onRender() {
        this.innerText = `clicks: ${this.state$}`;
        a.save$("session", this.getUniqueID(), ""+this.state$);
    }
    onConnect() {
        this.onRender();
    }
}
CounterComponent.link();



})();