import CustomerCreatedEvent from "./customer-created.event";
import EventHandlerInterface from "../../event-handler.interface";
import EventInterface from "../../event.interface";

export default class EditedCustomerHandler implements EventHandlerInterface<CustomerCreatedEvent> {
  handle(event: EventInterface): void {
    const { eventData } = event
    console.log(`Cliente alterado para: id: ${eventData.id}, nome: ${eventData.name}, endereço: ${eventData.Address}`, event);
  }
}