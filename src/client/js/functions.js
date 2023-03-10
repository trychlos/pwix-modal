/*
 * pwix:modal/src/client/js/functions.js
 *
 * The public methods exposed through the pwixModal global object.
 */

import { mdModal } from '../classes/md_modal.class.js';

// Life of a modal (birth and death)

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
    if( modal ){
        modal.target( target );
    }
};

/**
 * @summary Close the topmost opened dialog
 * @locus Client
 */
pwixModal.close = function(){
    const modal = pwixModal._client.Stack.pop();
    if( modal ){
        modal.close();
    }
};

/**
 * @locus Client
 * @returns {Integer} the count of opened modals
 */
pwixModal.count = function(){
    return pwixModal._client.Stack.count();
};

// Header management

/**
 * @summary Set the classes of the dialog
 * @locus Client
 * @param {String} classes the classes to be added to the '.modal' element
 * @param {String} id the identifier of the targeted dialog, defaulting to the topmost
 */
pwixModal.setClasses = function( classes, id ){
    const modal = pwixModal._client.Stack.modal( id );
    if( modal ){
        modal.classes( classes );
    }
};

/**
 * @summary Set the title of the dialog
 * @locus Client
 * @param {String} title the title to be set
 * @param {String} id the identifier of the targeted dialog, defaulting to the topmost
 */
pwixModal.setTitle = function( title, id ){
    const modal = pwixModal._client.Stack.modal( id );
    if( modal ){
        modal.title( title );
    }
};

// Body management

/**
 * @summary Set the template to be rendered as the modal body
 * @locus Client
 * @param {String} template the name of the template
 * @param {String} id the identifier of the targeted dialog, defaulting to the topmost
 */
pwixModal.setBody = function( template, id ){
    const modal = pwixModal._client.Stack.modal( id );
    if( modal ){
        modal.body( template );
    }
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
    if( modal ){
        modal.footer( template );
    }
};

/**
 * @summary Enable/disable a button
 *  Only if a specific footer has not been set via pwixModal.setFooter()
 * @locus Client
 * @param {String} button the button to enable/disable
 * @param {Boolean} enable whether the button should be enabled
 * @param {String} id the identifier of the targeted dialog, defaulting to the topmost
 */
pwixModal.buttonEnable = function( button, enable, id ){
    const btn = pwixModal.buttonFind( button, id );
    if( btn ){
        btn.prop( 'disabled', !enable );
    } else {
        console.error( 'button not found', button, id );
    }
};

/**
 * @summary Find a button element
 *  Only if a specific footer has not been set via pwixModal.setFooter()
 * @locus Client
 * @param {String} button the button to search for
 * @param {String} id the identifier of the targeted dialog, defaulting to the topmost
 * @eturns {Object} the found button as a jQuery object, or null
 */
pwixModal.buttonFind = function( button, id ){
    const modal = pwixModal._client.Stack.modal( id );
    if( modal ){
        return modal.buttonFind( button );
    }
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
 * @summary Set the buttons of the currently opened dialog
 *  Only if a specific footer has not been set via pwixModal.setFooter()
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
        if( modal ){
            modal.buttons( btns );
        }
    } else {
        console.error( 'invalid provided buttons', buttons );
    }
    return ok;
};
