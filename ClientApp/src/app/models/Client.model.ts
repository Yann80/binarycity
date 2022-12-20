import { Contact } from "./Contact.model";

export class Client {
  id:number;
  name:string;
  clientCodePrefix: string;
  clientCode: string;
  contacts: Contact[] = [];
  numberOfContacts: number;
}
