opinions
========

static git-powered comment module for node

This module is intendet to build up services like [Disqus](http://disqus.com/).
It doen’t do all the work for you. You still have to build a comment service
_around_ it. Git is used to keep track of the comments. This is only meant as a
built in backup strategy.

Installation
------------

    npm install opinions

Usage
-----

Here’s an example that uses [JSML](https://github.com/pvorb/jsml) to store the
comments into files.

~~~ javascript
var JSML = require('jsml');
var Opinions = require('opinions');

var op = new Opinions({
  'work-tree': __dirname,         // working directory
  'git-dir': __dirname + '/.git'  // git directory (usually .git)
});

// the functions in this array will be executed in parallel on
// each new comment
var tasks = [
  function (forFile, comment, options, callback) {
    fs.appendFile(forFile + '.jsml', JSML,
        JSML.stringify(comment, null, '  ') + '\n---\n',
        function (err) {
      callback(err, [ forFile + '.jsml' ]);
  }
];

// addComment(forFile, comment, tasks, callback)
op.addComment('article.html', {
  message: 'A simple comment',
  author:  'Paul',
  modified: '2012-07-09T17:24:14.446Z',
  website: 'https://vorb.de/'
}, tasks, function (err) {
  if (err)
    return console.error(err);
});
~~~

Bugs and Issues
---------------

If you encounter any bugs or issues, feel free to
[open an issue](https://github.com/pvorb/node-opinions/issues) at github. New
ideas and help on fixing bugs and improving the system are always welcome.

License
-------

Copyright © 2012 Paul Vorbach

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the “Software”), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
