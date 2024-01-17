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

    - `Modal.C.Verbose.FOCUS`

        Trace the focus() function

    - `Modal.C.Verbose.NOMODAL`

        Trace the modal research when there is none

    - `Modal.C.Verbose.RESIZING`

        Trace resizing informations

    - `Modal.C.Verbose.STACK`

        Trace push into and pop from stack

    Defaults to `Modal.C.Verbose.NONE`.

Remind too that Meteor packages are instanciated at application level. They are so only configurable once, or, in other words, only one instance has to be or can be configured. Addtionnal calls to `Modal.configure()` will just override the previous one. You have been warned: **only the application should configure a package**.

## What does it provide ?

### `Modal`

The globally exported object.

### Methods

#### The life of the modal

- `Modal.run({ parms })`

    Creates and shows a modal dialog with `parms` parameters object. Known parameters are:

    - `mdAutoFocus`

        Whether we should try to initialize the focus ourselves,or let the application manage it.

        When `true`, we try to set the focus on the first inputable field of the body, or the last button of the footer.

        Though this default aims to make the package easier to use, the application should be conscious that it also prevents the application to put the focus itself.

        Defaults to `true`.

    - `mdBeforeClose`

        A function to be called when the user asks for close the modal, by clicking on the backdrop, or the close button of the header, or a close button in the footer. This function let the application allows or forbid the close:

        - the function takes a unique argument, which is the modal identifier
        - it is expected that the function returns a Promise which must resolve to:
            - `true` to let the modal be closed
            - `false` to prevent the modal to be closed.

        The default is to leave the modal be closed when the user asks for that.

    - `mdBody`

        The name of a Blaze template to be rendered as the dialog body.

        No default.

    - `mdButtons`

        The buttons to be displayed in the standard footer, as a string, an array of strings, an object or an array of objects.

        Only considered if a specific footer is not asked (see `mdFooter` parm).

        Default is to have one `OK` button.

        When provided as an array, the buttons are displayed from left (the first element of the array) to right (the last element).

        See also [Buttons management](#buttons-management) for the syntax of this data.

    - `mdClasses`

        A string which contains the classes to be added to the '`.modal`' element.

        No default.

    - `mdClassesBody`

        A string which contains the classes to be added to the '`.modal-body`' element.

        No default.

    - `mdClassesContent`

        A string which contains the classes to be added to the '`.modal-content`' element.

        No default.

    - `mdClassesFooter`

        A string which contains the classes to be added to the '`.modal-footer`' element.

        No default.

    - `mdClassesHeader`

        A string which contains the classes to be added to the '`.modal-header`' element.

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

    - `mdFullScreen`

        Whether the modal should be displayed in full screen mode.

        This is nonetheless a rather bad idea in XS and S devices where the pagination should rather be reviewed.

        And also a bad idea on larger displays, as this lead to very too big dialogs.

        Reserve this use to dedicated less-than-MD devices.

    - `mdSizeKey`

        The string name of the `localStorage` item which will record the last used width and height.

        No default.

        Using this feature requires the user has accepted the use of functional cookies. The size will be stored as a `localStorage` item.

    - `mdTarget`

        The target of the events as a jQuery object.

        Default is let bubble the events.

        Note that at the time of the modal creation, you are not yet able to set the rendered template as the events target (as it has not yet been rendered). See also `Modal.target()`.

        Note also that the modal will be attached to the `body` of the page. Events will so bubble directly from the modal to the body.

    - `mdTitle`

        The title of the dialog.

        No default.

    This method returns a string which is the unique identifier of the new modal.

- `Modal.buttonFind( button_id [, id ] )`

    Returns the specfied button as a jQuery object for the specified opened modal, defaulting to the topmost one.

    Because this method makes a search on the `data-md-btn-id` attribute, it may be irrelevant when a specific footer has been defined.

- `Modal.askClose()`

    Close the current modal dialog from the caller, taking care of the eventual `mdBeforeClose` configured function.

    If the function has been provided, it is ran and its result is executed.

    Else, the odal is closed (which is the default if the function is not configured).

- `Modal.close()`

    Unconditionally close the current modal dialog from the caller.

    Unconditionlly here means that this method doesn't take care of the optional `mdBeforeClose` configured function which ask for a user confirmation. Closing means.. closing!

    Of course, and if this has not been prevented in the modal configuration, it is still possible to close the modal dialog via the usual ways:

    - from the dismiss button in the header

    - from the `Close` (resp. `Cancel`) button in the footer,

    - or by clicking anywhere outside of the modal.

- `Modal.count()`

    Returns the count of opened modals.

- `Modal.focus( arg )`

    Set the focus on a field.

    `arg` is a parameter object which may contain:

    - `id`: the modal identifier, defaulting to the topmost one

    - `field`: the targeted field as a jQuery object, defaulting to the first inputable or the last button.

    The application may have its own opinion about which is the first inputable field, or, in other words, which field should be the default when the user presses a key. It will most probably to set the focus from its own `onRendered()` function. But this later is triggered before ours. So, because we are executed last, we cannot provide any suitable default.

    As a consequence, each client application shoud call this function itself if it wants the user has any suitable default.

- `Modal.set( arg )`

    A generic method to configure a running modal.

    `arg` must be a Javascript object with following keys:

    - `id`: the identifier of the to-be-configured modal, defaulting to the current topmost

    - `autoFocus`: when specified, whether the focus is automatically managed by the modal itself.

        See the `mdAutoFocus` parameter to get a full description.

    - `beforeClose`: when specified, the function to be called by the modal to get an authorization to close.

        See the `mdBeforeClose` parameter to get a description of the function.

    - `body`: when specified, the name of the Blaze template to be set as the modal body

    - `bodyHeight`: when specified, set a minimal new body height

        Body height may be specified with a `'+'` or `'-'` prefix to respectively increase or decrease the current body height.

    - `buttons`: when specified, a string, an array of strigs, an object or an array of object, each one providing the properties to be set on a button, as:

        - `id`: mandatory, defaulting to the string itself if only a string is provided
        - `label`
        - `classes`
        - `enabled`
        - `name`
        - `type`
        - `html`
        - `cb`
        - `dismiss`
        - `ifExist`: only apply if the button already exists, defaulting to false; this means that, if you do not specify this attribute, you may create a new button!

        If a button has not been previously defined, then it is added at the end of the list.

        This is also the case when the buttons are only specified as strings, not objects. In that case, we consider that this is a request to add a new button, which must not exist yet.

    - `classes`: when specified, classes to be added to the '`.modal`' element

    - `classesBody`: when specified, classes to be added to the '`.modal-body`' element

    - `classesContent`: when specified, classes to be added to the '`.modal-content`' element

    - `classesFooter`: when specified, classes to be added to the '`.modal-footer`' element

    - `classesHeader`: when specified, classes to be added to the '`.modal-header`' element

    - `closeByBackdrop`: when specified, whether the dialog should be closed when clicking on the backdrop

    - `closeByHeader`: when specified, whether the header exhibits a dismiss button

    - `closeByKeyboard`: when specified, whether the dialog should be closed when hitting Escape

    - `footer`: when specified, the name of the Blaze template to be set as the modal footer

        Just set to `null` to pass from a specific footer to the standard one.

        Specifying a particular footer takes precedence over the standard one.
        
        When a particular footer is specified, then the button methods are no more operationnal, and you have to manage them yourself.

    - `fullscreen`: when specified, whether the dialog should be displayed in full screen mode

    - `target`: when specified, the JQuery object which must receive events for that modal

        This method is usually called from the rendered body template `onRendered()` function. At that time, not only the DOM is rendered for this element, but it is very probable that this is in this template that the triggered events will be useful.

    - `title`: when specified, the title of the modal

- `Modal.target()`

    Returns the current modal events target.

#### Buttons management

When using the standard footer, buttons can be specified either as an object or an array of objects.

An accepted object is a full object definition, with keys:

- `id`: the button identifier as a string, mandatory

    It may be one of our known button identifiers as defined by the [constants](#buttons), or an identifier provided by the caller.

    The special `Modal.C.ButtonExt.RESET` identifier let the application remove all previously defined buttons.

- `label`: the label of the button

    If the button identifier is one of ours, then label defaults to the standard (localized) label associated with this button.

    If the button identifier is provided by the caller, then label defaults to the identifier itself.

- `classes`: the classes to be set for the button

    Defaults to:

    - `btn-secondary` for all but the last buttons
    - `btn-primary` for the last (the rightest) button.

- `enabled`: whether the button defaults to be enabled.

    Defaults to `true`.

- `name`: the name of the button

    Defaults to button identifier.

- `type`: the type of the button

    Accepted values are:

    - `submit`
    - `reset`
    - `button`

    Defaults to `button`.

    Please also note that a `type="submit"` button will reload the page when activated. This is probably not what you want in a Meteor application.

- `html`: the full button definition `<button>...</button>` as a HTML string

    No default.

    If this attribute is set, it takes precedence other `label`, `classes`, `enabled`, `name` and `type`.

- `cb`: a function `(modal_id, button_id)` to be called when the button is clicked

    The return value of the function is ignored.

- `dismiss`: a boolean value which says whether clicking on the button should dismiss the modal

    Defaults to `true` if there is one single button, or if they are `CANCEL` or `CLOSE` buttons. Default to `false` in every other case.

All others parameters passed when creating the button are kept, and made available in `button.parms` data passed with `md-click` event.

Each button, apart those generated directly via the `html` key, has a `date-md-btn-id` attribute set to the button identifier.

Please note that all that buttons management is NOT relevant when using a specific footer.

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

#### Special identifiers

- `Modal.C.ButtonExt.RESET`

These are our known, standard, button identifiers. Their labels are localizable.

### Events

- `md-click`

    A button has been clicked.

    The event holds a data object with:

    - `id`: the modal identifier

    - `button`: the button properties with:

        - `id`: the button identifier (always set)
        - `parms`: the parameters initially passed when creating the button

    - `parms`: the parameters initialy passed to `Modal.run()`.

    If the button holds a truthy `dismiss` property, or is the only button of the standard footer, then the dialog is closed. In other cases, it is the responsability of the event receiver to close the modal.

- `md-close`

    An event sent when the modal is about to close, whatever be the reason.

    The event holds a data object with:

    - `id`: the modal identifier
    - `parms`: the parameters initialy passed to `Modal.run()`.

    Note that this event is only for information. It does not let the receiver to prevent the modal closing. In order to do that, see the `mdBeforeClose` parameter.

- `md-ready`

    The modal has been rendered, the DOM is ready.

    The event holds a data object with:

    - `id`: the modal identifier
    - `parms`: the parameters initialy passed to `Modal.run()`.

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

Dependencies as of v 1.9.0:
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

Because this is dynamically done on a per dialog basis, and only on the caller request, the package cannot advertize of this use, relying on the caller own declaration.

---
P. Wieser
- Last updated on 2023, Oct. 11th
