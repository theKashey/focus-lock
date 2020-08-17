import { NodeIndex, tabSort } from '../src/utils/tabOrder';

const r = (tabIndex: number, index: number, key: number): NodeIndex & { key: number } => ({
  tabIndex,
  index,
  key,
  node: null as any,
});
const order = (data: Array<{ key: number }>) => data.map(({ key }) => key).join(',');

describe('tab order', () => {
  it('should order simple row', () => {
    const row = [r(0, 1, 1), r(0, 2, 2), r(0, 6, 6), r(0, 3, 3), r(0, 4, 4), r(0, 5, 5)];
    const result = row.sort(tabSort);
    expect(order(result)).toBe('1,2,3,4,5,6');
  });

  it('should use tabIndex', () => {
    const row = [r(0, 1, 1), r(0, 2, 2), r(1, 3, 6), r(2, 4, 3), r(2, 7, 7), r(0, 5, 4), r(0, 6, 5)];
    const result = row.sort(tabSort);
    expect(order(result)).toBe('6,3,7,1,2,4,5');
  });
});
