import type { SKU, CartLine } from "../engine/type";
import { BaseRule } from "./base/base-rule";

export class BuyXPayYRule extends BaseRule {
	constructor(
			private readonly sku: SKU,
			private readonly buyQuantity: number,
			private readonly payQuantity: number
	) {
			if(!Number.isInteger(buyQuantity) || buyQuantity <= 0 || !Number.isInteger(payQuantity) || payQuantity <= 0) {
					throw new Error('buyQuantity and payQuantity must be positive integers');
			}
			if(payQuantity > buyQuantity) {
					throw new Error('payQuantity cannot be greater than buyQuantity');
			}
			super(`Buy ${buyQuantity} Pay ${payQuantity} for ${sku}`);
		}
	isApplicable(cart: Map<SKU, CartLine>): boolean {
		const cartLine = this.getCartLine(cart, this.sku);
		return cartLine !== undefined && cartLine.quantity >= this.buyQuantity;
	}
	
	computeDiscount(cart: Map<SKU, CartLine>): number {
		const cartLine = this.getCartLine(cart, this.sku);
		if(!cartLine) {
			return 0;
		}
		const applicableSets = Math.floor(cartLine.quantity / this.buyQuantity);
		const discountPerSet = (this.buyQuantity - this.payQuantity) * cartLine.unitCents;
		return applicableSets * discountPerSet;
	}
}