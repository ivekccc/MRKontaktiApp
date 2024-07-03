import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContactService,Contact } from 'src/app/services/contact.service';

@Component({
  selector: 'app-update-contact',
  templateUrl: './update-contact.page.html',
  styleUrls: ['./update-contact.page.scss'],
})
export class UpdateContactPage implements OnInit {
  contact: Contact = {
    id: 0,
    name: '',
    surname: '',
    phone: '',
    email: '',
    favorites: false
  };
  constructor(private contactService: ContactService, private route: ActivatedRoute) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.params['id']);
    const contact = this.contactService.getContact(id);
    if (contact) {
      this.contact = contact;
    } else {
      console.error('Contact not found');
    }
  }

  saveContact() {
    if (this.contact) {
      this.contactService.updateContact(this.contact);
    } else {
      console.error('Contact is undefined');
    }
  }

}
