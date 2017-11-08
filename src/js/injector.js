import { create, append } from './util';

export function inject( scripts ) {

  scripts.forEach( src => {

    const script = create({
      type : 'script',
      attr : { src : chrome.extension.getURL( src ) }
    });

    append( document.head, script );

  });

}