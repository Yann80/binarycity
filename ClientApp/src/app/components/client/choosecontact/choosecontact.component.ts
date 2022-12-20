import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { BinarycityService } from '../../../services/binarycity.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Contact } from '../../../models/Contact.model';
import { Client } from '../../../models/Client.model';

@Component({
  selector: 'app-choosecontact',
  templateUrl: './choosecontact.component.html',
  styleUrls: ['./choosecontact.component.css']
})
export class ChoosecontactComponent implements OnInit {

  client: Client;
  contactFullname: string;
  contacts: Contact[] = [];
  selectedContacts: Contact[] = [];
  listOfContacts = new FormControl();

  constructor(private service: BinarycityService, private spinner: NgxSpinnerService,private dialogRef: MatDialogRef<ChoosecontactComponent>, @Inject(MAT_DIALOG_DATA) public data:any) { }

  ngOnInit(): void {
    this.client = this.data.client;
    this.contactFullname = this.client.clientCode;

    this.service.getContacts()
      .subscribe(
        (result: any) => {
          this.contacts = result;
          this.assignContactsToClient();
          this.spinner.hide();
        }
      );
  }

  assignContactsToClient() {
    let filteredContacts = this.contacts.filter((contact) => contact.numberOfClients > 0);
    let id = this.client.id;
    this.selectedContacts = filteredContacts.filter(function (client) {
      return client.id == id;
    });
  }

  save() {
    this.spinner.show();
    this.client.contacts = this.selectedContacts;
    this.service.updateClient(this.client).subscribe({
      next: (data) => {
        this.spinner.hide();
      }
    });
    this.dialogRef.close(this.client);
  }

  close() {
    this.dialogRef.close();
  }
}
