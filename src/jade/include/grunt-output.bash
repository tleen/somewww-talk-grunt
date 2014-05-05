[4mRunning "env:vars" (env) task[24m

[4mRunning "clean:pre" (clean) task[24m
Cleaning dist/error.html...[32mOK[39m
Cleaning dist/humans.txt...[32mOK[39m
Cleaning dist/images...[32mOK[39m
Cleaning dist/index.css...[32mOK[39m
Cleaning dist/index.html...[32mOK[39m
Cleaning dist/index.js...[32mOK[39m

[4mRunning "mkdir:tmp" (mkdir) task[24m
Creating "tmp"...[32mOK[39m

[4mRunning "jade:templates" (jade) task[24m
File tmp/error.html created.
File tmp/index.html created.

[4mRunning "sass:0" (sass) task[24m
File tmp/index.css created.

[4mRunning "imagemin:assets" (imagemin) task[24m
✔ assets/images/grunt-logo.png (already optimized)
Minified 1 image (saved 0 B)

[4mRunning "favicons:generate" (favicons) task[24m
[32m>> [39mCreated output folder at " tmp/images/favicons/ "
Resizing images for "src/favicon/favicon.png"... [32mOK[39m
favicon.ico... [32mOK[39m
favicon.png... [32mOK[39m
Updating HTML... [32mOK[39m

[4mRunning "jshint:files" (jshint) task[24m
[32m>> [39m4 files lint free.

[4mRunning "csslint:0" (csslint) task[24m
[32m>> [39m1 file lint free.

[4mRunning "concat:css" (concat) task[24m
File tmp/index.css created.

[4mRunning "concat:js" (concat) task[24m
File tmp/index.js created.

[4mRunning "cssmin:0" (cssmin) task[24m
File tmp/index.css created: 253 B → 161 B

[4mRunning "uglify:0" (uglify) task[24m
File tmp/index.js created: 314 B → 185 B

[4mRunning "copy:assets" (copy) task[24m
Copied [36m1[39m files

[4mRunning "copy:tmp" (copy) task[24m
Copied [36m8[39m files

[4mRunning "test:local" (test) task[24m

[90m    dist/index.html should exist: [0m[32m  ․[0m[90m dist/index.html should exist: [0m[90m1ms[0m
[90m    dist/index.html should be this generated version: [0m[32m  ․[0m[90m dist/index.html should be this generated version: [0m[90m2ms[0m

[92m [0m[32m 2 passing[0m[90m (6ms)[0m


[4mRunning "clean:post" (clean) task[24m
Cleaning .sass-cache...[32mOK[39m
Cleaning tmp...[32mOK[39m

[32mDone, without errors.[39m
