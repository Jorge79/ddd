import EventHandlerInterface from "../../@shared/event-handler.interface";
import EventInterface from "../../@shared/event.interface";
import CustomerEditedEvent from "./customer-edited.event";

export default class EditedCustomerHandler implements EventHandlerInterface<CustomerEditedEvent> {
  handle(event: EventInterface): void {
    const { eventData } = event
    console.log(`Cliente alterado para: id: ${eventData.id}, nome: ${eventData.name}, endereço: ${eventData.Address}`, event);
  }
}