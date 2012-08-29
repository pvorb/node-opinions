/*
 * Copyright 2011 Hendrik Schnepel
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var util = require("util");
var events = require("events");

/**
 * Create a new queue.
 * 
 * The handler parameter must be a function that takes two
 * parameters: first the item that has been added to the
 * queue and second a callback that you MUST call after the
 * handler's work on the item is completed.
 *
 *     --> If you don't, the queue will stall! <--
 *
 * Pay attention when you do anything that may cause errors
 * or otherwise exit the handler earlier than expected.
 *
 * @constructor
 * @param handler
 */
var Queue = module.exports.Queue = function(handler) {
  events.EventEmitter.call(this);
  this._queue = [];
  this._processing = false;
  if (handler) {
    this.on("process", handler);
  }
};
util.inherits(Queue, events.EventEmitter);

/**
 * Add something to the queue.
 * 
 * @param item
 */
Queue.prototype.add = function(item) {
  this._queue.push(item);
  this._ensureProcessing();
};

/**
 * @private
 */
Queue.prototype._ensureProcessing = function() {
  if (!this._processing) {
    if (this._queue.length > 0) {
      this._doProcess();
    }
    else {
      this.emit("empty");
    }
  }
};

/**
 * @private
 */
Queue.prototype._doProcess = function() {
  this._processing = true;
  this.emit("process", this._queue.shift(), this._doRelease.bind(this));
};

/**
 * @private
 */
Queue.prototype._doRelease = function(err) {
  if (err) {
    this.emit("error", err);
  }
  this._processing = false;
  this._ensureProcessing();
};
