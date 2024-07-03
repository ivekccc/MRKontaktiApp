import { Injectable } from '@angular/core';

export interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = [];
  private nextId = 1;

  constructor() { }

  getContacts(): Contact[] {
    return this.contacts;
  }

  getContact(id: number): Contact | undefined {
    return this.contacts.find(contact => contact.id === id);
  }
  addContact(contact: Contact): void {
    contact.id = this.nextId++;
    this.contacts.push(contact);
  }
  updateContact(contact: Contact): void {
    const index = this.contacts.findIndex(c => c.id === contact.id);
    if (index !== -1) {
      this.contacts[index] = contact;
    }
  }
  deleteContact(id: number): void {
    this.contacts = this.contacts.filter(contact => contact.id !== id);
  }
}
