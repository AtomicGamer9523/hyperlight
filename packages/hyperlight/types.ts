import { HyperLightComponent } from "./index";

export interface HandlerOwners {
    [id: string]: string
}

export interface UniqueItem {
    /**
     * Gets a Unique ID of an Item
     * @returns {string} ID
     * @public
    */
    getUniqueID(): string;
}

export interface HyperLightComponentConstructor<T> {
    /**
     * @returns {HyperLightComponent<T>}
    */
    new(): HyperLightComponent<T>;
}

export interface IReactiveComponent<State> {
    /**
     * The current state of the Component
     * @public
    */
    get state$(): State;
}

export interface IHyperLightComponent<State> extends IReactiveComponent<State> {
    /**
     * Adds an event listener to a handler.
     * @example
     * ```js
     * this.addHandler('handlerID', 'eventName', event => {
     *     console.log(event);
     * });
     * ```
     * @param {string} handlerID handler ID
     * @param {Event} event event to listen to
     * @param {(this: Element, ev: ElementEventMap[Event]) => void} listener listener
     * @param {boolean | AddEventListenerOptions | undefined} options additional options
     * @returns {void} void
     * @public
    */
    addHandler<Event extends keyof ElementEventMap>(
        handlerID: string, event: Event,
        listener: (this: Element, ev: ElementEventMap[Event]) => Promise<void>,
        options?: boolean | AddEventListenerOptions
    ): void;

    /**
     * Invoked each time the state updates or a render is requested.
     * @abstract
    */
    onRender(): void;

    /**
     * Invoked each time the custom element is appended into a document-connected element.
     * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
     * @abstract
    */
    onConnect(): void;
}

export namespace HashingTypes {
    export type Hash = string;
    
    export interface DataHashes {
        [key: string]: Hash
    }
}
