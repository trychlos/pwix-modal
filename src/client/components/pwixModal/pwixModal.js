/*
 * pwix:modal/src/client/components/pwixModal/pwixModal.js
 *
 * A Bootstrap-based draggable and resizable modal dialog.
 * 
 * The behavior relies on the fact that a modal is unique in the application: there can be only at any time.
 */

import { pwixI18n as i18n } from 'meteor/pwix:i18n';

import '../../../common/js/index.js';

import './pwixModal.html';
import './pwixModal.less';

/*
// https://stackoverflow.com/questions/34372412/meteor-bind-events-outside-template-with-event-handlers-inside-the-template
//  let us handle the events sents from the acUserLogin modal used by 'user_edit' template
//  because the 'user_edit' template is attached to the body, no Blaze template can handle its events :(
//  below, 'this' is bound to the 'users_manager' template instance
//
// jQueryUI overlay handling
function eventHandler( event ){
    console.log( 'overlay click, closing' );
    if( this.MD.view ){
        Blaze.remove( this.MD.view );
    }
}
*/

Template.pwixModal.onCreated( function(){
    const self = this;

    self.MD = {
        minWidth: 0,
        minHeight: 0
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
});

Template.pwixModal.onRendered( function(){
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

    // make resizable if possible
    //  it happens that Bootstrap initialize the dialog at its minimal height
    if( self.$( '.modal-content' ).resizable ){
        self.$( '.modal-content' ).resizable({
            handles: 'all'
        });
        self.$( '.modal-content' ).on( 'resize', ( event, ui ) => {
            //console.log( 'resize', event, ui );
            const div = self.$( '.modal-content' )[0];
            if( !self.MD.minWidth ){
                //console.log( 'width', 'client='+div.clientWidth, 'offset='+div.offsetWidth, 'scroll='+div.scrollWidth );
                if( div.scrollWidth - div.clientWidth > 5 ){
                    self.MD.minWidth = div.scrollWidth + 18;
                    console.log( 'setting minWidth to', self.MD.minWidth );
                    self.$( '.modal-content' ).resizable({
                        minWidth: self.MD.minWidth
                    });
                    event.preventDefault();
                }
            }
            if( !self.MD.minHeight ){
                //console.log( 'height', 'client='+div.clientHeight, 'offset='+div.offsetHeight, 'scroll='+div.scrollHeight );
                if( div.scrollHeight - div.clientHeight > 5 ){
                    self.MD.minHeight = ui.originalSize.height;
                    console.log( 'setting minHeight to', self.MD.minHeight );
                    self.$( '.modal-content' ).resizable({
                        minHeight: self.MD.minHeight
                    });
                    event.preventDefault();
                }
            }
        });
    }

    // at the end, actually show the dialog
    self.$( '.modal' ).modal( 'show' );

    /*
    // jQuery UI
    // =========
    //  defaults to be non-modal: several dialogs can be opened

    self.$( '.pwixModal' ).resizable({
        handles: 'all'
    });

    self.$( '.pwixModal' ).dialog({
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
    */
});

Template.pwixModal.helpers({

    // the class to be added to the button
    //  the last is set as primary - all others secondary
    btnClass( btn ){
        const btns = pwixModal._buttons.get();
        return btns.indexOf( btn ) === btns.length-1 ? 'btn-primary' : 'btn-secondary';
    },

    // the i18n namespace
    namespace(){
        return pwixModal.i18n;
    },

    // the list of buttons
    buttons(){
        return pwixModal._buttons.get();
    }
});

Template.pwixModal.events({
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
        let $target = pwixModal._target.get();
        $target = $target ? $target : instance.$( '.pwixModal' );
        $target.trigger( 'md-click', btn );
        // and let bubble up
    },

    // remove the Blaze element from the DOM
    'hidden.bs.modal .pwixModal'( event, instance ){
        $( 'body' ).removeClass( 'pwix-modal-dialog-body-class' );
        Blaze.remove( instance.view );
    },

    // set the focus on first input field
    'shown.bs.modal .pwixModal'( event, instance ){
        instance.$( '.modal-body input' ).first().focus();
    }
});

Template.pwixModal.onDestroyed( function(){
    /*
    // jQuery UI overlay handling
    console.log( 'onDestroyed' );
    $( 'body .ui-widget-overlay' ).off( 'click', eventHandler );
    */
});
