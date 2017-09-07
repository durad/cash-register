
import { Coupon } from './coupon';
import { Discount } from './discount';
import { Helper } from './helper';
import { Product } from './product';

export class ReceiptItem {
    finalPrice: number = 0;
    lines: string[] = [];
    discount: Discount = null;
    discountLine: string = null;
    discountSaving: number = null;

    constructor(
        public product: Product,
        public quantity: number
    ) {
    }

    addQuantity(addedQuantity: number): void {
        this.quantity += addedQuantity;
    }

    regularPrice(): number {
        return this.product.price * this.quantity;
    }
}

export class Receipt {
    subTotal: number = 0;
    total: number = 0;
    coupon: Coupon;
    couponLine: string = null;
    couponSaving: number = null;

    constructor(
        public receiptItems: ReceiptItem[],
        public discounts: Discount[]
    ) {
    }

    processItems(): void {
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

    toString(): string {
        let qtyWidth = 10;
        let productWidth = 30;
        let priceWidth = 16;

        let receiptLines = [];

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

    print(): void {
        console.log(this.toString());
        console.log();
        console.log();
    }
}
