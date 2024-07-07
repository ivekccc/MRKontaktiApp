import { Component, OnInit } from '@angular/core';
import { ContactService } from 'src/app/services/contact.service';
import { Contact } from 'src/app/contact.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PopoverController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ContactPopoverComponent } from 'src/app/contact-popover/contact-popover.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {

  constructor(private authService: AuthService,private contactService: ContactService, private router: Router,
    private popoverController: PopoverController,
    private alertController: AlertController) { }

  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  searchTerm: string = '';
  selectedTab= 'all';
  showSortOptions = false;
  selectedContact: Contact | null = null; // Added property
  private contactsSubscription: Subscription = new Subscription(); // Initialize the subscription

  toggleSortOptions() {
    this.showSortOptions = !this.showSortOptions;
  }
  openContact(contact: Contact) {
    this.router.navigate(['/update-contact', contact.id]);
  }

  toggleTab(tab: 'all' | 'favorites') {
    this.selectedTab = tab;
  }

  get favoriteContacts() {
    return this.filteredContacts.filter(contact => contact.favorites);
  }


  ngOnInit() {
    this.contactService.loadContactsFromFirebase(); // Added from duplicate ngOnInit method
    this.contactsSubscription = this.contactService.getContacts().subscribe(contacts => {
      this.contacts = contacts;
      this.filteredContacts = this.contacts;
    });

  }
  ngOnDestroy() {
    if (this.contactsSubscription) {
      this.contactsSubscription.unsubscribe();
    }
  }

  filterContacts() {
    this.filteredContacts = this.contacts.filter(contact => contact.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    || contact.phone.toLowerCase().includes(this.searchTerm.toLowerCase())
    || contact.email.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

    sortContacts(criteria: keyof Contact) {
    this.filteredContacts.sort((a, b) => {
      if (a[criteria] < b[criteria]) return -1;
      if (a[criteria] > b[criteria]) return 1;
      return 0;
    });
  }

  openContactDetail(contact: Contact) {
    this.router.navigate(['/update-contact', contact.id]);
  }
  logout() {
    this.authService.logout();
    /*Privremeno resenje za testiranje logout funkcionalnosti*/
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
async presentPopover(event: Event, contact: Contact) {
  const popover = await this.popoverController.create({
    component: ContactPopoverComponent,
    componentProps: { contact },
    event: event,
    translucent: true,
    showBackdrop: false
  });
  popover.onDidDismiss().then((data)=>{
    if(data.data){
      const{action}=data.data;
      if(action=='edit'){
       this.openContactDetail(contact);
      }
      if(action=='delete'){
        this.contactService.deleteContactFirebase(contact.id);
      }
    }
  });
  return await popover.present();
}



}
