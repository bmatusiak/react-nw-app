
## install 
```
npm install
```

## install nwjs sdk (for development *live)
```
rm -rf package-lock.json
npm install nw --nwjs_build_type=sdk
$ node ./server.js
$ nw
```

## build app package(exe) (for production)

requires node version <=16 (nw-builder)

```
node ./build.js
```
