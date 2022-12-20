import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { Location } from '@angular/common'
import { NgxSpinnerService } from 'ngx-spinner';
import { Contact } from '../../models/Contact.model';
import { BinarycityService } from '../../services/binarycity.service';
import { ChooseclientComponent } from './chooseclient/chooseclient.component';
import { MessageboxComponent } from '../../shared/messagebox/messagebox.component';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contacts: Contact[] = [];
  contactForm: FormGroup;
  selectedContact?: Contact;
  newContact: Contact;
  noDataFound: boolean; 

  constructor(private service: BinarycityService, private formBuilder: FormBuilder, private router: Router, private location: Location, private spinner: NgxSpinnerService, private dialog: MatDialog) { }

  ngOnInit(): void {

    this.contactForm = this.formBuilder.group({
      Name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9][a-zA-Z0-9.,'\-_ ]*[a-zA-Z0-9]$")
      ])),
      Surname: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9][a-zA-Z0-9.,'\-_ ]*[a-zA-Z0-9]$")
      ])),
      Email: ['', [
        Validators.required, Validators.email]]
    });

    this.spinner.show();
    this.service.getContacts()
      .subscribe(
        (result: any) => {
          this.contacts = result;
          this.noDataFound = this.contacts.length == 0;
          this.spinner.hide();
        }
      );
  }

  onSubmit(form: FormGroup) {
    const objContact: Contact = {
        id: 0,
        name: form.value.Name,
        surname: form.value.Surname,
        email: form.value.Email,
        fullName: '',
        numberOfClients: 0,
        clients: []
    };

    if (this.selectedContact == undefined) {
      this.service.addContact(objContact).subscribe(data => {
        this.contacts.push(data);
        this.noDataFound = false;
        this.contactForm.reset();
      });

    }
    else {
      objContact.id = this.selectedContact.id;
      this.service.updateContact(objContact).subscribe({
        next: (data) => {
          const index = this.contacts.findIndex(
            (contact) => contact.id === this.selectedContact?.id
          );
          this.contacts[index].name = data.name
          this.contacts[index].surname = data.surname
          this.contacts[index].fullName = data.fullName;
          this.contacts[index].email = data.email;
          this.contactForm.reset();
        }
      });
    }
  }

  deleteContact(contact: Contact) {
    const confirmDialog = this.dialog.open(MessageboxComponent, {
      data: {
        title: 'Confirm deletion of contact',
        message: 'Are you sure, you want to delete contact: ' + contact.fullName + ' ?'
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.service.deleteContact(contact).subscribe({
          next: (data) => {
            const index = this.contacts.findIndex(
              (contact) => contact.id === contact.id
            );
            this.contacts.splice(index, 1);
            this.noDataFound = this.contacts.length == 0;
          }
        });
      }
    });
  }

  editContact(contact: Contact) {
    this.selectedContact = contact;
    this.contactForm.get("Name")?.setValue(this.selectedContact.name);
    this.contactForm.get("Surname")?.setValue(this.selectedContact.surname);
    this.contactForm.get("Email")?.setValue(this.selectedContact.email);
  }

  linkToClient(contact: Contact) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(ChooseclientComponent, {
      minWidth: 500,
      maxHeight: 600,
      data: {
        contact: contact
      }
    });

    dialogRef.afterClosed().subscribe(
      data => {
        contact = data;
        const index = this.contacts.findIndex(
          (contact) => contact.id === contact.id
        );
        //TODO: implement function of numberOfContacts
        this.contacts[index].numberOfClients = contact.clients.length;
      });
  }

  get getControl() {
    return this.contactForm.controls;
  }

  previousPage() {
    this.location.back();
  }
}
