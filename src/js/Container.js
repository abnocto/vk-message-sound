import {
  CROSS_SRC, NOTE_SRC,
  NOTE_CLASS, DIV_CLASS,
  DIALOG_SENDER_ATTR_KEY,
  SENDER_ID_LIMIT
} from './constants';
import * as storage from './storage';
import * as util from './util';

export default class Container {

  constructor( element ) {
    this.element = element;
    this.sender  = this.getSender();
    this.sound   = storage.getSound( this.sender );
    if ( this.sender ) {
      this.div  = this.createDiv();
      util.append( this.element, this.div );
      this.note = this.createNote();
      util.append( this.element, this.note );
    }
  }

  getSender() {
    const sender = parseInt( util.getAttr( this.element, DIALOG_SENDER_ATTR_KEY ) );
    if ( !sender || sender >= SENDER_ID_LIMIT ) return null;
    return sender;
  }

  createNote() {

    const note = util.create({
      type      : 'img',
      className : NOTE_CLASS,
      attr      : { src : chrome.extension.getURL( NOTE_SRC ) }
    });

    util.on( note, 'click', event => {
      event.stopImmediatePropagation();
      const display = this.div && util.getStyle( this.div, 'display' );
      const toggled = display === 'none' ? 'block' : 'none';
      this.div && util.setStyle( this.div, 'display', toggled );
    });

    return note;

  }

  createDiv( isVisible ) {

    const trTop = util.create({ type : 'tr' });
    util.append( trTop, this.createNameCell()   );
    util.append( trTop, this.createPlayCell()   );
    util.append( trTop, this.createRemoveCell() );

    const trBottom = util.create({ type : 'tr' });
    util.append( trBottom, this.createSelectCell() );
    util.append( trBottom, this.createUpdateCell() );

    const table = util.create({ type : 'table' });
    util.append( table, trTop    );
    util.append( table, trBottom );

    const div = util.create({
      type      : 'div',
      className : DIV_CLASS,
      style     : { display : isVisible ? 'block' : 'none' }
    });
    util.append( div, table );

    util.on( div, 'click', event => event.stopImmediatePropagation() );

    return div;

  }

  createNameCell() {
    const name = `Сигнал: ${ this.sound ? this.sound.name : 'Стандартный' }`;
    return util.create({ type : 'td', text : name });
  }

  createPlayCell() {

    let play;

    if ( this.sound ) {

      play = util.create({
        type : 'img',
        attr : {
          src   : chrome.extension.getURL( NOTE_SRC ),
          title : 'Воспроизвести сигнал'
        }
      });

      util.on( play, 'click', event => {
        event.stopImmediatePropagation();
        new Audio( this.sound.url ).play();
      });

    }

    const tdPlay = util.create({ type : 'td' });
    if ( this.sound ) {
      util.append( tdPlay, play );
    }

    return tdPlay;

  }

  createRemoveCell() {

    let remove;

    if ( this.sound ) {

      remove = util.create({
        type : 'img',
        attr : {
          src   : chrome.extension.getURL( CROSS_SRC ),
          title : 'Сбросить сигнал на стандартный'
        }
      });

      util.on( remove, 'click', event => {
        event.stopImmediatePropagation();
        storage.removeSound( this.sender );
        this.reload();
      });

    }

    const tdRemove = util.create({ type : 'td' });
    if ( this.sound ) {
      util.append( tdRemove, remove );
    }

    return tdRemove;

  }

  createSelectCell() {

    const samples = storage.getSamples();

    const options = [
      util.create({
        type : 'option',
        attr : { value : -1 },
        text : '-'
      })
    ];

    samples.forEach( sample => {
      const option = util.create({
        type  : 'option',
        attr  : { value : sample.id },
        text  : sample.name
      });
      options.push( option );
    });

    const select = util.create({ type : 'select' });

    options.forEach( option => {
      util.append( select, option );
    });

    util.on( select, 'change', event => {

      event.stopImmediatePropagation();
      const sampleId = parseInt( select.value );

      if ( sampleId !== -1 ) {

        const samplesList = Array.prototype.slice.call( samples );
        const sample = samplesList.find( iSample => iSample.id === sampleId );

        if ( sample ) {
          const sound = {
            name   : sample.name,
            url    : sample.url,
            sender : this.sender
          };
          storage.addSound( sound );
          this.reload();
        }

      }

    });

    const tdSelect = util.create({ type : 'td', attr : { colspan : '2' } });
    util.append( tdSelect, select );

    return tdSelect;

  }

  createUpdateCell() {

    const input = util.create({
      type : 'input',
      attr : { type : 'file', accept : 'audio/*' }
    });

    util.on( input, 'change', event => {

      event.stopImmediatePropagation();
      const fileData = input.files[0];

      if ( fileData.type.indexOf( 'audio/' ) !== -1 ) {

        const reader = new FileReader();

        util.on( reader, 'loadend', event => {

          event.stopImmediatePropagation();

          const sound = {
            name : fileData.name,
            url  : reader.result.toString(),
            sender : this.sender
          };

          try {
            storage.addSound( sound );
            this.reload();
          } catch ( ex ) {
            this.reload();
            this.addError('Файл превышает максимально допустимый размер!');
          }

        });

        reader.readAsDataURL( fileData );

      } else {
        this.reload();
        this.addError('Файл имеет недопустимый формат!');
      }

    });

    const tdUpdate = util.create({ type : 'td' });
    util.append( tdUpdate, input );

    return tdUpdate;

  }

  reload() {
    util.remove( this.div );
    this.sound = storage.getSound( this.sender );
    this.div = this.createDiv( true );
    this.element.insertBefore( this.div, this.note );
  }

  addError( errorMessage ) {
    const p = util.create({ type : 'p', text : errorMessage });
    util.append( this.div, p );
  }

}