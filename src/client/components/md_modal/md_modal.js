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
        measures: {},
        htmlBodyStyles: null,
        modalContentStyles: null,
        modalBodyStyles: null,
        modalHeaderStyles: null,
        modalFooterStyles: null,

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

        // compute min and max width and height
        // take other measurements which will be needed later
        takeMeasures(){
            // body width and height
            this.htmlBodyStyles = getComputedStyle( $( 'body' )[0] );
            const body_width = parseFloat( this.htmlBodyStyles.width );
            this.measures['body-width'] = body_width;
            const body_height = parseFloat( this.htmlBodyStyles.height );
            this.measures['body-height'] = body_height;
            // modal content margin
            this.modalContentStyles = getComputedStyle( self.$( '.modal-content' )[0] );
            const margin_top = parseFloat( this.modalContentStyles.margin_top );
            this.measures['modal-margin-top'] = margin_top;
            // modal body padding
            this.modalBodyStyles = getComputedStyle( self.$( '.modal-body' )[0] );
            const padding = parseFloat( this.modalBodyStyles.paddingLeft );
            this.measures['modal-padding'] = padding;
            // modal header height
            this.modalHeaderStyles = getComputedStyle( self.$( '.modal-header' )[0] );
            const header_height = parseFloat( this.modalHeaderStyles.height );
            this.measures['header-height'] = header_height;
            // modal footer height
            this.modalFooterStyles = getComputedStyle( self.$( '.modal-footer' )[0] );
            const footer_height = parseFloat( this.modalFooterStyles.height );
            this.measures['footer-height'] = footer_height;
            // Source - https://stackoverflow.com/a/8876069
            // Posted by ryanve, modified by community. See post 'Timeline' for change history
            // Retrieved 2026-03-08, License - CC BY-SA 4.0
            const vw_width = Math.max( document.documentElement.clientWidth || 0, window.innerWidth || 0 );
            this.measures['viewport-width'] = vw_width;
            const vw_height = Math.max( document.documentElement.clientHeight || 0, window.innerHeight || 0 );
            this.measures['viewport-height'] = vw_height;
            // optimal width depends of the respective width of the body (and its children), of the footer (and its children)
            // honors the dialog padding
            let width = Math.max( this.computeWidth( '.modal-body' ), this.computeWidth( '.modal-footer' ));
            width += 2*padding;
            this.measures['width'] = width;
            // at the moment min width is same than optimal width
            const min_width = width;
            this.measures['min-width'] = min_width;
            // current height is just read from content styles, unless it has been specified as a parameter
            const contentHeight = this.modal.get().contentHeight();
            this.measures['height'] = contentHeight ? contentHeight + header_height + footer_height : parseFloat( this.modalContentStyles.height );
            // max width and height are 95% of body size ,- taking into account the shift when modals are stacked
            this.measures['max-width'] = 0.95 * ( body_width - header_height );
            this.measures['max-height'] = 0.95 * ( body_height - header_height );
            // get bounding client rect for current and previous modal
            const count = Modal.count();
            const prev_modal = count > 1 ? mdStack.byIndex( count-2 ) : null;
            const prev_rc = prev_modal ? $( '#'+prev_modal.id()+' .modal-content' )[0].getBoundingClientRect() : null;
            this.measures['prev-rc'] = prev_rc;
            const this_rc = self.$( '.modal-content' )[0].getBoundingClientRect();
            this.measures['this-rc'] = this_rc;
        }
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
            self.MD.takeMeasures();

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
            // setup this modal content on top of the backdrop
            $( '#'+modal.id()).css({
                'z-index': modal.contentZIndex()
            });
            //logger.debug( 'backdrop z-index', modal.backdropZIndex(), 'modal z-index', modal.contentZIndex());

            // make resizable if possible
            //  it happens that Bootstrap initialize the dialog at a usable height, but may overflow the content width
            if( self.$( '.modal-content' ).resizable ){
                self.$( '.modal-content' ).resizable({
                    handles: 'all',
                    minWidth: self.MD.measures['min-width']
                });
            }

            // prepare our modal styles
            // let Bootstrap compute itself the needed height (nb: 'px' is the default unit)
            const css = ({
                width: self.MD.measures['width'],
                minWidth: self.MD.measures['min-width'],
                maxWidth: self.MD.measures['max-width'],
                //height: self.MD.measures['height'],
                minHeight: self.MD.measures['min-height'],
                maxHeight: self.MD.measures['max-height'],
                top: 0,
                left: 0
            });

            // does the modal must be displayed full screen ?
            if( modal.fullScreen()){
                const pos = '1px';
                const width = self.MD.measures['max-width'];
                const height = self.MD.measures['max-height'];
                css = _.merge( css, {
                    top: pos,
                    left: pos,
                    width: width,
                    minWidth: width,
                    height: height,
                    minHeight: height
                });
                logger.verbose({ verbosity: Modal.configure().verbosity, against: Modal.C.Verbose.RESIZING }, 'set fullscreen', pos, width, height );

            // not in full screen mode, so we shift the modal relatively to the previous one
            // horizontal and vertical positions are computed separately
            } else {
                const pos = modal.position();
                const count = Modal.count();
                const prev_rc = self.MD.measures['prev-rc'];
                const this_rc = self.MD.measures['this-rc'];

                // positionning in the center of the screen
                if( pos & Modal.C.Position.SCREEN_H_CENTERED ){
                    const modalWidth = self.MD.measures['width'];
                    const screenWidth = self.MD.measures['viewport-width'];
                    const x_pos = ( screenWidth - modalWidth ) / 2;
                    const x_left = parseInt( x_pos + 0.5 );
                    css.left = x_left;

                // positionning this modal relatively to the previous one if only honored if there is one previous one
                } else if( pos & Modal.C.Position.MODAL_H_CENTERED ){
                    if( count > 1 ){
                        const modalWidth = self.MD.measures['width'];
                        const target_x = prev_rc.left + (( prev_rc.width - modalWidth ) / 2 );
                        let x_shift = target_x - this_rc.left;
                        x_shift = parseInt( x_shift + 0.5 );
                        css.left = x_shift;
                    }
                
                // else shift if possible
                // Boostrap defaults to position modal-content at top and centered, with a 'relative' position
                // we must this 'relative' attribute as else we can not drag anymore
                // so have to compute our shift relatively to this default position
                } else {
                    if( count > 1 ){
                        const shift = self.MD.measures['header-height'];
                        const target_x = prev_rc.left + shift;
                        let x_shift = target_x - this_rc.left;
                        //logger.debug( 'horizontal shift', prev_rc, this_rc, target_x, x_shift );
                        // if either of horizontal or vertical shifts make the dialog override the viewport, then back to the top-left corner of the screen
                        const max_width = self.MD.measures['max-width'];
                        if( this_rc.left + x_shift + this_rc.width >= max_width ){
                            x_shift = ( -1 * this_rc.left ) + shift;
                            //logger.debug( 'x_shift realigned to', x_shift );
                        }
                        // update the css
                        x_shift = parseInt( x_shift + 0.5 );
                        css.left = x_shift;
                    }
                }

                if( pos & Modal.C.Position.SCREEN_V_CENTERED ){
                    const modalHeight = self.MD.measures['height'];
                    const screenHeight = self.MD.measures['viewport-height'];
                    const y_pos = ( screenHeight - modalHeight ) / 2;
                    const y_top = parseInt( y_pos + 0.5 );
                    css.top = y_top;

                // positionning this modal relatively to the previous one if only honored if there is one previous one
                } else if( pos & Modal.C.Position.MODAL_V_CENTERED ){
                    const count = Modal.count();
                    if( count > 1 ){
                        const modalHeight = self.MD.measures['height'];
                        const y_pos = prev_rc.top + ( ( prev_rc.height - modalHeight ) / 2 );
                        const y_top = parseInt( y_pos + 0.5 );
                        css.top = y_top;
                    }

                // auto shift
                } else {
                    if( count > 1 ){
                        const max_height = self.MD.measures['max-height'];
                        const shift = self.MD.measures['header-height'];
                        // shift vertically depending of the count of opened dialogs
                        let y_shift = shift * ( count - 1 );
                        // if either of horizontal or vertical shifts make the dialog override the viewport, then back to the top-left corner of the screen
                        if( this_rc.top + y_shift + this_rc.height >= max_height ){
                            y_shift = ( -1 * this_rc.top ) + shift;
                        }
                        // update the css
                        y_shift = parseInt( y_shift + 0.5 );
                        css.top = y_shift;
                    }
                }

                // if a vertical move if asked for this modal, it applies to the above horizontal and vertical shift
                //  only apply if possible (not higher than the viewport)
                const move = modal.moveTop();
                if( move ){
                    const css_top = parseFloat( css.top );
                    if( css_top + move + this_rc.height < max_height ){
                        css.top = css_top + move;
                    }
                }
            }

            // set the modal content style once
            //logger.debug( 'css', css );
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
        // see also:
        //  https://stackoverflow.com/questions/75535862/data-keyboard-false-doesnt-work-in-bootstrap-for-the-following-code
        //  https://stackoverflow.com/questions/16693079/how-to-disable-escape-key-for-twitter-bootstrap-modals
        /*
        if( event.keyCode === 27 ){
            const modal = this.modal;
            modal.askClose();
            return false;
        } */
    },

    'submit .modal-content'( event, instance ){
        const $btn = instance.$( event.currentTarget ).find( '.modal-footer button.md-btn.md-last' );
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
        const btnId = $btn.attr( 'data-md-btn-id' );
        const button = modal.buttonGet( btnId );
        const target = modal.target() || $btn;
        target.trigger( 'md-click', {
            id: modal.id(),
            button,
            parms: modal.parms()
        });

        // whether to dismiss the dialog ?
        let dismiss = button.dismiss();
        if( dismiss === undefined ){
            dismiss = modal.buttons().length === 1 || false;
        }
        if( dismiss ){
            modal.askClose();
            return false;
        }
        // else let bubble up
    },

    // about to close the modal
    'hide.bs.modal .modal'( event, instance ){
        const modal = this.modal;
        if( modal ){
            if( !modal.isTopmost()){
                return false;
            }
            if( modal.unconditionallyClosing()){
                logger.debug( 'unconditionally closing', modal.id());
                return true;
            }
            modal.askClose();
            return false;
        }
        // default action is to let the modal be hidden (aka be closed)
        return true;
    },

    // remove the Blaze element from the DOM
    'hidden.bs.modal .modal'( event, instance ){
        $( 'body' ).removeClass( instance.MD.myClass.get());
        Blaze.remove( instance.view );
        // and re-set the focus on the new topmost
        const topmost = Modal.stack.topmost();
        if( topmost ){
            topmost.focus();
        }
    },

    // set the focus on first input field if asked for
    'shown.bs.modal .modal'( event, instance ){
        const modal = this.modal;
        if( modal && modal.isTopmost() && modal.autoFocus()){
            modal.focus();
        }
    }
});

Template.md_modal.onDestroyed( function(){
    //logger.debug( 'onDestroyed', this );
    Modal.stack.pop();
});
