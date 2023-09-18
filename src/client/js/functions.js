/*
 * pwix:modal/src/client/js/functions.js
 *
 * The public methods exposed through the Modal global object.
 */

import _ from 'lodash';

import { mdModal } from '../classes/md_modal.class.js';

/**
 * @summary Get/set the function which allow the modal closing
 *  OBSOLETED
 *  WILL BE REMOVED ON 2.0 VERSION
 */
Modal.beforeClose = function( fn, id ){
    console.warn( 'pwix:modal beforeClose() method is obsolete, redirected to set()' );
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
    console.warn( 'pwix:modal buttonEnable() method is obsolete, redirected to set()' );
    let o = { buttons: { id: button, enabled: enable }};
    if( id ){
        o.id = id;
    }
    Modal.set( o );
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
    const modal = Modal._stack.modal( id );
    if( modal ){
        return modal.buttonFind( button );
    }
};

/**
 * @summary Close the topmost opened dialog
 * @locus Client
 */
Modal.close = function(){
    //console.error( 'a console error to trace the call stack' );
    const modal = Modal._stack.modal();
    if( modal ){
        modal.close();
    }
};

/**
 * @locus Client
 * @returns {Integer} the count of opened modals
 */
Modal.count = function(){
    return Modal._stack.count();
};

/**
 * @summary Set the focus on the first inputable field or the last button
 * @locus Client
 */
Modal.focus = function( arg ){
    const modal = Modal._stack.modal( arg.id );
    modal.focus( arg );
};

/**
 * @locus Client
 *  OBSOLETED
 *  WILL BE REMOVED ON 2.0 VERSION
 */
Modal.knownButtons = function(){
    console.warn( 'pwix:modal knownButtons() method is obsolete, use Object.keys( Modal.C.Button )' );
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
 */
Modal.set = function( arg ){
    //console.debug( arg );
    const modal = Modal._stack.modal( arg.id );
    if( Object.keys( arg ).includes( 'autoFocus' )){
        modal.autoFocus( arg.autoFocus );
    }
    if( Object.keys( arg ).includes( 'beforeClose' )){
        modal.beforeClose( arg.beforeClose );
    }
    if( Object.keys( arg ).includes( 'body' )){
        modal.body( arg.body );
    }
    if( Object.keys( arg ).includes( 'buttons' )){
        modal.buttons( arg.buttons );
    }
    if( Object.keys( arg ).includes( 'classes' )){
        modal.classes( arg.classes );
    }
    if( Object.keys( arg ).includes( 'classesBody' )){
        modal.classesBody( arg.classesBody );
    }
    if( Object.keys( arg ).includes( 'classesContent' )){
        modal.classesContent( arg.classesContent );
    }
    if( Object.keys( arg ).includes( 'classesFooter' )){
        modal.classesFooter( arg.classesFooter );
    }
    if( Object.keys( arg ).includes( 'classesHeader' )){
        modal.classesHeader( arg.classesHeader );
    }
    if( Object.keys( arg ).includes( 'closeByBackdrop' )){
        modal.closeByBackdrop( arg.closeByBackdrop );
    }
    if( Object.keys( arg ).includes( 'closeByHeader' )){
        modal.closeByHeader( arg.closeByHeader );
    }
    if( Object.keys( arg ).includes( 'closeByKeyboard' )){
        modal.closeByKeyboard( arg.closeByKeyboard );
    }
    if( Object.keys( arg ).includes( 'footer' )){
        modal.footer( arg.footer );
    }
    if( Object.keys( arg ).includes( 'fullscreen' )){
        modal.fullScreen( arg.fullscreen );
    }
    if( Object.keys( arg ).includes( 'target' )){
        modal.target( arg.target );
    }
    if( Object.keys( arg ).includes( 'title' )){
        modal.title( arg.title );
    }
};

/**
 * @summary Set the template to be rendered as the modal body
 *  OBSOLETED
 *  WILL BE REMOVED ON 2.0 VERSION
 */
Modal.setBody = function( template, id ){
    console.warn( 'pwix:modal setBody() method is obsolete, redirected to set()' );
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
    console.warn( 'pwix:modal setBody() method is obsolete, redirected to set()' );
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
    console.warn( 'pwix:modal setClasses() method is obsolete, redirected to set()' );
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
    console.warn( 'pwix:modal setFooter() method is obsolete, redirected to set()' );
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
    console.warn( 'pwix:modal setTarget() method is obsolete, redirected to set()' );
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
    console.warn( 'pwix:modal title() method is obsolete, redirected to set()' );
    let o = { title: title };
    if( id ){
        o.id = id;
    }
    Modal.set( o );
};

/**
 * @returns {Object} the current events target for the topmost modal
 */
Modal.target = function(){
    const modal = Modal._stack.modal();
    return modal.target();
};
