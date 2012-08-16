var fs = require('fs');

var async = require('async');
var Git = require('git-wrapper');
var Set = require('Set');

var Opinions = module.exports = function Options(options) {
  'use strict';
  this.git = new Git();
};

opinions.prototype.addComment =
    function addComment(forFile, comment, tasks, added) {
  'use strict';

  if (typeof forFile != 'string')
    return added(new Error('forFile must be a String.'));
  if (typeof added != 'function')
    return added(new Error('added must be a callback function.'));

  var path = forFile += '.comments';

  var toCommit = new Set();

  // execute tasks
  async.forEach(tasks, function execute(task, callback) {
    'use strict';
    task(forFile, comment, function (err, changed) {
      'use strict';
      if (err)
        return callback(err);

      toCommit.addAll(changed);
      callback();
    });
  }), function cb(err) {
    'use strict';
    if (err)
      return added(err);

    // start committing the files
    this.git.exec('add', toCommit.toArray(), function (err, out) {
      'use strict';
      if (err)
        return added(err);

      var msg = 'Add comment for\n\n'+forFile;

      this.git.exec('commit', function (err, out) {
        'use strict';
        if (err)
          return added(err);

        added();
      });
    });
  };
};
