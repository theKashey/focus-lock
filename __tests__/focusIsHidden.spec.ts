import { focusIsHidden, constants } from '../src';

describe('focusIsHidden', () => {
  const setupTest = () => {
    document.body.innerHTML = `
      <div ${constants.FOCUS_ALLOW}>
        <button id="focus-hidden"></button>
      </div>
      <button id="focus-not-hidden"></button>
    `;
  };

  it('returns true when the focused element is hidden', () => {
    setupTest();

    const button = document.querySelector('#focus-hidden') as HTMLButtonElement;

    button.focus();

    expect(focusIsHidden()).toBe(true);
  });

  it('returns false when the focused element is not hidden', () => {
    setupTest();

    const button = document.querySelector('#focus-not-hidden') as HTMLButtonElement;

    button.focus();

    expect(focusIsHidden()).toBe(false);
  });

  const setupShadowTest = (nested?: boolean) => {
    const html = `
      <div id="app">
        <div id="nonshadow">
          <input />
          <button>I am a button</button>
        </div>
        <div id="shadowdom"></div>
      </div>`;
    const shadowHtml = `
      <div id="first"></div>
      <button id="firstBtn">first button</button>
      <div id="last">
        <button id="secondBtn">second button</button>
      </div>
      `;
    document.body.innerHTML = html;

    const shadowContainer = document.getElementById('shadowdom') as HTMLElement;
    const root = shadowContainer.attachShadow({ mode: 'open' });
    const shadowDiv = document.createElement('div');
    shadowDiv.innerHTML = shadowHtml;
    root.appendChild(shadowDiv);

    if (nested) {
      const firstDiv = root.querySelector('#first') as HTMLDivElement;
      const nestedRoot = firstDiv.attachShadow({ mode: 'open' });
      const nestedShadowDiv = document.createElement('div');

      nestedShadowDiv.innerHTML = shadowHtml;
      nestedRoot.appendChild(nestedShadowDiv);
    }
  };

  it('looks for focus within shadow doms', () => {
    setupShadowTest();

    const shadowHost = document.querySelector('#shadowdom') as HTMLDivElement;
    const button = shadowHost.shadowRoot?.querySelector('#firstBtn') as HTMLButtonElement;

    button.focus();

    expect(focusIsHidden()).toBe(false);

    shadowHost.setAttribute(constants.FOCUS_ALLOW, '');

    expect(focusIsHidden()).toBe(true);
  });

  it('looks for focus within nested shadow doms', () => {
    setupShadowTest(true);

    const shadowHost = document.querySelector('#shadowdom') as HTMLDivElement;
    const nestedShadowHost = shadowHost.shadowRoot?.querySelector('#first') as HTMLDivElement;
    const button = nestedShadowHost.shadowRoot?.querySelector('#firstBtn') as HTMLButtonElement;

    button.focus();

    expect(focusIsHidden()).toBe(false);

    shadowHost.setAttribute(constants.FOCUS_ALLOW, '');

    expect(focusIsHidden()).toBe(true);
  });

  it('does not support marking shadow members as FOCUS_ALLOW', () => {
    setupShadowTest();

    const shadowHost = document.querySelector('#shadowdom') as HTMLDivElement;
    const shadowDiv = shadowHost.shadowRoot?.querySelector('#last') as HTMLDivElement;
    const button = shadowDiv.children[0] as HTMLButtonElement;

    button.focus();

    expect(focusIsHidden()).toBe(false);

    // Setting elements within shadow doms as FOCUS_ALLOW not supported
    shadowDiv.setAttribute(constants.FOCUS_ALLOW, '');

    expect(focusIsHidden()).toBe(false);
  });
});
