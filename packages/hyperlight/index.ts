import { HyperLightComponentConstructor, IHyperLightComponent, IReactiveComponent, HandlerOwners, HashingTypes, UniqueItem } from "./types";

const handlerOwners: HandlerOwners = {};

/**
 * A Class Representing a reactive element
*/
abstract class ReactiveComponent<State>
    // Needed for the web-components to actually work
    extends HTMLElement
    // Who doesn't like docs ? ;)
    implements IReactiveComponent<State>
{
    /**
     * Internal state of the component
     * @private
    */
    private state: State;

    /**
     * Never explicity called
     * @param defaultState 
     * @constructor
    */
    constructor(defaultState: State) {
        super();
        this.state = defaultState;
    }

    /**
     * Internal method that should **NOT** be overwritten by the user
     * @param {string} handlerID handler ID
     * @param {Event} event event to listen to
     * @param {(this: Element, ev: ElementEventMap[Event]) => void} listener listener
     * @param {boolean | AddEventListenerOptions | undefined} options options
     * @returns {void}
     * @private
    */
    protected __addHandler<Event extends keyof ElementEventMap>(
        handlerID: string, event: Event,
        listener: (this: Element, ev: ElementEventMap[Event]) => void,
        options?: boolean | AddEventListenerOptions
    ): void {
        const self = this;
        const elements = document.getElementsByTagName("*");
        for (let i = 0; i < elements.length; i++) {
            const attrs = elements[i].attributes;
            const handler = attrs.getNamedItem("handler");
            if (!handler) continue;
            if (!handler.value) continue;
            if (handler.value != handlerID) continue;
            elements[i].addEventListener(event, function() {
                listener.apply(this, arguments)
                self.__updateSelf.apply(self);
            }, options)
        }
    }

    /**
     * Internal method that should **NOT** be overwritten by the user
     * @abstract
     * @returns {void}
     * @private
    */
    protected abstract __updateSelf(): void;

    /**
     * Internal method that should **NOT** be overwritten by the user
     * @abstract
     * @returns {void}
     * @private
    */
    protected abstract connectedCallback(): void;


    public get state$(): State {
        return this.state;
    }

    /**
     * The current state of the Component
     * @protected
    */
    protected set state$(state: State) {
        this.state = state;
        this.__updateSelf();
    }
}

/**
 * # HyperLightComponent
 * 
 * ## The Core of it all
 * 
 * ### Example:
 * 
 * **Html**:
 * 
 * ```html
 * <h-counter>clicks: 0</h-counter>
 * <button handler="increment-button-handler">Increment</button>
 * ```
 * 
 * **JS**:
 * ```js
 * class CounterComponent extends h.HyperLightComponent {
 *     static name = "counter";
 *     constructor() {
 *         super(0);
 *         this.addHandler('increment-button-handler', 'click', event => {
 *             console.log("Increment Button Clicked!", event)
 *             this.state$++;
 *         });
 *     }
 *     render() {
 *         this.textContent = `clicks: ${this.state$}`
 *     }
 * }
 * CounterComponent.link();
 * ```
*/
export abstract class HyperLightComponent<State>
    // Technically optional, unless you actually want it to work ;)
    extends ReactiveComponent<State>
    // DOCS
    implements IHyperLightComponent<State>, UniqueItem
{
    /**
     * Instances created
    */
    private static __instances: number = 0;

    /**
     * Allows your component to be used in html.
     * 
     * @example
     * ```js
     * MyCustomComponent.link();
     * ```
    */
    public static link(): void {
        globalThis.customElements.define(`h-${this.name}`,
            this as unknown as HyperLightComponentConstructor<any>
        );
    }

    /**
     * Unique ID for only one singular instance of the Component
    */
    private uniqueID: string;

    /**
     * A Common a simple name
    */
    private name: string;

    /**
     * @param {string} name name of this Component
     * @param {State} defaultState the default state of the application
     * @constructor
     * @public
    */
    public constructor(name: string, defaultState: State) {
        super(defaultState);
        HyperLightComponent.__instances++;
        this.name = name;
        this.uniqueID = `${name}-${window.location.href}-${HyperLightComponent.__instances}`;
    }
    protected __updateSelf() {
        this.onRender();
    }
    protected connectedCallback() {
        this.onConnect();
    }
    public getUniqueID(): string {
        return this.uniqueID;
    }
    public addHandler<Event extends keyof ElementEventMap>(
        handlerID: string, event: Event,
        listener: (this: Element, ev: ElementEventMap[Event]) => void,
        options?: boolean | AddEventListenerOptions
    ): void {
        const thisID: string = this.getUniqueID();
        if(handlerOwners[handlerID]) {
            const thisIDParts = this.getUniqueID().split(/-/);
            const ownerIDParts = handlerOwners[handlerID].split(/-/)
            if(thisIDParts[0] == ownerIDParts[0] && thisIDParts[1] == ownerIDParts[1]) {
                if(handlerOwners[handlerID] == thisID)
                    throw new Error(`You have already registered to handle ${handlerID}!`,{ cause: this.name })
                console.warn(`This Component has already registered to handle ${handlerID}`, this.name);
                return;
            }
        }
        handlerOwners[handlerID] = thisID;
        this.__addHandler(handlerID, event, listener, options);
    }
    public abstract onRender(): void;
    public onConnect(): void { }
}

export namespace Hashing {
    const dataHashes: HashingTypes.DataHashes = {};

    export async function hash(input: string): Promise<HashingTypes.Hash> {
        const text: Uint8Array = new TextEncoder().encode(input);
        const hashBuffer: ArrayBuffer = await crypto.subtle.digest("SHA-1", text);
        const hashBytes: Uint8Array = new Uint8Array(hashBuffer)
        const hashString: string = Array.from(hashBytes, (byte: number) => {
            return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('');
        return hashString;
    }

    export async function compare<T>(
        key: string, newvalue: string,
        ifDifferent: () => T = () => undefined,
        ifSame: () => T = () => undefined
    ): Promise<T> {
        const newDataHash = await hash(newvalue);
        if (dataHashes[key] != newDataHash) {
            dataHashes[key] = newDataHash;
            return ifDifferent();
        } else {
            return ifSame();
        }
    }
}
