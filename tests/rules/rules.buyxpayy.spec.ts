import { BuyXPayYRule } from "../../src/rules/buy-x-pay-y-rule";
import type { SKU, CartLine } from "../../src/engine/type";

const ATV_PRICE_CENTS = 10950;

const cartWith = (sku: SKU, quantity: number, unitCents: number): Map<SKU, CartLine> => {
    const cart = new Map<SKU, CartLine>();
    cart.set(sku, { sku, quantity, unitCents });
    return cart;
};
// 1. Buy 3 Pay 2 rule for 'atv' SKU
describe('BuyXPayYRule (Buy 3 Pay 2 example)', () => {
    it('throws error for invalid parameters',() => {
        expect(() => new BuyXPayYRule('atv', 0, 2)).toThrow();
        expect(() => new BuyXPayYRule('atv', 3, 0)).toThrow();
        expect(() => new BuyXPayYRule('atv', -1, 2)).toThrow();
        expect(() => new BuyXPayYRule('atv', 3, -2)).toThrow();
        expect(() => new BuyXPayYRule('atv', 2.5, 2)).toThrow();
        expect(() => new BuyXPayYRule('atv', 3, 2.5)).toThrow();
        expect(() => new BuyXPayYRule('atv', 2, 3)).toThrow();
    });
// 2. Applicable when quantity meets or exceeds buyQuantity
    it('one free per group at exact threshold', () => {
        const rule = new BuyXPayYRule('atv', 3, 2);
        const cart = cartWith('atv', 3, ATV_PRICE_CENTS);
        expect(rule.isApplicable(cart)).toBe(true);
        expect(rule.computeDiscount(cart)).toBe(ATV_PRICE_CENTS);
    });
// 3. Compute discount correctly
    it('stacks for multiple groups', () => {
        const rule = new BuyXPayYRule('atv', 3, 2);
        const cart = cartWith('atv', 7, ATV_PRICE_CENTS);
        expect(rule.isApplicable(cart)).toBe(true);
        // 2 full groups of 3, 1 free for each group
        expect(rule.computeDiscount(cart)).toBe(2 * ATV_PRICE_CENTS);
    });
// 4. Edge cases
    it('ignore partial groups', () => {
        const rule = new BuyXPayYRule('atv', 3, 2);
        const cart = cartWith('atv', 4, ATV_PRICE_CENTS);
        expect(rule.isApplicable(cart)).toBe(true);
        // only 1 full group of 3, 1 free
        expect(rule.computeDiscount(cart)).toBe(ATV_PRICE_CENTS);
    });
// 5. Non-applicable scenarios
    it('ignore non applicable sku', () => {
        const rule = new BuyXPayYRule('atv', 3, 2);
        const cart = cartWith('ipd', 3, 54999);
        expect(rule.isApplicable(cart)).toBe(false);
        expect(rule.computeDiscount(cart)).toBe(0);
    });
});