/*
 * pwix:modal/src/client/js/functions.js
 *
 * The public methods exposed through the pwixModal global object.
 */

import { mdModal } from '../classes/md_modal.class.js';

// Life of a modal (birth and death)

/**
 * @summary Close the topmost opened dialog
 * @locus Client
 */
pwixModal.close = function(){
    pwixModal._client.Stack.pop().close();
};

/**
 * @summary Opens a new modal dialog
 * @locus Client
 * @param {Object} parms the running parameters of the new dialog
 * @returns {String} the identifier of this new modal
 */
pwixModal.run = function( parms ){
    const modal = new mdModal( parms );
    pwixModal._client.Stack.push( modal );
    return modal.id();
};

/**
 * @summary Set the events target
 * @locus Client
 * @param {Object} target the jQuery target of the events
 * @param {String} id the identifier of the targeted dialog, defaulting to the topmost
 */
pwixModal.setTarget = function( target, id ){
    const modal = pwixModal._client.Stack.modal( id );
    modal.target( target );
};

// Header management

/**
 * @summary Set the title of the dialog
 * @locus Client
 * @param {String} title the title to be set
 * @param {String} id the identifier of the targeted dialog, defaulting to the topmost
 */
pwixModal.setTitle = function( title, id ){
    const modal = pwixModal._client.Stack.modal( id );
    modal.title( title );
};

// Body management

/**
 * @summary Set the template to be rendered as the modal body
 * @locus Client
 * @param {String} template the name of the template
 * @param {String} id the identifier of the targeted dialog, defaulting to the topmost
 */
pwixModal.setBody = function( template ){
    const modal = pwixModal._client.Stack.modal( id );
    modal.body( template );
};

// Footer management
//  If the caller defines a particular footer template to be rendered, then it must take care itself of managing buttons
//  Buttons here are only manageable if they belong to the standard footer

/**
 * @summary Set the template to be rendered as the modal footer
 * @locus Client
 * @param {String} template the name of the Blaze template
 * @param {String} id the identifier of the targeted dialog, defaulting to the topmost
 */
pwixModal.setFooter = function( template, id ){
    const modal = pwixModal._client.Stack.modal( id );
    modal.footer( template );
};

/**
 * @summary Set the buttons of the currently opened dialog
 * @locus Client
 * @param {Array|String} buttons the button or array of buttons to be set
 *  Only set the provided buttons if valid.
 *  Doesn't provide any default here.
 * @param {String} id the identifier of the targeted dialog, defaulting to the topmost
 * @returns {Boolean} whether the provided buttons were valid and have been set
 */
pwixModal.setButtons = function( buttons, id ){
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
        const modal = pwixModal._client.Stack.modal( id );
        modal.buttons( btns );
    } else {
        console.error( 'invalid provided buttons', buttons );
    }
    return ok;
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
