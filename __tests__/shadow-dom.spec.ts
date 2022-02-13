import { focusMerge } from '../src';

describe('shadow dow ', () => {
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = '';
  });
  it('supports detached elements', () => {
    document.body.innerHTML = `<div><button></button></div>`;
    const frag = document.createDocumentFragment();
    const button = document.createElement('button');
    frag.appendChild(button);

    expect(focusMerge(document.body, null)).toEqual({
      node: button,
    });
  });

  it('support for shadow dom', () => {
    const html = `
      <div id="app">
            <input />
            <button>I am a button</button>
          <div id="shadowdom"></div>
      </div>`;
    const shadowHtml = `
          <div id="first"></div>
          <button id="firstBtn">first button</button>
          <button id="secondBtn">second button</button>
          <div id="last"></div>
      `;
    document.body.innerHTML = html;
    const shadowContainer = document.getElementById('shadowdom') as HTMLElement;
    const root = shadowContainer.attachShadow({ mode: 'open' });
    const shadowDiv = document.createElement('div');
    shadowDiv.innerHTML = shadowHtml;
    root.appendChild(shadowDiv);
    const firstBtn = root.getElementById('firstBtn');
    expect(focusMerge(shadowDiv, null)).toEqual({
      node: firstBtn,
    });
  });

  // customElements are not supported
  it.skip('web components dom element', () => {
    // source: https://github.com/pearofducks/focus-lock-reproduction
    expect.assertions(1);

    class ReproElement extends HTMLElement {
      public connectedCallback() {
        const html = `
          <div id="app">
            <input />
            <button>I am a button</button>
          </div>
        `;
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = html;
        const app = shadow.querySelector('#app');
        expect(focusMerge(app! as any, null)).toEqual({
          node: expect.anything(),
        });
      }
    }

    if (!customElements.get('repro-element')) {
      customElements.define('repro-element', ReproElement);
    }

    document.body.innerHTML = `<repro-element></repro-element>`;
  });
});
