
export class Product {
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
