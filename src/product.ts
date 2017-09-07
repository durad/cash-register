
/**
 * Represents a single product type.
 */
export class Product {
    /**
     * Creates a new instance of the Product class.
     * @param code Unique product code. This value will be scanned at the register.
     * @param name Product name. This value will appear on the receit.
     * @param price Original product price.
     * @param pricePer Unit of measurement for the quantity of the product.
     */
    constructor(
        public readonly code: string,
        public readonly name: string,
        public readonly price: number,
        public readonly pricePer: 'unit' | 'kg' | 'lb' = 'unit'
    ) {
    }

    /**
     * Formats a number to a string showing the product quantity with the optional unit type.
     * @param quantity Number to be formatted.
     */
    formatQuantity(quantity: number): string {
        if (this.pricePer === 'unit') {
            return quantity.toString();
        } else {
            return `${quantity} ${this.pricePer}`;
        }
    }
}
