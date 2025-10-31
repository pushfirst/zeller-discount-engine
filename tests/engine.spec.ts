import { Checkout } from "../src/engine/discount-engine";
import { BuyXPayYRule } from "../src/rules/buy-x-pay-y-rule";
import { BulkPriceRule } from "../src/rules/bulk-price-rule";
import { catalogue } from "../src/catalogue";

describe('Checkout Acceptance Scenarios', () => {
    it('1. Catalogue Sanity', () => {
        expect(catalogue.atv.priceCents).toBe(10950);
        expect(catalogue.ipd.priceCents).toBe(54999);
        expect(catalogue.mbp.priceCents).toBe(139999);
        expect(catalogue.vga.priceCents).toBe(3000);
    });

    const rules = [
        new BuyXPayYRule('atv', 3, 2), // Buy 3 Pay 2 on Apple TVs
        new BulkPriceRule('ipd', 4, 49999), // Bulk price on Super iPads
    ];

    it('2. atv atv atv, vga => total $249.00', () => {
        const checkout = new Checkout(rules);
        checkout.scan('atv');
        checkout.scan('atv');
        checkout.scan('atv');
        checkout.scan('vga');
        const totalCents = checkout.total();
        expect(totalCents).toBe(249.00);
    });

    it('3. atv ipd ipd atv ipd ipd ipd => total $2718.95', () => {
        const checkout = new Checkout(rules);
        checkout.scan('atv');
        checkout.scan('ipd');
        checkout.scan('ipd');
        checkout.scan('atv');
        checkout.scan('ipd');
        checkout.scan('ipd');
        checkout.scan('ipd');
        const totalCents = checkout.total();
        expect(totalCents).toBe(2718.95);
    });
});