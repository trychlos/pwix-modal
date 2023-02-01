Package.describe({
    name: 'pwix:modal',
    version: '1.0.0',
    summary: 'A Bootstrap-based package which provides draggable and resizable modal dialogs to Meteor',
    git: 'https://github.com/trychlos/pwix-modal',
    documentation: 'README.md'
});

Package.onUse( function( api ){
    configure( api );
    api.export([
        'pwixModal',
        'MODAL_BTN_OK',
        'MODAL_BTN_CANCEL',
        'MODAL_BTN_CLOSE',
        'MODAL_BTN_SAVE',
        'MODAL_BTN_YES',
        'MODAL_BTN_NO'
    ]);
    api.mainModule( 'src/client/js/index.js', 'client' );
    api.mainModule( 'src/server/js/index.js', 'server' );
});

Package.onTest( function( api ){
    configure( api );
    api.use( 'tinytest' );
    api.use( 'pwix:modal' );
    api.mainModule( 'test/js/index.js' );
});

function configure( api ){
    api.versionsFrom( '2.9.0' );
    api.use( 'blaze-html-templates@2.0.0', 'client' );
    api.use( 'ecmascript' );
    api.use( 'less@4.0.0', 'client' );
    api.use( 'pwix:i18n@1.0.0' );
    api.use( 'tmeasday:check-npm-versions@1.0.2', 'server' );
    api.addFiles( 'src/client/components/pwixModal/pwixModal.js', 'client' );
}

// NPM dependencies are checked in /src/server/js/check_npms.js
// See also https://guide.meteor.com/writing-atmosphere-packages.html#npm-dependencies
