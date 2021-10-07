const fs = require('fs');
const http = require('http');
const path = require('path');
const express = require('express');

const hostname = "localhost";
const port = 3000;

const app = express();
// const mog = morgan();

app.use((req, res, next) => {
    console.log("Request for " + req.url + " by method " + req.method);

    if (req.method == 'GET') {
        var fileUrl;
        if (req.url == '/') fileUrl = '/index.html';
        else fileUrl = req.url;
        var filePath = path.resolve('./public' + fileUrl);
        const fileExt = path.extname(filePath);
        console.log("fileExt = " + fileExt);

        if (fileExt == '.html') {
            fs.exists(filePath, (exists) => {
                if (!exists) {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/html');
                    res.end('<html><body><h1>Error 404: ' + fileUrl + ' not found</h1></body></html>');
                    return;
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                fs.createReadStream(filePath).pipe(res);
            })
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end('<html><body><h1>Error 404: ' + fileUrl + ' not an HTML file</h1></body></html>');
            return;
        }
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end('<html><body><h1>Error 404: ' + req.method + ' not support</h1></body></html>');
        return;
    }
})

const server_express = http.createServer(app);

// const server = http.createServer();


server_express.listen(port, hostname, () => {
    console.log(`sever running at http://${hostname}:${port}`)
})