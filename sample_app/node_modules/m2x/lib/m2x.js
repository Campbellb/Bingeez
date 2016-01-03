"use strict";

var Client = require("./client");

var Charts        = require("./charts");
var Collections   = require("./collections");
var Commands      = require("./commands");
var Devices       = require("./devices");
var Distributions = require("./distributions");
var Jobs          = require("./jobs");
var Keys          = require("./keys");

var M2X;

M2X = function(apiKey, apiBase) {
    this.client = new Client(apiKey, apiBase);

    this.charts        = new Charts(this.client);
    this.collections   = new Collections(this.client);
    this.commands      = new Commands(this.client);
    this.devices       = new Devices(this.client, this.keys);
    this.distributions = new Distributions(this.client);
    this.jobs          = new Jobs(this.client);
    this.keys          = new Keys(this.client);
};

M2X.prototype.status = function(callback) {
    return this.client.get("/status", callback);
};

M2X.prototype.time = function(callback) {
    return this.client.get("/time", callback);
};

M2X.prototype.timeSeconds = function(callback) {
    return this.client.get("/time/seconds", callback);
};

M2X.prototype.timeMillis = function(callback) {
    return this.client.get("/time/millis", callback);
};

M2X.prototype.timeIso8601 = function(callback) {
    return this.client.get("/time/iso8601", callback);
};

module.exports = M2X;
