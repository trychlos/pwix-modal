/*
 * pwix:modal/src/client/classes/md_stack.class.js
 *
 * This is the class which manages the stack of opened dialogs.
 * Because there is only one stack, this is a _singleton.
 */

import { Logger } from 'meteor/pwix:logger';

import '../../common/js/index.js';

import { mdModal } from './md_modal.class.js';

const logger = Logger.get();

export class mdStack {

    // static data
    //
    static _singleton = null;

    // the starting z-index level
    static zIndexStart = 1000;

    // the computing tick
    // each modal uses two z-index levels: one of the backdrop whether it is visible or not, and the second for the modal itself.
    static zIndexTick = 2;

    // private data
    //
    // the stack itself
    _stack = [];

    /**
     * @constructor
     * @return {mdStack}
     */
    constructor(){
        if( mdStack._singleton ){
            logger.info( 'mdStack.mdStack() returning already instanciated mdStack._singleton' );
            return mdStack._singleton;
        }

        mdStack._singleton = this;
        return this;
    }

    /**
     * @returns {Number} the backdrop opacity
     */
    backdropOpacity( id ){
        let opacity = Modal.configure().backdropOpacity;
        return opacity;
    }

    /**
     * @returns {Boolean} whether this backdrop is visible or not
     */
    backdropVisible( id ){
        let visible = Modal.configure().backdropVisible;
        return visible;
    }

    /**
     * @returns {Integer} the z-index of the backdrop for the specified modal
     *  Rationale:
     *    Each modal has its own backdrop created by bootstrap
     *    They are stacked as:
     *              backdrop zindex                 modal zindex
     *  modal #1:   zIndexStart+0                   zIndexStart+1
     *  modal #2:   zIndexStart+zIndexTick+0        zIndexStart+zIndexTick+1
     *  modal #3:   zIndexStart+(2*zIndexTick)+0    zIndexStart+(2*zIndexTick=+1
     *  ...
     */
    backdropZIndex( id ){
        const idx = this.index( id );
        let zindex = mdStack.zIndexStart+0;
        if( idx >=  0 ){
            zindex += idx * ( mdStack.zIndexTick );
        }
        return zindex;
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
     * @returns {Integer} the z-index of the modal content
     *  Rationale: see backdropZIndex()
     */
    contentZIndex( id ){
        const idx = this.index( id );
        let zindex = mdStack.zIndexStart+1;
        if( idx >=  0 ){
            zindex += idx * ( mdStack.zIndexTick );
        }
        return zindex;
    }

    /**
     * @returns {Integer} the count of opened modals
     */
    count(){
        return this._stack.length;
    }

    /**
     * @summary Find the searched for modal
     * @param {String} id the identifier of the searched modal, may be undefined
     * @returns {Integer} the index of the found modal in the stack, or -1
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
        } else if( Modal.configure().verbosity & Modal.C.Verbose.NOMODAL ){
            if( id ){
                logger.warn( 'mdStack.index() trying to find a modal while none is opened', id );
            } else {
                logger.warn( 'mdStack.index() trying to find an undefined modal' );
            }
        }
        return found;
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
            logger.verbose({ verbosity: Modal.configure().verbosity, against: Modal.C.Verbose.STACK }, 'mdModal.pop() from stack (length='+this.count()+')' );
            //logger.debug( 'before pop length', this.count());
            const modal = this._stack.pop();
            // set the focus on the new topmost modal
            const topmost = this.topmost();
            if( topmost ){
                topmost.focus();
            }
            // and reactivate its backdrop
            const $backdrops = $( 'body div.modal-backdrop' );
            if( $backdrops.length ){
                $( $backdrops[$backdrops.length-1] ).css({
                    display: modal.backdropVisible() ? 'block' : 'none'
                });
            }
            return modal;
        }
        logger.error( 'mdModal.pop() trying to pop a modal while none is opened' );
        return null;
    }

    /**
     * @summary Push on top of the stack the last opened dialog
     * @param {mdModal} modal the newly instanciated (being created and rendered) modal
     */
    push( modal ){
        if( !modal || !( modal instanceof mdModal )){
            logger.error( 'push() expects an instance of mdModal, got', modal, 'throwing...' );
            throw new Error( 'Bad data type' );
        }
        logger.verbose({ verbosity: Modal.configure().verbosity, against: Modal.C.Verbose.STACK }, 'push() into stack (length='+this.count()+')' );
        // before pushing this new modal, we make all other with an invisible backdrop
        $( 'body div.modal-backdrop' ).css({
            display: 'none'
        });
        // and push this new modal
        this._stack.push( modal );
    }

    /**
     * @returns {mdModal} the topmost modal or null
     */
    topmost(){
        let topmost = null;
        const count = this.count();
        if( count > 0 ){
            topmost = this._stack[count-1];
        }
        return topmost;
    }
}
