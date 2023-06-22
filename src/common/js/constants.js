/*
 * pwix:modal/src/client/js/constants.js
 */

// known buttons
//
// note to the maintainer: each constant is:
//  - defined here
//  - exported in /package.js
//  - have a internationalizable label in /src/common/js/i18n.js
//  - documented in /README.md
//  - listed in /src/client/js/functions.js

MD_BUTTON_OK = 'MD_BUTTON_OK';
MD_BUTTON_CANCEL = 'MD_BUTTON_CANCEL';
MD_BUTTON_CLOSE = 'MD_BUTTON_CLOSE';
MD_BUTTON_SAVE = 'MD_BUTTON_SAVE';
MD_BUTTON_YES = 'MD_BUTTON_YES';
MD_BUTTON_NO = 'MD_BUTTON_NO';

// vertical position
MD_POSITION_CENTER = 'MD_POSITION_CENTER';

// verbosity level
MD_VERBOSE_NONE           = 0x00;
MD_VERBOSE_CONFIGURE      = 0x01 <<  0;
MD_VERBOSE_NOMODAL        = 0x01 <<  1;

// not exported

I18N = 'pwix:modal:i18n:namespace';
