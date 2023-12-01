import CustomerCreatedEvent from "../../customer-created.event";
import EventHandlerInterface from "../../event-handler.interface";
import EventInterface from "../../event.interface";

export default class CreatedCustomerHandler implements EventHandlerInterface<CustomerCreatedEvent> {
  handle(event: EventInterface): void {
    console.log("Esse é o primeiro console.log do evento: CustomerCreated");
  }

  handle2(event: EventInterface): void {
    console.log("Esse é o segundo console.log do evento: CustomerCreated");
  }

  EnviaConsoleLogHandler(event: EventInterface): void {
    console.log("Endereço do cliente: {id}, {nome} alterado para: {endereco}");
  }
}