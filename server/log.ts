// deno-lint-ignore-file no-explicit-any

import { writeAllSync } from "https://deno.land/std@0.170.0/streams/write_all.ts";
import * as nodeutil from "https://deno.land/std@0.170.0/node/util.ts";

Object.defineProperty(globalThis, "__tssColorsLoaded$$", { value: true });

export const GRAY = "\x1b[38;5;245m";
export const TRC = "\x1b[38;5;36m";
export const DBG = "\x1b[38;5;93m";
export const INF = "\x1b[36m";
export const WRN = "\x1b[38;5;208m";
export const ERR = "\x1b[38;5;196m";
export const GREEN = "\x1b[92m";

const date = () => ((new Date()).toISOString());

const __log = (msg: string | Uint8Array): void => {
    if(typeof msg == "string") {
        const encoder = new TextEncoder();
        msg = encoder.encode(msg);
    }
    writeAllSync(Deno.stdout, msg)
}

const log = (data: string, date: string, level: number): void => {
    const levelColor = (l=>{
        switch (l) {
            case -2:
                return `[${TRC}TRC${GRAY}]${TRC}`;
            case -1:
                return `[${DBG}DBG${GRAY}]${DBG}`;
            case 0:
                return `[${INF}INF${GRAY}]${INF}`;
            case 1:
                return `[${WRN}WRN${GRAY}]${WRN}`;
            case 2:
                return `[${ERR}ERR${GRAY}]${ERR}`;
            case 101:
                return `[\x1b[92mPASS${GRAY}]\x1b[92m`;
            case 102:
                return `[${ERR}FAIL${GRAY}]${ERR}`;
            default: return "";
        }
    })(level);
    __log(`${GRAY}${date} ${levelColor} ${data}\x1b[0m\n`);
}

const CONFIG = {
    showHidden: true,
    colors: false
}

const betterTrace = (...args: any[]): void => {
    if(args.length <= 0) return __log("\n")
    log(nodeutil.formatWithOptions(CONFIG,...args), date(), -2)
}
const betterDebug = (...args: any[]): void => {
    if(args.length <= 0) return __log("\n")
    log(nodeutil.formatWithOptions(CONFIG,...args), date(), -1)
}
const betterInfo = (...args: any[]): void => {
    if(args.length <= 0) return __log("\n")
    log(nodeutil.formatWithOptions(CONFIG,...args), date(), 0)
}
const betterWarn = (...args: any[]): void => {
    if(args.length <= 0) return __log("\n")
    log(nodeutil.formatWithOptions(CONFIG,...args), date(), 1)
}
const betterError = (...args: any[]): void => {
    if(args.length <= 0) return __log("\n")
    log(nodeutil.formatWithOptions(CONFIG,...args), date(), 2)
}

const betterOk = (...args: any[]): void => {
    if(args.length <= 0) return __log("\n")
    log(nodeutil.formatWithOptions(CONFIG,...args), date(), 101)
}

const betterFail = (...args: any[]): void => {
    if(args.length <= 0) return __log("\n")
    log(nodeutil.formatWithOptions(CONFIG,...args), date(), 102)
}

console.trace = betterTrace;
console.debug = betterDebug;
console.log = betterInfo;
console.info = betterInfo;
console.warn = betterWarn;
console.error = betterError;

Object.defineProperty(console, "ok", { value: betterOk });
Object.defineProperty(console, "fail", { value: betterFail });
