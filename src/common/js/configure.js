/*
 * pwix:modal/src/common/js/configure.js
 */

import _ from 'lodash';

import { ReactiveVar } from 'meteor/reactive-var';

let _conf = {};

const _defaults = {
    closeByBackdrop: true,
    contentClassesArray: null,
    verbosity: Modal.C.Verbose.CONFIGURE
};

/**
 * @summary Package configuration
 *  Should be called *in same terms* both by the client and the server.
 * @locus Anywhere
 * @param {Object} o the runtime configuration of the package
 * @returns {Object} the package configuration
 */
Modal.configure = function( o ){
    if( o && _.isObject( o )){
        _conf = _.merge( _defaults, _conf, o );
        Modal._conf.set( _conf );
        // be verbose if asked for
        if( _conf.verbosity & Modal.C.Verbose.CONFIGURE ){
            //console.log( 'pwix:modal configure() with', o, 'building', _conf );
            console.log( 'pwix:modal configure() with', o );
        }
    }
    // also acts as a getter
    return Modal._conf.get();
};

_conf = _.merge( {}, Modal._defaults );
Modal._conf = new ReactiveVar( _conf );
