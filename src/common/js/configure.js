/*
 * pwix:modal/src/common/js/configure.js
 */

import _ from 'lodash';

pwixModal._defaults = {
    verbosity: MD_VERBOSE_NONE
};

_.merge( pwixModal._conf, pwixModal._defaults );

/**
 * @summary Package configuration
 *  Should be called *in same terms* both by the client and the server.
 * @locus Anywhere
 * @param {Object} o the runtime configuration of the package
 * @returns {Object} the package configuration
 */
pwixModal.configure = function( o ){
    if( o && _.isObject( o )){
        _.merge( pwixModal._conf, pwixModal._defaults, o );
        // be verbose if asked for
        if( pwixModal._conf.verbosity & MD_VERBOSE_CONFIGURE ){
            console.log( 'pwix:modal configure() with', o, 'building', pwixModal._conf );
        }
    }
    // also acts as a getter
    return pwixModal._conf;
};
