
import { Receipt } from './receipt';
import { Value } from './value';

/**
 * Abstract class representing a single coupon. Inherit this class in order to implement a custom coupon logic.
 */
export abstract class Coupon {
    /**
     * @param code Unique code of this coupon instance.
     * @param name Name of the coupn program. This name will appear on the final receipt.
     */
    constructor(
        public code: string,
        public name: string
    ) {
    }

    /**
     * Determines if this coupon instance is applicable to the given receipt.
     * @param receipt Receipt to be tested.
     */
    abstract isApplicableTo(receipt: Receipt): boolean;

    /**
     * Calculates receipt total price if this coupon has been applied.
     * @param receipt Receit for which the new total is to be calculated.
     */
    abstract discountedPrice(receipt: Receipt): number;

    /**
     * Calculates receit saving as a result of this coupon.
     * @param receipt Receit whose saving are beeing calculated.
     */
    saving(receipt: Receipt): number {
        return receipt.total - this.discountedPrice(receipt);
    }

    /**
     * Applies this coupon to a given receipt.
     * @param receipt Receipt that coupon will be applied to.
     */
    applyTo(receipt: Receipt): void {
        receipt.coupon = this;
        receipt.couponLine = this.name;
        receipt.couponSaving =  this.saving(receipt);
        receipt.total = this.discountedPrice(receipt);
    }
}

/**
 * Represents type of coupon where an amount of money is deducted after a certain minimum target has been purched.
 * Example: Purchase $100 and get $5 off.
 */
export class CashTargetCoupon extends Coupon {
    /**
     * Creates an instance of the CashTargetCoupon class.
     * @param code Unique code of this coupon instance.
     * @param name Name of the coupn program. This name will appear on the final receipt.
     * @param targetMin Target that needs to be purched in order for this coupon to be applicable.
     * @param value Amount of money deducted from the final price when coupon is applied.
     */
    constructor(
        code: string,
        name: string,
        public targetMin: number,
        public value: Value
    ) {
        super(code, name);
    }

    /**
     * Checks if the given receipt's current total meets minimum requirements.
     * @param receipt Receit to be checked.
     */
    isApplicableTo(receipt: Receipt): boolean {
        return receipt.total >= this.targetMin;
    }

    /**
     * Calculates receit saving by substracting value from the receit's total.
     * @param receipt Receit whose saving are beeing calculated.
     */
    discountedPrice(receipt: Receipt): number {
        return this.value.addTo(receipt.total);
    }
}
