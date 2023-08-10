import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import ChangeAddressEvent from "../change-address.event";

export default class EnviaConsoleLogHandler implements EventHandlerInterface<ChangeAddressEvent>{
    handle(event: ChangeAddressEvent): void {

       console.log(`Handler: EnviaConsoleLogHandler. Mensagem: "Endereço do cliente: ${event.eventData.id}, ${event.eventData.nome} alterado para: ${event.eventData.endereco}`);
    }
}