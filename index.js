"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var node_fetch_1 = __importDefault(require("node-fetch"));
var cheerio_1 = __importDefault(require("cheerio"));
var update = function () {
    return node_fetch_1.default('https://blog.sjm.computer/wordcount')
        .then(function (req) { return req.text(); })
        .then(function (body) { return cheerio_1.default.load(body); })
        .then(function ($) { return $('#wordcount').text(); })
        .then(function (value) {
        return node_fetch_1.default("https://www.beeminder.com/api/v1/users/samiswellcool/goals/published-words/datapoints.json?auth_token=" + process.env.BEEMINDER_AUTH_TOKEN + "&value=" + value, {
            method: 'POST',
        });
    })
        .then(function (res) { return res.json(); })
        .then(function (x) { return console.log(x); })
        .catch(function (e) { return console.error(e); });
};
update();
setInterval(update, 1000 * 60 * 60);
