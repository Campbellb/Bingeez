"use strict";

var helpers = require("./helpers");

var Commands;

// Wrapper for AT&T M2X Commands API
// https://m2x.att.com/developer/documentation/v2/commands
Commands = function(client) {
    this.client = client;
};

// List Sent Commands
//
// https://m2x.att.com/developer/documentation/v2/commands#List-Sent-Commands
Commands.prototype.list = function(params, callback) {
    if (typeof params === "function") {
        callback = params;
        params = {};
    }
    return this.client.get("/commands", { qs: params || {} }, callback);
};

// View Command Details
//
// https://m2x.att.com/developer/documentation/v2/commands#View-Command-Details
Commands.prototype.view = function(id, callback) {
    return this.client.get(helpers.url("/commands/%s", id), callback);
};

// Send Command
// Send a command with the given name to the given target devices.
// The name should be a custom string defined by the user and understood by
// the device.
//
// https://m2x.att.com/developer/documentation/v2/commands#Send-Command
Commands.prototype.send = function(params, callback) {
    return this.client.post("/commands", {
        headers: { "Content-Type": "application/json" },
        params: params
    }, callback);
};

module.exports = Commands;
