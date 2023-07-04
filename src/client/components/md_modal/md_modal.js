/*
 * pwix:modal/src/client/components/md_modal/md_modal.js
 *
 * A Bootstrap-based draggable and resizable modal dialog.
 * 
 * Parms:
 * - modal: the mdModal instance
 */

import { ReactiveVar } from 'meteor/reactive-var';
import { Layout } from 'meteor/pwix:layout';

//  provides 'draggable()' and 'resizable()' methods
import 'jquery-ui/dist/jquery-ui.min.js';

import { mdStack } from '../../classes/md_stack.class.js';

import '../../../common/js/index.js';

import './md_modal.html';
import './md_modal.less';

Template.md_modal.onCreated( function(){
    const self = this;
    //console.log( self );

    self.MD = {
        // the class added to the body to identify *this* dialog backdrop
        myClass: new ReactiveVar( '' ),

        // css values read from .md-hidden div
        cssHidden: {
            padding: new ReactiveVar( 0 )
        },

        // the size of the content
        minWidth: 0,
        contentWidth: new ReactiveVar( 0 ),

        // compute the content min width
        //  which depends of the respective width of the body (and its children), of the footer (and its children)
        //  and of the available width in the screen
        computeContentWidth( maxWidth ){
            //console.debug( 'modal-body' );
            let bodyWidth = self.MD.maxWidth( '.modal-body' );
            //console.debug( 'modal-footer' );
            let footerWidth = self.MD.maxWidth( '.modal-footer' );
            let width = bodyWidth > footerWidth ? bodyWidth : footerWidth;
            self.MD.contentWidth.set( width > maxWidth ? maxWidth : width );
        },

        // get the css padding from .md-hidden div
        cssPadding(){
            let padding = self.MD.cssHidden.padding.get();
            if( !padding ){
                padding = parseInt( self.$( '.md-hidden ').css( 'padding' ));
                self.MD.cssHidden.padding.set( padding );
            }
            //console.debug( 'padding', padding );
            return padding;
        },

        // if a localStorage key has been provided, get it
        lastSizeGet(){
            const key = Template.currentData().modal.sizeKey();
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
        },

        // if a localStorage key has been provided, set it
        lastSizeSet(){
            const key = Template.currentData().modal.sizeKey();
            if( key ){
                localStorage.setItem( key, self.$( '.modal-content' ).css( 'width' ) + ',' + self.$( '.modal-content' ).css( 'height' ));
            }
        },

        // compute the max width between a div and its first child
        //  if the final width comes from the children, then add the paddings
        maxWidth( selector ){
            let div = self.$( selector );
            let parentWidth = 0;
            let childWidth = 0;
            if( div && div.length ){
                parentWidth = div[0].clientWidth;
                //console.debug( 'parentWidth', parentWidth );
            }
            div = div.children().first();
            if( div && div.length ){
                childWidth = div[0].clientWidth;
                //console.debug( 'childWidth', childWidth );
            }
            const maxWidth = parentWidth < childWidth ? childWidth + ( 2 * self.MD.cssPadding()) : parentWidth;
            //console.debug( 'maxWidth', maxWidth );
            return maxWidth;
        }
    };

    // compute our body class name
    self.autorun(() => {
        self.MD.myClass.set( 'pwix-modal-class-'+Template.currentData().modal.id());
    });
});

