/**
 * list of the object to be considered as focusable
 */
export default [
  'button:enabled',
  'select:enabled',
  'textarea:enabled',
  'input:enabled',

  'a[href]',
  'area[href]',

  'summary',
  'iframe',
  'object',
  'embed',

  'audio[controls]',
  'video[controls]',

  '[tabindex]',
  '[contenteditable]',
  '[autofocus]',
];
