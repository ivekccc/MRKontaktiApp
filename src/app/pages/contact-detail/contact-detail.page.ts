import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from 'src/app/services/contact.service';
import { Contact } from 'src/app/services/contact.service';



@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.page.html',
  styleUrls: ['./contact-detail.page.scss'],
})
export class ContactDetailPage implements OnInit {
  contact: Contact = {
    id: 0,
    name: '',
    surname: '', // Dodato polje
    phone: '',
    email: '',
    favorites: false // Dodato polje
  };
  contactId: number | undefined;

  constructor(private contactService: ContactService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.contactId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.contactId) {
      const contact = this.contactService.getContact(this.contactId);
      if (contact) {
        this.contact = contact;
      } else {
        this.router.navigate(['/contacts']);
      }
    }
  }
  saveContact() {
    if (this.contactId) {
      this.contactService.updateContact(this.contact);
    } else {
      this.contactService.addContact(this.contact);
    }
    this.router.navigate(['/contacts']);
  }

  deleteContact() {
    if (this.contactId) {
      this.contactService.deleteContact(this.contactId);
    }
    this.router.navigate(['/contacts']);
  }


}
