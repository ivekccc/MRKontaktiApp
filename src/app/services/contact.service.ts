import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Contact {
  id: number;
  name: string;
  surname: string;
  phone: string;
  email: string;
  favorites: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = [
  {
    id: 1,
    name: 'Marko',
    surname: 'Markovic',
    phone: '123-456-7890',
    email: 'marko.markovic@example.com',
    favorites: false
  },
  {
    id: 2,
    name: 'Jelena',
    surname: 'Jovanovic',
    phone: '234-567-8901',
    email: 'jelena.jovanovic@example.com',
    favorites: true
  },
  {
    id: 3,
    name: 'Nikola',
    surname: 'Nikolic',
    phone: '345-678-9012',
    email: 'nikola.nikolic@example.com',
    favorites: false
  },
  {
    id: 4,
    name: 'Ana',
    surname: 'Anic',
    phone: '456-789-0123',
    email: 'ana.anic@example.com',
    favorites: true
  },
  {
    id: 5,
    name: 'Petar',
    surname: 'Petrovic',
    phone: '567-890-1234',
    email: 'petar.petrovic@example.com',
    favorites: false
  }
  ];
  private nextId = 6;
  private contactsSubject: BehaviorSubject<Contact[]> = new BehaviorSubject(this.contacts);

  constructor() { }

  getContacts(): Observable<Contact[]> {
    return this.contactsSubject.asObservable();
  }

  getContact(id: number): Contact | undefined {
    const contact = this.contacts.find(contact => contact.id === id);
    return contact;
  }
  addContact(contact: Contact): void {
    contact.id = this.nextId++;
    this.contacts.push(contact);
  }
  updateContact(contact: Contact): void {
    const index = this.contacts.findIndex(c => c.id === contact.id);
    if (index !== -1) {
      this.contacts[index] = contact;
      this.contactsSubject.next(this.contacts);
    }
  }

  deleteContact(id: number): void {
    this.contacts = this.contacts.filter(contact => contact.id !== id);
    this.contactsSubject.next(this.contacts);
  }
}
