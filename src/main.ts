
import { CashTargetCoupon, Coupon } from './coupon';
import { Discount, QuantityDiscount, TradeDiscount } from './discount';
import { Helper } from './helper';
import { Product } from './product';
import { ReceiptItem } from './receipt';
import { CashRegister } from './register';
import { FixedValue, PercentageValue, Value } from './value';

let register = new CashRegister();

register.addProduct(new Product('BANA', 'Bananas', 0.99, 'lb'));
register.addProduct(new Product('CHEE', 'Cheerios', 6.99));
register.addProduct(new Product('WINE', 'Fine Vine', 44.99));

register.addDiscount(new TradeDiscount('Bananas - 20% off', 'BANA', new PercentageValue(-20)));
register.addDiscount(new QuantityDiscount('Cheerios - buy 3 for 2', 'CHEE', 2, new PercentageValue(-100), 1));

register.scanProduct('BANA', 2);
register.scanProduct('CHEE');

let receipt1 = register.createReceipt();
receipt1.print();

register.addCoupon(new CashTargetCoupon('8JWN', 'Spend $100, get $5 off', 100, new FixedValue(-5)));

register.scanProduct('BANA', 2);
register.scanProduct('BANA', 1.4);
register.scanProduct('CHEE');
register.scanProduct('CHEE');
register.scanProduct('CHEE');
register.scanProduct('CHEE');
register.scanProduct('WINE');
register.scanProduct('WINE');
register.applyCoupon('8JWN');

let receipt2 = register.createReceipt();
receipt2.print();
