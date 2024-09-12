/**
 * Hyperlight.js
 * 
 * Example:
 * ```html
 * <script src="hyperlight.min.js"></script>
 * 
 * <script>
 *     // User updates their language preference to Spanish.
 *     HyperLight.save("lang", "es");
 * 
 *     function randHex(length) {
 *         const gen = () => Math.floor(Math.random() * 0xF).toString(0xF);
 *         return Array.from({ length }, gen).join('');
 *     }
 * </script>
 * 
 * <img
 *     $src = "https://dummyimage.com/100x50/${randHex(6)}/${randHex(6)}.png&text=Example"
 *     $alt = "${HyperLight.get('lang') === 'es' ? 'Ejemplo' : 'Example'}"
 *     s.width = "100px"
 *     s.height = "50px"
 *     lazyload
 * ></img>
 * 
 * <div eval = "console.log('This is a div', this)">
 *     <span s.color = "#${randHex(6)}">Example</span>
 * </div>
 * ```
 * 
 * @version 3.0.1
 * @license MIT
*/
interface HyperLight {
    /**
     * Whether the observer will automatically close after the DOM is loaded.
     * 
     * This is recommended for performance reasons.
     * Especially when you know that more elements will NOT be added to the DOM.
     * 
     * Defaults to `true`.
     * 
     * @returns {boolean} If the observer will automatically close.
     * @since 3.0.0
     * @public
    */
    get autoCloseObserver(): boolean;
    /**
     * Whether to automatically close the observer after the DOM is loaded.
     * 
     * This is recommended for performance reasons.
     * Especially when you know that more elements will NOT be added to the DOM.
     * 
     * Defaults to `true`.
     * 
     * @param {boolean} value If the observer will automatically close.
     * @since 3.0.0
     * @public
    */
    set autoCloseObserver(value: boolean);
    /**
     * Allows for manual starting of the observer.
     * 
     * You may use this, but don't forget to {@link closeObserver close} when you're done.
     * 
     * @function
     * @returns {void}
     * @since 3.0.0
     * @public
    */
    openObserver(): void;
    /**
     * Allows for manual closing of the observer.
     * 
     * This method is by default called when the DOM is loaded.
     * You may disable this by setting {@link autoCloseObserver} to `false`.
     * Or you may re-open the observer by calling {@link openObserver}.
     * 
     * @function
     * @returns {void}
     * @since 3.0.0
     * @public
    */
    closeObserver(): void;
    /**
     * Saves a value to the session storage.
     * 
     * @param {string} key Key to save the value under.
     * @param {string} value Value associated with the key.
     * @returns {void} Nothing.
     * @since 3.0.1
     * @public
    */
    save(key: string, value: string): void;
    /**
     * Attempts to get a value from the session storage.
     * 
     * This method may return `undefined` if the key does not exist.
     * 
     * @param {string} key Key to get the value from.
     * @returns {string | undefined} Value associated with the key (or `undefined`).
     * @since 3.0.1
     * @public
    */
    get(key: string): string | undefined;
    /**
     * Removes a value from the session storage.
     * 
     * @param {string} key Key to remove the value from.
     * @returns {boolean} Whether the key was initially present.
     * @since 3.0.1
     * @public
    */
    rm(key: string): boolean;
}
declare const HyperLight: HyperLight;
