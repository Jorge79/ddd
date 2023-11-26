import SendEmailWhenProductIsCreatedHandler from "./product/handler/send-email-when-product-is-created.handler"

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()

    eventDispatcher.register("ProductCreatedEvent", eventHandler)

    expect(eventDispatcher.getEventHandler["ProductCreatedEvent"]).toBeDefined()
    expect(eventDispatcher.getEventHandler["ProductCreatedEvent"].length).toBe(1)
  })
})