const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        createProxyMiddleware("/screenings", {
            target: "http://localhost:5000/", //url of your server
        })
    );
    app.use(
        createProxyMiddleware("/schedule", {
            target: "http://localhost:5000/",//url of your server
        })
    );
};