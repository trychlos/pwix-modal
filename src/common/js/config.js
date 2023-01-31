/*
 * pwix:modal/src/common/js/config.js
 */

//console.log( 'pwix:modal/src/common/js/config.js defining globally exported miModalInfo object' );

pwixModal = {

    // client-specific data and functions
    client: {},

    // package configuration
    conf: {},

    // should be *in same terms* called both by the client and the server
    configure: function( o ){
        console.log( 'pwix:modal configure() with', o );
        pwixModal.conf = {
            ...pwixModal.conf,
            ...o
        };
    },

    // server-specific data and functions
    server: {}
};
