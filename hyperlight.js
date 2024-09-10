/// <reference path="./hyperlight.d.ts" />

(f=>f((n,v)=>Object.defineProperty(window,n,{configurable:!0,writable:!0,value:v})))(def => {
    'use strict';

    /**
     * Very simple hashing function, returns 16 hex characters.
     * 
     * @returns {string} 16 hex characters
    */
    const uuid = () => crypto.randomUUID().replace(/-/g, '');

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
     * @param {HTMLElement} element HTML element to modify
     * @returns {void}
     */
    function elementModifier(element) {
        if (element.hasAttribute('hyperlight')) return;
        element.setAttribute('hyperlight', uuid());

        if (element.hasAttribute('lazyload')) {
            element.removeAttribute('lazyload');
            element.setAttribute('decoding', 'async');
            element.setAttribute('loading', 'lazy');
        }

        if (element.hasAttribute('eval')) {
            const code = element.getAttribute('eval');
            element.removeAttribute('eval');
            try {
                /**@type {Function}*/
                const func = eval(`(function(){${code}})`);
                if (typeof func !== 'function') throw new Error(
                    "'eval' attribute must be the body of a function"
                );
                func.call(element);
            } catch (e) {
                console.error("[Hyperlight], Error in 'eval' attribute:", e);
            }
        }

        for(const attr of element.getAttributeNames()) {
            if (attr.startsWith('s.')) {
                const value = element.getAttribute(attr);
                element.removeAttribute(attr);
                element.style.setProperty(attr.substring(2), value);
            }
        }
    }

    function HyperLightMutationObserver(records) {
        records.forEach(record => {
            record.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;
                node.querySelectorAll('*')
                    .forEach(elementModifier);
            })
        });
    }

    class HyperLightObserver extends MutationObserver {
        #auto_close;
        constructor(autoClose = false) {
            super(HyperLightMutationObserver);
            this.#auto_close = autoClose;
        }
        close() {
            this.disconnect();
        }
        open() {
            this.observe(document, {
                childList: true,
                subtree: true
            });
        }
        get autoClose() {
            return this.#auto_close;
        }
        set autoClose(value) {
            if (value === true) this.#auto_close = true;
            else this.#auto_close = false;
        }
    }

    class HyperLightImpl {
        #observer;
        constructor() {
            this.#observer = new HyperLightObserver(true);
            this.#observer.open();
            document.addEventListener('DOMContentLoaded', () => {
                if (window["hyperlight"].autoClose)
                    window["hyperlight"].close();
            });
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
    }

    def("hyperlight", new HyperLightImpl());
});
