# pwix:modal

## What is it ?

A Bootstrap-based Meteor package which provides draggable and resizable modal dialogs.

## Usage

The dialog makes use of Blaze templating for its rendering. It expects be called with a template to render in its body. Just call
```
    pwixModal.run( parms )
```
and you're done!

## Configuration

None at the moment.

## What does it provide ?

### A global object

`pwixModal`

### Methods

`pwixModal.run( parms )`

Creates and shows a modal dialog with `parms` parameters.

`pwixModal.close()`

Close the current modal dialog.

`pwixModal.enableButton( button, enable )`

Enable (resp. disable) the specified button.<br />
Only relevant in a dialog is currently opened.

`pwixModal.findButton( button )`

Returns the specfied button as a jQuery object.<br />
Only relevant in a dialog is currently opened.

`pwixModal.knownButtons()`

Returns an array which contains managed buttons.

`pwixModal.setButtons( buttons )`

Set the to-be-displayed buttons.<br />
`buttons` can be specified as a string for a single button, or as an array.<br />
May be called both before the dialog is opened, for example for preparing a next run, or during the dialog execution.

`pwixModal.setTarget( target )`

Set the events target.<br />
May be called both before the dialog is opened, for example for preparing a next run, or during the dialog execution.

### Blaze components

#### pwixModal

Parameters are to be passed as an options object when calling `pwixModal.run()` method.

<table>
<tr>
<td style="vertical-align: top;">
mdTemplate
</td>
<td style="vertical-align: top;">
The name of the template to be rendered in the body.<br />
If omitted, then the body will be empty.
</td>
</tr>

<tr>
<td style="vertical-align: top;">
mdTitle
</td>
<td style="vertical-align: top;">
The title to be displayed in the modal header.<br />
If omitted, then the header will be empty.
</td>
</tr>

<tr>
<td style="vertical-align: top;">
mdClasses
</td>
<td style="vertical-align: top;">
The classes to be added to the <code>&lt;div class="modal-dialog">...&lt;/div></code>.<br />
Bootstrap in particular uses some classes to define the initial width of the dialog (see <a href="https://getbootstrap.com/docs/5.3/components/modal/#optional-sizes">Optional sizes</a>).<br />
You can of course use that for your own needs.<br />
No default.
</td>
</tr>

<tr>
<td style="vertical-align: top;">
mdButtons
</td>
<td style="vertical-align: top;">
A button constant, o an array of button constants to be displayed in the footer.<br />
Buttons are identified by the constants:
<ul>
<li>MD_BUTTON_OK</li>
<li>MD_BUTTON_CANCEL</li>
<li>MD_BUTTON_CLOSE</li>
<li>MD_BUTTON_SAVE</li>
<li>MD_BUTTON_YES</li>
<li>MD_BUTTON_NO</li>
</ul>
Default is to have at least a <code>MD_BUTTON_OK</code> button.
</td>
</tr>

<tr>
<td style="vertical-align: top;">
mdTarget
</td>
<td style="vertical-align: top;">
The jQuery element to which the <code>click</code> events must be redirected as <code>md-click</code> messages.<br />
The messgae will have button constants as its data.<br />
Default is to send these messages to the <code>pwixModal</code> itself.
</td>
</tr>
</table>

All other parameters passed here will be directly passed to the template rendered in the body of the dialog.

_Note_: the package is cool enough to destroy itself the Blaze created view on dialog close. So you don't have to take care about that.

## NPM peer dependencies

Starting with v 1.0.0, and in accordance with advices from [the Meteor Guide](https://guide.meteor.com/writing-atmosphere-packages.html#npm-dependencies), we no more hardcode NPM dependencies in the `Npm.depends` clause of the `package.js`. 

Instead we check npm versions of installed packages at runtime, on server startup, in development environment.

Dependencies as of v 1.0.0:
```
    '@popperjs/core': '^2.11.6'
    'bootstrap': '^5.2.1'
    'jquery-ui-dist': '^1.13.2'
```
Each of these dependencies should be installed at application level:
```
    meteor npm install <package> --save
```

## Translations

New and updated translations are willingly accepted, and more than welcome. Just be kind enough to submit a PR on the [Github repository](https://github.com/trychlos/pwix-modal/pulls).

---
P. Wieser
- Last updated on 2023, Feb. 2nd
