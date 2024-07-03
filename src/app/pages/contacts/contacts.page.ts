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
  filteredContacts: Contact[] = [];
  searchTerm: string = '';
  selectedTab= 'all';
  showSortOptions = false;

  toggleSortOptions() {
    this.showSortOptions = !this.showSortOptions;
  }

  toggleTab(tab: 'all' | 'favorites') {
    this.selectedTab = tab;
  }

  get favoriteContacts() {
    return this.filteredContacts.filter(contact => contact.favorites);
  }

  constructor(private contactService: ContactService ) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.contacts = this.contactService.getContacts();
    this.filteredContacts = this.contacts;
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

}
