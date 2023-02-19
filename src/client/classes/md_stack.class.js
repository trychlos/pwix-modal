/*
 * pwix:modal/src/client/classes/md_stack.class.js
 *
 * This is the class which manages the stack of opened dialogs.
 * Because there is only one stack, this is a singleton.
 */

import '../../common/js/index.js';

import { mdModal } from './md_modal.class.js';

export class mdStack {

    // static data
    //
    static Singleton = null;

    // the starting z-index level
    static zIndex = 1000;

    // the computing tick
    static tick = 100;

    // static methods
    //

    /**
     * @summary Make sure each modal in on top of the previous ones
     * @returns {Integer} the first z-index level (display of the backdrops)
     */
    static firstZindex(){
        return mdStack.zIndex;
    }

    /**
     * @summary Make sure each modal in on top of the previous ones
     * @returns {Integer} the z-index level of the last modal
     */
    static lastZindex(){
        if( !mdStack.Singleton._stack.length ){
            throw new Error( 'trying to compute the z-index of a modal while none is opened' );
        }
        return mdStack.zIndex + ( mdStack.tick * ( this._stack.length-1 ));
    }

    // private data
    //
    // the stack itself
    _stack = [];

    /**
     * Constructor
     * @return {mdStack}
     */
    constructor(){
        if( mdStack.Singleton ){
            console.log( 'returning already instanciated mdStack.Singleton' );
            return mdStack.Singleton;
        }

        const self = this;

        mdStack.Singleton = self;
        return this;
    }

    /**
     * @summary Find the searched for modal
     * @param {String} id the identifier of the searched modal, may be undefined
     * @returns {mdModal} either the identified modal, or the topmost one
     * @throws {Error} if no modal is currrently opened
     * @throws {Error} if an identified modal is not found
     */
    modal( id ){
        if( !this._stack.length ){
            throw new Error( 'trying to find a modal while none is opened', id );
        }
        let modal = null;
        if( id ){
            this._stack.every(( m ) => {
                if( m.id() === id ){
                    modal = m;
                    return false;
                }
                return true;
            });
            if( !modal ){
                throw new Error( 'modal not found', id );
            }
        } else {
            modal = this._stack[this._stack.length-1];
        }
        return modal;
    }

    /**
     * @summary Remove the topmost dialog from the stack
     * @returns {mdModal} the removed dialog which was the topmost
     */
    pop(){
        if( !this._stack.length ){
            throw new Error( 'trying to pop a modal while none is opened' );
        }
        return this._stack.pop();
    }

    /**
     * @summary Push on top of the stack the last opened dialog
     * @param {mdModal} modal the newly instanciated modal
     */
    push( modal ){
        if( !modal || !( modal instanceof mdModal )){
            throw new Error( 'expecting mdModal instance, found', modal );
        }
        this._stack.push( modal );
    }
}
