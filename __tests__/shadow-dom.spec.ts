import { focusMerge, focusNextElement, focusPrevElement } from '../src';

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

  it('web components dom element', () => {
    // source: https://github.com/pearofducks/focus-lock-reproduction
    expect.assertions(1);

    class FocusWithinShadow extends HTMLElement {
      public connectedCallback() {
        const html = `
          <div id="app">
            <input />
            <button>I am a button</button>
          </div>
        `;
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = html;

        expect(focusMerge(document.body, null)).toEqual({
          node: shadow.querySelector('input'),
        });
      }
    }

    customElements.define('focus-within-shadow', FocusWithinShadow);

    document.body.innerHTML = `
      <focus-within-shadow></focus-within-shadow>
      <button>I should not be focused<button>
    `;
  });

  it('web components respect tabIndex', () => {
    expect.assertions(2);

    class FocusOutsideShadow extends HTMLElement {
      public connectedCallback() {
        const html = `
          <div id="app">
            <input />
            <button>I am a button</button>
          </div>
        `;
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = html;

        const input = shadow.querySelector('input') as HTMLInputElement;
        const button = shadow.querySelector('button') as HTMLButtonElement;

        expect(focusMerge(document.body, null)).toEqual({
          node: document.querySelector('#focused'),
        });

        expect(focusMerge([input, button], null)).toEqual({
          node: input,
        });
      }
    }

    customElements.define('focus-outside-shadow', FocusOutsideShadow);

    document.body.innerHTML = `
      <focus-outside-shadow></focus-outside-shadow>
      <button id="focused" tabindex="100" >I should be focused<button>
    `;
  });

  it('focusNextElement w/ web components respects out of order tabIndex', () => {
    expect.assertions(4);

    class FocusNextOOO extends HTMLElement {
      public connectedCallback() {
        const html = `
          <div id="app">
            <input />
            <button tabindex="3"></button>
          </div>
        `;
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = html;

        const shadowInput = shadow.querySelector('input') as HTMLInputElement;
        const shadowButton = shadow.querySelector('button') as HTMLButtonElement;
        const input = document.querySelector('input') as HTMLInputElement;
        const button = document.querySelector('button') as HTMLButtonElement;

        focusMerge(document.body, null)?.node?.focus();
        expect(document.activeElement).toBe(input);

        focusNextElement(input);
        expect(document.activeElement).toBe(button);

        focusNextElement(button);
        expect(document.activeElement?.shadowRoot?.activeElement).toBe(shadowButton);

        focusNextElement(shadowButton);
        expect(document.activeElement?.shadowRoot?.activeElement).toBe(shadowInput);
      }
    }

    customElements.define('focus-next-ooo', FocusNextOOO);

    document.body.innerHTML = `
      <input tabIndex="1"></button>
      <focus-next-ooo></focus-next-ooo>
      <button tabindex="2"></button>
    `;
  });

  it('focusPrevElement w/ web components respects out of order tabIndex', () => {
    expect.assertions(4);

    class FocusPrevOOO extends HTMLElement {
      public connectedCallback() {
        const html = `
          <div id="app">
            <input />
            <button tabindex="3"></button>
          </div>
        `;
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = html;

        const shadowInput = shadow.querySelector('input') as HTMLInputElement;
        const shadowButton = shadow.querySelector('button') as HTMLButtonElement;
        const input = document.querySelector('input') as HTMLInputElement;
        const button = document.querySelector('button') as HTMLButtonElement;

        focusMerge(document.body, null)?.node?.focus();
        expect(document.activeElement).toBe(input);

        focusPrevElement(input);
        expect(document.activeElement?.shadowRoot?.activeElement).toBe(shadowInput);

        focusPrevElement(shadowInput);
        expect(document.activeElement?.shadowRoot?.activeElement).toBe(shadowButton);

        focusPrevElement(shadowButton);
        expect(document.activeElement).toBe(button);
      }
    }

    customElements.define('focus-prev-ooo', FocusPrevOOO);

    document.body.innerHTML = `
      <input tabIndex="1"></button>
      <focus-prev-ooo></focus-prev-ooo>
      <button tabindex="2"></button>
    `;
  });
});
