# pwix:modal - README

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

Close the current modal dialog from the caller.

Of course, it is always possible to close the modal dialog from the `Close` (resp. `OK`, resp. `Cancel`) button, or by clicking anywhere outside of the modal!

`pwixModal.enableButton( button, enable )`

Enable (resp. disable) the specified button.

Only relevant if a dialog is currently opened.

`pwixModal.findButton( button )`

Returns the specfied button as a jQuery object.

Only relevant if a dialog is currently opened.

`pwixModal.knownButtons()`

Returns an array which contains buttons known by `pwixModal`.

`pwixModal.setButtons( buttons )`

Set the to-be-displayed buttons.

`buttons` can be specified as a string for a single button, or as an array.

May be called both before the dialog is opened, for example for preparing a next run, or during the dialog execution.

`pwixModal.setFooter( template )`

Set the template to be rendered as the modal footer.

May be called both before the dialog is opened, for example for preparing a next run, or during the dialog execution.

`pwixModal.setTarget( target )`

Set the events target.

May be called both before the dialog is opened, for example for preparing a next run, or during the dialog execution.

`pwixModal.setTemplate( template )`

Set the template to be rendered as the modal body.

May be called both before the dialog is opened, for example for preparing a next run, or during the dialog execution.

`pwixModal.setTitle( title )`

Set the title of the modal.

May be called both before the dialog is opened, for example for preparing a next run, or during the dialog execution.

### Blaze components

#### mdModal

Parameters are to be passed as an options object when calling `pwixModal.run()` method.

<table>
<tr>
<td style="vertical-align: top;">
mdTemplate
</td>
<td style="vertical-align: top;">
The name of the template to be rendered in the body.<br />
If omitted, and not previously set with `pwixModal.setTemplate()`, then the body will be empty.
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
A button constant, or an array of button constants to be displayed in the footer.<br />
Buttons are identified by the constants:
<ul>
<li>MD_BUTTON_OK</li>
<li>MD_BUTTON_CANCEL</li>
<li>MD_BUTTON_CLOSE</li>
<li>MD_BUTTON_SAVE</li>
<li>MD_BUTTON_YES</li>
<li>MD_BUTTON_NO</li>
</ul>
All buttons will have `btn-secondary` class, but the last one which will be `btn-primary`.<br />
Default is to have one <code>MD_BUTTON_OK</code> button.
</td>
</tr>

<tr>
<td style="vertical-align: top;">
mdFooter
</td>
<td style="vertical-align: top;">
The name of a Blaze template to be used to render the modal footer.<br />
If provided, `mdButtons` parameter is not used.<br />
Default is to use a standard footer, and the `mdButtons` parameter.
</td>
</tr>

<tr>
<td style="vertical-align: top;">
mdTarget
</td>
<td style="vertical-align: top;">
The jQuery element to which the <code>click</code> events must be redirected as <code>md-click</code> messages.<br />
The event will have button constants as its data.<br />
Default is to send these messages to the <code>mdModal</code> itself.
</td>
</tr>
</table>

All other parameters passed here will be directly passed to the template rendered in the body of the dialog.

_Note_: the package is cool enough to destroy itself the Blaze created view on dialog close. So you don't have to take care about that.

### Events

`md-click`

A button has been clicked.

The clicked button is provided as data of the event.

`md-modal-close`

An event sent when the modal is about to close, whatever be the reason.

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
