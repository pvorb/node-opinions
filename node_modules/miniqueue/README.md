node-miniqueue
==============

Requirements
------------

* [Node](http://nodejs.org)


Example
-------

    var Queue = require("miniqueue").Queue;

    var numbers = new Queue(function(i, release) {
      console.info("I'm processing number", i);
      setTimeout(function() { // very long processing
        console.info("Done with number", i);
        release(); // you absolutely MUST call this when you're done.
      }, 1000);
    });

    numbers.on("empty", function() {
      console.info("Queue is empty.");
    });

    var i;
    for (i = 0; i < 3; ++i) {
      setTimeout(function(i) {
        console.info("Adding number", i);
        numbers.add(i);
      }.bind(undefined, i), 10);
    }


License
-------

Copyright 2011 Hendrik Schnepel

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
