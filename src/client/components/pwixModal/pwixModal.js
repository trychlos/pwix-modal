/*
 * pwix:modal/src/client/components/pwixModal/pwixModal.js
 *
 * A Bootstrap-based draggable and resizable modal dialog.
 * 
 * Parms:
 * 
 * - modalTitle: the title of the modal
 *   no default
 * 
 * - modalClasses: the classes to be added to the modal-dialog
 *   no default
 * 
 * - modalTemplate: the Blaze template to be rendered as the content of the 'modal-body' div
 * 
 * - modalButtons: an array of constants
 *   default to only have a 'OK' button
 */

import { pwixI18n as i18n } from 'meteor/pwix:i18n';

import '../../../common/js/index.js';

import './pwixModal.html';
import './pwixModal.less';

// https://stackoverflow.com/questions/34372412/meteor-bind-events-outside-template-with-event-handlers-inside-the-template
//  let us handle the events sents from the acUserLogin modal used by 'user_edit' template
//  because the 'user_edit' template is attached to the body, no Blaze template can handle its events :(
//  below, 'this' is bound to the 'users_manager' template instance
//
// jQueryUI overlay handling
/*
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
        lastBtn: null
    };
});

Template.pwixModal.onRendered( function(){
    const self = this;

    // Bootstrap
    // =========
    // add a tag class to body element to let the stylesheet identify *this* modal
    $( 'body' ).addClass( 'pwix-modal-dialog-body-class' );

    // make draggable if possible
    // .modal or .modal-dialog ?
    if( self.$( '.modal-dialog' ).draggable ){
        console.log( 'draggable' );
        self.$( '.modal-dialog' ).draggable({
            handle: '.modal-header',
            cursor: 'grab'
        });
    }

    // make resizable if possible
    // .modal or .modal-content ?
    if( self.$( '.modal-content' ).resizable ){
        console.log( 'resizable' );
        self.$( '.modal-content' ).resizable({
            handles: 'all'
        });
    }

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

    // make sure we have at least one button
    self.autorun(() => {
        if( !Object.keys( Template.currentData()).includes( 'modalButtons' )){
            Template.currentData().modalButtons = [ MODAL_BTN_OK ];
        }
    });

    // record the last button
    self.autorun(() => {
        const btns = Template.currentData().modalButtons;
        self.MD.lastBtn = btns[ btns.length-1 ];
    });
});

Template.pwixModal.helpers({
    // the class to be added to the button
    //  the last should be be primary - all others secondary
    btnClass( btn ){
        const MD = Template.instance().MD;
        return MD.lastBtn ? ( MD.lastBtn === btn ? 'btn-primary' : 'btn-secondary' ) : '';
    },
    // the translated label of the button
    btnLabel( btn ){
        return i18n.label( pwixModal.i18n, btn );
    },
    helper(){
        console.log( this );
    }
});

Template.pwixModal.events({
    // remove the Blaze element from the DOM
    'hidden.bs.modal .pwixModal'( event, instance ){
        $( 'body' ).removeClass( 'pwix-modal-dialog-body-class' );
        Blaze.remove( instance.view );
    }
});

Template.pwixModal.onDestroyed( function(){
    // jQuery UI overlay handling
    /*
    console.log( 'onDestroyed' );
    $( 'body .ui-widget-overlay' ).off( 'click', eventHandler );
    */
});
