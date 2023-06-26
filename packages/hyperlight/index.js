const handlerOwners = {};
class ReactiveComponent extends HTMLElement {
    state;
    constructor(defaultState) {
        super();
        this.state = defaultState;
    }
    __addHandler(handlerID, event, listener, options) {
        const self = this;
        const elements = document.getElementsByTagName("*");
        for (let i = 0; i < elements.length; i++) {
            const attrs = elements[i].attributes;
            const handler = attrs.getNamedItem("handler");
            if (!handler)
                continue;
            if (!handler.value)
                continue;
            if (handler.value != handlerID)
                continue;
            elements[i].addEventListener(event, function () {
                listener.apply(this, arguments);
                self.__updateSelf.apply(self);
            }, options);
        }
    }
    get state$() {
        return this.state;
    }
    set state$(state) {
        this.state = state;
        this.__updateSelf();
    }
}
export class HyperLightComponent extends ReactiveComponent {
    static __instances = 0;
    static link() {
        globalThis.customElements.define(`h-${this.name}`, this);
    }
    uniqueID;
    name;
    constructor(name, defaultState) {
        super(defaultState);
        HyperLightComponent.__instances++;
        this.name = name;
        this.uniqueID = `${name}-${window.location.href}-${HyperLightComponent.__instances}`;
    }
    __updateSelf() {
        this.onRender();
    }
    connectedCallback() {
        this.onConnect();
    }
    getUniqueID() {
        return this.uniqueID;
    }
    addHandler(handlerID, event, listener, options) {
        const thisID = this.getUniqueID();
        if (handlerOwners[handlerID]) {
            const thisIDParts = this.getUniqueID().split(/-/);
            const ownerIDParts = handlerOwners[handlerID].split(/-/);
            if (thisIDParts[0] == ownerIDParts[0] && thisIDParts[1] == ownerIDParts[1]) {
                if (handlerOwners[handlerID] == thisID)
                    throw new Error(`You have already registered to handle ${handlerID}!`, { cause: this.name });
                console.warn(`This Component has already registered to handle ${handlerID}`, this.name);
                return;
            }
        }
        handlerOwners[handlerID] = thisID;
        this.__addHandler(handlerID, event, listener, options);
    }
    onConnect() { }
}
export var Hashing;
(function (Hashing) {
    const dataHashes = {};
    async function hash(input) {
        const text = new TextEncoder().encode(input);
        const hashBuffer = await crypto.subtle.digest("SHA-1", text);
        const hashBytes = new Uint8Array(hashBuffer);
        const hashString = Array.from(hashBytes, (byte) => {
            return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('');
        return hashString;
    }
    Hashing.hash = hash;
    async function compare(key, newvalue, ifDifferent = () => undefined, ifSame = () => undefined) {
        const newDataHash = await hash(newvalue);
        if (dataHashes[key] != newDataHash) {
            dataHashes[key] = newDataHash;
            return ifDifferent();
        }
        else {
            return ifSame();
        }
    }
    Hashing.compare = compare;
})(Hashing || (Hashing = {}));
