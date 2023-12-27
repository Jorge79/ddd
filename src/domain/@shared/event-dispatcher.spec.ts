import { Sequelize } from "sequelize-typescript"
import CustomerModel from "../../infrastructure/db/sequelize/model/customer.model"
import Address from "../customer/value-object/address"
import Customer from "./customer/handler/customer"
import CustomerCreatedEvent from "./customer/handler/customer-created.event"
import CreatedCustomerHandler, { CreatedCustomerSecondHandler } from "./customer/handler/customer-created.handler"
import EventDispatcher from "./event-dispatcher"
import ProductCreatedEvent from "../product/event/product-created.event"
import SendEmailWhenProductIsCreatedHandler from "../product/event/handler/send-email-when-product-is-created.handler"
import EditedCustomerHandler from "./customer/handler/customer-address.handler"
import CustomerEditedEvent from "./customer/handler/customer-edited.event"

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

  it("should notify the createdcustomer handlers", async () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new CreatedCustomerHandler();
    const secondHandler = new CreatedCustomerSecondHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("CustomerCreatedEvent", eventHandler);
    eventDispatcher.register("CustomerCreatedEvent", secondHandler);

    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(secondHandler);

    const customerCreatedEvent = new CustomerCreatedEvent({
      id: "1",
      name: "Customer 1",
    });

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  })

  it("should notify the customer edited address handler", async () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EditedCustomerHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");
    const customer = new Customer("123", "Customer 1");

    eventDispatcher.register("CustomerEditedEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["CustomerEditedEvent"][0]).toMatchObject(eventHandler);

    const newAddress = new Address("Street 2", 2, "Zipcode 2", "City 2")

    customer.changeAddress(newAddress)

    const customerCreatedEvent = new CustomerEditedEvent({
      id: "1",
      name: "Customer 1",
      Address: newAddress
    });

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  })
})