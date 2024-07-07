import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Contact } from 'src/app/contact.model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-contact-popover',
  templateUrl: './contact-popover.component.html',
  styleUrls: ['./contact-popover.component.scss'],
})
export class ContactPopoverComponent implements OnInit {

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
      cssClass: 'alert-ok-button',
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
          handler: (event) => {
            const okButton = document.querySelector('.alert-ok-button');
            if (okButton instanceof HTMLButtonElement) {
              okButton.disabled = !event.checked;
              okButton.classList.toggle('disabled-button', !event.checked);
            }
          }
        }
      ],
      buttons: this.alertButtons,
    });

    await alert.present();
    const okButton = document.querySelector('.alert-ok-button');
    if (okButton instanceof HTMLButtonElement) {
      okButton.disabled = true;
      okButton.classList.add('disabled-button');
    }
  }

  editContact() {
    this.popoverController.dismiss({ action: 'edit', contact: this.contact });
  }

  deleteContact() {
    this.popoverController.dismiss({ action: 'delete', contact: this.contact });
  }
}
