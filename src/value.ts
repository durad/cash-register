
export abstract class Value {
    abstract addTo(price: number): number;
}

export class FixedValue extends Value {
    constructor(public readonly value: number) {
        super();
    }

    addTo(price: number) {
        return price + this.value;
    }
}

export class PercentageValue extends Value {
    constructor(public readonly value: number) {
        super();
    }

    addTo(price: number): number {
        return (1 + this.value / 100) * price;
    }
}
