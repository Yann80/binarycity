import { Client } from "./Client.model";

export class Contact {
  id: number;
  name: string;
  surName: string;
  email: string;
  fullName: string;
  numberOfClients: number;
  clients: Client[] = [];
}
