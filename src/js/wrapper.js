import * as storage from './storage';
import * as constants from './constants';

function wrap() {

  const wrapIntervalID = setInterval( function() {

    if ( window.Notifier && window.Notifier.pushEvent ) {

      const original = window.Notifier.pushEvent;

      let originalPlay;
      if ( window.curNotifier && window.curNotifier.sound_im ) {
        originalPlay = window.curNotifier.sound_im.playSound;
      }

      window.Notifier.pushEvent = function( dataString ) {

        const dataList = dataString.split( constants.DELIMITER );
        
        if ( dataList[ constants.TYPE_INDEX ] === constants.MAIL_TYPE ) {
          const sender = parseInt( dataList[ constants.SENDER_INDEX ] );
          const sound  = storage.getSound( sender );
          if ( sound ) {
            if ( window.curNotifier && window.curNotifier.sound_im ) {
              window.curNotifier.sound_im.playSound = x => new Audio( sound.url ).play();
            }
          } else {
            if ( window.curNotifier && window.curNotifier.sound_im ) {
              window.curNotifier.sound_im.playSound = originalPlay;
            }
          }
        }

        original.apply( window.Notifier, arguments );

      };

      clearInterval( wrapIntervalID );

    }

  }, constants.INTERVAL_FREQUENCY );

}

wrap();