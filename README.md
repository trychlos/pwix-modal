# pwix:modal

## What is it ?

A Bootstrap-based Meteor package which provides draggable and resizable modal dialogs.

## Installation

As simple as:

```
    meteor add pwix:modal
```

## Usage

Just call
```
    pwixModal.run( parms )
```
and you're done!

Without any parameters, the displayed modal will have a header with a dismiss button but no title, an empty body, and a footer with a single `OK` button.

See below for the available parameters.

### Opening several modals

Though the [Bootstrap documentation](https://getbootstrap.com/docs/5.2/components/modal/) prevents against it, this package let you open more than only one modal at a time. Each is stacked on top of the previous one, and take the focus while it is active and no modal is opened on top of it.

## Configuration

None at the moment.

## What does it provide ?

### `pwixModal`

The globally exported object.

### Methods

#### The life of the modal

- `pwixModal.run({ parms })`

    Creates and shows a modal dialog with `parms` parameters object. Known parameters are:

    - `mdBody`

        The name of a Blaze template to be rendered as the dialog body.

        No default.

    - `mdButtons`

        The buttons to be displayed in the standard footer, as a string or an array of strings.

        Default is have at least one `OK` button.

    - `mdClasses`

        A string which contains the classes to be added to the '`.modal`' element.

        No default.

    - `mdCloseByBackdrop`

        Whether clicking outside of the dialog should close it.

        Defaults to `true`.

    - `mdCloseByHeader`

        Whether the header holds a `Close` button.

        Defaults to `true`.

    - `mdCloseByKeyboard`

        Whether `Escape` key closes the modal.

        Defaults to `true`.

    - `mdFooter`

        The name of a Blaze template to be rendered as the dialog footer.

        Default is to render a standard footer with at least one `OK` button.

    - `mdSizeKey`

        The string name of the `localStorage` item which will record the last used width and height.

        No default.

        Using this feature requires the user has accepted the use of functional cookies. The size will be stored as a `localStorage` item.

    - `mdTarget`

        The target of the events as a jQuery object.

        Default is let bubble the events.

        Note that at the time of the modal creation, you are not yet able to set the rendered body as the events target (as it has not yet been rendered). See also `pwixModal.target()`.

    - `mdTitle`

        The title of the dialog.

        No default.

    - `mdVerticalPosition`

        How to vertically position the modal.

        Accepted values are either a standard position value as described in [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/top), or one of constants:

        - `MD_POSITION_CENTER`

            Vertically center the modal in the screen

        Default is to position about 2em of the top (depending of the size of the screen).

        Note that this vertical position might be shifted if several modals are stacked at this time.

    This method returns a string which is the unique identifier of the new modal.

- `pwixModal.setTarget( target [, id ] )`

    Obsoleted as of v 1.2.0, will be removed on 2.0, redirected to `pwixModal.target()` getter/setter.

- `pwixModal.target({ target: <target> [, id: <id> ] })`

    Set the events target as a jQuery object for the specified opened modal, defaulting to the topmost one.

    This method will be usually called from the rendered body template `onRendered()` function. At that time, not only the DOM is rendered for this element, but it is very probable that the triggered events will be useful in this template.

    Returns the target of the identified modal, or of the topmost one, or null if none apply.

- `pwixModal.close()`

    Close the current modal dialog from the caller.

    Of course, it is always possible to close the modal dialog via the usual ways:

    - from the always displayed dismiss button in the header

    - from the `Close` (resp. `Cancel`) button in the footer,

    - or by clicking anywhere outside of the modal.

- `pwixModal.count()`

    Returns the count of opened modals.

#### Manage the header

- `pwixModal.setClasses( classes [, id ] )`

    Set the supplementary '`.modal`' classes for the specified opened modal, defaulting to the topmost one.

- `pwixModal.setTitle( title [, id ] )`

    Set the title for the specified opened modal, defaulting to the topmost one.

#### Manage the body

- `pwixModal.setBody( template [, id ] )`

    Set the name of the body template for the specified opened modal, defaulting to the topmost one.

#### Manage the footer

- `pwixModal.setFooter( template [, id ] )`

    Set the name of the footer template for the specified opened modal, defaulting to the topmost one.

    Just set to `null` to pass from a specific footer to the standard one.

    Specifying a particular footer takes precedence over the standard one. When it is specified, then the button methods are no more operationnal.

- `pwixModal.buttonEnable( button, enable [, id ] )`

    Enable (resp. disable) the specified button for the specified opened modal, defaulting to the topmost one.

    Not relevant when a particular footer has been specified.

- `pwixModal.buttonFind( button [, id ] )`

    Returns the specfied button as a jQuery object for the specified opened modal, defaulting to the topmost one.

    Not relevant when a particular footer has been specified.

- `pwixModal.knownButtons()`

    Returns an array which contains the buttons known by `pwixModal`.

- `pwixModal.setButtons( buttons [, id ] )`

    Set the to-be-displayed buttons for the specified opened modal, defaulting to the topmost one.

    `buttons` can be specified as a string for a single button, or as an array.

### Constants

#### Buttons

- `MD_BUTTON_OK`
- `MD_BUTTON_CANCEL`
- `MD_BUTTON_CLOSE`
- `MD_BUTTON_SAVE`
- `MD_BUTTON_YES`
- `MD_BUTTON_NO`

### Events

- `md-click`

    A button has been clicked.

    The event holds a data object with:

    - `modal`: the modal identifier
    - `button`: the button identifier.

    If the button is `MD_BUTTON_CANCEL` or is the only button of the standard footer, then the dialog is closed.

    It is the responsability of the event receiver to close the modal when needed.

- `md-close`

    An event sent when the modal is about to close, whatever be the reason.

    The event holds a data object with:

    - `modal`: the modal identifier.

## Example

Say you have a template you want render in a modal:
```
    <template name="my_panel">
        <div class="my-panel">

            <form>
                <label for="" class="form-label form-label-sm frs-one">{{ i18n label="title_label" }}</label>
                <input type="text" class="form-control form-control-sm frs-title" placeholder="{{ i18n label="title_placeholder" }}" value="{{ catTitle }}" />

                <label for="" class="form-label form-label-sm frs-one">{{ i18n label="description_label" }}</label>
                <textarea class="form-control form-control-sm frs-description" placeholder="{{ i18n label="description_placeholder" }}" rows="3">{{ catDescription }}</textarea>
            </form>

        </div>
    </template>
```

From the parent who mades the open decision, just run:
```
    pwixModal.run({
        mdBody: 'my_panel',
        mdTitle: 'A simple form',
        mdButtons: [ MD_BUTTON_CANCEL, MD_BUTTON_SAVE ]
    });
```

In the template JS:
```
    Template.my_panel.onRendered( function(){
        pwixModal.setTarget( this.$( '.my-panel' ));
    });

    ...

    Template.my_panel.events({
- `md-click .my-panel'( event, instance, data ){
            if( data.button === MD_BUTTON_SAVE ){
                // do something
                pwixModal.close();
            }
        }
    });
```

## Modal attachment in the DOM

`pwix:modal` attaches its modals to the document `body`.

If you do not set a target, the events will eventually bubble until the `body` DOM element.

## NPM peer dependencies

Starting with v 1.0.0, and in accordance with advices from [the Meteor Guide](https://guide.meteor.com/writing-atmosphere-packages.html#npm-dependencies), we no more hardcode NPM dependencies in the `Npm.depends` clause of the `package.js`. 

Instead we check npm versions of installed packages at runtime, on server startup, in development environment.

Dependencies as of v 1.4.0:
```
    '@popperjs/core': '^2.11.6',
    'bootstrap': '^5.2.1',
```

Each of these dependencies should be installed at application level:
```
    meteor npm install <package> --save
```

## Translations

New and updated translations are willingly accepted, and more than welcome. Just be kind enough to submit a PR on the [Github repository](https://github.com/trychlos/pwix-modal/pulls).

## Cookies and comparable technologies

`pwix:modal` may use `localStorage` to record the size of a dialog through the `mdSizeKey` argument of the `pwixModal.run()` method.

Because this is dynamically done on a per dialog basis, and only on the caller request, the package doesn't advertize of this use, relying on the caller own declaration.

---
P. Wieser
- Last updated on 2023, May 29th
