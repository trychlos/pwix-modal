/*
 * pwix:modal/src/client/js/constants.js
 */

Modal.C = {

    // known buttons
    // note to the maintainer: each constant is:
    //  - defined here
    //  - have a internationalizable label in /src/common/js/i18n.js
    //  - documented in /README.md
    Button: {
        OK: 'OK',
        CANCEL: 'CANCEL',
        CLOSE: 'CLOSE',
        SAVE: 'SAVE',
        YES: 'YES',
        NO: 'NO'
    },

    // (vertical) position
    Position: {
        CENTER: 'CENTER'
    },

    // verbosity levels
    Verbose: {
        NONE: 0,
        CONFIGURE: 0x01 <<  0,
        NOMODAL:   0x01 <<  1
    }
};

// not exported

I18N = 'pwix:modal:i18n:namespace';
