import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ContactService } from 'src/app/services/contact.service';
import { Contact } from 'src/app/contact.model';

@Component({
  selector: 'app-update-contact',
  templateUrl: './update-contact.page.html',
  styleUrls: ['./update-contact.page.scss'],
})
export class UpdateContactPage implements OnInit {
  contact: Contact = {
    id: '',
    name: '',
    surname: '',
    phone: '',
    email: '',
    favorites: false,
    userId: ''
  };
  disabled: boolean = true;

  changeDisabled(){
    this.disabled = !this.disabled;
  }
  constructor(private router: Router,private contactService: ContactService, private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    const contact = this.contactService.getContact(id);
    if (contact) {
      this.contact = contact;
    } else {
      console.error('Contact not found');
    }
  }

  saveContact() {
    if (this.contact) {
      this.contactService.updateContactFirebase(this.contact);
      this.router.navigate(['/contacts']);
    } else {
      console.error('Contact is undefined');
    }
  }
  cancelAdd(){

    this.router.navigate(['/contacts']);
  }

  public alertButtons = [
    {
      text: "Keep",
      role: 'cancel',
      handler: () => {

      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        this.cancelAdd();
      },
    },
  ];

}
