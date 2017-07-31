# EOS

## Installation
* `npm install -g gulp typings`: installs Gulp and Typings globally
* `npm install`: installs node modules locally then triggers type definition
 installation and builds the app

## Build and Run
### Automatically
* `gulp`: lints, builds, and restarts web server on changes
    (Branch changes will cause server to crash; stop and start before doing so)

If no code has changed since your last build, you can just run:

* `gulp serve`: starts web server with a watcher that will recompile any changed files
    (will not trigger recompilation on any files changed before task starts)

