/*
 * pwix:modal/src/client/classes/md_modal.class.js
 *
 * This is the class which manages the modal dialogs.
 */

import _ from 'lodash';

import { Random } from 'meteor/random';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';

import '../../common/js/index.js';

import '../components/md_modal/md_modal.js';

import { mdButton } from './md_button.class.js';

export class mdModal {

    // static methods
    //

    // private data
    //

    // a unique dynamically allocated identifier of this modal
    _id = null;

    // initial parameters
    _parms = null;

    // the last version of the parameters
    _autofocus = new ReactiveVar( null );
    _beforeclose = new ReactiveVar( null );
    _body = new ReactiveVar( null );
    _bodyheight = new ReactiveVar( null );
    _buttons = {
        value: [],  // an array of mdButton's
        dep: new Tracker.Dependency()
    };
    _classes = new ReactiveVar( null );
    _classesbody = new ReactiveVar( null );
    _classescontent = new ReactiveVar( null );
    _classesfooter = new ReactiveVar( null );
    _classesheader = new ReactiveVar( null );
    _closebackdrop = new ReactiveVar( true );
    _closeheader = new ReactiveVar( true );
    _closekeyboard = new ReactiveVar( true );
    _footer = new ReactiveVar( null );
    _fullscreen = new ReactiveVar( null );
    _movetop = new ReactiveVar( 0 );
    _sizekey = new ReactiveVar( null );
    _target = new ReactiveVar( null );
    _title = new ReactiveVar( null );

    // the rendered view
    _view = null;

    // private methods
    //

    _argBool( obj, arg, def ){
        let _res = def;
        if( Object.keys( obj ).includes( arg )){
            const b = obj[arg];
            if( b === true || b === false ){
                _res = b;
            } else if( b === 'true' || b === 'false' ){
                console.warn( 'pwix:modal expects \''+arg+'\' to be a boolean, found', b, 'string' );
                _res = ( b === 'true' );
            } else {
                console.warn( 'pwix:modal expects \''+arg+'\' to be a boolean, found', b );
            }
        }
        return _res;
    }

    /**
     * Constructor
     * Allocating a new mdModal is from user point of view same than opening a new modal
     * - allocate a new id
     * - ask to Blaze to continue the work
     * @param {Object} parms the parameters provided by the caller
     * @return {mdModal}
     */
    constructor( parms ){

        this._id = Random.id();
        this._parms = parms;

        this._autofocus.set( this._argBool( parms, 'mdAutoFocus', true ));

        if( parms.mdBeforeClose ){
            this._beforeclose.set( parms.mdBeforeClose );
        }
        if( parms.mdBody ){
            this._body.set( parms.mdBody );
        }
        if( parms.mdButtons ){
            // no dep change at construction time
            mdButton.setup( this, parms.mdButtons );
        }
        if( parms.mdClasses ){
            this._classes.set( parms.mdClasses );
        }
        if( parms.mdClassesBody ){
            this._classesbody.set( parms.mdClassesBody );
        }
        if( parms.mdClassesContent ){
            this._classescontent.set( parms.mdClassesContent );
        }
        if( parms.mdClassesFooter ){
            this._classesfooter.set( parms.mdClassesFooter );
        }
        if( parms.mdClassesHeader ){
            this._classesheader.set( parms.mdClassesHeader );
        }

        // be reactive to configuration changes
        Tracker.autorun(() => {
            this._closebackdrop.set( this._argBool( parms, 'mdCloseByBackdrop', Modal.configure().closeByBackdrop ));
        });

        this._closeheader.set( this._argBool( parms, 'mdCloseByHeader', true ));
        this._closekeyboard.set( this._argBool( parms, 'mdCloseByKeyboard', true ));

        if( parms.mdFooter ){
            this._footer.set( parms.mdFooter );
        }

        this._fullscreen.set( this._argBool( parms, 'mdFullScreen', false ));

        if( parms.mdMoveTop ){
            this._movetop.set( parms.mdMoveTop );
        }
        if( parms.mdSizeKey ){
            this._sizekey.set( parms.mdSizeKey );
        }
        if( parms.mdTarget ){
            this._target.set( parms.mdTarget );
        }
        if( parms.mdTitle ){
            this._title.set( parms.mdTitle );
        }

        this._view = Blaze.renderWithData( Template.md_modal, { modal: this }, $( 'body' )[0] );
        //console.debug( this._view );

        return this;
    }

    /**
     * @summary let the application a chance to prevent the close of the modal
     *  If a 'beforeClose() function has been configured, it is expected to return a Promise which must resolve to:
     *  - true to let the modal be closed
     *  - false to prevent the close.
     */
    askClose(){
        //console.debug( 'askToClose()', this );
        const fn = this.beforeClose();
        if( fn && _.isFunction( fn )){
            fn( this.id()).then(( res ) => {
                if( res ){
                    this.close();
                }
            });
        } else {
            this.close();
        }
    }

