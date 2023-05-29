/*
 * pwix:modal/src/common/js/i18n.js
 */

pwixModal.i18n = {
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
pwixModal.i18n.en = pwixModal.i18n.en_US;
pwixModal.i18n.fr = pwixModal.i18n.fr_FR;
