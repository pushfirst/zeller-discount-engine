import { Checkout } from "../src/engine/discount-engine";
import { RuleConfig, RuleFactory } from "../src/rules/rule-factory";
import { catalogue } from "../src/catalogue";

describe('Checkout Acceptance Scenarios', () => {
    it('1. Catalogue Sanity', () => {
        expect(catalogue.atv.priceCents).toBe(10950);
        expect(catalogue.ipd.priceCents).toBe(54999);
        expect(catalogue.mbp.priceCents).toBe(139999);
        expect(catalogue.vga.priceCents).toBe(3000);
    });

    const discountRulesConfig: RuleConfig[] = [
        {
            type: 'BUY_X_PAY_Y',
            params: {
                sku: 'atv',
                buyQuantity: 3,
                payQuantity: 2
            }
        },
        {
            type: 'BULK_PRICE',
            params: {
                sku: 'ipd',
                thresholdExclusive: 4,
                bulkUnitCents: 49999
            }
        }
    ];

    const rules = discountRulesConfig.map(config => RuleFactory.fromConfig(config))
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