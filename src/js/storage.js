import { LOCAL_STORAGE_PROP, LOCAL_STORAGE_SAMPLES_PROP } from './constants';

export function addSound( sound ) {
  const list = JSON.parse( localStorage.getItem( LOCAL_STORAGE_PROP ) ) || [];
  const soundIndex = list.findIndex( isound => isound.sender === sound.sender );
  if ( soundIndex !== -1 ) {
    list.splice( soundIndex, 1 );
  }
  list.push( sound );
  localStorage.setItem( LOCAL_STORAGE_PROP, JSON.stringify( list ) );
}

export function removeSound( sender ) {
  const list = JSON.parse( localStorage.getItem( LOCAL_STORAGE_PROP ) );
  if ( !list ) return;
  const soundIndex = list.findIndex( sound => sound.sender === sender );
  if ( soundIndex === -1 ) return;
  list.splice( soundIndex, 1 );
  localStorage.setItem( LOCAL_STORAGE_PROP, JSON.stringify( list ) );
}

export function getSound( sender ) {
  const list = JSON.parse( localStorage.getItem( LOCAL_STORAGE_PROP ) );
  return list ? list.find( sound => sound.sender === sender ) : null;
}

export function areSamples() {
  return Array.isArray( JSON.parse( localStorage.getItem( LOCAL_STORAGE_SAMPLES_PROP ) ) );
}

export function setSamples( samples ) {
  localStorage.setItem( LOCAL_STORAGE_SAMPLES_PROP, JSON.stringify( samples ) );
}

export function getSamples() {
  return JSON.parse( localStorage.getItem( LOCAL_STORAGE_SAMPLES_PROP ) ) || [];
}