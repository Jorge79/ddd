import EventHandlerInterface from "../../event-handler.interface";
import EventInterface from "../../event.interface";
import ProductCreatedEvent from "../../product-created.event";

export default class SendEmailWhenProductIsCreatedHandler implements EventHandlerInterface<ProductCreatedEvent> {
  handle(event: EventInterface): void {
    console.log("sending email to ");
  }
}