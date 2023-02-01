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

Template.pwixModal.onCreated( function(){
    const self = this;

    self.MD = {
        lastBtn: null
    };
});

Template.pwixModal.onRendered( function(){
    const self = this;

    // add a tag class to body element to let the stylesheet identify *this* modal
    $( 'body' ).addClass( 'pwix-modal-dialog-body-class' );

    // make draggable if possible
    if( self.$( '.modal' ).draggable ){
        console.log( 'draggable' );
        self.$( '.modal' ).draggable({
            handle: '.modal-header',
            cursor: 'grab'
        });
    }

    // make resizable if possible
    /*
    if( self.$( '.modal' ).resizable ){
        console.log( 'resizable' );
        self.$( '.modal' ).resizable({
            handles: 'all'
        });
    }
    */

    self.$( '.modal' ).modal( 'show' );

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

    /*
    self.$( '.modal' ).dialog({
        draggable: true,
        resizable: true
    });
    */
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
    }
});

Template.pwixModal.events({
    // remove the Blaze element from the DOM
    'hidden.bs.modal .c-app-modal'( event, instance ){
        $( 'body' ).removeClass( 'pwix-modal-dialog-body-class' );
        Blaze.remove( instance.view );
    }
});
