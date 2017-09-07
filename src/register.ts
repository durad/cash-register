
class Helper {
    static repeat(ch: string, width: number): string {
        let p = [];
        for (let i = 0; i < width; i++) {
            p.push(ch);
        }

        return p.join('');
    }

    static padRight(s: string, width: number): string {
        if (s.length >= width) {
            return s.substring(0, width);
        }

        return s + this.repeat(' ', width - s.length);
    }

    static padLeft(s: string, width: number): string {
        if (s.length >= width) {
            return s.substring(0, width);
        }

        return this.repeat(' ', width - s.length) + s;
    }

    static formatMoney(amount: number): string {
        return `${amount < 0 ? '(' : ''}$${Math.abs(amount).toFixed(2)}${amount < 0 ? ')' : ''}`;
    }
}

class Product {
    constructor(
        public readonly code: string,
        public readonly name: string,
        public readonly price: number,
        public readonly pricePer: 'unit' | 'kg' | 'lb' = 'unit'
    ) {
    }

    formatQuantity(quantity: number): string {
        if (this.pricePer === 'unit') {
            return quantity.toString();
        } else {
            return `${quantity} ${this.pricePer}`;
        }
    }
}

abstract class Value {
    abstract addTo(price: number): number;
}

class FixedValue extends Value {
    constructor(public readonly value: number) {
        super();
    }

    addTo(price: number) {
        return price + this.value;
    }
}

class PercentageValue extends Value {
    constructor(public readonly value: number) {
        super();
    }

    addTo(price: number): number {
        return (1 + this.value / 100) * price;
    }
}

abstract class Discount {
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

class TradeDiscount extends Discount {
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

class QuantityDiscount extends Discount {
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

class Coupon {
    // persons: { [id: string] : IPerson; } = {};
}

class Cart {
    items: [{ product: Product, amount: number }];
}

class Receipt {
    addLine(line: string) {
    }
}

class ReceiptItem {
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

class CashRegister {
    products: Product[] = [];
    receitItems: ReceiptItem[] = [];
    discounts: Discount[] = [];

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

    scanProduct(productCode: string, quantity: number = 1): void {
        let receiptItem = this.receitItems.filter(ri => ri.product.code === productCode)[0];

        if (!receiptItem) {
            let product = this.products.filter(p => p.code === productCode)[0];
            if (!product) {
                throw new Error(`There is no product with code: ${productCode}`);
            }

            this.receitItems.push(new ReceiptItem(product, quantity));
        } else {
            receiptItem.addQuantity(quantity);
        }
    }

    processItems(): void {
        for (let item of this.receitItems) {
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
        }
    }

    createReceit(): string {
        this.processItems();

        let receitLines = [];
        let qtyWidth = 10;
        let productWidth = 30;
        let priceWidth = 16;

        let subTotal = 0;

        receitLines.push([
            Helper.padRight('Qty', qtyWidth),
            Helper.padRight('Product', productWidth),
            Helper.padLeft('Price', priceWidth)
        ].join(' '));

        receitLines.push([
            Helper.repeat('=', qtyWidth),
            Helper.repeat('=', productWidth),
            Helper.repeat('=', priceWidth)
        ].join(' '));

        for (let item of this.receitItems) {
            receitLines.push([
                Helper.padRight(item.product.formatQuantity(item.quantity), qtyWidth),
                Helper.padRight(item.product.name, productWidth),
                Helper.padLeft(Helper.formatMoney(item.regularPrice()), priceWidth)
            ].join(' '));

            if (item.discountSaving !== null) {
                receitLines.push([
                    Helper.repeat(' ', qtyWidth),
                    Helper.padRight(item.discountLine, productWidth),
                    Helper.padLeft(Helper.formatMoney(-item.discountSaving), priceWidth)
                ].join(' '));
            }

            subTotal += item.finalPrice;
        }

        receitLines.push([
            Helper.repeat(' ', qtyWidth),
            Helper.repeat(' ', productWidth),
            Helper.repeat('-', priceWidth)
        ].join(' '));

        receitLines.push([
            Helper.repeat(' ', qtyWidth),
            Helper.padLeft('TOTAL', productWidth),
            Helper.padLeft(Helper.formatMoney(subTotal), priceWidth)
        ].join(' '));

        return receitLines.join('\n');
    }
}

let register = new CashRegister();

register.addProduct(new Product('BANA', 'Bananas', 0.99, 'lb'));
register.addProduct(new Product('CHEE', 'Cheerios', 6.99));

register.addDiscount(new TradeDiscount('Bananas - 20% off', 'BANA', new PercentageValue(-20)));
register.addDiscount(new QuantityDiscount('Cheerios - buy 3 for 2', 'CHEE', 2, new PercentageValue(-100), 1));

register.scanProduct('BANA', 2);
register.scanProduct('BANA', 1.4);
register.scanProduct('CHEE');
register.scanProduct('CHEE');
register.scanProduct('CHEE');
register.scanProduct('CHEE');
// register.scanProduct('CHEE');
// register.scanProduct('CHEE');

console.log(register.createReceit());
