import { Component, OnInit } from '@angular/core';
import { ContactService } from 'src/app/services/contact.service';
import { Contact } from 'src/app/services/contact.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
  contacts: Contact[] = [];


  constructor(private contactService: ContactService ) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.contacts = this.contactService.getContacts();
  }

}
