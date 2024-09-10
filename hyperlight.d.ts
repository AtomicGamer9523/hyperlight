/**
 * Hyperlight.js
 * 
 * Example:
 * ```html
 * <script src="hyperlight.min.js"></script>
 * 
 * <script>
 *     // User updates their language preference to Spanish.
 *     HyperLight.session.save("lang", "es");
 * </script>
 * 
 * <img
 *     src="https://example.com/image.jpg"
 *     s.width = "100px"
 *     s.height = "100px"
 *     alt = "An example image"
 *     eval = "if (HyperLight.session.get('lang') === 'es') {
 *         // 'this' refers to the current element.
 *         this.alt = 'Una imagen de ejemplo';
 *     }"
 *     lazyload
 * ></img>
 * ```
 * 
 * @version 1.0.0
 * @license MIT
*/
interface HyperLight {
    /**
     * Whether the observer should automatically close after the DOM is loaded.
     * 
     * This is recommended for performance reasons.
     * Especially when you know that more elements will NOT be added to the DOM.
     * 
     * Defaults to `true`.
     * 
     * @type {boolean}
     * @since 1.0.0
     * @public
    */
    autoCloseObserver: boolean;
    /**
     * Allows for manual starting of the observer.
     * 
     * You may use this, but don't forget to {@link closeObserver close} when you're done.
     * 
     * @function
     * @returns {void}
     * @since 1.0.0
     * @public
    */
    openObserver(): void;
    /**
     * Allows for manual closing of the observer.
     * 
     * This method is by default called when the DOM is loaded.
     * You may disable this by setting {@link autoCloseObserver} to `false`.
     * Or you may re-open the observer by calling {@link openObserver}.
    */
    closeObserver(): void;
}
declare namespace HyperLight {
    /**
     * Whether the observer should automatically close after the DOM is loaded.
     * 
     * This is recommended for performance reasons.
     * Especially when you know that more elements will NOT be added to the DOM.
     * 
     * Defaults to `true`.
     * 
     * @type {boolean}
     * @since 1.0.0
     * @public
    */
    export var autoCloseObserver: boolean;
    /**
     * Allows for manual starting of the observer.
     * 
     * You may use this, but don't forget to {@link closeObserver close} when you're done.
     * 
     * @function
     * @returns {void}
     * @since 1.0.0
     * @public
    */
    export function openObserver(): void;
    /**
     * Allows for manual closing of the observer.
     * 
     * This method is by default called when the DOM is loaded.
     * You may disable this by setting {@link autoCloseObserver} to `false`.
     * Or you may re-open the observer by calling {@link openObserver}.
    */
    export function closeObserver(): void;
    /**
     * Session storage methods.
     * 
     * This is a utility wrapper around the `sessionStorage` object.
     * 
     * Usefull for things like saving language preferences, etc.
     * 
     * Example:
     * ```js
     * HyperLight.session.save("lang", "en");
     * 
     * console.log(HyperLight.session.get("lang")); // "en"
     * 
     * HyperLight.session.rm("lang");
     * ```
     * 
     * @namespace session
     * @since 1.0.0
     * @public
    */
    export namespace session {
        /**
         * Saves a value to the session storage.
         * 
         * @param {string} key Key to save the value under.
         * @param {string} value Value associated with the key.
         * @returns {void} Nothing.
         * @since 1.0.0
         * @public
        */
        export function save(key: string, value: string): void;
        /**
         * Attempts to get a value from the session storage.
         * 
         * This method may return `undefined` if the key does not exist.
         * 
         * @param {string} key Key to get the value from.
         * @returns {string | undefined} Value associated with the key (or `undefined`).
         * @since 1.0.0
         * @public
        */
        export function get(key: string): string | undefined;
        /**
         * Removes a value from the session storage.
         * 
         * @param {string} key Key to remove the value from.
         * @returns {boolean} Whether the key was initially present.
         * @since 1.0.0
         * @public
        */
        export function rm(key: string): boolean;
    }
}
declare const HyperLight: HyperLight;
