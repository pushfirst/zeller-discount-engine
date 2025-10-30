'use strict';
import type { DiscountRule, SKU, CartLine } from "../../engine/type";

export abstract class BaseRule implements DiscountRule {
    constructor(public readonly name: string) {}

    abstract isApplicable(cart: Map<SKU, CartLine>): boolean;
    abstract computeDiscount(cart: Map<SKU, CartLine>): number;

    protected getCartLine(cart: Map<SKU, CartLine>, sku: SKU): CartLine | undefined {
        return cart.get(sku);
    }
}