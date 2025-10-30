import { BaseRule } from "../src/rules/base/base-rule";
import type { SKU, CartLine } from "../src/engine/type";

describe('BaseRule abstract class', () => {
  it('should be extendable and enforce implementation of abstract methods', () => {
    class TestRule extends BaseRule {
      isApplicable(cart: Map<SKU, CartLine>): boolean {
        return true;
      }
      computeDiscount(cart: Map<SKU, CartLine>): number {
        return 100;
      }
    }

    const rule = new TestRule('Test Rule');
    const cart = new Map<SKU, CartLine>();
    expect(rule.name).toBe('Test Rule');
    expect(rule.isApplicable(cart)).toBe(true);
    expect(rule.computeDiscount(new Map())).toBe(100);
  });
});