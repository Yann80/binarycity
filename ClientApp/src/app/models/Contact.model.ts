import { Client } from "./Client.model";

export interface Contact {
  contactId: number;
  name: string;
  surname: string;
  email: string;
  fullName: string;
  numberOfClients: number;
  clients: Client[];
}
