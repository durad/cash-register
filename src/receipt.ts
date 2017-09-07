
import { Coupon } from './coupon';
import { Discount } from './discount';
import { Helper } from './helper';
import { Product } from './product';

/**
 * Represents one item on the final receipt with specific product and quantity.
 */
export class ReceiptItem {
    /**
     * Price after discount.
     */
    finalPrice: number = 0;

    /**
     * Discount object applied to the current item.
     */
    discount: Discount = null;

    /**
     * Text added to the receipt in case the discount is applied.
     */
    discountLine: string = null;

    /**
     * Total saving on this line in case a discount has been applied.
     */
    discountSaving: number = null;

    /**
     * Creates a new object of the ReceiptItem class.
     * @param product Product that is being purchesed.
     * @param quantity Quantity of the product items or product weight.
     */
    constructor(
        public product: Product,
        public quantity: number
    ) {
    }

    /**
     * Updates the quantity of a given product.
     * @param addedQuantity Quantity of the product to be added.
     */
    addQuantity(addedQuantity: number): void {
        this.quantity += addedQuantity;
    }

    /**
     * Calculates the price of the product without any discount applied.
     */
    regularPrice(): number {
        return this.product.price * this.quantity;
    }
}

/**
 * Represents receipt of a single purchase.
 */
export class Receipt {
    /**
     * Price of all items after all discounts have been applied but before a coupon has been applied.
     */
    subTotal: number = 0;

    /**
     * Price of all items after both discounts and coupon have been applied.
     */
    total: number = 0;

    /**
     * Represents the coupon applied to the current purchase.
     */
    coupon: Coupon = null;

    /**
     * Text added to the receipt in case the coupon has been applied.
     */
    couponLine: string = null;

    /**
     * Total saving on the receipt in case the coupon has been applied.
     */
    couponSaving: number = null;

    /**
     * Creates the instance of the Receipt class.
     * @param receiptItems List of receipt items.
     * @param discounts List of currently active discounts.
     */
    constructor(
        public receiptItems: ReceiptItem[],
        public discounts: Discount[]
    ) {
    }

    /**
     * Calculates subTotal by applying the best discounts to each and every receipt item.
     */
    calculateSubTotal(): void {
        for (let item of this.receiptItems) {
            item.finalPrice = item.regularPrice();

            let bestDiscount: Discount = null;
            let minPrice: number = item.finalPrice;

            for (let discount of this.discounts) {
                if (!discount.isApplicableTo(item)) {
                    continue;
                }

                let discountedPrice = discount.discountedPrice(item);
                if (discountedPrice < minPrice) {
                    minPrice = discountedPrice;
                    bestDiscount = discount;
                }
            }

            if (bestDiscount !== null) {
                bestDiscount.applyTo(item);
            }

            this.subTotal += item.finalPrice;
            this.total = this.subTotal;
        }
    }

    /**
     * Generates a textual representation of the receipt that can be printed on the machine.
     */
    toString(): string {
        let qtyWidth = 10;
        let productWidth = 30;
        let priceWidth = 16;

        let receiptLines = [];

        // header
        receiptLines.push([
            Helper.padRight('Qty', qtyWidth),
            Helper.padRight('Product', productWidth),
            Helper.padLeft('Price', priceWidth)
        ].join(' '));

        receiptLines.push([
            Helper.repeat('=', qtyWidth),
            Helper.repeat('=', productWidth),
            Helper.repeat('=', priceWidth)
        ].join(' '));

        // items
        for (let item of this.receiptItems) {
            receiptLines.push([
                Helper.padRight(item.product.formatQuantity(item.quantity), qtyWidth),
                Helper.padRight(item.product.name, productWidth),
                Helper.padLeft(Helper.formatMoney(item.regularPrice()), priceWidth)
            ].join(' '));

            if (item.discountSaving !== null) {
                receiptLines.push([
                    Helper.repeat(' ', qtyWidth),
                    Helper.padRight(item.discountLine, productWidth),
                    Helper.padLeft(Helper.formatMoney(-item.discountSaving), priceWidth)
                ].join(' '));
            }
        }

        // footer
        receiptLines.push([
            Helper.repeat(' ', qtyWidth),
            Helper.repeat(' ', productWidth),
            Helper.repeat('-', priceWidth)
        ].join(' '));

        receiptLines.push([
            Helper.repeat(' ', qtyWidth),
            Helper.padLeft('SubTotal', productWidth),
            Helper.padLeft(Helper.formatMoney(this.subTotal), priceWidth)
        ].join(' '));

        if (this.couponSaving !== null) {
            receiptLines.push([
                Helper.repeat(' ', qtyWidth),
                Helper.padLeft(this.couponLine, productWidth),
                Helper.padLeft(Helper.formatMoney(-this.couponSaving), priceWidth)
            ].join(' '));

            receiptLines.push([
                Helper.repeat(' ', qtyWidth),
                Helper.repeat(' ', productWidth),
                Helper.repeat('-', priceWidth)
            ].join(' '));
        }

        receiptLines.push([
            Helper.repeat(' ', qtyWidth),
            Helper.padLeft('TOTAL', productWidth),
            Helper.padLeft(Helper.formatMoney(this.total), priceWidth)
        ].join(' '));

        return receiptLines.join('\n');
    }

    /**
     * Prints a receipt the console.
     */
    print(): void {
        console.log(this.toString());
        console.log();
        console.log();
    }
}
