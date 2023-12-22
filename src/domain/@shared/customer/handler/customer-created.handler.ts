import CustomerCreatedEvent from "../../customer-created.event";
import EventHandlerInterface from "../../event-handler.interface";
import EventInterface from "../../event.interface";

export default class CreatedCustomerHandler implements EventHandlerInterface<CustomerCreatedEvent> {
  handle(event: EventInterface): void {
    console.log("Esse é o primeiro console.log do evento: CustomerCreated");
  }
}