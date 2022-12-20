import { Contact } from "./Contact.model";

export class Client {
  clientId:number;
  name:string;
  clientCodePrefix: string;
  clientCode: string;
  contacts: Contact[] = [];
  numberOfContacts: number;
}
