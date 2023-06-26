var Saving;
(function (Saving) {
    const STORAGES = {
        "session": globalThis.sessionStorage,
        "persistent": globalThis.localStorage
    };
    function save(type, key, value) {
        get(type).setItem(key, value);
    }
    Saving.save = save;
    function load(type, key) {
        return get(type).getItem(key) || "";
    }
    Saving.load = load;
    function remove(type, key) {
        get(type).removeItem(key);
    }
    Saving.remove = remove;
    function get(type) {
        return STORAGES[type];
    }
    Saving.get = get;
})(Saving || (Saving = {}));
export function save$(type, key, value) {
    (async () => {
        const h = await import('../hyperlight/index.js');
        h.Hashing.compare(key, value, () => Saving.save(type, key, value), () => { });
    })();
}
export function load$(type, key, currentValue, cb) {
    (async () => {
        const h = await import('../hyperlight/index.js');
        const res = await h.Hashing.compare(key, currentValue, () => Saving.load(type, key), () => currentValue);
        cb(res);
    })();
}
export function rm$(type, key) {
    Saving.remove(type, key);
}
