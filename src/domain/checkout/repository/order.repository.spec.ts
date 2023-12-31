import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import OrderModel from "../../../infrastructure/order/repository/sequelize/order.model";
import OrderItemModel from "../../../infrastructure/order/repository/sequelize/order-item.model";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import Customer from "../../customer/handler/customer";
import Address from "../../customer/value-object/address";
import ProductRepository from "../../product/repository/product.repository";
import Product from "../../product/entity/product";
import OrderItem from "../entity/order_item";
import Order from "../entity/order";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
    const orderItem2 = new OrderItem("2", product.name, product.price, product.id, 4);

    const order = new Order("123", "123", [orderItem, orderItem2]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    orderItem.changeName("New product 10")
    orderItem.changePrice(20)
    orderItem.changeQuantity(5)

    orderItem2.changeName("New product 2")
    orderItem2.changePrice(5)
    orderItem2.changeQuantity(1)

    await orderRepository.update(order)

    const orderModel = await OrderModel.findOne({ where: { id: "123" }, include: { "association": "items" } });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
        {
          id: orderItem2.id,
          name: orderItem2.name,
          price: orderItem2.price,
          quantity: orderItem2.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  })

  it("should find an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
    const order = new Order("123", "123", [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
    const orderModel = await OrderModel.findOne({ where: { id: "123" }, include: { "association": "items" } });

    const foundOrder = await orderRepository.find("123");

    expect(orderModel.toJSON()).toStrictEqual({
      customer_id: foundOrder.customerId,
      id: foundOrder.id,
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
      total: order.total()
    });
  });

  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
    const orderItem2 = new OrderItem("2", product.name, product.price, product.id, 2);

    const orderRepository = new OrderRepository();
    const order = new Order("1", "123", [orderItem]);
    await orderRepository.create(order);
    const order2 = new Order("2", "123", [orderItem2]);
    await orderRepository.create(order2);

    const foundOrders = await orderRepository.findAll();
    const orders = [order, order2]

    expect(foundOrders).toEqual(orders)
  })
})