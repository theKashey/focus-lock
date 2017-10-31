# focus-lock
It is a trap! We got your focus and will not let him out!

[![NPM](https://nodei.co/npm/focus-lock.png?downloads=true&stars=true)](https://nodei.co/npm/react-focus-lock/)

This is quite low level API, to be used by final realization. Usually everything
can be solved in 3 lines
```js
import moveFocusInside, { focusInside } from 'focus-lock';

if (observed && !focusInside(observed)) {
  result = moveFocusInside(observed, lastActiveFocus);
}
```

#WHY?
From [MDN Article about accessible dialogs](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_dialog_role):
 - The dialog must be properly labeled
 - Keyboard __focus must be managed__ correctly
 
This one is about managing the focus.

I'v got a good [article about focus management, dialogs and  WAI-ARIA](https://medium.com/@antonkorzunov/its-a-focus-trap-699a04d66fb5).    

#Implementations

This is vanilla js base package for:
  - [react-focus-lock](https://github.com/theKashey/react-focus-lock)
  - [vue-focus-lock](https://github.com/theKashey/vue-focus-lock)


This is a small, but very useful for:
 - Modal dialogs. You can not leave it with "Tab", ie tab-out.
 - Focused tasks. It will aways brings you back.

#API

`default(topNode, lastNode)` (aka setFocus), moves focus inside topNode, keeping in mind that last focus inside was - lastNode
 
# Licence
 MIT
 
 
