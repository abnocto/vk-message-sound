export function append( target, element ) {
  target.appendChild( element );
}

export function getAttr( element, key ) {
  return element.getAttribute( key );
}

export function getStyle( element, key ) {
  return element.style[ key ];
}

export function create( data ) {
  const { type, className, attr, style, text } = data;
  let element = null;
  if ( type ) {
    element = document.createElement( type );
    if ( className ) {
      element.classList.add( className );
    }
    if ( attr ) {
      for ( let key in attr ) {
        element.setAttribute( key, attr[ key ] );
      }
    }
    if ( style ) {
      for ( let key in style ) {
        element.style[ key ] = style[ key ];
      }
    }
    if ( text ) {
      element.innerText = text;
    }
  }
  return element;
}

export function on( element, type, callback ) {
  element.addEventListener( type, callback, false );
}

export function query( selector, allFlag ) {
  return document[`querySelector${ allFlag ? 'All' : '' }`]( selector );
}

export function remove( element ) {
  element.parentNode.removeChild( element );
}

export function setAttr( element, key, val ) {
  element.setAttribute( key, val );
}

export function setStyle( element, key, val ) {
  element.style[ key ] = val;
}