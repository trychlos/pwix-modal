/*
 * pwix:modal/src/client/components/md_modal/md_modal.js
 *
 * A Bootstrap-based draggable and resizable modal dialog.
 * 
 * Parms:
 * - modal: the mdModal instance
 */

import { UILayout } from 'meteor/pwix:ui-layout';
import { ReactiveVar } from 'meteor/reactive-var';

//  provides 'draggable()' and 'resizable()' methods
import 'jquery-ui/dist/jquery-ui.min.js';

import { mdStack } from '../../classes/md_stack.class.js';

import '../../../common/js/index.js';

import './md_modal.html';
import './md_modal.less';

Template.md_modal.onCreated( function(){
    const self = this;
    //console.log( 'onCreated', self );

    self.MD = {
        // the class added to the body to identify *this* dialog backdrop
        myClass: new ReactiveVar( '' ),

        // the mdModal instance
        modal: new ReactiveVar( null ),

        // css values read from .md-hidden div
        cssHidden: {
            padding: new ReactiveVar( 0 )
        },

        // the size of the content
        minWidth: 0,
        contentWidth: new ReactiveVar( 0 ),

        // the margin got from the .md-hidden class definition
        margin: 0,

        // compute the content min width
        //  which depends of the respective width of the body (and its children), of the footer (and its children)
        //  and of the available width in the screen
        computeContentWidth( maxWidth ){
            //console.debug( 'modal-body' );
            let bodyWidth = self.MD.maxWidth( '.modal-body' );
            //console.debug( 'modal-footer' );
            let footerWidth = self.MD.maxWidth( '.modal-footer' );
            let width = ( bodyWidth > footerWidth ? bodyWidth : footerWidth ) + self.MD.cssPadding();
            //console.debug( 'computeContentWidth: body', bodyWidth, 'footer', footerWidth, 'width', width );
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
    //console.log( 'onRendered', self );

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
            if( Modal.configure().verbosity & Modal.C.Verbose.RESIZING ){
                console.log( 'resizing', event, ui );
            }
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
            'z-index': Modal.stack.firstZindex()
        });
    });

    // set the z-index of the modal
    self.autorun(() => {
        //console.debug( 'modal onRendered', Modal.stack.count());
        $( 'body .modal#'+self.MD.modal.get().id()).css({
            'z-index': Modal.stack.lastZindex()
        });
    });

    self.MD.margin = parseInt( self.$( '.md-hidden' ).css( 'margin' ));

    // set the minimal width of the dialog
    //  if we display a dynamic footer, then the dialog may have some issues to find the right width
    //  if we find here that the footer width is greater than the content, then we adjust the dialog width
    self.autorun(() => {
        const maxWidth = parseInt( UILayout.width()) - 2*self.MD.margin;
        let w;
        if( self.MD.modal.get().fullScreen()){
            w = maxWidth;
        } else {
            self.MD.computeContentWidth( maxWidth );
            w = self.MD.contentWidth.get();
        }
        if( Modal.configure().verbosity & Modal.C.Verbose.RESIZING ){
            console.log( 'set minimal width of the modal to', w );
        }
        self.$( '.modal-content' ).css({ width: w, minWidth: w, maxWidth: maxWidth });
    });

    // horizontally center the modal
    //  this was automatic with standard bootstrap, but has disappeared somewhere
    self.autorun(() => {
        if( !self.MD.modal.get().fullScreen()){
            const contentWidth = parseInt( self.$( '.modal-content' ).css( 'width' ));
            const viewWidth = parseInt( UILayout.width());
            const left = (( viewWidth-contentWidth ) / 2 )+'px';
            if( Modal.configure().verbosity & Modal.C.Verbose.RESIZING ){
                console.log( 'horizontally center the modal: viewWidth', viewWidth, 'contentWidth', contentWidth, 'left', left );
            }
            self.$( '.modal-content' ).css({ left: left });
        }
    });

    // does the modal must be displayed full screen ?
    self.autorun(() => {
        if( self.MD.modal.get().fullScreen()){
            const pos = '1px';
            const em = parseInt( self.$( '.md-hidden' ).css( 'font-size' ));
            const width = ( parseInt( UILayout.width()) - em )+'px';
            const height = ( parseInt( UILayout.height()) - em )+'px';
            if( Modal.configure().verbosity & Modal.C.Verbose.RESIZING ){
                console.log( 'set fullscreen', pos, width, height );
            }
            self.$( '.modal-content' ).css({ top: pos, left: pos, height: height, minHeight: height, maxHeight: height, width: width, minWidth: width, maxWidth: width });
        }
    });

    // make sure the modal is not higher than the viewport
    self.autorun(() => {
        if( !self.MD.modal.get().fullScreen()){
            const em = parseInt( self.$( '.md-hidden' ).css( 'font-size' ));
            const available = parseInt( UILayout.height());
            let height = parseInt( self.$( '.modal-content' ).css( 'height' ));
            let top = parseInt( self.$( '.modal-content' ).css( 'top' ));
            if( top+height >= available-em ){
                if( height >= available-em ){
                    height = ( available-em )+'px';
                    top = '1px'
                } else {
                    top = ( available-em-height-1 )+'px';
                }
                self.$( '.modal-content' ).css({ top: top, height: height, minHeight: height, maxHeight: height });
            }
        }
    });

    // vertical move
    //  only apply if possible (not higher than the viewport)
    self.autorun(() => {
        if( !self.MD.modal.get().fullScreen()){
            const move = self.MD.modal.get().moveTop();
            const available = parseInt( UILayout.height());
            const height = parseInt( self.$( '.modal-content' ).css( 'height' ));
            const top = parseInt( self.$( '.modal-content' ).css( 'top' ));
            if( top+move+height < available ){
                self.$( '.modal-content' ).css({
                    top: '+=' + move + 'px'
                });
            }
        }
    });

    // vertically shift the stacked modals (because horizontal position defaults to be centered - see above)
    // if possible given the available width and height
    self.autorun(() => {
        const count = Modal.count();
        if( count > 1 ){
            const shift = parseInt( self.$( '.md-hidden' ).css( 'left' ));
            const em = parseInt( self.$( '.md-hidden' ).css( 'font-size' ));
            const available = parseInt( UILayout.height());
            const height = parseInt( self.$( '.modal-content' ).css( 'height' ));
            const top = parseInt( self.$( '.modal-content' ).css( 'top' ));
            let newtop = ( count - 1 ) * shift;
            if( newtop+height > available-em ){
                newtop = 1;
            }
            self.$( '.modal-content' ).css({ top: newtop+'px' });
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
        //console.debug( 'Modal helper', buttons );
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
        //console.debug( event );
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
        console.debug( event.keyCode );
        if( event.keyCode === 27 ){
            const modal = this.modal;
            modal.askClose();
            return false;
        }
        */
    },

    'submit .modal-content'( event, instance ){
        const $btn = instance.$( event.currentTarget ).find( '.modal-footer button.md-btn.md-last' );
        //console.debug( event, $btn );
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
        //console.debug( event, this, $btn, $btn.data());
        const btnId = $btn.attr( 'data-md-btn-id' );
        const button = modal.buttonGet( btnId );
        const target = modal.target() || $btn;
        //console.debug( target );
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
        //console.debug( 'dismiss', dismiss );
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
    //console.debug( 'onDestroyed', this );
    Modal.stack.pop();
});
