import { BulkPriceRule } from "../../src/rules/bulk-price-rule";
import type { SKU, CartLine } from "../../src/engine/type";

const IPD_PRICE_CENTS = 54999;
const BULK_PRICE_CENTS = 49999;

const cartWith = (sku: SKU, quantity: number, unitCents: number): Map<SKU, CartLine> => {
    const cart = new Map<SKU, CartLine>();
    cart.set(sku, { sku, quantity, unitCents });
    return cart;
};
// 1. Bulk price rule for 'ipd' SKU
describe('BulkPriceRule', () => {
    it('throws error for invalid parameters',() => {
        expect(() => new BulkPriceRule('ipd', 0, BULK_PRICE_CENTS)).toThrow();
        expect(() => new BulkPriceRule('ipd', -1, BULK_PRICE_CENTS)).toThrow();
        expect(() => new BulkPriceRule('ipd', 5.5, BULK_PRICE_CENTS)).toThrow();
        expect(() => new BulkPriceRule('ipd', 4, 0)).toThrow();
        expect(() => new BulkPriceRule('ipd', 4, -1000)).toThrow();
        expect(() => new BulkPriceRule('ipd', 4, 49999.5)).toThrow();
    });
// 2. Applicable when quantity exceeds threshold
    it('is applicable when quantity exceeds threshold', () => {
        const rule = new BulkPriceRule('ipd', 4, BULK_PRICE_CENTS);
        const cart = cartWith('ipd', 5, IPD_PRICE_CENTS);
        expect(rule.isApplicable(cart)).toBe(true);
    });
    // 3. Not applicable when quantity is at or below threshold
    it('is not applicable when quantity is at or below threshold', () => {
        const rule = new BulkPriceRule('ipd', 4, BULK_PRICE_CENTS);
        const cartAtThreshold = cartWith('ipd', 4, IPD_PRICE_CENTS);
        const cartBelowThreshold = cartWith('ipd', 3, IPD_PRICE_CENTS);
        expect(rule.isApplicable(cartAtThreshold)).toBe(false);
        expect(rule.isApplicable(cartBelowThreshold)).toBe(false);
    });
    // 4. no negative discount if bulk price is higher than unit price
    it('computes zero discount if bulk price is higher than unit price', () => {
        const rule = new BulkPriceRule('ipd', 4, 59999);
        const cart = cartWith('ipd', 5, IPD_PRICE_CENTS);
        expect(rule.computeDiscount(cart)).toBe(0);
    });
// 5. Compute discount correctly
    it('computes correct discount when applicable', () => {
        const rule = new BulkPriceRule('ipd', 4, BULK_PRICE_CENTS);
        const cart = cartWith('ipd', 6, IPD_PRICE_CENTS);
        const expectedDiscount = (IPD_PRICE_CENTS - BULK_PRICE_CENTS) * 6;
        expect(rule.computeDiscount(cart)).toBe(expectedDiscount);
    });
// 6. doesnt impact other skus
    it('does not apply discount to other SKUs', () => {
        const rule = new BulkPriceRule('ipd', 4, BULK_PRICE_CENTS);
        const cart = cartWith('atv', 10, 10950);
        expect(rule.isApplicable(cart)).toBe(false);
        expect(rule.computeDiscount(cart)).toBe(0);
    });
});