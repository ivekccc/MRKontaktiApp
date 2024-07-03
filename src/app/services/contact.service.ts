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
  private contacts: Contact[] = [{id:1,name:'John Doe',phone:'1234567890',email:'john.doe@example.com'}
  ,{id:2,name:'Jane Smith',phone:'0987654321',email:'jane.smith@example.com'},
  {id:3,name:'Alice Johnson',phone:'5551234567',email:'alice.johnson@example.com'},
  {id:4,name:'Bob Brown',phone:'5559876543',email:'bob.brown@example.com'}
  ];
  private nextId = 2;

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
