import type { DiscountRule, SKU } from "../engine/type";
import { BuyXPayYRule } from "./buy-x-pay-y-rule";
import { BulkPriceRule } from "./bulk-price-rule";

export type RuleType = 'BUY_X_PAY_Y' | 'BULK_PRICE';

export type BuyXPayYConfig = {
    type: 'BUY_X_PAY_Y';
    name?: string;
    params: { sku: SKU; buyQuantity: number; payQuantity: number; };
}

export type BulkPriceConfig = {
    type: 'BULK_PRICE';
    name?: string;
    params: { sku: SKU; thresholdExclusive: number; bulkUnitCents: number; };
}

export type RuleConfig = BuyXPayYConfig | BulkPriceConfig;

export class RuleFactory {
    static fromConfig(config: RuleConfig): DiscountRule {
        if(!config || !('type' in config) || !('params' in config) || !config.params) {
            throw new Error('Invalid rule configuration');
        }

        switch(config.type) {
            case 'BUY_X_PAY_Y':{
                const { sku, buyQuantity, payQuantity } = config.params;
                return new BuyXPayYRule(sku, buyQuantity, payQuantity);
            }
            case 'BULK_PRICE':{
                const { sku, thresholdExclusive, bulkUnitCents } = config.params;
                return new BulkPriceRule(sku, thresholdExclusive, bulkUnitCents);
            }
        }
    }
}