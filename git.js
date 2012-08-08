var exec = require('child_process').exec;

var git = module.exports = function git() {};

// properties gitDir and workTree are optional
git.prototype.gitDir = null;
git.prototype.workTree = null;

git.prototype.baseCommand = function () {
  var cmd = 'git';
  if (this.gitDir !== null)
    cmd += ' --git-dir='+this.gitDir;
  else if (this.workTree !== null)
    cmd += ' --work-tree='+this.workTree;
  return cmd;
};

git.prototype.addAndCommit = function(files, msg, commited) {
  if (typeof files == 'string')
    files = [ files ];

  var fileStr = ' -- ';
  if (typeof files == 'object' && file instanceof Array)
    for (var i = 0; i < files.length; i++)
      fileStr += files[i];

  var add = this.baseCommand() + ' add ' + fileStr;
  var commit = this.baseCommand() + ' commit --message="'+ msg +'"' + fileStr;

  var cmd = add + ' && ' + commit;

  exec(cmd, commited);
};
