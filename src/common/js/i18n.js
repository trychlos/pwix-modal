/*
 * pwix:modal/src/common/js/i18n.js
 */

import { pwixI18n } from 'meteor/pwix:i18n';

Modal.i18n = {
    en_US: {
        OK: 'OK',
        CANCEL: 'Cancel',
        CLOSE: 'Close',
        SAVE: 'Save',
        YES: 'Yes',
        NO: 'No',
        NEW: 'New...'
    },
    fr_FR: {
        OK: 'OK',
        CANCEL: 'Annuler',
        CLOSE: 'Fermer',
        SAVE: 'Enregistrer',
        YES: 'Oui',
        NO: 'Non',
        NEW: 'Nouveau...'
    }
};

// actually a package should only provide these short language fallbacks
Modal.i18n.en = Modal.i18n.en_US;
Modal.i18n.fr = Modal.i18n.fr_FR;

pwixI18n.namespace( I18N, Modal.i18n );

/**
 * @returns {String} the i18n namespace of the package
 */
Modal.i18n.namespace = function(){
    return I18N;
};
