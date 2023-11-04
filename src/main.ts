import Customer from "./domain/entity/customer";
import Address from "./domain/entity/address";
import OrderItem from "./domain/entity/order_item";
import Order from "./domain/entity/order";

let customer = new Customer("123", "Jorge")
const address = new Address("Rio Vermelho", 1, "1111-111", "Bahia")
customer.Address = address
customer.activate()

const item1 = new OrderItem("1", "item 1", 10, "1", 1)
const item2 = new OrderItem("2", "item 2", 30, "2", 1)
const order = new Order("1", "123", [item1, item2])