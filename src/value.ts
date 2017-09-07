
/**
 * Absctract class representing percentage or fixed value.
 */
export abstract class Value {
    /**
     * Adds this value to the existing price.
     * @param price Price to which we are adding value.
     */
    abstract addTo(price: number): number;
}

/**
 * Represents fixed value in dollars.
 */
export class FixedValue extends Value {
    /**
     * Creates a new instance of the FixedValue class
     * @param value Amount of dollars.
     */
    constructor(public readonly value: number) {
        super();
    }

    /**
     * Adds this value to the existing price.
     * @param price Price to which we are adding value.
     */
    addTo(price: number) {
        return price + this.value;
    }
}

/**
 * Represents a percentage value.
 */
export class PercentageValue extends Value {
    /**
     * Creates a new instance of PercentageValue class
     * @param value Percentage value
     */
    constructor(public readonly value: number) {
        super();
    }

    /**
     * Calculates the new price by adding this percentage value on top of it.
     * @param price Price to which we are adding value.
     */
    addTo(price: number): number {
        return (1 + this.value / 100) * price;
    }
}
