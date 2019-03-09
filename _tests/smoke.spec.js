import {expect} from 'chai';

import {focusInside, focusMerge} from '../src/';

describe('smoke', () => {
  const createTest = () => {
    document.body.innerHTML = `    
    <div id="d1"> 
    <button>1</button>
    <button>2</button>
    </div>
    <div id="d2">
    <button>3</button>
    <button>4</button>
    </div>
    <div id="d3">
    <button>3</button>
    <button>4</button>
    </div>
    <div id="d4" tabindex="1">    
    </div>
    `;
  };

  describe('FocusInside', () => {
    it('false - when there is no focus', () => {
      createTest();
      expect(focusInside(document.body)).to.be.equal(true);
      expect(focusInside(document.querySelector('#d1'))).to.be.equal(false);
      expect(focusInside(document.querySelector('#d2'))).to.be.equal(false);
      expect(focusInside(document.querySelector('#d3'))).to.be.equal(false);
      expect(focusInside(document.querySelector('#d4'))).to.be.equal(false);
    });

    it('true - when focus in d1', () => {
      createTest();
      document.querySelector('#d1 button').focus();
      expect(focusInside(document.body)).to.be.equal(true);
      expect(focusInside(document.querySelector('#d1'))).to.be.equal(true);
      expect(focusInside(document.querySelector('#d2'))).to.be.equal(false);
    });

    it('true - when focus on d4 (tabbable)', () => {
      createTest();
      document.querySelector('#d4').focus();
      expect(focusInside(document.body)).to.be.equal(true);
      expect(focusInside(document.querySelector('#d4'))).to.be.equal(true);
      expect(focusInside(document.querySelector('#d1'))).to.be.equal(false);
    });

    it('multi-test', () => {
      createTest();
      document.querySelector('#d1 button').focus();
      expect(focusInside(document.body)).to.be.equal(true);
      expect(focusInside(document.querySelector('#d1'))).to.be.equal(true);
      expect(focusInside([document.querySelector('#d1')])).to.be.equal(true);
      expect(focusInside([document.querySelector('#d2')])).to.be.equal(false);
      expect(focusInside([document.querySelector('#d1'), document.querySelector('#d2')])).to.be.equal(true);
      expect(focusInside([document.querySelector('#d2'), document.querySelector('#d3')])).to.be.equal(false);
      expect(focusInside([document.querySelector('#d3'), document.querySelector('#d1')])).to.be.equal(true);
    });
  });

  describe('FocusMerge', () => {
    it('move focus', () => {
      createTest();
      document.querySelector('#d4').focus();
      focusMerge(document.querySelector('#d1'), null).node.focus();
      expect(focusInside(document.querySelector('#d1'))).to.be.equal(true);

      focusMerge(document.querySelector('#d2'), null).node.focus();
      expect(focusInside(document.querySelector('#d2'))).to.be.equal(true);

      expect(focusMerge([document.querySelector('#d2'), document.querySelector('#d3')], null)).to.be.equal(undefined);
      expect(focusInside(document.querySelector('#d2'))).to.be.equal(true);

      focusMerge([document.querySelector('#d3'), document.querySelector('#d4')], null).node.focus();
      expect(focusInside(document.querySelector('#d3'))).to.be.equal(true);
    });
  });

});