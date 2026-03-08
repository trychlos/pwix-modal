/*
 * pwix:modal/src/client/components/md_modal/md_modal.js
 *
 * A Bootstrap-based draggable and resizable modal dialog.
 * 
 * Parms:
 * - modal: the mdModal instance
 */

import _ from 'lodash';

import { Logger } from 'meteor/pwix:logger';
import { UIUtils } from 'meteor/pwix:ui-utils';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';

//  provides 'draggable()' and 'resizable()' methods
import 'jquery-ui/dist/jquery-ui.min.js';

import { mdStack } from '../../classes/md_stack.class';

import '../../../common/js/index.js';

import './md_modal.html';
import './md_modal.less';

const logger = Logger.get();

Template.md_modal.onCreated( function(){
    const self = this;
    //logger.log( 'onCreated', self );

    self.MD = {
        // the class added to the body to identify *this* dialog backdrop
        myClass: new ReactiveVar( '' ),

        // the mdModal instance
        modal: new ReactiveVar( null ),

        // various measurements
        measures: new ReactiveDict({}),
        htmlBodyStyles: null,
        modalContentStyles: null,
        modalBodyStyles: null,
        modalHeaderStyles: null,

        // compute min and max width and height
        computeLimits(){
            // body width and height
            this.htmlBodyStyles = getComputedStyle( $( 'body' )[0] );
            const body_width = parseFloat( this.htmlBodyStyles.width );
            this.measures.set( 'body-width', body_width );
            const body_height = parseFloat( this.htmlBodyStyles.height );
            this.measures.set( 'body-height', body_height );
            // modal content margin
            this.modalContentStyles = getComputedStyle( self.$( '.modal-content' )[0] );
            const margin_top = parseFloat( this.modalContentStyles.margin_top );
            this.measures.set( 'modal-margin-top', margin_top );
            // modal body padding
            this.modalBodyStyles = getComputedStyle( self.$( '.modal-body' )[0] );
            const padding = parseFloat( this.modalBodyStyles.paddingLeft );
            this.measures.set( 'modal-padding', padding );
            // modal header height
            this.modalHeaderStyles = getComputedStyle( self.$( '.modal-header' )[0] );
            const header_height = parseFloat( this.modalHeaderStyles.height );
            this.measures.set( 'header-height', header_height );
            // Source - https://stackoverflow.com/a/8876069
            // Posted by ryanve, modified by community. See post 'Timeline' for change history
            // Retrieved 2026-03-08, License - CC BY-SA 4.0
            const vw_width = Math.max( document.documentElement.clientWidth || 0, window.innerWidth || 0 );
            this.measures.set( 'viewport-width', vw_width );
            const vw_height = Math.max( document.documentElement.clientHeight || 0, window.innerHeight || 0 );
            this.measures.set( 'viewport-height', vw_height );
            // optimal width depends of the respective width of the body (and its children), of the footer (and its children)
            // honors the dialog padding
            let width = Math.max( this.computeWidth( '.modal-body' ), this.computeWidth( '.modal-footer' ));
            width += 2*padding;
            this.measures.set( 'width', width );
            // at the moment min width is same than optimal width
            const min_width = width;
            this.measures.set( 'min-width', min_width );
            // current height is just read from content styles
            this.measures.set( 'height', this.modalContentStyles.height );
            // max width and height are 95% of body size ,- taking into account the shift when modals are stacked
            this.measures.set( 'max-width', 0.95 * ( body_width - header_height ));
            this.measures.set( 'max-height', 0.95 * ( body_height - header_height ));
        },

        // compute the max width between a div and its first child
        computeWidth( selector, ){
            let div = self.$( selector );
            let parentWidth = 0;
            let childWidth = 0;
            if( div && div.length ){
                const styles = getComputedStyle( div[0] );
                parentWidth = parseFloat( styles.width ) + parseFloat( styles.marginLeft ) + parseFloat( styles.marginRight );
            }
            div = div.children().first();
            if( div && div.length ){
                const styles = getComputedStyle( div[0] );
                childWidth = parseFloat( styles.width ) + parseFloat( styles.marginLeft ) + parseFloat( styles.marginRight );
            }
            const width = Math.max( parentWidth, childWidth );
            //logger.debug( selector, 'parent', parentWidth, 'child', childWidth, 'width', width );
            return width;
        },

        // if a localStorage key has been provided, get it
        lastSizeGet(){
            const modal = self.MD.modal.get();
            if( modal ){
                const key = modal.sizeKey();
                if( key ){
                    const str = localStorage.getItem( key );
                    if( str ){
                        const words = str.split( ',' );
                        self.$( '.modal-content' ).css({
                            width: words[0],
                            height: words[1]
                        });
                    }
                }
            }
        },

        // if a localStorage key has been provided, set it
        lastSizeSet(){
            const modal = self.MD.modal.get();
            if( modal ){
                const key = modal.sizeKey();
                if( key ){
                    localStorage.setItem( key, self.$( '.modal-content' ).css( 'width' ) + ',' + self.$( '.modal-content' ).css( 'height' ));
                }
            }
        },
    };

    // get the modal instance
    // compute our body class name
    // push this modal in the stack
    self.autorun(() => {
        const modal = Template.currentData().modal;
        if( modal ){
            self.MD.modal.set( modal );
            self.MD.myClass.set( 'pwix-modal-class-'+modal.id());
            Modal.stack.push( modal );
        }
    });
});

