/*
 * pwix:modal/src/client/classes/md_stack.class.js
 *
 * This is the class which manages the stack of opened dialogs.
 * Because there is only one stack, this is a _singleton.
 */

import '../../common/js/index.js';

import { mdModal } from './md_modal.class.js';

export class mdStack {

    // static data
    //
    static _singleton = null;

    // the starting z-index level
    static zIndexStart = 1000;

    // the computing tick
    static zIndexTick = 10;

    // private data
    //
    // the stack itself
    _stack = [];

    /**
     * Constructor
     * @return {mdStack}
     */
    constructor(){
        if( mdStack._singleton ){
            console.log( 'returning already instanciated mdStack._singleton' );
            return mdStack._singleton;
        }

        mdStack._singleton = this;
        return this;
    }

    /**
     * @summary Given the configured contentClassesArray first, and the place of this modal in the stack, returns the corresponding n'th item of the array
     * @param {String} the modal identifier
     * @returns {String} the n-th item of the configured array
     */
    contentClassesArray( modalId ){
        const classes = Modal.configure().contentClassesArray;
        let res = '';
        if( classes && Array.isArray( classes ) && classes.length ){
            const found = this.index( modalId );
            if( found >= 0 ){
                const nth = found % classes.length;
                res = classes[nth];
            }
        }
        return res;
    }

    /**
     * @returns {Integer} the count of opened modals
     */
    count(){
        return this._stack.length;
    }

    /**
     * @summary Make sure each modal in on top of the previous ones
     * @returns {Integer} the first z-index level (display of the backdrops)
     */
    firstZindex(){
        return mdStack.zIndexStart;
    }

    /**
     * @summary Find the searched for modal
     * @param {String} id the identifier of the searched modal, may be undefined
     * @returns {Integer} the found modal, or -1
     * @throws {Error} if the modal is not found
     */
    index( id ){
        let found = -1;
        if( this._stack.length ){
            if( id ){
                for( let i=0 ; i<this._stack.length ; ++i ){
                    const m = this._stack[i];
                    if( m.id() === id ){
                        found = i;
                        break;
                    }
                }
                if( found === -1 ){
                    throw new Error( 'modal not found', id );
                }
            } else {
                found = this._stack.length - 1;
            }
        } else if( Modal._conf.verbosity & Modal.C.Verbose.NOMODAL ){
            if( id ){
                console.warn( 'pwix:modal trying to find a modal while none is opened', id );
            } else {
                console.warn( 'pwix:modal trying to find an undefined modal' );
            }
        }
        return found;
    }

    /**
     * @summary Make sure each modal in on top of the previous ones
     * @returns {Integer} the z-index level of the last modal
     */
    lastZindex(){
        if( !this._stack.length ){
            throw new Error( 'trying to compute the z-index of a modal while none is opened' );
        }
        return mdStack.zIndexStart + ( mdStack.zIndexTick * this._stack.length );
    }

    /**
     * @summary Find the searched for modal
     * @param {String} id the identifier of the searched modal, may be undefined
     * @returns {mdModal} either the identified modal, or the topmost one
     * @throws {Error} if no modal is currrently opened
     * @throws {Error} if an identified modal is not found
     */
    modal( id ){
        let modal = null;
        const found = this.index( id );
        if( found >= 0 ){
            modal = this._stack[found];
        }
        return modal;
    }

    /**
     * @summary Remove the topmost dialog from the stack
     * @returns {mdModal} the removed dialog which was the topmost
     */
    pop(){
        if( this.count()){
            if( Modal._conf.verbosity & Modal.C.Verbose.STACK ){
                console.log( 'pwix:modal poping from stack (length='+this.count()+')' );
            }
            //console.debug( 'before pop length', this.count());
            return this._stack.pop();
        }
        console.error( 'trying to pop a modal while none is opened' );
        return null;
    }

    /**
     * @summary Push on top of the stack the last opened dialog
     * @param {mdModal} modal the newly instanciated (being created and rendered) modal
     */
    push( modal ){
        if( !modal || !( modal instanceof mdModal )){
            throw new Error( 'expecting mdModal instance, found', modal );
        }
        if( Modal._conf.verbosity & Modal.C.Verbose.STACK ){
            console.log( 'pwix:modal pushing into stack (length='+this.count()+')' );
        }
        this._stack.push( modal );
        //console.debug( 'after push length', this.count());
    }
}
