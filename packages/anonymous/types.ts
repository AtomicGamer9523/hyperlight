export type Key = string;

export namespace SavingTypes {
    export interface Storage {
        getItem(key: string): string;
        setItem(key: string, value: string): void;
        removeItem(key: string): void;
        [key: string]: any;
    }

    export type StorageType = "session" | "persistent";

    export interface Storages {
        [name: string]: Storage
    }
}
