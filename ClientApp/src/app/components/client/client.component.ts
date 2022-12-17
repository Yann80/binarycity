import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common'
import { Router } from '@angular/router';
import { Client } from '../../models/Client.model';
import { BinarycityService } from '../../services/binarycity.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  clients: Client[] = [];
  clientForm: FormGroup;
  selectedClient?: Client;
  newClient: Client;

  constructor(private service: BinarycityService, private formBuilder: FormBuilder, private router: Router, private location: Location, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {

    this.clientForm = this.formBuilder.group({
      Name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9][a-zA-Z0-9.,'\-_ ]*[a-zA-Z0-9]$")
      ]))
    });

    this.spinner.show();
    this.service.getClients()
      .subscribe(
        (result: any) => {
          this.clients = result;
          this.spinner.hide();
        }
      );
  }

  onSubmit(form: FormGroup) {
    const objClient: Client = {
        name: form.value.Name,
        id: 0,
        clientCodePrefix: '',
        clientCode: '',
        numberOfContacts: 0,
        contacts: []
    };

    if (this.selectedClient == undefined) {
      this.service.addClient(objClient).subscribe(data => {
        this.clients.push(data);
        this.clientForm.reset();
      });

    }
    else {
      objClient.id = this.selectedClient.id;
      this.service.updateClient(objClient).subscribe({
        next: (data) => {
          const index = this.clients.findIndex(
            (client) => client.id === this.selectedClient?.id
          );
          this.clients[index].name = this.clientForm.get("Name")?.value;
        }
      });
    }
  }

  deleteClient(client: Client) {
    if (confirm("Confirmer suppression")) {
      this.service.deleteClient(client).subscribe({
        next: (data) => {
          const index = this.clients.findIndex(
            (client) => client.id === client.id
          );
          this.clients.splice(index, 1);
        }
      });
    }
  }

  editClient(client: Client) {
    this.selectedClient = client;
    this.clientForm.get("firstName")?.setValue(this.selectedClient.name);
  }

  get getControl() {
    return this.clientForm.controls;
  }

  previousPage() {
    this.location.back();
  }
}
