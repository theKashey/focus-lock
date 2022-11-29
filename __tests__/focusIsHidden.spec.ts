import { focusIsHidden, constants } from '../src';

describe('focusIsHidden', () => {
  describe('normal dom', () => {
    const setupTest = () => {
      document.body.innerHTML = `
      <div ${constants.FOCUS_ALLOW}>
        <button id="focus-hidden"></button>
      </div>
      <button id="focus-not-hidden"></button>
    `;
    };

    beforeEach(setupTest);

    it('returns true when the focused element is hidden', () => {
      const button = document.querySelector('#focus-hidden') as HTMLButtonElement;

      button.focus();

      expect(focusIsHidden()).toBe(true);
    });

    it('returns false when the focused element is not hidden', () => {
      const button = document.querySelector('#focus-not-hidden') as HTMLButtonElement;

      button.focus();

      expect(focusIsHidden()).toBe(false);
    });
  });

  describe('shadow dom', () => {
    const setupShadowRoot = () => {
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

      return { root, shadowHtml };
    };

    const setupNestedShadowRoot = () => {
      const { root, shadowHtml } = setupShadowRoot();

      const firstDiv = root.querySelector('#first') as HTMLDivElement;
      const nestedRoot = firstDiv.attachShadow({ mode: 'open' });
      const nestedShadowDiv = document.createElement('div');

      nestedShadowDiv.innerHTML = shadowHtml;
      nestedRoot.appendChild(nestedShadowDiv);
    };

    const runTest = (
      shadowHost: HTMLDivElement,
      button: HTMLButtonElement,
      shouldBeHidden: boolean,
      shouldBeDiscovered: boolean
    ) => {
      button.focus();

      expect(focusIsHidden()).toBe(shouldBeHidden);

      shadowHost.setAttribute(constants.FOCUS_ALLOW, '');

      expect(focusIsHidden()).toBe(shouldBeDiscovered);
    };

    describe('FOCUS_ALLOW behavior', () => {
      it('looks for focus within shadow doms', () => {
        setupShadowRoot();

        const shadowHost = document.querySelector('#shadowdom') as HTMLDivElement;
        const button = shadowHost.shadowRoot?.querySelector('#firstBtn') as HTMLButtonElement;

        runTest(shadowHost, button, false, true);
      });

      it('looks for focus within nested shadow doms', () => {
        setupNestedShadowRoot();

        const shadowHost = document.querySelector('#shadowdom') as HTMLDivElement;
        const nestedShadowHost = shadowHost.shadowRoot?.querySelector('#first') as HTMLDivElement;
        const button = nestedShadowHost.shadowRoot?.querySelector('#firstBtn') as HTMLButtonElement;

        runTest(shadowHost, button, false, true);
      });
    });

    it('does not support marking shadow members as FOCUS_ALLOW', () => {
      setupShadowRoot();

      const shadowHost = document.querySelector('#shadowdom') as HTMLDivElement;
      const shadowDiv = shadowHost.shadowRoot?.querySelector('#last') as HTMLDivElement;
      const button = shadowDiv.children[0] as HTMLButtonElement;

      runTest(shadowDiv, button, false, false);
    });
  });

  describe('iframes', () => {
    const setupIFrame = () => {
      const html = `
      <div id="app">
        <div id="noniframe">
          <input />
          <button>I am a button</button>
        </div>
        <div id="iframe-container">
          <iframe></iframe>
        </div>
      </div>`;
      const iframeHtml = `
      <div id="first"></div>
      <button id="firstBtn">first button</button>
      <div id="last">
        <button id="secondBtn">second button</button>
      </div>
      `;

      document.body.innerHTML = html;

      const iframe = document.querySelector('iframe') as HTMLIFrameElement;
      const root = iframe.contentDocument;

      if (!root) {
        throw new Error('Unable to get iframe content document');
      }

      root.write(iframeHtml);

      return { root, iframeHtml };
    };

    const setupNestedIFrame = () => {
      const { root, iframeHtml } = setupIFrame();

      const firstDiv = root.querySelector('#first') as HTMLDivElement;
      const nestedIFrame = document.createElement('iframe');
      firstDiv.append(nestedIFrame);

      const nestedIFrameRoot = nestedIFrame.contentDocument;

      if (!nestedIFrameRoot) {
        throw new Error('Unable to get iframe content document');
      }

      nestedIFrameRoot.write(iframeHtml);

      return { root, iframeHtml };
    };

    const runTest = (
      iframeContainer: HTMLDivElement,
      button: HTMLButtonElement,
      shouldBeHidden: boolean,
      shouldBeDiscovered: boolean
    ) => {
      button.focus();
      expect(focusIsHidden()).toBe(shouldBeHidden);

      iframeContainer.setAttribute(constants.FOCUS_ALLOW, '');

      expect(focusIsHidden()).toBe(shouldBeDiscovered);
    };

    describe('FOCUS_ALLOW behavior', () => {
      it('looks for focus within iframes', () => {
        const { root } = setupIFrame();

        const iframeContainer = document.querySelector('#iframe-container') as HTMLDivElement;
        const button = root.querySelector('#firstBtn') as HTMLButtonElement;

        runTest(iframeContainer, button, false, true);
      });

      it('looks for focus within nested iframes', () => {
        const { root } = setupNestedIFrame();

        const iframeContainer = document.querySelector('#iframe-container') as HTMLDivElement;
        const nestedIframe = root.querySelector('iframe') as HTMLIFrameElement;

        const nestedIFrameRoot = nestedIframe.contentDocument;

        if (!nestedIFrameRoot) {
          throw new Error('Unable to get iframe content document');
        }

        // JSDom doesn't properly support focusing directly in a nested iframe.
        // As a workaround we need to first focus in the iframe and then on the button
        nestedIframe.focus();

        const button = nestedIFrameRoot.querySelector('#firstBtn') as HTMLButtonElement;
        runTest(iframeContainer, button, false, true);
      });
    });

    it('does not support marking shadow members as FOCUS_ALLOW', () => {
      const { root } = setupIFrame();

      const iframeDiv = root.querySelector('#last') as HTMLDivElement;
      const button = iframeDiv.children[0] as HTMLButtonElement;

      runTest(iframeDiv, button, false, false);
    });
  });
});
