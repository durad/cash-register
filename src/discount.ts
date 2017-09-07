
import { ReceiptItem } from './receipt';
import { Value } from './value';

/**
 * Abstract class representing a discount type. Inherit this class in order to implement a custom discount logic.
 */
export abstract class Discount {
    /**
     * @param name Name of the discount. This value will be displayed on the receipt.
     * @param productCode Code of the product for which this discount is applicable.
     */
    constructor(
        public readonly name: string,
        public readonly productCode?: string
    ) {
    }

    /**
     * Checks if the discount is applicable to the given receipt item.
     * @param item Receit item to be tested.
     */
    isApplicableTo(item: ReceiptItem): boolean {
        return item.product.code === this.productCode;
    }

    /**
     * Calculates item price in case this discount has been applied.
     * @param item Receipt item for which we are calculating the price.
     */
    abstract discountedPrice(item: ReceiptItem): number;

    /**
     * Calculates item saving in case this discount has been applied.
     * @param item Receipt item whose savings are being calculated.
     */
    saving(item: ReceiptItem): number {
        return item.regularPrice() - this.discountedPrice(item);
    }

    /**
     * Applies this discount to a given reciept item.
     * @param item Receipt item that discount will be applied to.
     */
    applyTo(item: ReceiptItem): void {
        item.discount = this;
        item.discountLine = this.name;
        item.discountSaving =  this.saving(item);
        item.finalPrice = this.discountedPrice(item);
    }
}

/**
 * Represents a trade discount. This is a classic "sale" discount
 * where all items are discounted by a percentage or by a fixed amount.
 * Examples: 20% off or $5 off
 */
export class TradeDiscount extends Discount {
    /**
     * Creates an instance of the TradeDiscount class.
     * @param name Name of the discount. This value will be displayed on the receipt.
     * @param productCode Code of the product for which this discount is applicable.
     * @param value Amount of the discount.
     */
    constructor(
        public readonly name: string,
        public readonly productCode: string,
        public readonly value: Value
    ) {
        super(name, productCode);
    }

    /**
     * Calculates item price in case this discount has been applied.
     * @param item Receipt item whose savings are being calculated.
     */
    discountedPrice(item: ReceiptItem): number {
        let discountedProductPrice = this.value.addTo(item.product.price);
        return Math.max(0, discountedProductPrice * item.quantity);
    }
}

/**
 * Represents a quantity discount. The discount works like following:
 * First minTarget number of items are not being discounted after which the discount
 * is applied to a afterTarget number of items (possibly all of the remaining items).
 * Examples: "Buy one get one 50% off" or "3 for the price of 2"
 */
export class QuantityDiscount extends Discount {
    /**
     * Creates a new instance of the QuantityDiscount class.
     * @param name Name of the discount. This value will be displayed on the receipt.
     * @param productCode Code of the product for which this discount is applicable.
     * @param minTarget Minimum required quantity target after which discout is applied.
     * @param value Amount of the discount.
     * @param afterTarget Number of items after minTarget to which the discount is applied.
     * If null then discount will be applied to all of the remaining items.
     */
    constructor(
        public readonly name: string,
        public readonly productCode: string,
        public readonly minTarget: number,
        public readonly value: Value,
        public readonly afterTarget: number
    ) {
        super(name, productCode);
    }

    /**
     * Checks if the given receipt item has met the minimum quantity requirements.
     * @param item Receipt item to check.
     */
    isApplicableTo(item: ReceiptItem) {
        return super.isApplicableTo(item) && item.quantity > this.minTarget;
    }

    /**
     * Calculates item price in case this discount has been applied.
     * @param item Receipt item whose savings are being calculated.
     */
    discountedPrice(item: ReceiptItem): number {
        let price = 0;
        let quantity = item.quantity;

        while (quantity > this.minTarget) {
            price += item.product.price * this.minTarget;
            quantity -= this.minTarget;
            let at = this.afterTarget !== null ? this.afterTarget : quantity;
            price += this.value.addTo(item.product.price) * at;
            quantity -= at;
        }

        price += quantity * item.product.price;

        return price;
    }
}
