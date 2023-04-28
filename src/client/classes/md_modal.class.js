/*
 * pwix:modal/src/client/classes/md_modal.class.js
 *
 * This is the class which manages the modal dialogs.
 */

import { Random } from 'meteor/random';

import '../../common/js/index.js';

import '../components/md_modal/md_modal.js';

export class mdModal {

    // private data
    //

    // a unique dynamically allocated identifier of this modal
    _id = null;

    // initial parameters
    _parms = null;

    // the last version of the parameters
    _body = new ReactiveVar( null );
    _buttons = new ReactiveVar( null );
    _classes = new ReactiveVar( null );
    _footer = new ReactiveVar( null );
    _target = new ReactiveVar( null );
    _title = new ReactiveVar( null );
    _sizekey = new ReactiveVar( null );

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

        if( parms.mdBody ){
            this._body.set( parms.mdBody );
        }
        if( parms.mdButtons ){
            this._buttons.set( parms.mdButtons );
        }
        if( parms.mdClasses ){
            this._classes.set( parms.mdClasses );
        }
        if( parms.mdFooter ){
            this._footer.set( parms.mdFooter );
        }
        if( parms.mdTarget ){
            this._target.set( parms.mdTarget );
        }
        if( parms.mdTitle ){
            this._title.set( parms.mdTitle );
        }
        if( parms.mdSizeKey ){
            this._sizekey.set( parms.mdSizeKey );
        }

        Blaze.renderWithData( Template.md_modal, { modal: this }, $( 'body' )[0] );

        return this;
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
     * @summary
     * @param {String} button the searched button
     * @returns {jQuery} the found button as a jQuery object, or null
     */
    buttonFind( button ){
        return $( '.md-modal .modal-footer' ).find( '[data-pwix-btn='+button+']' );
    }

    /**
     * @summary Getter/Setter
     * @param {Array} buttons the list of buttons to be displayed in the standard footer
     * @returns {Array} the current list of buttons
     */
    buttons( buttons ){
        if( buttons !== undefined ){
            this._buttons.set( buttons );
        }
        return this._buttons.get() || [ MD_BUTTON_OK ];
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
     * @summary Close the modal
     */
    close(){
        $( '.md-modal .modal#'+this.id()).modal( 'hide' );
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
     * @summary Getter
     * @returns {String} the unique identifier
     */
    id(){
        return this._id;
    }

    /**
     * @summary Getter
     * @returns {Object} the parms initially passed by the caller to pwixModal.run()
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
