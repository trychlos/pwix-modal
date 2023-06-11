/*
 * pwix:modal/src/common/js/configure.js
 */

_defaults = {
    verbosity: MD_VERBOSE_NONE
};

pwixModal._conf = { ...defaults };

/**
 * @summary Package configuration
 * @locus Anywhere
 * @param {Object} o the runtime configuration of the package
 *  Should be *in same terms* called both by the client and the server.
 */
pwixModal.configure = function( o ){
    pwixModal._conf = { ...defaults, ...o };

    if( pwixModal._conf.verbosity & MD_VERBOSE_CONFIGURE ){
        console.log( 'pwix:modal configure() with', o, 'building', pwixModal._conf );
    }
};
