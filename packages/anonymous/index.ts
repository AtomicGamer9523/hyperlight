import { SavingTypes, Key } from "./types";

namespace Saving {
    const STORAGES: SavingTypes.Storages = {
        "session": globalThis.sessionStorage,
        "persistent": globalThis.localStorage
    }
    
    export function save(type: SavingTypes.StorageType, key: Key, value: string): void {
        get(type).setItem(key, value);
    }
    
    export function load(type: SavingTypes.StorageType, key: Key): string {
        return get(type).getItem(key) || "";
    }
    
    export function remove(type: SavingTypes.StorageType, key: Key): void {
        get(type).removeItem(key);
    }
    
    export function get(type: SavingTypes.StorageType): SavingTypes.Storage {
        return STORAGES[type];
    }
}

export function save$(type: SavingTypes.StorageType, key: Key, value: string): void {
    (async()=>{
        const h = await import('../hyperlight/index.js');
        h.Hashing.compare(key, value,
            () => Saving.save(type, key, value),
            () => {}
        );
    })();
}

export function load$(type: SavingTypes.StorageType, key: Key, currentValue: string, cb: (res: string) => void): void {
    (async()=>{
        const h = await import('../hyperlight/index.js');
        const res = await h.Hashing.compare(key, currentValue,
            () => Saving.load(type, key),
            () => currentValue
        );
        cb(res)
    })();
}

export function rm$(type: SavingTypes.StorageType, key: Key): void {
    Saving.remove(type, key);
}
