
import { Coupon } from './coupon';
import { Discount, QuantityDiscount, TradeDiscount } from './discount';
import { Helper } from './helper';
import { Product } from './product';
import { Receipt, ReceiptItem } from './receipt';
import { FixedValue, PercentageValue, Value } from './value';

/**
 * Class represents the state of the cash register.
 * All interactions with the register happen through methods of this class.
 */
export class CashRegister {
    /**
     * List of products that the register know of.
     */
    products: Product[] = [];

    /**
     * List of discounts that are currently active.
     */
    discounts: Discount[] = [];

    /**
     * A dictionary of unused coupons. Coupon code is the key iof the dict.
     */
    coupons: { [ code: string ]: Coupon } = {};

    /**
     * List of items scanned during current purchasing session.
     */
    scannedItems: ReceiptItem[] = [];

    /**
     * Coupon applied during current purchasing session.
     */
    appliedCoupn: Coupon = null;

    /**
     * Creates the new instance of the cash register class.
     */
    constructor() {
    }

    /**
     * Adds a product to the register list of known products.
     * @param product Product to be added.
     */
    addProduct(product: Product): void {
        if (this.products.filter(p => p.code === product.code).length) {
            throw new Error(`There is already a product with code: ${product.code}`);
        }

        this.products.push(product);
    }

    /**
     * Adds a discount the the list of active discounts.
     * @param discount Discount to be added.
     */
    addDiscount(discount: Discount) {
        this.discounts.push(discount);
    }

    /**
     * Adds a coupn to the list of known coupons.
     * @param coupon Coupon to be added.
     */
    addCoupon(coupon: Coupon): void {
        if (this.coupons[coupon.code]) {
            throw new Error(`A coupon with code ${coupon.code} already exists`);
        }

        this.coupons[coupon.code] = coupon;
    }

    /**
     * Adds a product based on a scanned code to the list of items to be purchased.
     * @param productCode Scanned product code.
     * @param quantity Number of items or weight of the product.
     */
    scanProduct(productCode: string, quantity: number = 1): void {
        let receiptItem = this.scannedItems.filter(ri => ri.product.code === productCode)[0];

        if (!receiptItem) {
            let product = this.products.filter(p => p.code === productCode)[0];
            if (!product) {
                throw new Error(`There is no product with code: ${productCode}`);
            }

            this.scannedItems.push(new ReceiptItem(product, quantity));
        } else {
            receiptItem.addQuantity(quantity);
        }
    }

    /**
     * Applies a coupon to the current purchase based on the scanned code.
     * @param couponCode Code of the coupon.
     */
    applyCoupon(couponCode: string) {
        if (!this.coupons[couponCode]) {
            return;
        }

        this.appliedCoupn = this.coupons[couponCode];
    }

    /**
     * Creates a receipt object for the current shopping session.
     */
    createReceipt(): Receipt {
        let receipt = new Receipt(this.scannedItems, this.discounts);

        receipt.calculateSubTotal();

        if (this.appliedCoupn) {
            if (this.appliedCoupn.isApplicableTo(receipt)) {
                this.appliedCoupn.applyTo(receipt);
                delete this.coupons[this.appliedCoupn.code];
            }
        }

        this.scannedItems = [];
        this.appliedCoupn = null;

        return receipt;
    }
}
