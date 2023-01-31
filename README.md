# pwix:modal

## What is it ?

A Bootstrap-based Meteor package which provides draggable and resizable modal dialogs.

## Configuration

None at the moment.

## What does it provide ?

### A global object

`pwixModal`

### Blaze components

#### pwixModalDialog

_Note_: the package is cool enough to destroy itself the Blaze created view on dialog close. So you don't have to take care about that.

## NPM peer dependencies

Starting with v 1.0.0, and in accordance with advices from [the Meteor Guide](https://guide.meteor.com/writing-atmosphere-packages.html#npm-dependencies), we no more hardcode NPM dependencies in the `Npm.depends` clause of the `package.js`. 

Instead we check npm versions of installed packages at runtime, on server startup, in development environment.

Dependencies as of v 1.0.0:
- @popperjs/core, starting with v 2.11,
- bootstrap, starting with v 5.2.

Each of these dependencies should be installed at application level:
```
    meteor npm install <package> --save
```

---
P. Wieser
- Last updated on 2023, Jan. 29th
