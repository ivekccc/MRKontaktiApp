import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ContactService,Contact } from 'src/app/services/contact.service';

@Component({
  selector: 'app-contact-popover',
  templateUrl: './contact-popover.component.html',
  styleUrls: ['./contact-popover.component.scss'],
})
export class ContactPopoverComponent  implements OnInit {

  @Input() contact!: Contact;

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {}

  editContact() {
    this.popoverController.dismiss({ action: 'edit' });
  }
  deleteContact() {
    this.popoverController.dismiss({ action: 'delete' });
  }
}
