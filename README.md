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
    Modal.run( parms )
```
and you're done!

Without any parameters, the displayed modal will have a header with a dismiss button but no title, an empty body, and a footer with a single `OK` button.

See below for the available parameters.

### Opening several modals

Though the [Bootstrap documentation](https://getbootstrap.com/docs/5.2/components/modal/) prevents against it, this package let you open more than only one modal at a time. Each is stacked on top of the previous one, and take the focus while it is active and no modal is opened on top of it.

## Configuring

The package's behavior can be configured through a call to the `Modal.configure()` method, with just a single javascript object argument, which itself should only contains the options you want override.

Known configuration options are:

- `verbosity`

    The verbosity level as:
    
    - `Modal.C.Verbose.NONE`
    
    or an OR-ed value of integer constants:

    - `Modal.C.Verbose.CONFIGURE`

        Trace configuration operations

    - `Modal.C.Verbose.NOMODAL`

        Trace the modal research when there is none

    Defaults to `Modal.C.Verbose.NONE`.

Remind too that Meteor packages are instanciated at application level. They are so only configurable once, or, in other words, only one instance has to be or can be configured. Addtionnal calls to `Modal.configure()` will just override the previous one. You have been warned: **only the application should configure a package**.

## What does it provide ?

### `Modal`

The globally exported object.

### Methods

#### The life of the modal

- `Modal.run({ parms })`

    Creates and shows a modal dialog with `parms` parameters object. Known parameters are:

    - `mdBeforeClose`

        A function to be called when the user asks for close the modal, by clicking on the backdrop, or the close button of the header, or a close button in the footer. This function let the application allows or forbid the close:

        - the function takes a unique argument, which is the modal identifier
        - if the function returns `true`, the modal will be closed
        - if the function returns `false`, the modal will not.

        The default is to leave the modal be closed when the user asks for that.

    - `mdBody`

        The name of a Blaze template to be rendered as the dialog body.

        No default.

    - `mdButtons`

        The buttons to be displayed in the standard footer, as a string, an object or an array of strings or objects.

        Default is to have one `OK` button.

        See also `Modal.setButtons()` method for the syntax of this data.

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

        If both are specified, `mdFooter` takes precedence on `mdButtons`.

    - `mdSizeKey`

        The string name of the `localStorage` item which will record the last used width and height.

        No default.

        Using this feature requires the user has accepted the use of functional cookies. The size will be stored as a `localStorage` item.

    - `mdTarget`

        The target of the events as a jQuery object.

        Default is let bubble the events.

        Note that at the time of the modal creation, you are not yet able to set the rendered template as the events target (as it has not yet been rendered). See also `Modal.target()`.

    - `mdTitle`

        The title of the dialog.

        No default.

    - `mdVerticalPosition`

        How to vertically position the modal.

        Accepted values are either a standard position value as described in [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/top), or one of constants:

        - `Modal.C.Position.CENTER`

            Vertically center the modal in the screen

        Default is to position about 2em of the top (depending of the size of the screen).

        Note that this vertical position might be shifted if several modals are stacked at this time.

    This method returns a string which is the unique identifier of the new modal.

- `Modal.beforeClose()`

    Get or set the function which allows the modal closing.

- `Modal.close()`

    Close the current modal dialog from the caller.

    Of course, it is always possible to close the modal dialog via the usual ways:

    - from the always displayed dismiss button in the header

    - from the `Close` (resp. `Cancel`) button in the footer,

    - or by clicking anywhere outside of the modal.

- `Modal.count()`

    Returns the count of opened modals.

- `Modal.setTarget( target [, id ] )`

    Obsoleted as of v 1.2.0, will be removed on 2.0, redirected to `Modal.target()` getter/setter.

- `Modal.target({ target: <target> [, id: <id> ] })`

    Set the events target as a jQuery object for the specified opened modal, defaulting to the topmost one.

    This method will be usually called from the rendered body template `onRendered()` function. At that time, not only the DOM is rendered for this element, but it is very probable that the triggered events will be useful in this template.

    Returns the target of the identified modal, or of the topmost one, or null if none apply.

#### Manage the header

- `Modal.setClasses( classes [, id ] )`

    Set the supplementary '`.modal`' classes for the specified opened modal, defaulting to the topmost one.

- `Modal.setTitle( title [, id ] )`

    Set the title for the specified opened modal, defaulting to the topmost one.

#### Manage the body

- `Modal.setBody( template [, id ] )`

    Set the name of the body template for the specified opened modal, defaulting to the topmost one.

#### Manage the footer

- `Modal.setFooter( template [, id ] )`

    Set the name of the footer template for the specified opened modal, defaulting to the topmost one.

    Just set to `null` to pass from a specific footer to the standard one.

    Specifying a particular footer takes precedence over the standard one. When it is specified, then the button methods are no more operationnal.

- `Modal.buttonEnable( button_id, enable [, id ] )`

    Enable (resp. disable) the specified button identifier for the specified opened modal, defaulting to the topmost one.

    Not relevant when a particular footer has been specified.

- `Modal.buttonFind( button_id [, id ] )`

    Returns the specfied button as a jQuery object for the specified opened modal, defaulting to the topmost one.

    Not relevant when a particular footer has been specified.

- `Modal.knownButtons()`

    Returns an array which contains the buttons known by `Modal`.

    This function is obsoleted as of v 1.6.0, will be removed on 2.0. It is now enough to get `Object.keys( Modal.C.Button )` array.

- `Modal.setButtons( buttons [, id ] )`

    Set the to-be-displayed buttons for the specified opened modal, defaulting to the topmost one.

    `buttons` can be specified as a string, or an object, or as an array of strings of objects:

    - strings are expected to be known, standard, button identifiers; in that case, the default behavior of the relevant button is provided

    - objects fully describe a button. Following keys may be specified:

        - `id`: the button identifier, may belong to the caller, mandatory

        - `label`: default to the identifier if this identifier is not one of our known standard buttons

        - `cb`: a function `(modal_id, button_id)` to be called when the button is clicked

        - `dismiss`: whether clicking on the button should dismiss the modal,
            - defaulting to `true` if there is one single button, and for known standard buttons
            - to `false` else (caller-provided button identifiers)

#### Translations

- `Modal.i18n.namespace()`

    Returns the i18n namespace of the package.

### Constants

#### Buttons

- `Modal.C.Button.OK`
- `Modal.C.Button.CANCEL`
- `Modal.C.Button.CLOSE`
- `Modal.C.Button.SAVE`
- `Modal.C.Button.YES`
- `Modal.C.Button.NO`

These are our known, standard, button identifiers. Their labels are localizable.

### Events

- `md-click`

    A button has been clicked.

    The event holds a data object with:

    - `modal`: the modal identifier
    - `button`: the button identifier
    - `btnObj`: the button properties as passed to `Modal.setButtons()` function or as `mdButtons` parameter

    If the button holds a truely `dismiss` property, or is the only button of the standard footer, then the dialog is closed. In other cases, it is the responsability of the event receiver to close the modal.

- `md-close`

    An event sent when the modal is about to close, whatever be the reason.

    The event holds a data object with:

    - `id`: the modal identifier.

    Note that this event is only for information. It does not let the receiver to prevent the modal closing. In order to do that, see the `mdBeforeClose` parameter.

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
    Modal.run({
        mdBody: 'my_panel',
        mdTitle: 'A simple form',
        mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.SAVE ]
    });
```

In the template JS:
```
    Template.my_panel.onRendered( function(){
        Modal.setTarget( this.$( '.my-panel' ));
    });

    ...

    Template.my_panel.events({
        'md-click .my-panel'( event, instance, data ){
            if( data.button === Modal.C.Button.SAVE ){
                // do something
                Modal.close();
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

Dependencies as of v 1.6.0:
```
    '@popperjs/core': '^2.11.6',
    'bootstrap': '^5.2.1',
    'lodash': '^4.17.0'
```

Each of these dependencies should be installed at application level:
```
    meteor npm install <package> --save
```

## Translations

New and updated translations are willingly accepted, and more than welcome. Just be kind enough to submit a PR on the [Github repository](https://github.com/trychlos/pwix-modal/pulls).

## Cookies and comparable technologies

`pwix:modal` may use `localStorage` to record the size of a dialog through the `mdSizeKey` argument of the `Modal.run()` method.

Because this is dynamically done on a per dialog basis, and only on the caller request, the package doesn't advertize of this use, relying on the caller own declaration.

---
P. Wieser
- Last updated on 2023, July 4th
