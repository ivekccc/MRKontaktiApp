import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from 'src/app/services/contact.service';
import { Contact } from 'src/app/contact.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';



@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.page.html',
  styleUrls: ['./contact-detail.page.scss'],
})
export class ContactDetailPage implements OnInit {
  contact: Contact = {
    id: '',
    name: '',
    surname: '',
    phone: '',
    email: '',
    favorites: false,
    userId: ''
  };


  contactForm: FormGroup= this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    surname: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required, Validators.minLength(10)]],
    email: ['', [Validators.required, Validators.email]],
    favorites: [false]
  });;

  constructor(private contactService: ContactService, private route: ActivatedRoute, private router: Router, private fb: FormBuilder) { }

  ngOnInit() {

  }
  saveContact() {
      if(this.contactForm.valid){
        const{name, surname, phone, email, favorites} = this.contactForm.value;
        const contact: Contact = {id: '', name, surname, phone, email, favorites, userId: ''};
        this.contactService.addContactFirebase(contact);
        this.router.navigate(['/contacts']);
      }
  }

}
