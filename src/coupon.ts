
import { Receipt } from './receipt';
import { Value } from './value';

export abstract class Coupon {
    constructor(
        public code: string,
        public name: string
    ) {
    }

    abstract isApplicableTo(receipt: Receipt): boolean;

    abstract discountedPrice(receipt: Receipt): number;

    saving(receipt: Receipt): number {
        return receipt.total - this.discountedPrice(receipt);
    }

    applyTo(receipt: Receipt): void {
        receipt.coupon = this;
        receipt.couponLine = this.name;
        receipt.couponSaving =  this.saving(receipt);
        receipt.total = this.discountedPrice(receipt);
    }
}

export class CashTargetCoupon extends Coupon {
    constructor(
        code: string,
        name: string,
        public targetMin: number,
        public value: Value
    ) {
        super(code, name);
    }

    isApplicableTo(receipt: Receipt) {
        return receipt.total >= this.targetMin;
    }

    discountedPrice(receipt: Receipt): number {
        return this.value.addTo(receipt.total);
    }
}
