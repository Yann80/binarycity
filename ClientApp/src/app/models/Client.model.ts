import { Contact } from "./Contact.model";

export class Client {
  id:number;
  name:string;
  clientCodePrefix: string;
  clientCode: string;
  numberOfContacts:number;
  contacts: Contact[] = [];
}
