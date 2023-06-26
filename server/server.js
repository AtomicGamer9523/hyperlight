import "./log.ts";

import { loadFile } from "./fileManager.ts";

import express from "npm:express";
const app = express();
const port = 8080;

function serveFile(path, file) {
    app.get(path, async (_req, res) => {
        const data = await loadFile(file);
        res.set('Access-Control-Allow-Origin', '*')
        res.set('Content-Type', 'text/javascript');
        res.send(data)
    });
}

serveFile('/hyperlight/index.js', "hyperlight/index");
serveFile('/anonymous/index.js', "anonymous/index");

app.get("*", (_req, res) => {
    res.send("404")
});

app.listen(port, () => console.info(`Dev Server up! IP: http://localhost:${port}/`));