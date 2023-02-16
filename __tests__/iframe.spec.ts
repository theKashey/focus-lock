import { focusMerge, focusNextElement /*, focusPrevElement*/ } from '../src';

describe('iframes', () => {
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  it('support for iframes', () => {
    const html = `
      <div id="app">
            <input />
            <button>I am a button</button>
          <iframe></iframe>
      </div>`;
    const iframeHtml = `
          <div id="first"></div>
          <button id="firstBtn">first button</button>
          <button id="secondBtn">second button</button>
          <div id="last"></div>
      `;
    document.body.innerHTML = html;

    const iframe = document.querySelector('iframe') as HTMLIFrameElement;
    const root = iframe.contentDocument;

    if (!root) {
      throw new Error('Unable to get iframe content document');
    }

    root.write(iframeHtml);

    const firstBtn = root.getElementById('firstBtn');

    expect(focusMerge(root.body, null)).toEqual({
      node: firstBtn,
    });
  });

  it('iframe dom element', () => {
    const html = `
      <div id="app">
            <input />
            <button>I am a button</button>
          <iframe></iframe>
          <button>I should be not be focused<button>
      </div>`;
    const iframeHtml = `
      <input />
      <button>I am a button</button>
      `;
    document.body.innerHTML = html;

    const iframe = document.querySelector('iframe') as HTMLIFrameElement;
    const root = iframe.contentDocument;

    if (!root) {
      throw new Error('Unable to get iframe content document');
    }

    root.write(iframeHtml);

    const input = root.querySelector('input') as HTMLInputElement;

    expect(focusMerge(document.body, null)).toEqual({
      node: input,
    });
  });

  // jsdom has no iframe security. We cannot test this here
  it('iframe on another domain', () => {
    const html = `
      <div id="app">
            <input />
            <button>I am a button</button>          
          <iframe src="https://localhost:9090/not-existing"></iframe>
          <button>I should be not be focused<button>
      </div>`;
    document.body.innerHTML = html;

    expect(focusMerge(document.body, null)).toEqual({
      node: expect.any(HTMLInputElement),
    });
  });

  it('iframe respect tabIndex', () => {
    const html = `
      <div id="app">
            <input />
            <button>I am a button</button>
          <iframe></iframe>
          <button id="focused" tabindex="100" >I should be focused<button>
      </div>`;
    const iframeHtml = `
    <input />
    <button>I am a button</button>
      `;
    document.body.innerHTML = html;

    const iframe = document.querySelector('iframe') as HTMLIFrameElement;
    const root = iframe.contentDocument;

    if (!root) {
      throw new Error('Unable to get iframe content document');
    }

    root.write(iframeHtml);

    const input = root.querySelector('input') as HTMLInputElement;
    const button = root.querySelector('button') as HTMLButtonElement;

    expect(focusMerge(document.body, null)).toEqual({
      node: document.querySelector('#focused'),
    });

    expect(focusMerge([input, button], null)).toEqual({
      node: input,
    });
  });

  it('focusNextElement w/in iframes respects out of order tabIndex', () => {
    document.body.innerHTML = `
      <input tabIndex="1"></button>
      <iframe></iframe>
      <button tabindex="2"></button>
    `;

    const iframeHtml = `
      <div id="app">
        <input />
        <button tabindex="3"></button>
      </div>
    `;

    const iframe = document.querySelector('iframe') as HTMLIFrameElement;
    const root = iframe.contentDocument;

    if (!root) {
      throw new Error('Unable to get iframe content document');
    }

    root.write(iframeHtml);

    const iframeInput = root.querySelector('input') as HTMLInputElement;
    const iframeButton = root.querySelector('button') as HTMLButtonElement;
    const input = document.querySelector('input') as HTMLInputElement;
    const button = document.querySelector('button') as HTMLButtonElement;

    focusMerge(document.body, null)?.node?.focus();
    expect(document.activeElement).toBe(input);

    focusNextElement(input);
    expect(document.activeElement).toBe(button);
    focusNextElement(button);
    expect(root.activeElement).toBe(iframeButton);
    focusNextElement(iframeButton);
    expect(root.activeElement).toBe(iframeInput);
  });
});
