/*
 * pwix:modal/src/common/js/configure.js
 */

import _ from 'lodash';

import { ReactiveVar } from 'meteor/reactive-var';

let _conf = {};
Modal._conf = new ReactiveVar( _conf );

Modal._defaults = {
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
        // check that keys exist
        let built_conf = {};
        Object.keys( o ).forEach(( it ) => {
            if( Object.keys( Modal._defaults ).includes( it )){
                built_conf[it] = o[it];
            } else {
                console.warn( 'pwix:modal configure() ignore unmanaged key \''+it+'\'' );
            }
        });
        if( Object.keys( built_conf ).length ){
            _conf = _.merge( Modal._defaults, _conf, built_conf );
            Modal._conf.set( _conf );
            // be verbose if asked for
            if( _conf.verbosity & Modal.C.Verbose.CONFIGURE ){
                //console.log( 'pwix:modal configure() with', o, 'building', _conf );
                console.log( 'pwix:modal configure() with', built_conf );
            }
        }
    }
    // also acts as a getter
    return Modal._conf.get();
};

_conf = _.merge( {}, Modal._defaults );
Modal._conf .set( _conf );
