import nwbuild from "nw-builder";
import fs from "fs";
import webpack from "webpack";
import webpackConfig from "./webpack.config.js";

(async function () {
    //clear old dist
    fs.rmSync("./dist", { recursive: true, force: true })

    //webpack
    var wp = await new Promise((res) => {
        webpack(webpackConfig, (err, stats) => {
            if (err || stats.hasErrors()) {
                return res(false);
            }
            res(true);
        });
    })
    if (!wp) return;

    //package manifest
    var appPackage = JSON.parse(fs.readFileSync('package.json').toString("utf8"));
    var packageJSON = {
        name: appPackage.name,
        version: appPackage.version,
        description:appPackage.description,
        author: appPackage.author,
        license: appPackage.license,
        main: "index.html",
        "chromium-args": appPackage["chromium-args"]
    };
    fs.writeFileSync('dist/package.json', JSON.stringify(packageJSON, null, 4));

    //build package
    var b = await nwbuild({
        mode: "build",
        srcDir: "./dist",
        outDir: "./build",
        version: "latest",
        glob: false,
        cacheDir: process.env.LOCALAPPDATA + "./Temp/nwbuild-cache"
    });
    fs.rmSync("./dist", { recursive: true, force: true })
    //move new build to new dist
    fs.renameSync("./build", "./dist");
})();
