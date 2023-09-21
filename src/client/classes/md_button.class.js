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
     * @summary Update one or several existing button(s)
     * @param {mdModal} modal the calling mdModal
     * @param {String|Object|Array} defs the definition of one or more buttons
     *  Contrarily to the initial definition, this update MUST have an id in each provided object
     * @returns {Boolean} whether we have changed (reset and/or added) the buttons population
     */
    static setup( modal, defs ){
        let adefs = _.isArray( defs ) ? defs : [ defs ];
        //console.debug( 'adefs', adefs );
        let changed = false;
        adefs.every(( def ) => {
            if( def ){
                //console.debug( 'examining', def );
                let o = {};
                if( _.isString( def )){
                    o.id = def;
                } else if( !def.id || !_.isString( def.id )){
                    console.error( 'identifier is mandatory, not found' );
                } else {
                    o = { ...def };
                }
                //console.debug( 'built', o );
                if( o.id && _.isString( o.id )){
                    if( o.id === Modal.C.ButtonExt.RESET ){
                        if( modal.buttonsReset()){
                            changed = true;
                        }
                    } else {
                        const ifExist = ( o.ifExist === true || o.ifExist === false ) ? o.ifExist : false;
                        //console.debug( 'ifExist', ifExist );
                        let found = modal.buttonGet( o.id );
                        if( found ){
                            //console.debug( 'found', found );
                            found._setDef( o );
                        } else if( !ifExist ){
                            if( modal.buttonAdd( new mdButton( o ))){
                                changed = true;
                            }
                        } else {
                            console.log( 'pwix:modal not applying definition as button doesn\'t exist' );
                        }
                    }
                } else {
                    console.error( 'o is invalid', o );
                }
            }
            return true;
        });
        return changed;
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
        } else if( def.id === Modal.C.Button.CANCEL || def.id === Modal.C.Button.CLOSE ){
            this._dismiss.set( true );
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
        this.parms = def;
    }

    // public data
    //

    id = null;
    parms = null;

    /**
     * Constructor
     * @param {Object} def the button definition
     * @return {mdButton}
     */
    constructor( def ){
        this.id = def.id;

        this._setDef( def );

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
        return ( dismiss === true || dismiss === false ) ? dismiss : undefined;
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
