
class Product {
    constructor(
        private readonly code: string,
        private readonly name: string,
        private readonly price: number,
        private readonly pricePer: 'unit' | 'g' | '100g' | 'kg' | 'lb'
    ) {
    }

    getPrice(amount: number, discounts: Discount[] = []): number {
        return 0;
    }
}

// class UnitProduct extends Product {
//     getPrice(count: number, discount?: Discount) {
//     }
// }

// class WeightedProduct {
//     getPrice(weight) {
//         // asd
//     }
// }

class Discount {
    isExclusive: boolean;
    productCodes: string | string[];
    after: number;
    discounted: number;
    appliesTo: 'rest' | 'all';

    // validFrom: Date;
    // validTo: Date;
}

class Coupon {

}

class CashRegister {
    // prices: Map<string, number> = new Map<string, number>();

    constructor() {
    }
}

class Cart {
    items: [{ product: Product, amount: number }];
}
