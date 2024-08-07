import nwbuild from "nw-builder";
import fs from "fs";
import webpack from "webpack";
import webpackConfig from "./webpack.config.js";
import { spawn, exec } from "child_process";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        description: appPackage.description,
        author: appPackage.author,
        license: appPackage.license,
        main: "index.html",
        "chromium-args": appPackage["chromium-args"],
        "js-flags": appPackage["js-flags"],
        dependencies: appPackage.dependencies
    };
    fs.writeFileSync('dist/package.json', JSON.stringify(packageJSON, null, 4));

    await npmInstall();

    function npmInstall(prod) {

        return new Promise((resolve, reject) => {
            // const args = ["install"];
            // if (prod) args.push("--omit=dev")
            const npm = exec("npm install --omit=dev", {
                cwd: path.resolve(__dirname, "./dist/")
            }, function (err, stdout, stderr) {
                resolve()
            });
                npm.on("close", code => {
                    console.log(`child process exited with code ${code}`);
                    resolve(code)
                });

        });
        // return new Promise((resolve, reject) => {
        //     const args = ["install"];
        //     if (prod) args.push("--omit=dev")
        //     const npm = spawn("npm", args, {
        //         cwd: path.resolve(__dirname, "./dist/")
        //     });
        //     npm.stdout.on("data", data => {
        //         console.log(` ${data}`);
        //     });
        //     npm.stderr.on("data", data => {
        //         console.log(` ${data}`);
        //     });
        //     npm.on('error', (error) => {
        //         console.log(`error: ${error.message}`);
        //         reject(error)
        //     });
        //     npm.on("close", code => {
        //         console.log(`child process exited with code ${code}`);
        //         resolve(code)
        //     });
        // });
    }


    //build package
    var b = await nwbuild({
        mode: "build",
        srcDir: "./dist",
        outDir: "./build",
        version: "latest",
        glob: false,
        cacheDir: __dirname + "/nwbuild-cache"
    });


    async function createNpmDependenciesArray(p) {
        // var p = await import(packageFilePath);
        // var p = require(packageFilePath);
        if (!p.dependencies) return [];

        var deps = [];
        for (var mod in p.dependencies) {
            deps.push(mod + "@" + p.dependencies[mod]);
        }

        return deps;
    }

    // fs.rmSync("./dist", { recursive: true, force: true })
    //move new build to new dist
    // fs.renameSync("./build", "./dist");
})();
