import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Client } from '../../../models/Client.model';
import { Contact } from '../../../models/Contact.model';
import { BinarycityService } from '../../../services/binarycity.service';

@Component({
  selector: 'app-chooseclient',
  templateUrl: './chooseclient.component.html',
  styleUrls: ['./chooseclient.component.css']
})
export class ChooseclientComponent implements OnInit {

  contact: Contact;
  contactFullname: string;
  clients: Client[] = [];
  selectedClients: Client[] = [];
  listOfClients = new FormControl();

  constructor(private service: BinarycityService, private spinner: NgxSpinnerService, private dialogRef: MatDialogRef<ChooseclientComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.contact = this.data.contact;
    this.contactFullname = this.contact.fullName;

    this.service.getClients()
      .subscribe(
        (result: any) => {
          this.clients = result;
          this.assignClientsToContact();
          this.spinner.hide();
        }
      );
  }

  assignClientsToContact() {
    let filteredClients = this.clients.filter((client) => client.numberOfContacts > 0);
    let id = this.contact.contactId;
    this.selectedClients = filteredClients.map(function (cl) {
      cl.contacts = cl.contacts.filter(co => co.contactId == id);
      return cl;
    }).filter(({ contacts }) => contacts.length);
  }

  save() {
    this.spinner.show();
    this.contact.clients = this.selectedClients;
    this.service.updateContact(this.contact).subscribe({
      next: (data) => {
        this.spinner.hide();
      }
    });
    this.dialogRef.close(this.contact);
  }

  close() {
    this.dialogRef.close(this.contact);
  }

}
