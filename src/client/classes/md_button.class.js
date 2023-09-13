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
     * @returns {Array} the list of defined buttons
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
            buttons[buttons.length-1].last = true;
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
     * @param {Array} defined the current definition of the buttons
     * @param {String|Object|Array} def the definition of a button
     * @returns {Array} the updated defined list
     */
    static update( defined, sets ){
        //console.debug( 'defined', defined );
        //console.debug( 'sets', sets );
        let asets = _.isArray( sets ) ? sets : [ sets ];
        asets.every(( set ) => {
            //console.debug( 'set', set );
            if( !set.id ){
                console.error( 'identifier is mandatory, not found' );
            } else {
                let found = null;
                defined.every(( def ) => {
                    //console.debug( 'def', def );
                    if( def.id === set.id ){
                        found = def;
                    }
                    return found === null;
                });
                if( !found ){
                    const btn = mdButton.new( set );
                    if( btn ){
                        if( defined.length ){
                            defined[defined.length-1].last = false;
                        }
                        btn.last = true;
                        defined.push( btn );
                    }
                } else {
                    _.merge( found, set );
                    // setup the reactive vars
                    if( Object.keys( set ).includes( 'enabled' ) && _.isBoolean( set.enabled )){
                        found._enabled.set( set.enabled );
                    }
                }
            }
            return true;
        });
        return defined;
    }

    // private data
    //

    _enabled = new ReactiveVar( true );

    // private methods
    //

    // public data
    //

    id = null;
    parms = null;

    /**
     * Constructor
     * @param {String|Object} def the button definition
     * @return {mdButton}
     */
    constructor( def ){
        this.id = def.id;
        this.parms = def;

        // initialize the enabled rv
        if( Object.keys( def ).includes( 'enabled' ) && _.isBoolean( def.enabled )){
            this._enabled.set( def.enabled );
        }

        return this;
    }

    /**
     * @return {String} the classes to set to the button
     */
    classes(){
        return this.parms.classes || ( this.last ? 'btn-primary' : 'btn-secondary' );
    }

    /**
     * @return {Boolean} whether the button dismiss the dialog
     */
    dismiss(){
        return Object.keys( this.parms ).includes( 'dismiss' ) && _.isBoolean( this.parms.dismiss ) ? this.parms.dismiss : undefined;
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
        return this.parms.html || '';
    }

    /**
     * @return {String} the label of the button
     */
    label(){
        return this.parms.label || ( Object.keys( Modal.C.Button ).includes( this.id ) ? pwixI18n.label( I18N, this.id ) : this.id );
    }

    /**
     * @return {String} the name of the button
     */
    name(){
        return this.parms.name || this.id;
    }

    /**
     * @return {String} the type of the button
     */
    type(){
        return this.parms.type || 'button';
    }
}
