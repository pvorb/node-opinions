var fs = require('fs');

var async = require('async');
var Git = require('git-wrapper');
var logger = require('stoopid').logger('opinions');
var Queue = require('miniqueue').Queue;
var Set = require('Set');

var Opinions = module.exports = function Opinions(options) {
  'use strict';
  var self = this;
  self.git = new Git(options);
  self.logger = logger;
  self.queue = new Queue(function (args, release) {
    'use strict';
    // restore arguments
    var forFile = args[0];
    var comment = args[1];
    var tasks   = args[2];
    var added   = args[3];

    if (typeof forFile != 'string')
      return release() || added(new Error('forFile must be a String.'));
    if (typeof added != 'function')
      return release()
        || added(new Error('added must be a callback function.'));

    var path = forFile += '.comments';

    var toCommit = new Set();

    // execute tasks prior to committing
    async.forEach(tasks, function execute(task, callback) {
      'use strict';
      task(forFile, comment, options, function (err, changed) {
        'use strict';
        if (err)
          return callback(err);

        toCommit.addAll(changed);
        callback();
      });
    }, function cb(err) {
      'use strict';
      if (err)
        return release() || added(err);

      self.logger.debug('completed tasks');

      // add the files to the stage
      self.git.exec('add', toCommit.toArray(), function (err, out) {
        'use strict';
        if (err)
          return release() || added(err);

        self.logger.debug('staged files');

        var msg = '"Add comment for\n\n' + forFile + '"';

        // start committing the files
        self.git.exec('commit', { m: msg }, [], function (err, out) {
          'use strict';
          if (err)
            return release() || added(err);

          self.logger.debug('successful commit');

          release();
          added();
        });
      });
    });
  });

  self.queue.on('empty', function () {
    'use strict';
    self.logger.info('queue empty');
  });
};

Opinions.prototype.addComment =
    function addComment(forFile, comment, tasks, added) {
  'use strict';

  this.logger.info('init comment for file ', forFile);
  // add the comment to the queue
  this.queue.add(arguments);
};
