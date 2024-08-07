var React = require('react');

var { createRoot } = require('react-dom/client');

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const root = createRoot(document.getElementById('app'));

root.render(<h1>Hello world! (React)</h1>);

window.addEventListener("load", () => {
    if (typeof process != "undefined") {
        var win = nw.Window.get();
        win.on('close', function () {
            // win.closeDevTools();
            this.hide();
            this.close(true);
            process.exit(0);
        });
        if (process.versions["nw-flavor"].indexOf("sdk") >= 0)
            win.showDevTools();//will crash non sdk flavors
    }
});
