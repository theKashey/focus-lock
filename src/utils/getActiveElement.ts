const getNestedShadowActiveElement = (shadowRoot: ShadowRoot): HTMLElement | undefined =>
  shadowRoot.activeElement
    ? shadowRoot.activeElement.shadowRoot
      ? getNestedShadowActiveElement(shadowRoot.activeElement.shadowRoot)
      : (shadowRoot.activeElement as HTMLElement)
    : undefined;

const getNestedIframeActiveElement = (iframe: HTMLIFrameElement): HTMLElement | undefined => {
  const activeElement = iframe?.contentWindow?.document?.activeElement;

  return activeElement
    ? activeElement instanceof HTMLIFrameElement
      ? getNestedIframeActiveElement(activeElement)
      : (activeElement as HTMLElement)
    : undefined;
};

/**
 * returns active element from document or from nested shadowdoms
 */
export const getActiveElement = (): HTMLElement | undefined => {
  return (
    document.activeElement
      ? document.activeElement.shadowRoot
        ? getNestedShadowActiveElement(document.activeElement.shadowRoot)
        : document.activeElement instanceof HTMLIFrameElement
        ? getNestedIframeActiveElement(document.activeElement)
        : document.activeElement
      : undefined
  ) as any; // eslint-disable-next-line @typescript-eslint/no-explicit-any
};