    /**
     * @summary Getter/Setter
     * @param {Boolean} b whether the dialog should manage itself the focus
     * @returns {Boolean} the autofocus value
     */
    autoFocus( b ){
        if( b !== undefined && _.isBoolean( b )){
            this._autofocus.set( b );
        }
        return this._autofocus.get();
    }

    /**
     * @summary Getter/Setter
     * @param {Function} fn a function to allow the close of the modal
     * @returns {Function} the closing function
     */
    beforeClose( fn ){
        if( fn !== undefined ){
            this._beforeclose.set( fn );
        }
        return this._beforeclose.get() || '';
    }

    /**
     * @summary Getter/Setter
     * @param {String} body the name of the template to be rendered in the dialog body
     * @returns {String} the current body template
     */
    body( body ){
        if( body !== undefined ){
            this._body.set( body );
        }
        return this._body.get() || '';
    }

    /**
     * @summary Getter/Setter
     * @param {String} height the new (minimal) body height
     * @returns {String} the current body height
     *  For now, body
     */
    bodyHeight( height ){
        if( height !== undefined ){
            const $body = $( '.modal#'+this._id ).find( '.modal-body' );
            if( $body ){
                let h = parseInt( $body.height());
                if( height.startsWith( '+' )){
                    h += parseInt( height.substring( 1 ));
                } else if( height.startsWith( '-' )){
                    h -= parseInt( height.substring( 1 ));
                } else {
                    h = parseInt( height );
                }
                $body.height( h );
            }
            this._bodyheight.set( height );
        }
        return this._bodyheight.get() || '';
    }

    /**
     * @summary Add a new button to the end of the current array
     * @param {mdButton} button the button to be added
     * @returns {Boolean} true as the buttons population has changed
     */
    buttonAdd( button ){
        if( this._buttons.value.length ){
            const btn = this._buttons.value[this._buttons.value.length-1];
            btn.last = false;
        }
        button.last = true;
        this._buttons.value.push( button );
        //console.debug( 'buttonAdd()', button );
        return true;
    }

    /**
     * @summary
     * @param {String} button the searched button
     * @returns {jQuery} the found button as a jQuery object, or null
     */
    buttonFind( button ){
        return $( '.md-modal .modal-footer' ).find( '[data-md-btn-id='+button+']' );
    }

    /**
     * @summary
     * @param {String} id the searched button identifier
     * @returns {mdButton} the button instance
     */
    buttonGet( id ){
        let found = null;
        this._buttons.value.every(( btn ) => {
            if( btn.id === id ){
                found = btn;
            }
            return found === null;
        });
        //this._buttons.dep.depend();
        return found;
    }

    /**
     * @summary Getter/Setter
     * @param {String|Object|Array} buttons a list of buttons definitions to be displayed in the standard footer
     * @returns {Array} the current list of mdButton buttons
     *  A reactive data source which depends of the population of the array (which buttons are there) and NOT of their respective content
     *  See mdButton for that
     */
    buttons( buttons ){
        if( buttons ){
            mdButton.setup( this, buttons ) && this._buttons.dep.changed();
        } else {
            this._buttons.dep.depend();
        }
        return this._buttons.value; // array of mdButton's
    }

    /**
     * @summary Reset the list of buttons
     * @returns {Boolean} whether the list of buttons has changed after this reset
     */
    buttonsReset(){
        const count = this._buttons.value.length;
        //console.debug( 'buttonsReset()', count );
        this._buttons.value = [];
        return count > 0;
    }

    /**
     * @summary Getter/Setter
     * @param {String} classes the list of classes to be added to the '.modal'
     * @returns {String} the current list of classes
     */
    classes( classes ){
        if( classes !== undefined ){
            this._classes.set( classes );
        }
        return this._classes.get() || '';
    }

    /**
     * @summary Getter/Setter
     * @param {String} classes the list of classes to be added to the '.modal-body'
     * @returns {String} the current list of classes
     */
    classesBody( classes ){
        if( classes !== undefined ){
            this._classesbody.set( classes );
        }
        return this._classesbody.get() || '';
    }

    /**
     * @summary Getter/Setter
     * @param {String} classes the list of classes to be added to the '.modal-content'
     * @returns {String} the current list of classes
     */
    classesContent( classes ){
        if( classes !== undefined ){
            this._classescontent.set( classes );
        }
        return this._classescontent.get() || '';
    }

    /**
     * @summary Getter/Setter
     * @param {String} classes the list of classes to be added to the '.modal-footer'
     * @returns {String} the current list of classes
     */
    classesFooter( classes ){
        if( classes !== undefined ){
            this._classesfooter.set( classes );
        }
        return this._classesfooter.get() || '';
    }

    /**
     * @summary Getter/Setter
     * @param {String} classes the list of classes to be added to the '.modal-header'
     * @returns {String} the current list of classes
     */
    classesHeader( classes ){
        if( classes !== undefined ){
            this._classesheader.set( classes );
        }
        return this._classesheader.get() || '';
    }

