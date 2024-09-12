/// <reference path="./hyperlight.d.ts" />

(f=>f((n,v)=>Object.defineProperty(window,n,{configurable:!0,writable:!0,value:v})))(def => {
    'use strict';

    /**
     * Evaluates the given code in a safe way. Returns a potential result.
     * 
     * @this {HTMLElement | undefined} Element to use in the code
     * @param {string} code Code to evaluate
     * @param {any[]} args Arguments to pass to the function
     * @returns {unknown} Potential result of the code
    */
    function safeEval(code, ...args) {
        try {
            /**@type {Function}*/
            const func = eval(code);
            if (typeof func !== 'function') throw new Error(
                "Code must be the body of a function"
            );
            return func.call(this, ...args);
        } catch (e) {
            console.error("[Hyperlight] Error in evaluation:", e);
        }
        return undefined;
    }

    /**
     * Modifies the given element based on its attributes
     * 
     * From:
     * ```html
     * <img
     *     src="https://example.com/image.jpg"
     *     s.width = "100px"
     *     s.height = "100px"
     *     code = "console.log('This is an image', self)"
     *     lazyload
     * ></img>
     * ```
     * 
     * To:
     * ```html
     * <img
     *     src="https://example.com/image.jpg"
     *     decoding="async"
     *     loading="lazy"
     *     id="hyperlight-447e5c6264c571c7957ce8a27dd759f81528af89007274889f1360423189c85b"
     * ></img>
     * <script>
     *     (self => {
     *         console.log('This is an image', self);
     *     })(document.getElementById('hyperlight-447e5c6264c571c7957ce8a27dd759f81528af89007274889f1360423189c85b'));
     * </script>
     * <style>
     *     #hyperlight-447e5c6264c571c7957ce8a27dd759f81528af89007274889f1360423189c85b {
     *         width: 100px;
     *         height: 100px;
     *     }
     * </style>
     * ```
     * 
     * @this {HTMLElement} HTML Element with the given attribute
     * @param {string} attr Attribute name (guaranteed to exist on the element)
    */
    function elementModifier(attr) {
        // Lazy loading
        if (attr === 'lazyload') {
            this.removeAttribute('lazyload');
            this.setAttribute('decoding', 'async');
            this.setAttribute('loading', 'lazy');
        }

        // Code execution with this element (multiple expressions possible)
        if (attr === 'eval') {
            const code = this.getAttribute('eval');
            this.removeAttribute('eval');
            safeEval.apply(this, ["(function(){" + code + "})"]);
        }

        // Inline code execution with this element (single statement inside a string)
        if (attr.startsWith('$')) {
            const value = this.getAttribute(attr);
            const name = attr.slice(1);
            this.removeAttribute(attr);
            const res = safeEval.apply(this, ["(function(){return `" + value + "`})"]);
            this.setAttribute(name, res);
        }

        // Style modification
        if (!attr.startsWith('s.')) return;
        
        const value = this.getAttribute(attr);
        const key = attr.substring(2);

        this.removeAttribute(attr);

        const res = safeEval.apply(this, ["(function(){return `" + value + "`})"]);
        this.style.setProperty(key, res);
    }

    /**
     * Checks if the given node is an element and modifies it
     * if needed.
     * 
     * @param {HTMLElement} node Node to modify
    */
    function modNode(node) {
        if (node.nodeType !== 1) return;
        node.getAttributeNames().forEach(elementModifier, node);
    }

    /**
     * A simple Observer wrapper.
     * 
     * It observes the entire document and modifies elements
     * Using the {@link modNode} function.
     * 
     * It IS observing by default.
    */
    class HyperLightObserver extends MutationObserver {
        /**
         * Whether the observer should close automatically when the DOM is loaded.
         * 
         * @type {boolean}
        */
        #auto_close;
        /**
         * Constructs a new HyperLightObserver.
         * 
         * @param {boolean | undefined} autoClose 
        */
        constructor(autoClose = false) {
            super(c => c.forEach(r => r.addedNodes.forEach(modNode)));
            this.#auto_close = autoClose;
            this.open();
        }
        /**
         * Closes the observer.
         * 
         * @returns {void}
        */
        close() {
            this.disconnect();
        }
        /**
         * Opens the observer.
         * 
         * Observes the entire document.
         * 
         * @returns {void}
        */
        open() {
            this.observe(document, {
                childList: true,
                subtree: true
            });
        }
        /**@returns {boolean} If the observer should close automatically*/
        get autoClose() {
            return this.#auto_close;
        }
        /**
         * Sets whether the observer should close automatically.
         * @param {boolean} value `true` or `false`
        */
        set autoClose(value) {
            this.#auto_close = value === true;
        }
    }

    /**
     * Implementation of the HyperLight interface.
     * 
     * @implements {HyperLight}
    */
    class HyperLightImpl {
        #observer;
        constructor() {
            this.#observer = new HyperLightObserver();
            document.addEventListener('DOMContentLoaded', () => {
                if (window["HyperLight"].autoCloseObserver)
                    window["HyperLight"].closeObserver();
            });
            this.#observer.open();
        }
        closeObserver() {
            this.#observer.close();
        }
        openObserver() {
            this.#observer.open();
        }
        get autoCloseObserver() {
            return this.#observer.autoClose;
        }
        set autoCloseObserver(value) {
            this.#observer.autoClose = value;
        }
        save(k, v) {
            window.localStorage.setItem(k, v);
        }
        get(k) {
            return window.localStorage.getItem(k);
        }
        rm(k) {
            const had = window.sessionStorage.getItem(k) !== null;
            window.sessionStorage.removeItem(k);
            return had;
        }
    }

    def("HyperLight", new HyperLightImpl());
});