Template.md_modal.onRendered( function(){
    const self = this;

    // make draggable if possible
    if( self.$( '.modal-dialog' ).draggable ){
        self.$( '.modal-dialog' ).draggable({
            handle: '.modal-header',
            cursor: 'grab'
        });
    }

    // show the dialog before trying to compute the minimal sizes
    self.$( '.modal' ).modal( 'show' );

    // make resizable if possible
    //  it happens that Bootstrap initialize the dialog at its minimal height, but may overflow the content width
    if( self.$( '.modal-content' ).resizable ){
        self.$( '.modal-content' ).resizable({
            handles: 'all'
        });
        //console.log( 'resizable', res );
        self.$( '.modal-content' ).on( 'resize', ( event, ui ) => {
            //console.log( 'resize', event, ui );
            if( !self.MD.minWidth ){
                const div = self.$( '.modal-content' )[0];
                //console.log( 'width', 'client='+div.clientWidth, 'offset='+div.offsetWidth, 'scroll='+div.scrollWidth );
                if( div.scrollWidth - div.clientWidth > 5 ){
                    self.MD.minWidth = div.scrollWidth + 18;
                    console.log( 'overflow detected, setting minWidth to', self.MD.minWidth );
                    self.$( '.modal-content' ).resizable({
                        minWidth: self.MD.minWidth
                    });
                    event.preventDefault();
                }
            }
        });
        // get/set the width and height ?
        self.MD.lastSizeGet();
    }

    // add a tag class to body element to let the stylesheet identify the modal
    self.autorun(() => {
        $( 'body' ).addClass( self.MD.myClass.get());
    });

    // set the backdrop style accordingly (we want it to not be visible)
    //  we use the 'myClass' to have a more-specific CSS selector than the Bootstrap default one
    self.autorun(() => {
        $( 'body.'+self.MD.myClass.get()+' div.modal-backdrop.show' ).css({
            display: 'none',
            'z-index': mdStack.firstZindex()
        });
    });

    // set the z-index of the modal
    self.autorun(() => {
        $( 'body .modal#'+Template.currentData().modal.id()).css({
            'z-index': mdStack.lastZindex()
        });
    });

    // set the minimal width of the dialog
    //  if we display a dynamic footer, then the dialog may have some issues to find the right width
    //  if we find here that the footer width is greater than the content, then we adjust the dialog width
    self.autorun(() => {
        const maxWidth = Layout.width();
        self.MD.computeContentWidth( maxWidth );
        self.$( '.modal-content' ).width( self.MD.contentWidth.get());
    });

    // make sure the modal doesn't override the screen width
    self.autorun(() => {
        const margin = self.$( '.md-hidden' ).css( 'margin' );
        //console.debug( 'margin', margin ); // '4px'
        self.$( '.modal-content' ).css({ maxWidth: Layout.width()-2*parseInt( margin )});
    });

    // horizontally center the modal
    //  this was automatic with standard bootstrap, but has disappeared somewhere
    self.autorun(() => {
        const contentWidth = parseInt( self.$( '.modal-content' ).css( 'width' ));
        //console.debug( 'contentWidth', contentWidth );
        const viewWidth = parseInt( Layout.width());
        //console.debug( 'viewWidth', viewWidth );
        self.$( '.modal-content' ).css({ left: (( viewWidth-contentWidth ) / 2 )+'px' });
    });

    // vertically position the modal
    self.autorun(() => {
        const position = Template.currentData().modal.verticalPosition();
        //console.debug( 'position', position );
        if( position ){
            let top = position;
            if( position === Modal.C.Position.CENTER ){
                const viewHeight = parseInt( Layout.height());
                const contentHeight = parseInt( self.$( '.modal-content' ).css( 'height' ));
                top = (( viewHeight - contentHeight ) / 2 )+'px';
            }
            self.$( '.modal-content' ).css({ top: top });
        }
    });

    // shift the stacked modals
    self.autorun(() => {
        const count = Modal.count();
        //console.debug( 'count', count );
        if( count > 1 ){
            const shift = parseInt( self.$( '.md-hidden' ).css( 'left' ));
            self.$( '.modal-content' ).css({
                top: '+=' + (( count - 1 ) * shift ) + 'px',
                left: '+=' + (( count - 1 ) * shift ) + 'px'
            });
        }
    });
});

Template.md_modal.helpers({

    // the template to be rendered in the dialog body
    body(){
        return Template.currentData().modal.body();
    },

    // the class to be added to the button
    //  the last is set as primary - all others secondary
    btnClass( btn ){
        const buttons = Template.currentData().modal.buttons();
        return buttons.indexOf( btn ) === buttons.length-1 ? 'btn-primary' : 'btn-secondary';
    },

    // the list of buttons
    buttons(){
        return Template.currentData().modal.buttons();
    },

    // the classes to be added to the modal
    classes(){
        return Template.currentData().modal.classes();
    },

    // whether backdrop is static ?
    closeBackdrop(){
        return Template.currentData().modal.closeByBackdrop() ? 'true' : 'static';
    },

    // whether header has a close button ?
    closeHeader(){
        return Template.currentData().modal.closeByHeader();
    },

    // whether Escape closes the modal
    closeKeyboard(){
        return Template.currentData().modal.closeByKeyboard() ? 'true' : 'false';
    },

    // the footer if any
    footer(){
        return Template.currentData().modal.footer();
    },

    // the modal identifier
    id(){
        return Template.currentData().modal.id();
    },

    // the i18n namespace
    namespace(){
        return I18N;
    },

    // the parms initially passed in by the caller to Modal.run()
    parms(){
        return Template.currentData().modal.parms();
    },

    // the modal title
    title(){
        return Template.currentData().modal.title();
    }
});

Template.md_modal.events({
    // click on a button
    // note that the Blaze templating system doesn't let us add the 'data-bs-dismiss="modal"' to the button
    // so all events come here, and we have to dismiss the dialog ourselves:
    //  - if Cancel
    //  - if only button
    'click .md-btn'( event, instance ){
        const modal = Template.currentData().modal;
        const btn = instance.$( event.currentTarget ).attr( 'data-pwix-btn' );
        const target = modal.target() || instance.$( event.currentTarget );
        //console.debug( target );
        target.trigger( 'md-click', { id: modal.id(), button: btn });

        const buttons = modal.buttons();
        const dismiss = buttons.length === 1 || btn === Modal.C.Button.CANCEL;
        if( dismiss ){
            self.$( '.modal#'+modal.id()).modal( 'hide' );
        }
        // and let bubble up
    },

    // about to close the modal
    'hide.bs.modal .modal'( event, instance ){
        const modal = Template.currentData().modal;
        const fn = modal.beforeClose();
        if( !fn || fn( modal.id())){
            const target = modal.target() || instance.$( event.currentTarget );
            instance.MD.lastSizeSet();
            target.trigger( 'md-close', { id: modal.id() });
        } else {
            event.preventDefault();
        }
    },

    // remove the Blaze element from the DOM
    'hidden.bs.modal .modal'( event, instance ){
        $( 'body' ).removeClass( instance.MD.myClass.get());
        Blaze.remove( instance.view );
    },

    // set the focus on first input field
    'shown.bs.modal .modal'( event, instance ){
        instance.$( '.modal#'+Template.currentData().modal.id()+' .modal-body input' ).first().focus();
    }
});
