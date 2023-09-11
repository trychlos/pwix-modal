/*
 * pwix:modal/src/client/js/constants.js
 */

Modal.C = {

    // known standard button identifiers
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

    // verbosity levels
    Verbose: {
        NONE: 0,
        CONFIGURE: 0x01 <<  0,
        NOMODAL:   0x01 <<  1,
        STACK:     0x01 <<  2,
        RESIZING:  0x01 <<  3
    }
};

// private

Modal._btnDefs = {
    OK: {
        dismiss: true
    },
    CANCEL: {
        dismiss: true
    },
    CLOSE: {
        dismiss: true
    },
    SAVE: {
        dismiss: true
    },
    YES: {
        dismiss: true
    },
    NO: {
        dismiss: true
    }
};

// not exported

I18N = 'pwix:modal:i18n:namespace';

// key of the data attached to button element
BTNKEY = 'pwix:modal/button:data'