Template.md_modal.onRendered( function(){
    const self = this;
    //logger.debug( 'onRendered', self );

    // when the modal is fully rendered, begin the work
    UIUtils.DOM.waitFor( '#'+self.MD.modal.get().id()).then(() => {
        const modal = self.MD.modal.get();
        if( modal ){        
            // show the dialog before anything else
            self.$( '.modal' ).modal( 'show' );
            //logger.debug( 'show' );

            // add a tag class to body element to let the stylesheet identify the modal
            $( 'body' ).addClass( self.MD.myClass.get());

            // make draggable if possible
            if( self.$( '.modal-dialog' ).draggable ){
                self.$( '.modal-dialog' ).draggable({
                    handle: '.modal-header',
                    cursor: 'grab'
                });
            }

            // compute min and max width and height
            self.MD.computeLimits();

            // remove style set by bootstrap
            self.$( '.modal-content' ).removeAttr( 'style' );
            //logger.debug( 'styles removed' );

            // set the backdrop style accordingly (we want it to not be visible unless configured)
            // it is actually created by bootstrap without we can do anything against that - just have to manage it
            const $backdrops = $( 'div.modal-backdrop' );
            if( $backdrops.length ){
                $( $backdrops[$backdrops.length-1] ).css({
                    display: modal.backdropVisible() ? 'block' : 'none',
                    opacity: modal.backdropOpacity(),
                    'z-index': modal.backdropZIndex()
                });
            }
            // setup the content on top of the backdrop
            $( '#'+modal.id()).css({
                'z-index': modal.contentZIndex()
            });
            //logger.debug( 'backdrop z-index', modal.backdropZIndex(), 'modal z-index', modal.contentZIndex());

            // make resizable if possible
            //  it happens that Bootstrap initialize the dialog at a usable height, but may overflow the content width
            if( self.$( '.modal-content' ).resizable ){
                self.$( '.modal-content' ).resizable({
                    handles: 'all',
                    minWidth: self.MD.measures.get( 'min-width' )
                });
            }

            // prepare our modal styles
            const css = ({
                width: self.MD.measures.get( 'width' ),
                minWidth: self.MD.measures.get( 'min-width' ),
                minHeight: self.MD.measures.get( 'min-height' ),
                maxWidth: self.MD.measures.get( 'max-width' ),
                maxHeight: self.MD.measures.get( 'max-height' ),
                top: 0,
                left: 0
            });

            // unless we display the modal in full screen mode, we shift it regarding the previous one
            if( !self.MD.modal.get().fullScreen()){
                const this_rc = self.$( '.modal-content' )[0].getBoundingClientRect();
                const max_height = self.MD.measures.get( 'max-height' );

                // Boostrap defaults to position modal-content at top and centered, with a 'relative' position
                // we must this 'relative' attribute as else we can not drag anymore
                // so have to compute our shift relatively to this default position
                const count = Modal.count();
                if( count > 1 ){
                    const shift = self.MD.measures.get( 'header-height' );
                    const prev = mdStack.byIndex( count-2 );
                    const prev_rc = $( '#'+prev.id()+' .modal-content' )[0].getBoundingClientRect();
                    const target_x = prev_rc.left + shift;
                    let x_shift = target_x - this_rc.left;
                    // shift vertically depending of the count of opened dialogs
                    let y_shift = shift * ( count - 1 );
                    // if either of horizontal or vertical shifts make the dialog override the viewport, then back to the top-left corner of the screen
                    const max_width = self.MD.measures.get( 'max-width' );
                    if( this_rc.left + x_shift + this_rc.width >= max_width || this_rc.top + y_shift + this_rc.height >= max_height ){
                        x_shift = ( -1 * this_rc.left ) + shift;
                        y_shift = ( -1 * this_rc.top ) + shift;
                    }
                    // update the css
                    x_shift = parseInt( x_shift + 0.5 );
                    y_shift = parseInt( y_shift + 0.5 );
                    css.top = y_shift+'px';
                    css.left = x_shift+'px';
                    //logger.debug( 'shift', shift, 'prev_rc', prev_rc, 'this_rc', this_rc, 'css', css );
                }

                // if a vertical move if asked for this modal, it applies to the above horizontal and vertical shift
                //  only apply if possible (not higher than the viewport)
                const move = self.MD.modal.get().moveTop();
                if( move ){
                    const css_top = parseFloat( css.top );
                    if( css_top + move + this_rc.height < max_height ){
                        css.top = ( css_top + move ) + 'px';
                    }
                }
            }

            // does the modal must be displayed full screen ?
            if( self.MD.modal.get().fullScreen()){
                const pos = '1px';
                const width = self.MD.measures.get( 'max-width' );
                const height = self.MD.measures.get( 'max-height' );
                css = _.merge( css, {
                    top: pos,
                    left: pos,
                    width: width,
                    minWidth: width,
                    height: height,
                    minHeight: height
                });
                logger.verbose({ verbosity: Modal.configure().verbosity, against: Modal.C.Verbose.RESIZING }, 'set fullscreen', pos, width, height );
            }

            // set the modal content style once
            self.$( '.modal-content' ).css( css );
        }
    });

    // send 'md-ready' when DOM is ready
    self.autorun(() => {
        const target = self.MD.modal.get().target() || self.$( '.md-modal' );
        target.trigger( 'md-ready', {
            id: self.MD.modal.get().id(),
            parms: self.MD.modal.get().parms()
        });
    });

    // set the focus if asked for
    self.autorun(() => {
        const modal = self.MD.modal.get();
        if( modal.autoFocus()){
            modal.focus();
        }
    });
});

