/**
 * returns active element from document or from nested shadowdoms
 */
import { safeProbe } from './safe';

export const getActiveElement = (inDocument: Document | ShadowRoot | undefined = document): HTMLElement | undefined => {
  if (!inDocument || !inDocument.activeElement) {
    return undefined;
  }

  const { activeElement } = inDocument;

  return (
    activeElement.shadowRoot
      ? getActiveElement(activeElement.shadowRoot)
      : activeElement instanceof HTMLIFrameElement && safeProbe(() => activeElement.contentWindow!.document)
      ? getActiveElement(activeElement.contentWindow!.document)
      : activeElement
  ) as HTMLElement;
};
