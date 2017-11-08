import * as css from '../css/style.css';
import * as constants from './constants';
import { inject } from './injector';
import * as storage from './storage';
import { samples } from './sample';
import Container from './Container';
import * as util from './util';

const scripts = [ constants.WRAPPER_SRC ];
inject( scripts );

storage.setSamples( samples );

let containers = [];

setInterval( function() {

  const dialogs = Array.prototype.slice.call(
    util.query( constants.DIALOGS_LIST_SELECTOR, true )
  );

  containers = containers.filter( container => {
    return dialogs.some( dialog => dialog === container.element );
  });

  dialogs.filter( dialog => {
    return containers.every( container => container.element !== dialog );
  }).forEach( dialog => {
    const container = new Container( dialog );
    containers.push( container );
  });

}, constants.INTERVAL_FREQUENCY );