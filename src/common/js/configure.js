/*
 * pwix:modal/src/common/js/configure.js
 */

import _ from 'lodash';

Modal._conf = {};

Modal._defaults = {
    verbosity: Modal.C.Verbose.NONE
};

_.merge( Modal._conf, Modal._defaults );

/**
 * @summary Package configuration
 *  Should be called *in same terms* both by the client and the server.
 * @locus Anywhere
 * @param {Object} o the runtime configuration of the package
 * @returns {Object} the package configuration
 */
Modal.configure = function( o ){
    if( o && _.isObject( o )){
        _.merge( Modal._conf, Modal._defaults, o );
        // be verbose if asked for
        if( Modal._conf.verbosity & Modal.C.Verbose.CONFIGURE ){
            console.log( 'pwix:modal configure() with', o, 'building', Modal._conf );
        }
    }
    // also acts as a getter
    return Modal._conf;
};
