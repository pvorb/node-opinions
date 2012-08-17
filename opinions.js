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
      return release() && added(new Error('forFile must be a String.'));
    if (typeof added != 'function')
      return release()
        && added(new Error('added must be a callback function.'));

    var path = forFile += '.comments';

    var toCommit = new Set();

    // execute tasks prior to committing
    async.forEach(tasks, function execute(task, callback) {
      'use strict';
      task(forFile, comment, function (err, changed) {
        'use strict';
        if (err)
          return callback(err);

        toCommit.addAll(changed);
        callback();
      });
    }, function cb(err) {
      'use strict';
      if (err)
        return release() && added(err);

      // add the files to the stage
      self.git.exec('add', toCommit.toArray(), function (err, out) {
        'use strict';
        if (err)
          return release() && added(err);

        var msg = 'Add comment for\n\n'+forFile;

        // start committing the files
        self.git.exec('commit', function (err, out) {
          'use strict';
          if (err)
            return release() && added(err);

          release();
          added();
        });
      });
    });
  });

  self.queue.on('empty', function () {
    self.logger.info('queue empty');
  });
};

opinions.prototype.addComment =
    function addComment(forFile, comment, tasks, added) {
  'use strict';

  this.logger.info('init comment for file ', file);
  // add the comment to the queue
  this.queue.add(arguments);
};
