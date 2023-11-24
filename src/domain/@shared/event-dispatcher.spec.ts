describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispathcer()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()

    eventDispatcher.register("ProductCreatedEvent", eventHandler)

    expect(eventDispatcher.getEventHandler["ProductCreatedEvent"]).toBeDefined()
    expect(eventDispatcher.getEventHandler["ProductCreatedEvent"].length).toBe(1)
  })
})