import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Client } from '../models/Client.model';
import { Contact } from '../models/Contact.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BinarycityService {

  private baseUrl = 'http://localhost:5037/api/';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  addClient(client: Client) {
    return this.httpClient.post<Client>(this.baseUrl + 'client/postclient', client, this.httpOptions);
  }

  updateClient(client: Client): Observable<Client> {
    return this.httpClient.put<Client>(this.baseUrl + 'client/updateclient/' + `${client.id}`, client);
  }

  deleteClient(client: Client): Observable<Client> {
    return this.httpClient.delete<Client>(this.baseUrl + 'client/deleteclient/' + client.id);
  }

  getClients() {
    return this.httpClient.get(this.baseUrl + 'client/getclients');
  }

  getContacts() {
    return this.httpClient.get(this.baseUrl + 'contact/getcontacts');
  }

  addContact(contact: Contact) {
    return this.httpClient.post<Contact>(this.baseUrl + 'contact/postcontact', contact, this.httpOptions);
  }

  updateContact(contact: Contact): Observable<Contact> {
    return this.httpClient.put<Contact>(this.baseUrl + 'contact/updatecontact/' + `${contact.id}`, contact);
  }

  deleteContact(contact: Contact): Observable<Contact> {
    return this.httpClient.delete<Contact>(this.baseUrl + 'contact/deletecontact/' + contact.id);
  }
}
