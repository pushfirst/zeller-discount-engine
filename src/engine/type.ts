'use strict';

export type SKU = 'atv' | 'ipd' | 'mbp' | 'vga';

export interface CartLine {
    sku: SKU,
    quantity: number,
    unitCents: number,
}

export interface DiscountRule {
    name: string,
    isApplicable(cart: Map<SKU, CartLine>): boolean,
    computeDiscount(cart: Map<SKU, CartLine>): number,
}