Template.md_modal.helpers({

    // the template to be rendered in the dialog body
    body(){
        return this.modal.body();
    },

    // the class to be added to the button
    //  the last is set as primary - all others secondary
    btnClasses( btn ){
        return btn.classes() + ( btn.last ? ' md-last' : '' );
    },

    // whether the button is initially disabled
    btnDisabled( btn ){
        return btn.enabled() ? '' : 'disabled';
    },

    // whether the button is defined by its html
    btnHasHtml( btn ){
        return btn.html().length > 0;
    },

    // the html definition of the button
    btnHtml( btn ){
        return btn.html()
    },

    // the standard label or a provided one
    btnLabel( btn ){
        return btn.label();
    },

    // the name of the button
    btnName( btn ){
        return btn.name();
    },

    // the type of the button
    btnType( btn ){
        return btn.type()
    },

    // the list of buttons
    buttons(){
        const buttons = this.modal.buttons();
        //logger.debug( 'buttons', buttons );
        return buttons;
    },

    // the classes to be added to the modal
    classes(){
        return this.modal.classes();
    },

    // the classes to be added to the modal body
    classesBody(){
        return this.modal.classesBody();
    },

    // the classes to be added to the modal content
    classesContent(){
        return this.modal.classesContent();
    },

    // the classes to be added to the modal footer
    classesFooter(){
        return this.modal.classesFooter();
    },

    // the classes to be added to the modal header
    classesHeader(){
        return this.modal.classesHeader();
    },

    // whether backdrop is static ?
    closeBackdrop(){
        return this.modal.closeByBackdrop() ? 'true' : 'static';
    },

    // whether header has a close button ?
    closeHeader(){
        return this.modal.closeByHeader();
    },

    // whether Escape closes the modal
    closeKeyboard(){
        return this.modal.closeByKeyboard() ? 'true' : 'false';
    },

    // the classes to be added by contentClassesArray configuration
    contentClassesArray(){
        return Modal.stack.contentClassesArray( this.modal.id());
    },

    // the footer if any
    footer(){
        return this.modal.footer();
    },

    // the modal identifier
    id(){
        return this.modal.id();
    },

    // the parms initially passed in by the caller to Modal.run()
    //  they are passed here to body and footer templates (if any)
    parms(){
        return this.modal.parms();
    },

    // the modal title
    title(){
        return this.modal.title();
    }
});

