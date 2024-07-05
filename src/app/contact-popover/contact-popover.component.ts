import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ContactService,Contact } from 'src/app/services/contact.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-contact-popover',
  templateUrl: './contact-popover.component.html',
  styleUrls: ['./contact-popover.component.scss'],
})
export class ContactPopoverComponent  implements OnInit {

  @Input() contact!: Contact;
  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        this.popoverController.dismiss();
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        this.deleteContact();
      },
    },
  ];

  constructor(private popoverController: PopoverController, private alertController: AlertController) { }

  ngOnInit() {}
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Delete contact?',
      message: 'This action cannot be undone',
      inputs: [
        {
          name: 'confirm',
          type: 'checkbox',
          label: 'Confirm',
        }
      ],
      buttons: this.alertButtons,
    });

    await alert.present();
  }

  editContact() {
    this.popoverController.dismiss({ action: 'edit' ,contact:this.contact});
  }
  deleteContact() {
    this.popoverController.dismiss({ action: 'delete',contact:this.contact });
  }
}
