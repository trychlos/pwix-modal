/*
 * pwix:modal/src/client/classes/md_button.class.js
 */

import _ from 'lodash';

import { ReactiveVar } from 'meteor/reactive-var';

import '../../common/js/index.js';

export class mdButton {

    // static data
    //

    // static methods
    //

    /**
     * @summary Define the initial set of buttons of a modal
     *  set 'last=true' on the last button
     * @param {String|Object|Array} defs the definition of the buttons
     * @returns {Array} the list of defined buttons, each one as an independant reactive var which contains a mdButton
     */
    static define( defs ){
        //console.debug( 'define input', defs );
        let buttons = [];
        let ids = {};
        const adefs = _.isArray( defs ) ? defs : [ defs ];
        adefs.every(( def ) => {
            const btn = mdButton.new( def );
            if( btn ){
                // make sure the identifier is unique
                if( Object.keys( ids ).includes( btn.id )){
                    console.error( 'already defined button identifier:', btn.id );
                } else {
                    ids[btn.id] = btn;
                    buttons.push( btn );
                }
            }
            return true;
        });
        // flag the last object (will be displayed on rightest side)
        if( buttons.length ){
            const btn = buttons[buttons.length-1];
            btn.last = true;
        }
        return buttons;
    }

    /**
     * @summary Define a new button
     * @param {String|Object} def the definition of a button
     * @returns {mdButton} a new button or null
     */
    static new( def ){
        let btn = null;
        // identifier is mandatory
        let o = {};
        if( _.isString( def )){
            o.id = def;
        } else if( !def.id || !_.isString( def.id )){
            console.error( 'identifier is mandatory, not found' );
        } else {
            o = { ...def };
        }
        if( o.id ){
            btn = new mdButton( o );
        }
        return btn;
    }

    /**
     * @summary Update one or several existing button(s)
     * @param {mdModal} modal the calling mdModal
     * @param {String|Object|Array} defs the definition of one or more buttons
     *  Contrarily to the initial definition, this update MUST have an id in each provided object
     * @returns {Array} the updated defined list
     */
    static update( modal, defs ){
        let adefs = _.isArray( defs ) ? defs : [ defs ];
        adefs.every(( def ) => {
            if( !def.id ){
                console.error( 'identifier is mandatory, not found' );
            } else if( def.id === Modal.C.ButtonExt.RESET ){
                modal.buttonsReset();
            } else {
                let found = modal.buttonGet( def.id );
                if( found ){
                    found._setDef( def );
                } else {
                    const btn = mdButton.new( def );
                    if( btn ){
                        modal.buttonAdd( btn );
                    }
                }
            }
            return true;
        });
    }

    // private data
    //

    _cb = new ReactiveVar( null );
    _classes = new ReactiveVar( null );
    _dismiss = new ReactiveVar( null );
    _enabled = new ReactiveVar( true );
    _html = new ReactiveVar( null );
    _label = new ReactiveVar( null );
    _name = new ReactiveVar( null );
    _type = new ReactiveVar( 'button' );

    // private methods
    //

    _setBool( arg, def ){
        if( arg === true || arg == false ){
            return arg;
        }
        if( def === true || def === false ){
            return def;
        }
        return undefined;
    }

    _setDef( def ){
        if( Object.keys( def ).includes( 'cb' )){
            this._cb.set( def.cb );
        }
        if( Object.keys( def ).includes( 'classes' )){
            this._classes.set( def.classes );
        }
        if( Object.keys( def ).includes( 'dismiss' ) && ( def.dismiss === true || def.dismiss === false )){
            this._dismiss.set( def.dismiss );
        }
        if( Object.keys( def ).includes( 'enabled' ) && ( def.enabled === true || def.enabled === false )){
            this._enabled.set( def.enabled );
        }
        if( Object.keys( def ).includes( 'html' )){
            this._html.set( def.html );
        }
        if( Object.keys( def ).includes( 'label' )){
            this._label.set( def.label );
        }
        if( Object.keys( def ).includes( 'name' )){
            this._name.set( def.name );
        }
        if( Object.keys( def ).includes( 'type' )){
            this._type.set( def.type );
        }
    }

    // public data
    //

    id = null;

    /**
     * Constructor
     * @param {String|Object} def the button definition
     * @return {mdButton}
     */
    constructor( def ){
        this.id = def.id;

        this._setDef( def );
        if( !this._name.get()){
            this._name.set( this.id );
        }

        //console.debug( this );
        return this;
    }

    /**
     * @return {Function} the calback function associated to the button
     */
    cb(){
        return this._cb.get();
    }

    /**
     * @return {String} the classes to set to the button
     */
    classes(){
        return this._classes.get() || ( this.last ? 'btn-primary' : 'btn-secondary' );
    }

    /**
     * @return {Boolean} whether the button dismiss the dialog
     */
    dismiss(){
        const dismiss = this._dismiss.get();
        return dismiss === true || dismiss === false ? dismiss : undefined;
    }

    /**
     * @return {Boolean} whether the button is enabled
     */
    enabled(){
        return this._enabled.get();
    }

    /**
     * @return {String} the HTML definition of the button, or ''
     */
    html(){
        return this._html.get() || '';
    }

    /**
     * @return {String} the label of the button
     */
    label(){
        return this._label.get() || ( Object.keys( Modal.C.Button ).includes( this.id ) ? pwixI18n.label( I18N, this.id ) : this.id );
    }

    /**
     * @return {String} the name of the button
     */
    name(){
        return this._name.get() || this.id;
    }

    /**
     * @return {String} the type of the button
     */
    type(){
        return this._type.get() || 'button';
    }
}