Template.md_modal.events({
    // handle the close click on the header
    'click button.btn-close'( event, instance ){
        const modal = this.modal;
        modal.askClose();
        return false;
    },

    // trigger a submit event on Enter
    //  we have made sure that this doesn't submit the form when the submit button is disabled
    //  a previous handler may have set a 'pwix:modal.submitable' key to false to prevent a form to be submitted
    //  see for example pwix:editor which doesn't want a form to be submitted when Enter key is hit in the edition text area
    'keydown .modal-content'( event, instance ){
        //logger.debug( event );
        if( event.keyCode === 13 ){
            if( event.target.nodeName !== "TEXTAREA" &&
                ( !Object.keys( event.originalEvent ).includes( 'pwix:modal' ) ||
                  !Object.keys( event.originalEvent['pwix:modal'] ).includes( 'submitable' ) ||
                  event.originalEvent['pwix:modal'].submitable === false )){

                    instance.$( event.currentTarget ).trigger( 'submit' );
            }
        }
        // this doesn't work
        /*
        logger.debug( event.keyCode );
        if( event.keyCode === 27 ){
            const modal = this.modal;
            modal.askClose();
            return false;
        }
        */
    },

    'submit .modal-content'( event, instance ){
        const $btn = instance.$( event.currentTarget ).find( '.modal-footer button.md-btn.md-last' );
        //logger.debug( event, $btn );
        if( $btn ){
            $btn.trigger( 'click' );
            return false;
        }
    },

    // click on a button
    // note that the Blaze templating system doesn't let us add the 'data-bs-dismiss="modal"' to the button
    //  (though this could have been made via jQuery)
    // so all events come here, and we have to dismiss the dialog ourselves:
    //  - if only button
    //  - if button exhibits a 'dismiss' attribute
    'click .md-btn'( event, instance ){
        const modal = this.modal;
        const $btn = instance.$( event.currentTarget );
        //logger.debug( event, this, $btn, $btn.data());
        const btnId = $btn.attr( 'data-md-btn-id' );
        const button = modal.buttonGet( btnId );
        const target = modal.target() || $btn;
        //logger.debug( target );
        //alert( 'sending md-click to '+target.toString());
        target.trigger( 'md-click', {
            id: modal.id(),
            button: modal.buttonGet( btnId ),
            parms: modal.parms()
        });

        // whether to dismiss the dialog ?
        let dismiss = button.dismiss();
        if( dismiss === undefined ){
            dismiss = modal.buttons().length === 1 || false;
        }
        //logger.debug( 'dismiss', dismiss );
        //alert( 'dismiss='+dismiss );
        if( dismiss ){
            modal.askClose();
            return false;
        }
        // else let bubble up
    },

    // about to close the modal
    'hide.bs.modal .modal'( event, instance ){
        const modal = this.modal;
        const target = modal.target() || instance.$( event.currentTarget );
        instance.MD.lastSizeSet();
        target.trigger( 'md-close', {
            id: modal.id(),
            parms: modal.parms()
        });
    },

    // remove the Blaze element from the DOM
    'hidden.bs.modal .modal'( event, instance ){
        $( 'body' ).removeClass( instance.MD.myClass.get());
        Blaze.remove( instance.view );
    },

    // set the focus on first input field
    'shown.bs.modal .modal'( event, instance ){
        instance.$( '.modal#'+this.modal.id()+' .modal-body input' ).first().focus();
    }
});

Template.md_modal.onDestroyed( function(){
    //logger.debug( 'onDestroyed', this );
    Modal.stack.pop();
});
