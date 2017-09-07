
import { ReceiptItem } from './receipt';
import { Value } from './value';

export abstract class Discount {
    constructor(
        public readonly name: string,
        public readonly productCode?: string
    ) {
    }

    isApplicableTo(item: ReceiptItem): boolean {
        return item.product.code === this.productCode;
    }

    abstract discountedPrice(item: ReceiptItem): number;

    saving(item: ReceiptItem): number {
        return item.regularPrice() - this.discountedPrice(item);
    }

    applyTo(item: ReceiptItem): void {
        item.discount = this;
        item.discountLine = this.name;
        item.discountSaving =  this.saving(item);
        item.finalPrice = this.discountedPrice(item);
    }
}

export class TradeDiscount extends Discount {
    constructor(
        public readonly name: string,
        public readonly productCode: string,
        public readonly value: Value
    ) {
        super(name, productCode);
    }

    discountedPrice(item: ReceiptItem): number {
        let discountedProductPrice = this.value.addTo(item.product.price);
        return Math.max(0, discountedProductPrice * item.quantity);
    }
}

export class QuantityDiscount extends Discount {
    constructor(
        public readonly name: string,
        public readonly productCode: string,
        public readonly minTarget: number,
        public readonly value: Value,
        public readonly afterTarget: number
    ) {
        super(name, productCode);
    }

    isApplicableTo(item: ReceiptItem) {
        return super.isApplicableTo(item) && item.quantity > this.minTarget;
    }

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
