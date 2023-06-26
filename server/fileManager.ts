import { compareHashes } from "./hashUtils.ts";

async function runCommand(command: Deno.Command) {
    const decoder = new TextDecoder();
    const { code, stdout, stderr } = await command.output();
    const stdoutLines = decoder.decode(stdout).split(/\r?\n/).filter(x => x != "");
    const stderrLines = decoder.decode(stderr).split(/\r?\n/).filter(x => x != "");
    
    if(code != 0) {
        stdoutLines.forEach(l => console.error(l));
        stderrLines.forEach(l => console.error(l));
    } else {
        stdoutLines.forEach(l => console.debug(l));
        stderrLines.forEach(l => console.error(l));
    }
}

async function compileTypeScript() {
    const command = new Deno.Command("cmd",{
        args: ["/C", "npx tsc"],
        cwd: ".."
    });
    await runCommand(command)
}

export async function loadFile(path: string) {
    const tsFileData = await Deno.readTextFile(`../packages/${path}.ts`);
    compareHashes(path, tsFileData, compileTypeScript);
    const jsFileData = await Deno.readTextFile(`../packages/${path}.js`);
    return jsFileData;
}

compileTypeScript();
