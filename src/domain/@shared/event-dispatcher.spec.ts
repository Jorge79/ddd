import { Sequelize } from "sequelize-typescript"
import CustomerModel from "../../infrastructure/db/sequelize/model/customer.model"
import CustomerRepository from "../../infrastructure/repository/customer.repository"
import Address from "../entity/address"
import Customer from "../entity/customer"
import CustomerCreatedEvent from "./customer-created.event"
import CreatedCustomerHandler from "./customer/handler/customer-created.handler"
import EventDispatcher from "./event-dispatcher"
import ProductCreatedEvent from "./product-created.event"
import SendEmailWhenProductIsCreatedHandler from "./product/handler/send-email-when-product-is-created.handler"

describe("Domain events tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([CustomerModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()

    eventDispatcher.register("ProductCreatedEvent", eventHandler)

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined()
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1)
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler)
  })

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()

    eventDispatcher.register("ProductCreatedEvent", eventHandler)

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler)

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler)

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined()
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0)
  })

  it("should unregister all events", () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler

    eventDispatcher.register("ProductCreatedEvent", eventHandler)

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler)

    eventDispatcher.unregisterAll()

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined()
  })

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() é executado
    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  })

  it("should notify the createdcustomer handler", async () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new CreatedCustomerHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "EnviaConsoleLogHandler");

    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.Address = address;
    await customerRepository.create(customer);

    eventDispatcher.register("CustomerCreatedEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);

    const newAddress = new Address("Street 2", 2, "Zipcode 2", "City 2")

    customer.changeAddress(newAddress)

    const customerCreatedEvent = new CustomerCreatedEvent({
      newAddress
    });

    // Quando o notify for executado o CreatedCustomerHandler.EnviaConsoleLogHandler() é executado
    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  })
})