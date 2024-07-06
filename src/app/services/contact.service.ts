import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Database, ref, set, onValue, remove, push } from '@angular/fire/database';
import { from } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
  private contacts: Contact[] = [];

  private loadContactsFromFirebase(): void {
    onValue(this.contactsRef, (snapshot) => {
      const data = snapshot.val();
      this.contacts = data ? Object.values(data) : [];
      this.nextId = this.contacts.length > 0 ? Math.max(...this.contacts.map(c => c.id)) + 1 : 1;
      this.contactsSubject.next(this.contacts);
    });
  }

  private nextId = 6;
  private contactsSubject: BehaviorSubject<Contact[]> = new BehaviorSubject(this.contacts);
  private contactsRef = ref(this.db, 'contacts');

  constructor(private db:Database, private http: HttpClient) {
    this.loadContactsFromFirebase();
   }

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
  addContactFirebase(contact: Contact): Observable<void> {
    const newContactRef = push(this.contactsRef);
    contact.id=this.contacts.length+1;
    this.contacts.push(contact);
    return from(set(newContactRef, contact));

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
