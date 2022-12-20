import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Location } from '@angular/common'
import { Router } from '@angular/router';
import { Client } from '../../models/Client.model';
import { BinarycityService } from '../../services/binarycity.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Contact } from '../../models/Contact.model';
import { ChoosecontactComponent } from './choosecontact/choosecontact.component';
import { MessageboxComponent } from '../../shared/messagebox/messagebox.component';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  clients: Client[] = [];
  contacts: Contact[] = [];
  clientForm: FormGroup;
  selectedClient?: Client;
  newClient: Client;
  noDataFound: boolean; 

  constructor(private service: BinarycityService, private formBuilder: FormBuilder, private router: Router, private location: Location, private spinner: NgxSpinnerService, private dialog: MatDialog) { }

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
          this.noDataFound = this.clients.length == 0;
        }
      );
    this.service.getContacts()
      .subscribe(
        (result: any) => {
          this.contacts = result;
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
        this.noDataFound = false;
        this.clientForm.reset();
      });

    }
    else {
      objClient.id = this.selectedClient.id;
      objClient.clientCodePrefix = this.selectedClient.clientCodePrefix;
      objClient.clientCode = this.selectedClient.clientCode;
      this.service.updateClient(objClient).subscribe({
        next: (data) => {
          const index = this.clients.findIndex(
            (client) => client.id === this.selectedClient?.id
          );
          this.clients[index].name = data.name;
          this.clients[index].clientCode = data.clientCode;
          this.clientForm.reset();
        }
      });
    }
  }

  deleteClient(client: Client) {
    const confirmDialog = this.dialog.open(MessageboxComponent, {
      data: {
        title: 'Confirm deletion of client',
        message: 'Are you sure, you want to delete client: ' + client.clientCode + ' ?'
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.service.deleteClient(client).subscribe({
          next: (data) => {
            const index = this.clients.findIndex(
              (client) => client.id === client.id
            );
            this.clients.splice(index, 1);
            this.noDataFound = this.clients.length == 0;
          }
        });
      }
    });
  }

  editClient(client: Client) {
    this.selectedClient = client;
    this.clientForm.get("Name")?.setValue(this.selectedClient.name);
  }

  linkToContact(client: Client) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(ChoosecontactComponent, {
      minWidth: 500,
      maxHeight: 600,
      data: {
        client: client
      }
    });

    dialogRef.afterClosed().subscribe(
      data => {
        client = data;
        const index = this.clients.findIndex(
          (client) => client.id === client.id
        );
        //TODO: implement function of numberOfContacts
        this.clients[index].numberOfContacts = client.contacts.length;
      });
  }

  get getControl() {
    return this.clientForm.controls;
  }

  previousPage() {
    this.location.back();
  }
}
