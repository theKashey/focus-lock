import { focusInside } from '../../src';

describe('form edge cases', () => {
  describe('specific input names', () => {
    it('contains', () => {
      document.body.innerHTML = `    
        <div id="f1">
            <form> 
                <button>1</button>
                <input name="contains" type="text" />
                <button>2</button>
            </form>
        </div>    
    `;

      expect(focusInside(document.getElementById('f1')!)).toBe(false);
    });
  });
});
