
import { CashTargetCoupon, Coupon } from './coupon';
import { Discount, QuantityDiscount, TradeDiscount } from './discount';
import { Helper } from './helper';
import { Product } from './product';
import { ReceiptItem } from './receipt';
import { CashRegister } from './register';
import { FixedValue, PercentageValue, Value } from './value';

// create a cash register object
let register = new CashRegister();

// load some product types into our register
register.addProduct(new Product('BANA', 'Bananas', 0.99, 'lb'));
register.addProduct(new Product('CHEE', 'Cheerios', 6.99));
register.addProduct(new Product('WINE', 'Fine Vine', 44.99));

// load few discounts to lure the customers
register.addDiscount(new TradeDiscount('Bananas - 20% off', 'BANA', new PercentageValue(-20)));
register.addDiscount(new QuantityDiscount('Cheerios - buy 3 for 2', 'CHEE', 2, new PercentageValue(-100), 1));

// make register aware of the coupons that were printed and distributed
register.addCoupon(new CashTargetCoupon('8JWN', 'Spend $100, get $5 off', 100, new FixedValue(-5)));
register.addCoupon(new CashTargetCoupon('KFUB', 'Spend $100, get $5 off', 100, new FixedValue(-5)));
register.addCoupon(new CashTargetCoupon('LDUF', 'Spend $100, get $5 off', 100, new FixedValue(-5)));

// first customer comes in
register.scanProduct('BANA', 2);
register.scanProduct('CHEE');

// some bananas and a box of Cheerios, not much saving
let receipt1 = register.createReceipt();
receipt1.print();

// we got 20% off of bananas, not bad
//
// Qty        Product                                   Price
// ========== ============================== ================
// 2 lb       Bananas                                   $1.98
//            Bananas - 20% off                       ($0.40)
// 1          Cheerios                                  $6.99
//                                           ----------------
//                                  SubTotal            $8.57
//                                     TOTAL            $8.57

// second customer comes in
register.scanProduct('BANA', 2);
// one banana more please!
register.scanProduct('BANA', 0.5);
// get enough Cheerios to get 3 for 2 discount
register.scanProduct('CHEE');
register.scanProduct('CHEE');
register.scanProduct('CHEE');
// unfortunately 4th box of Cheerios is not discounted
register.scanProduct('CHEE');
// push the total over a $100 with some expensive wine
register.scanProduct('WINE');
register.scanProduct('WINE');
// apply a $5 off cupon because we are over $100 now
register.applyCoupon('8JWN');

let receipt2 = register.createReceipt();
receipt2.print();

// We got 20% off of bananas, one box of Cheerios for free and $5 off on top of that. Great saving!
//
// Qty        Product                                   Price
// ========== ============================== ================
// 2.5 lb     Bananas                                   $2.48
//            Bananas - 20% off                       ($0.50)
// 4          Cheerios                                 $27.96
//            Cheerios - buy 3 for 2                  ($6.99)
// 2          Fine Vine                                $89.98
//                                           ----------------
//                                  SubTotal          $112.93
//                    Spend $100, get $5 off          ($5.00)
//                                           ----------------
//                                     TOTAL          $107.93
