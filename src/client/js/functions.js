/*
 * pwix:modal/src/client/js/functions.js
 *
 * The public methods exposed through the Modal global object.
 */

import _ from 'lodash';

import { Logger } from 'meteor/pwix:logger';

import { mdModal } from '../classes/md_modal.class.js';

const logger = Logger.get();

/**
 * @summary Close the topmost opened dialog if the mdBeforeClose() (if exists) returns a Promise which eventually resolves to true.
 *  If the mdBeforeClose(), the function closes the modal.
 * @locus Client
 *  OBSOLETED AS OF v2.5
 *  WILL BE REMOVED ON a LATER VERSION
 */
Modal.askClose = function(){
    logger.warn( 'Modal.askClose() method is obsoleted starting with v2.5 in favor of \'modal.askClose()\'. You should update your code' );
    const modal = Modal.stack.modal();
    if( modal ){
        modal.askClose();
    }
};

/**
 * @summary Get/set the function which allow the modal closing
 *  OBSOLETED
 *  WILL BE REMOVED ON 2.0 VERSION
 */
Modal.beforeClose = function( fn, id ){
    logger.warn( 'Modal.beforeClose() method is obsolete, redirected to set()' );
    let o = { beforeClose: fn };
    if( id ){
        o.id = id;
    }
    Modal.set( o );
};

/**
 * @summary Enable/disable a button
 *  OBSOLETED
 *  WILL BE REMOVED ON 2.0 VERSION
 */
Modal.buttonEnable = function( button, enable, id ){
    logger.warn( 'Modal.buttonEnable() method is obsolete, redirected to set()' );
    let o = { buttons: { id: button, enabled: enable }};
    if( id ){
        o.id = id;
    }
    Modal.set( o );
};

/**
 * @summary Find a button element
 *  OBSOLETED AS OF v2.5
 *  WILL BE REMOVED ON a LATER VERSION
 */
Modal.buttonFind = function( button, id ){
    logger.warn( 'Modal.buttonFind() method is obsoleted starting with v2.5 in favor of \'modal.buttonFind()\'. You should update your code' );
    const modal = Modal.stack.modal( id );
    if( modal ){
        return modal.buttonFind( button );
    }
};

/**
 * @summary Uncondionally close the topmost opened dialog
 *  OBSOLETED AS OF v2.5
 *  WILL BE REMOVED ON a LATER VERSION
 */
Modal.close = function(){
    logger.warn( 'Modal.close() method is obsoleted starting with v2.5 in favor of \'modal.close()\'. You should update your code' );
    const modal = Modal.stack.modal();
    if( modal ){
        modal.close();
    }
};

/**
 * @locus Client
 * @returns {Integer} the count of opened modals
 */
Modal.count = function(){
    return Modal.stack.count();
};

/**
 * @summary Set the focus on the first inputable field or the last button
 * @locus Client
 *  OBSOLETED AS OF v2.5
 *  WILL BE REMOVED ON a LATER VERSION
 */
Modal.focus = function( arg ){
    logger.warn( 'Modal.focus() method is obsoleted starting with v2.5 in favor of \'modal.focus()\'. You should update your code' );
    const modal = Modal.stack.modal( arg.id );
    modal.focus( arg );
};

/**
 * @locus Client
 *  OBSOLETED
 *  WILL BE REMOVED ON 2.0 VERSION
 */
Modal.knownButtons = function(){
    logger.warn( 'Modal.knownButtons() method is obsolete, use Object.keys( Modal.C.Button )' );
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
    return modal.id();
};

/**
 * @summary Generic setter
 * @locus Client
 * @param {Object} arg the argument object
 *  OBSOLETED AS OF v2.5
 *  WILL BE REMOVED ON a LATER VERSION
 */
Modal.set = function( arg ){
    logger.warn( 'Modal.set() method is obsoleted starting with v2.5 in favor of \'modal.set()\'. You should update your code' );
    const modal = Modal.stack.modal( arg.id );
    const dup = _.cloneDeep( arg );
    delete dup.id;
    modal.set( dup );
};

/**
 * @summary Set the template to be rendered as the modal body
 *  OBSOLETED
 *  WILL BE REMOVED ON 2.0 VERSION
 */
Modal.setBody = function( template, id ){
    logger.warn( 'Modal.setBody() method is obsolete, redirected to set()' );
    let o = { body: template };
    if( id ){
        o.id = id;
    }
    Modal.set( o );
};

/**
 * @summary Set the buttons of the currently opened dialog
 *  OBSOLETED
 *  WILL BE REMOVED ON 2.0 VERSION
 */
Modal.setButtons = function( buttons, id ){
    logger.warn( 'Modal.setBody() method is obsolete, redirected to set()' );
    let o = { buttons: buttons };
    if( id ){
        o.id = id;
    }
    Modal.set( o );
};

/**
 * @summary Set the classes of the dialog
 *  OBSOLETED
 *  WILL BE REMOVED ON 2.0 VERSION
 */
Modal.setClasses = function( classes, id ){
    logger.warn( 'Modal.setClasses() method is obsolete, redirected to set()' );
    let o = { classes: classes };
    if( id ){
        o.id = id;
    }
    Modal.set( o );
};

/**
 * @summary Set the template to be rendered as the modal footer
 *  OBSOLETED
 *  WILL BE REMOVED ON 2.0 VERSION
 */
Modal.setFooter = function( template, id ){
    logger.warn( 'Modal.setFooter() method is obsolete, redirected to set()' );
    let o = { footer: template };
    if( id ){
        o.id = id;
    }
    Modal.set( o );
};

/**
 * @summary Set the events target
 *  OBSOLETED
 *  WILL BE REMOVED ON 2.0 VERSION
 */
Modal.setTarget = function( target, id ){
    logger.warn( 'Modal.setTarget() method is obsolete, redirected to set()' );
    let o = { target: target };
    if( id ){
        o.id = id;
    }
    Modal.set( o );
};

/**
 * @summary Set the title of the dialog
 *  OBSOLETED
 *  WILL BE REMOVED ON 2.0 VERSION
 */
Modal.setTitle = function( title, id ){
    logger.warn( 'Modal.title() method is obsolete, redirected to set()' );
    let o = { title: title };
    if( id ){
        o.id = id;
    }
    Modal.set( o );
};

/**
 * @returns {Object} the current events target for the topmost modal
 *  OBSOLETED AS OF v2.5
 *  WILL BE REMOVED ON a LATER VERSION
 */
Modal.target = function(){
    logger.warn( 'Modal.target() method is obsoleted starting with v2.5 in favor of \'modal.target()\'. You should update your code' );
    const modal = Modal.stack.modal();
    return modal.target();
};

/**
 * @returns {Object} the current events target for the topmost modal
 */
Modal.topmost = function(){
    return Modal.stack.modal();
};
