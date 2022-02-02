const request = require("request");
const axios = require("axios").default;
const express = require("express");
const fs = require("fs");

const app = express();

app.get("/:filename", (req, res) => {
    const filename = req.params.filename;
    if (fs.existsSync(__dirname + "/storage/" + filename)) {
        console.log("File is cached", filename);
        return res.sendFile(__dirname + "/storage/" + filename);
    } else {
        console.log("File is proxied", filename);
        const reqw = request
            .get("http://sharaball.ru/fs/" + filename)
            .on("response", (resp) => {
                if(resp.statusCode == 200) {
                    reqw.pipe(res);
                    reqw.pipe(fs.createWriteStream(__dirname + "/storage/" + filename));
                } else {
                    res.statusCode = 404;
                    return res.send("peepoSad");
                }
            });
    }
});

app.listen(3434);