    /**
     * @summary Close the modal
     */
    close(){
        //console.debug( 'closing', '.md-modal .modal#'+this.id());
        $( '.md-modal .modal#'+this.id()).modal( 'hide' );
    }

    /**
     * @summary Getter/Setter
     * @param {Boolean} b whether clicking outside of the dialog should close it
     * @returns {Boolean} whether clicking outside of the dialog should close it
     *  In other terms, should we have a static backdrop ?
     */
    closeByBackdrop( b ){
        if( b === true || b === false ){
            this._closebackdrop.set( b );
        }
        return this._closebackdrop.get();
    }

    /**
     * @summary Getter/Setter
     * @param {Boolean} b whether the header has a close button which let the user close the modal ?
     * @returns {Boolean} whether the header has a close button which let the user close the modal ?
     */
    closeByHeader( b ){
        if( b === true || b === false ){
            this._closeheader.set( b );
        }
        return this._closeheader.get();
    }

    /**
     * @summary Getter/Setter
     * @param {Boolean} b whether Escape key let the user close the modal ?
     * @returns {Boolean} whether Escape key let the user close the modal ?
     */
    closeByKeyboard( b ){
        if( b === true || b === false ){
            this._closekeyboard.set( b );
        }
        return this._closekeyboard.get();
    }

    /**
     * @summary Getter/Setter
     * @param {String} footer the name of the template to be rendered in the dialog footer
     * @returns {String} the current footer template
     */
    footer( footer ){
        if( footer !== undefined ){
            this._footer.set( footer );
        }
        return this._footer.get() || '';
    }

    /**
     * @summary Set the focus on the first inputable field or the last button
     * @param {Object} arg the parameters:
     *  - field: the target field, defaulting to the first inputable field of the body, or the last button
     */
    focus( arg={} ){
        if( arg.field ){
            arg.field.trigger( 'focus' );
        } else {
            const inputable = [ 'INPUT', 'TEXTAREA', 'SELECT' ];
            const _firstStart = function( selector ){
                //console.debug( 'selector', selector );
                let found = null;
                const _firstRec = function( $o ){
                    //console.debug( '$o', $o );
                    $o.each( function( index, element ){
                        const $elt = $( this );
                        //console.debug( '$elt', $elt );
                        if( inputable.includes( $elt[0].nodeName )){
                            found = $elt;
                        } else {
                            _firstRec( $elt.children());
                        }
                        return found === null;
                    });
                };
                const $start = $( selector );
                _firstRec( $start );
                return found;
            };
            let $found = _firstStart( '.modal#'+this._id+' .modal-body' );
            if( !$found || !$found.length ){
                // 'submit' type buttons should be avoided in a SPA-like app
                $found = $( '.modal#'+this._id ).find( '.modal-footer button[type="submit"]' ).first();
            }
            if( !$found || !$found.length ){
                $found = $( '.modal#'+this._id ).find( '.modal-footer button.btn-primary' ).last();
            }
            if( $found && $found.length ){
                if( Modal.configure().verbosity & Modal.C.Verbose.FOCUS ){
                    console.log( 'pwix:modal focus() on', $found );
                }
                //$found.trigger( 'focus' );
                $found.focus();
                $found.select();
            }
        }
    }

    /**
     * @summary Getter/Setter
     * @param {Boolean} fullscreen whether the modal should be displayed in full screen mode
     * @returns {Boolean} the current full screen mode
     */
    fullScreen( fullscreen ){
        if( fullscreen === true || fullscreen === false ){
            this._fullscreen.set( fullscreen );
        }
        return this._fullscreen.get();
    }

    /**
     * @summary Getter
     * @returns {String} the unique identifier
     */
    id(){
        return this._id;
    }

    /**
     * @summary Getter/Setter
     * @param {Integer} move whether the modal should be vertically moved
     * @returns {Integer} the desired move in pixel units
     */
    moveTop( move ){
        if( typeof move !== 'undefined' ){
            this._movetop.set( move );
        }
        return this._movetop.get();
    }

    /**
     * @summary Getter
     * @returns {Object} the parms initially passed by the caller to Modal.run()
     */
    parms(){
        return this._parms;
    }

    /**
     * @summary Getter
     * @returns {String} the name of the localStorage item which stores the width and height
     */
    sizeKey(){
        return this._sizekey.get();
    }

    /**
     * @summary Getter/setter
     * @param {jQuery} target the jQuery object which must receives the dialog events
     * @returns {jQuery} the jQuery object which will receive the dialog events
     *  Will default to the same originating element, and bubble up
     */
    target( target ){
        if( target !== undefined ){
            this._target.set( target );
        }
        return this._target.get() || '';
    }

    /**
     * @summary Getter/Setter
     * @param {String} title the title to be set
     * @returns {String} the currently set dialog title
     */
    title( title ){
        if( title !== undefined ){
            this._title.set( title );
        }
        return this._title.get() || '';
    }
}
