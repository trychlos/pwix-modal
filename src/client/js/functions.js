/*
 * pwix:modal/src/client/js/functions.js
 *
 * The public methods exposed through the Modal global object.
 */

import _ from 'lodash';

import { mdModal } from '../classes/md_modal.class.js';

/**
 * @summary Get/set the function which allow the modal closing
 * @locus Client
 * @param {Function} fn the function to be set
 * @param {String} id the identifier of the targeted dialog, defaulting to the topmost
 * @returns {Function} the closing function
 */
Modal.beforeClose = function( fn, id ){
    const modal = Modal._client.Stack.modal( id );
    if( modal ){
        return modal.beforeClose( fn );
    }
};

/**
 * @summary Enable/disable a button
 *  Only if a specific footer has not been set via Modal.setFooter()
 * @locus Client
 * @param {String} button the button to enable/disable
 * @param {Boolean} enable whether the button should be enabled
 * @param {String} id the identifier of the targeted dialog, defaulting to the topmost
 */
Modal.buttonEnable = function( button, enable, id ){
    const btn = Modal.buttonFind( button, id );
    if( btn ){
        btn.prop( 'disabled', !enable );
    } else {
        console.error( 'button not found', button, id );
    }
};

/**
 * @summary Find a button element
 *  Only if a specific footer has not been set via Modal.setFooter()
 * @locus Client
 * @param {String} button the button to search for
 * @param {String} id the identifier of the targeted dialog, defaulting to the topmost
 * @eturns {Object} the found button as a jQuery object, or null
 */
Modal.buttonFind = function( button, id ){
    const modal = Modal._client.Stack.modal( id );
    if( modal ){
        return modal.buttonFind( button );
    }
};

/**
 * @summary Close the topmost opened dialog
 * @locus Client
 */
Modal.close = function(){
    const modal = Modal._client.Stack.pop();
    if( modal ){
        modal.close();
    }
};

/**
 * @locus Client
 * @returns {Integer} the count of opened modals
 */
Modal.count = function(){
    return Modal._client.Stack.count();
};

/**
 * @locus Client
 * @return {Array} known buttons
 */
Modal.knownButtons = function(){
    console.warn( 'pwix:modal knownButtons() obsolete method, use Object.keys( Modal.C.Button )' );
    return Object.keys( Modal.C.Button );
};

/**
 * @summary Opens a new modal dialog
 * @locus Client
 * @param {Object} parms the running parameters of the new dialog
 * @returns {String} the identifier of this new modal
 */
Modal.run = function( parms ){
    const modal = new mdModal( parms );
    Modal._client.Stack.push( modal );
    return modal.id();
};

/**
 * @summary Set the template to be rendered as the modal body
 * @locus Client
 * @param {String} template the name of the template
 * @param {String} id the identifier of the targeted dialog, defaulting to the topmost
 */
Modal.setBody = function( template, id ){
    const modal = Modal._client.Stack.modal( id );
    if( modal ){
        modal.body( template );
    }
};

/**
 * @summary Set the buttons of the currently opened dialog
 *  Only if a specific footer has not been set via Modal.setFooter()
 * @locus Client
 * @param {Array|String|Object} buttons the buttons to be set
 * @param {String} id the identifier of the targeted dialog, defaulting to the topmost
 * @returns {Integer} the count of valid buttons installed
 */
Modal.setButtons = function( buttons, id ){
    const installable = mdModal.CheckButtons( buttons );
    if( installable.length > 0 ){
        const modal = Modal._client.Stack.modal( id );
        if( modal ){
            modal.buttons( installable );
        }
    }
    return installable.length;
};

/**
 * @summary Set the classes of the dialog
 * @locus Client
 * @param {String} classes the classes to be added to the '.modal' element
 * @param {String} id the identifier of the targeted dialog, defaulting to the topmost
 */
Modal.setClasses = function( classes, id ){
    const modal = Modal._client.Stack.modal( id );
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
Modal.setFooter = function( template, id ){
    const modal = Modal._client.Stack.modal( id );
    if( modal ){
        modal.footer( template );
    }
};

/**
 * @summary Set the events target
 *  OBSOLETED
 *  WILL BE REMOVED ON 2.0 VERSION
 */
Modal.setTarget = function(){
    console.warn( 'pwix:modal setTarget() obsoleted method, redirected to target()' );
    Modal.target( ...arguments );
};

/**
 * @summary Set the title of the dialog
 * @locus Client
 * @param {String} title the title to be set
 * @param {String} id the identifier of the targeted dialog, defaulting to the topmost
 */
Modal.setTitle = function( title, id ){
    const modal = Modal._client.Stack.modal( id );
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
Modal.target = function( o ){
    //console.debug( o );
    let modal;
    if( o ){
        if( _.isObject( o )){
            if( o.target ){
                modal = Modal._client.Stack.modal( o.id );
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
        modal = Modal._client.Stack.modal();
    }
    return modal ? modal.target() : null;
};
