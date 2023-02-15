/*
 * pwix:modal/src/client/components/mdModal/mdModal.js
 *
 * A Bootstrap-based draggable and resizable modal dialog.
 * 
 * The behavior relies on the fact that a modal is unique in the application: there can be only at any time.
 */

import { ReactiveVar } from 'meteor/reactive-var';

import '../../../common/js/index.js';

import './mdModal.html';
import './mdModal.less';

Template.mdModal.onCreated( function(){
    const self = this;
    //console.log( self );

    self.MD = {
        minWidth: 0,
        minHeight: 0,
        bodyMinWidth: new ReactiveVar( 0 ),
        footerMinWidth: new ReactiveVar( 0 ),
        initialWidth: new ReactiveVar( false ),

        // compute the width of the content
        computeBody(){
            if( !self.MD.bodyMinWidth.get()){
                let width = self.MD.maxWidth( '.modal-body' );
                // an approximation so that something is rendered
                if( width > 100 ){
                    self.MD.bodyMinWidth.set( width );
                }
            }
        },

        // compute the width of the footer
        computeFooter(){
            if( !self.MD.footerMinWidth.get()){
                let width = self.MD.maxWidth( '.modal-footer' );
                // an approximation so that something is rendered
                if( width > 100 ){
                    self.MD.footerMinWidth.set( width );
                }
            }
        },

        // compute the max width between a div and its first child
        maxWidth( selector ){
            let div = self.$( selector );
            const parentWidth = div[0].clientWidth;
            div = div.children().first();
            const childWidth = div[0].clientWidth;
            return parentWidth < childWidth ? childWidth : parentWidth;
        }
    };

    // make sure we have at least one button
    self.autorun(() => {
        let btns = Template.currentData().mdButtons || null;
        if( !btns ){
            btns = MD_BUTTON_OK;
        }
        pwixModal.setButtons( btns );
    });

    // record the current events target
    self.autorun(() => {
        pwixModal.setTarget( Template.currentData().mdTarget || null );
    });

    // record the footer if any
    self.autorun(() => {
        pwixModal.setFooter( Template.currentData().mdFooter || null );
    });

    // record the requested template
    self.autorun(() => {
        pwixModal.setTemplate( Template.currentData().mdTemplate || null );
    });

    // record the title
    self.autorun(() => {
        pwixModal.setTitle( Template.currentData().mdTitle || null );
    });
});

Template.mdModal.onRendered( function(){
    const self = this;

    // Bootstrap
    // =========
    // add a tag class to body element to let the stylesheet identify *this* modal
    $( 'body' ).addClass( 'pwix-modal-dialog-body-class' );

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
    }

    // set the minimal width of the dialog
    //  if we display a dynamic footer, then the dialog may have some issues to find the right width
    //  if we find here that the footer width is greater than the content, then we adjust th dialog width
    self.autorun(() => {
        const bodyWidth = self.MD.bodyMinWidth.get();
        const footerWidth = self.MD.footerMinWidth.get();
        if( bodyWidth && footerWidth && !self.MD.initialWidth.get()){
            if( footerWidth > bodyWidth ){
                let width = footerWidth+40;
                width = width > screen.availWidth ? screen.availWidth-16 : width;
                console.log( 'setting width to', width );
                self.$( '.modal-content' ).width( width );
            }
            self.MD.initialWidth.set( true );
        }
    });

    // at the end, actually show the dialog
    //self.$( '.modal' ).modal( 'show' );

    /* *********
    // jQuery UI
    // =========
    //  defaults to be non-modal: several dialogs can be opened

    self.$( '.mdModal' ).resizable({
        handles: 'all'
    });

    self.$( '.mdModal' ).dialog({
        draggable: true,
        resizable: true,
        modal: true,
        close: function( ev, ui ){
            Blaze.remove( self.view );
        }
    });

    self.MD.view = self.view;

    // on modal, intercept clicks on overlay to close the dialog
    $( 'body .ui-widget-overlay' ).on( 'click', eventHandler.bind( self ));
    //
    ********* */
});

Template.mdModal.helpers({

    // the class to be added to the button
    //  the last is set as primary - all others secondary
    btnClass( btn ){
        const btns = pwixModal._buttons.get();
        return btns.indexOf( btn ) === btns.length-1 ? 'btn-primary' : 'btn-secondary';
    },

    // the list of buttons
    buttons(){
        return pwixModal._buttons.get();
    },

    // the footer if any
    footer(){
        return pwixModal._footer.get();
    },

    // the i18n namespace
    namespace(){
        return pwixModal.i18n;
    },

    // the template to be rendered
    template(){
        return pwixModal._template.get();
    },

    // the modal title
    title(){
        return pwixModal._title.get();
    }
});

Template.mdModal.events({
    // click on a button
    // note that the Blaze templating system doesn't let us add the 'data-bs-dismiss="modal"' to the button
    // so all events come here, and we have to dismiss the dialog ourselves:
    //  - if Cancel
    //  - if only button
    'click .md-btn'( event, instance ){
        const btn = instance.$( event.currentTarget ).attr( 'data-pwix-btn' );
        const buttons = pwixModal._buttons.get();
        const dismiss = buttons.length === 1 || btn === MD_BUTTON_CANCEL;
        if( dismiss ){
            self.$( '.modal' ).modal( 'hide' );
            return false;
        }
        const target = pwixModal._target.get() || instance.$( event.currentTarget );
        target.trigger( 'md-click', btn );
        // and let bubble up
    },

    // about to close the modal
    'hide.bs.modal .mdModal'( event, instance ){
        const target = pwixModal._target.get() || instance.$( event.currentTarget );
        target.trigger( 'md-modal-close' );
    },

    // remove the Blaze element from the DOM
    'hidden.bs.modal .mdModal'( event, instance ){
        $( 'body' ).removeClass( 'pwix-modal-dialog-body-class' );
        Blaze.remove( instance.view );
    },

    // set the focus on first input field
    'shown.bs.modal .mdModal'( event, instance ){
        instance.MD.computeBody();
        instance.MD.computeFooter();
        instance.$( '.modal-body input' ).first().focus();
    }
});

Template.mdModal.onDestroyed( function(){
    /*
    // jQuery UI overlay handling
    console.log( 'onDestroyed' );
    $( 'body .ui-widget-overlay' ).off( 'click', eventHandler );
    */
});
