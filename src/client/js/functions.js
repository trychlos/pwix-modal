/*
 * pwix:modal/src/client/js/functions.js
 */

import { ReactiveVar } from 'meteor/reactive-var';

import '../components/mdModal/mdModal.js';

pwixModal._buttons = new ReactiveVar( null );
pwixModal._footer = new ReactiveVar( null );
pwixModal._target = new ReactiveVar( null );
pwixModal._template = new ReactiveVar( null );
pwixModal._title = new ReactiveVar( null );

/**
 * @summary Close the opened dialog
 * @locus Client
 */
pwixModal.close = function(){
    $( '.mdModal .modal' ).modal( 'hide' );
};

/**
 * @summary Enable/disable a button
 * @locus Client
 * @param {String} button the button to enable/disable
 * @param {Boolean} enable whether the button should be enabled
 */
pwixModal.enableButton = function( button, enable ){
    const btn = pwixModal.findButton( button );
    if( btn ){
        btn.prop( 'disabled', !enable );
    }
};

/**
 * @summary Find a button element
 * @locus Client
 * @param {String} button the button to search for
 * @eturns {Object} the found button as a jQuery object, or null
 */
pwixModal.findButton = function( button ){
    return $( '.mdModal .modal-footer' ).find( '[data-pwix-btn='+button+']' );
};

/**
 * @locus Client
 * @return {Array} known buttons
 */
pwixModal.knownButtons = function(){
    return [
        MD_BUTTON_OK,
        MD_BUTTON_CANCEL,
        MD_BUTTON_CLOSE,
        MD_BUTTON_SAVE,
        MD_BUTTON_YES,
        MD_BUTTON_NO
    ];
};

/**
 * @summary Opens a new modal dialog
 * @locus Client
 * @param {Object} parms the running parameters of the new dialog
 */
pwixModal.run = function( parms ){
    Blaze.renderWithData( Template.mdModal, parms, $( 'body' )[0] );
};

/**
 * @summary Set the buttons of the currently opened dialog
 * @locus Client
 * @param {Array|String} buttons the button or array of buttons to be set
 *  Only set the provided buttons if valid.
 *  Doesn't provide any default here.
 */
pwixModal.setButtons = function( buttons ){
    const btns = Array.isArray( buttons ) ? buttons : [ buttons ];
    const knowns = pwixModal.knownButtons();
    let ok = true;
    btns.every(( btn ) => {
        if( !knowns.includes( btn )){
            ok = false;
        }
        return ok;
    });
    if( ok ){
        pwixModal._buttons.set( btns );
    } else {
        console.error( 'Invalid provided buttons', buttons );
    }
};

/**
 * @summary Set the template to be rendered as the modal footer
 * @locus Client
 * @param {String} template the name of the Blaze template
 */
pwixModal.setFooter = function( template ){
    if( template ){
        pwixModal._footer.set( template );
    }
};

/**
 * @summary Set the events target
 * @locus Client
 * @param {Object} target the jQuery target of the click events
 */
pwixModal.setTarget = function( target ){
    if( target ){
        pwixModal._target.set( target );
    }
};

/**
 * @summary Set the template to be rendered as the modal body
 * @locus Client
 * @param {String} template the name of the Blaze template
 */
pwixModal.setTemplate = function( template ){
    if( template ){
        pwixModal._template.set( template );
    }
};

/**
 * @summary Set the modal title
 * @locus Client
 * @param {String} title the modal title
 */
pwixModal.setTitle = function( title ){
    if( title ){
        pwixModal._title.set( title );
    }
};
