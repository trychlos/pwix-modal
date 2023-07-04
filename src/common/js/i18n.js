/*
 * pwix:modal/src/common/js/i18n.js
 */

import { pwixI18n } from 'meteor/pwix:i18n';

Modal.i18n = {
    en_US: {
        MD_BUTTON_OK: 'OK',
        MD_BUTTON_CANCEL: 'Cancel',
        MD_BUTTON_CLOSE: 'Close',
        MD_BUTTON_SAVE: 'Save',
        MD_BUTTON_YES: 'Yes',
        MD_BUTTON_NO: 'No'
    },
    fr_FR: {
        MD_BUTTON_OK: 'OK',
        MD_BUTTON_CANCEL: 'Annuler',
        MD_BUTTON_CLOSE: 'Fermer',
        MD_BUTTON_SAVE: 'Enregistrer',
        MD_BUTTON_YES: 'Oui',
        MD_BUTTON_NO: 'Non'
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
