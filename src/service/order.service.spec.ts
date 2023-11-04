import Customer from "../domain/entity/customer"
import Order from "../domain/entity/order"
import OrderItem from "../domain/entity/order_item"
import OrderService from "./order.service"

describe("Order service unit tests", () => {
  it("should get total of all orders", () => {
    const item1 = new OrderItem("i1", "item1", 100, "p1", 1)
    const item2 = new OrderItem("i1", "item1", 200, "p1", 2)

    const order1 = new Order("o1", "c1", [item1])
    const order2 = new Order("o2", "c1", [item2])

    const total = OrderService.total([order1, order2])

    expect(total).toBe(500)
  })

  it("should place an order", () => {
    const customer = new Customer("c1", "Customer1")
    const item1 = new OrderItem("i1", "item1", 10, "p1", 1)

    const order = OrderService.placeOrder(customer, [item1])

    expect(customer.rewardPoints).toBe(5)
    expect(order.total()).toBe(10)
  })
})