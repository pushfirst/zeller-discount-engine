import type { SKU, CartLine, DiscountBreakdown, DiscountRule } from "../engine/type";
import { catalogue } from "../catalogue";
import { fromCentsToDollars } from "../utils/money";

export class Checkout {
    private readonly rules: DiscountRule[] = [];
    private readonly cart: Map<SKU, CartLine>;

    constructor(pricingRules: DiscountRule[]) {
        this.rules = pricingRules;
        this.cart = new Map<SKU, CartLine>();
    }

    scan(sku: SKU): void {
        const product = catalogue[sku];
        if (!product) {
            throw new Error(`Product with SKU ${sku} not found in catalogue`);
        }
        const existingLine = this.cart.get(sku);
        if (existingLine) {
            this.cart.set(sku, {...existingLine, quantity: existingLine.quantity + 1 });
        } else {
            this.cart.set(sku, { sku: sku, quantity: 1, unitCents: product.priceCents });
        }
    }

    detailedTotal(): { originalTotal: number, discounts: DiscountBreakdown[], finalTotal: number } {
        const originalCents: number = [...this.cart.values()].reduce((sum, line) => sum + line.quantity * line.unitCents, 0);

        const discounts: DiscountBreakdown[] = [];
        let totalDiscount = 0;
        for(const rule of this.rules) {
            if(rule.isApplicable(this.cart)) {
                const discount = rule.computeDiscount(this.cart);
                if(discount > 0) {
                    discounts.push({ ruleName: rule.name, amountCents: discount });
                    totalDiscount += discount;
                }
            }
        }
        const finalCents = Math.max(0, originalCents - totalDiscount);
        
        return {
            originalTotal: fromCentsToDollars(originalCents),
            discounts,
            finalTotal: fromCentsToDollars(finalCents),
        }
    }

    total(): number {
        const bill = this.detailedTotal();
        return bill.finalTotal;
    }
}