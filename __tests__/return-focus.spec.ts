import { captureFocusRestore } from '../src/return-focus';

const getb = () => {
  const b1 = document.getElementById('b1')! as HTMLButtonElement;
  const restore = captureFocusRestore(b1);

  return { b1, restore };
};

test('returns focus to the original location', () => {
  document.body.innerHTML = `
     <div><button id="b1"></button></div>
   `;

  const { b1, restore } = getb();
  expect(restore()).toBe(b1);
});

test('on deletion returns focus to the element to the right location', () => {
  document.body.innerHTML = `
     <div><button id="b0"><button id="b1"><button id="b3"></button></div>
   `;

  const { b1, restore } = getb();
  b1.parentElement!.removeChild(b1);
  expect(restore()).toBe(document.getElementById('b3'));
});

test('on deletion returns focus to the element to the right location with spaces', () => {
  document.body.innerHTML = `
     <div><button id="b0"><button id="b1"><span/><button id="b3"></button></div>
   `;

  const { b1, restore } = getb();
  b1.parentElement!.removeChild(b1);
  expect(restore()).toBe(document.getElementById('b3'));
});

test('on deletion returns focus to the focusable element', () => {
  document.body.innerHTML = `
     <div><button id="b0"><button id="b1"><span/><button disabled id="b3"></button></div>
   `;

  const { b1, restore } = getb();
  b1.parentElement!.removeChild(b1);
  expect(restore()).toBe(document.getElementById('b0'));
});

test('moves focus when default element becomes non focusable', () => {
  document.body.innerHTML = `
     <div><button id="b1"><button id="b3"></button></div>
   `;

  const { b1, restore } = getb();
  b1.disabled = true;
  expect(restore()).toBe(document.getElementById('b3'));
});

test('on deletion returns where possible to the left', () => {
  document.body.innerHTML = `
     <div><button id="b0"><button id="b1"></button></div><button id="b3">
   `;

  const { b1, restore } = getb();
  b1.parentElement!.removeChild(b1);
  expect(restore()).toBe(document.getElementById('b0'));
});

test('picks some focusable at the same level', () => {
  document.body.innerHTML = `
     <div><button id="b0"><span/><span/><button id="b1"></button><span/></div><button id="b3">
   `;

  const { b1, restore } = getb();
  b1.parentElement!.removeChild(b1);
  expect(restore()).toBe(document.getElementById('b0'));
});

test('moves parents to find focusable', () => {
  document.body.innerHTML = `
     <div><button id="b1"></button></div><button id="b3">
   `;

  const { b1, restore } = getb();
  b1.parentElement!.removeChild(b1);
  expect(restore()).toBe(document.getElementById('b3'));
});

test('returns undefined if nothing focusable', () => {
  document.body.innerHTML = `
     <div><button id="b1"></button></div>
   `;

  const { b1, restore } = getb();
  b1.parentElement!.removeChild(b1);
  expect(restore()).toBe(undefined);
});
