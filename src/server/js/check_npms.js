/*
 * pwix:modal/src/server/js/check_npms.js
 */

import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

if( false ){
    //require( '@popperjs/core/package.json' );
}

checkNpmVersions({
    'lodash': '^4.17.0'
},
    'pwix:modal'
);
