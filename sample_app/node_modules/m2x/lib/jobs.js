"use strict";

var helpers = require("./helpers");
var Jobs;

// Wrapper for AT&T M2X Jobs API
//
// https://m2x.att.com/developer/documentation/v2/jobs
Jobs = function(client, keysAPI) {
    this.client = client;
    this.keysAPI = keysAPI;
};

// Return the details of the supplied job
//
// https://m2x.att.com/developer/documentation/v2/jobs#View-Job-Details
Jobs.prototype.view = function(id, callback) {
    return this.client.get(helpers.url("/jobs/%s", id), callback);
};

module.exports = Jobs;
