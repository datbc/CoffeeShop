import { OrderItem } from './orderitem';
import { Order } from './order';
import { Address } from './address';
import { Customer } from './customer';
export class Purchase {
    customer!: Customer;
    shippingAddress!: Address;
    order!: Order;
    orderItems!: OrderItem[];
}
