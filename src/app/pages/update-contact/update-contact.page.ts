import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from 'src/app/services/contact.service';
import { Contact } from 'src/app/contact.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

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

  contactForm: FormGroup;

  constructor(
    private router: Router,
    private contactService: ContactService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.contactForm = this.fb.group({
      name: [{ value: '', disabled: this.disabled }, [Validators.required, Validators.minLength(3)]],
      surname: [{ value: '', disabled: this.disabled }, [Validators.required, Validators.minLength(3)]],
      phone: [{ value: '', disabled: this.disabled }, [Validators.required, Validators.minLength(10)]],
      email: [{ value: '', disabled: this.disabled }, [Validators.required, Validators.email]],
      favorites: [{ value: false, disabled: this.disabled }]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    const contact = this.contactService.getContact(id);
    if (contact) {
      this.contact = contact;
      this.contactForm.patchValue(contact);
      this.setFormState();
    } else {
      console.error('Contact not found');
    }
  }

  changeDisabled() {
    this.disabled = !this.disabled;
    this.setFormState();
  }

  setFormState() {
    if (this.disabled) {
      this.contactForm.disable();
    } else {
      this.contactForm.enable();
    }
  }

  saveContact() {
    if (this.contactForm.valid) {
      const updatedContact: Contact = {
        ...this.contact,
        ...this.contactForm.value
      };
      this.contactService.updateContactFirebase(updatedContact);
      this.router.navigate(['/contacts']);
    } else {
      console.error('Form is invalid');
    }
  }

  cancelAdd() {
    this.router.navigate(['/contacts']);
  }

  public alertButtons = [
    {
      text: "Keep",
      role: 'cancel',
      handler: () => { },
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
