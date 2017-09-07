
import { Coupon } from './coupon';
import { Discount, QuantityDiscount, TradeDiscount } from './discount';
import { Helper } from './helper';
import { Product } from './product';
import { Receipt, ReceiptItem } from './receipt';
import { FixedValue, PercentageValue, Value } from './value';

export class CashRegister {
    products: Product[] = [];
    discounts: Discount[] = [];
    coupons: { [ code: string ]: Coupon } = {};

    scannedItems: ReceiptItem[] = [];
    appliedCoupn: Coupon = null;

    constructor() {
    }

    addProduct(product: Product): void {
        if (this.products.filter(p => p.code === product.code).length) {
            throw new Error(`There is already a product with code: ${product.code}`);
        }

        this.products.push(product);
    }

    addDiscount(discount: Discount) {
        this.discounts.push(discount);
    }

    addCoupon(coupon: Coupon): void {
        if (this.coupons[coupon.code]) {
            throw new Error(`A coupon with code ${coupon.code} already exists`);
        }

        this.coupons[coupon.code] = coupon;
    }

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

    applyCoupon(couponCode: string) {
        if (!this.coupons[couponCode]) {
            return;
        }

        this.appliedCoupn = this.coupons[couponCode];
    }

    createReceipt(): Receipt {
        let receipt = new Receipt(this.scannedItems, this.discounts);

        receipt.processItems();

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
