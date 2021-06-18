const fs = require("fs");
const http = require("http");
const path = require("path");
const { createBrotliCompress } = require("zlib");

http
  .createServer(function (req, res) {
    const foodIdx = String(req.url).split("/");
    console.log(foodIdx.length);
    if (
      String(req.url).match("food") &&
      foodIdx.length < 4 &&
      parseInt(foodIdx[2])
    ) {
      console.log("here");
      getJsonDb("/food.json", res, (data) => {
        searchInJson(data, res, parseInt(foodIdx[2]));
      });
    } else if (String(req.url).match("food") && foodIdx.length < 4) {
      getJsonDb("/food.json", res, (data) => {
        sendResponse(res, "application/json", data);
      });
    } else {
      sendResponse(res, "text/html", "404 not found");
    }
  })
  .listen(8080);

function getJsonDb(req, res, cb) {
  fs.readFile(path.join(__dirname + req), (error, data) => {
    if (error) {
      sendResponse(res, "text/html", "404 not found");
    } else {
      cb(data);
    }
  });
}

function searchInJson(data, res, idx) {
  try {
    const jsonData = JSON.parse(data);
    const result = jsonData.find((x) => x.id === idx);
    if (result) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    } else {
      sendResponse(res, "text/html", "404 not found");
    }
  } catch (error) {
    sendResponse(res, "text/html", "404 not found");
  }
}

function sendResponse(res, type, content) {
  res.writeHead(200, { "Content-Type": `${type}` });
  res.write(content);
  res.end();
}
