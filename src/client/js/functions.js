/*
 * pwix:modal/src/client/js/functions.js
 *
 * The public methods exposed through the pwixModal global object.
 */

import { mdModal } from '../classes/md_modal.class.js';

// https://stackoverflow.com/questions/8511281/check-if-a-value-is-an-object-in-javascript
// make sure we have a valid object
const _isJSObject = function( obj ){
    return obj && typeof obj === 'object' && !Array.isArray( obj );
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
 * @returns {String} the identifier of this new modal
 */
pwixModal.run = function( parms ){
    const modal = new mdModal( parms );
    pwixModal._client.Stack.push( modal );
    return modal.id();
};

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
 * @summary Set the events target
 *  OBSOLETED
 *  WILL BE REMOVED ON 2.0 VERSION
 */
pwixModal.setTarget = function(){
    console.warn( 'pwix:modal setTarget() obsoleted method, redirected to target()' );
    pwixModal.target( ...arguments );
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

/**
 * @summary Get or set the events target
 * @locus Client
 * @param {Object} o an optional object which contains needed parameters to act as a setter
 *  - target: a jQuery object which is to be set as the target of the modal
 *  - id: a string identifier which identifies the modal, defaulting to the topmost one
 * @returns {jQuery} the target of the modal, either explicitely identified or the topmost one, or null
 */
pwixModal.target = function( o ){
    //console.debug( o );
    let modal;
    if( o ){
        if( _isJSObject( o )){
            if( o.target ){
                modal = pwixModal._client.Stack.modal( o.id );
                if( modal ){
                    modal.target( o.target );
                }
            } else {
                console.error( 'pwix:modal target() expects the Object argument provides a \'target\' jQuery object, found', o.target );
            }
        } else {
            console.error( 'pwix:modal target() expects an Object argument, found', o );
        }
    } else {
        modal = pwixModal._client.Stack.modal();
    }
    return modal ? modal.target() : null;
};
