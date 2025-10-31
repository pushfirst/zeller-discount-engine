import type { SKU, CartLine } from "../engine/type";
import { BaseRule } from "./base/base-rule";

export class BulkPriceRule extends BaseRule {
	constructor(
		private readonly sku: SKU,
		private readonly thresholdExclusive: number,
		private readonly bulkUnitCents: number
	) {
		if (!Number.isInteger(thresholdExclusive) || thresholdExclusive <= 0) {
			throw new Error('thresholdExclusive must be a positive integer');
		}
		if (!Number.isInteger(bulkUnitCents) || bulkUnitCents <= 0) {
			throw new Error('bulkUnitCents must be a positive integer');
		}
		super(`Bulk price for ${sku} if buying more than ${thresholdExclusive}`);
	}
	isApplicable(cart: Map<SKU, CartLine>): boolean {
		const cartLine = this.getCartLine(cart, this.sku);
		return cartLine !== undefined && cartLine.quantity > this.thresholdExclusive;
	}

	computeDiscount(cart: Map<SKU, CartLine>): number {
		const cartLine = this.getCartLine(cart, this.sku);
		if (!cartLine || cartLine.quantity <= this.thresholdExclusive) {
			return 0;
		}
		const diff = cartLine.unitCents - this.bulkUnitCents;
		const discountPerUnit = diff > 0 ? diff : 0;
		return discountPerUnit * cartLine.quantity;
	}
}