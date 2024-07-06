import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Database, ref, set, onValue, remove, push, query, orderByChild, equalTo, get } from '@angular/fire/database';
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

  addContactFirebase(contact: Contact): Observable<void> {
    const newContactRef = push(this.contactsRef);
    contact.id=this.contacts.length+1;
    return from(set(newContactRef, contact));

  }

  private async getFirebaseIdByContactId(contactId: number): Promise<string | null> {
    const contactsQuery = query(this.contactsRef, orderByChild('id'), equalTo(contactId));
    const snapshot = await get(contactsQuery);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const keys = Object.keys(data);
      return keys.length > 0 ? keys[0] : null;
    }
    return null;
  }

  async updateContactFirebase(contact: Contact): Promise<void> {
    const firebaseId = await this.getFirebaseIdByContactId(contact.id);
    if (firebaseId) {
      const contactRef = ref(this.db, `contacts/${firebaseId}`);
      await set(contactRef, contact);
    } else {
      throw new Error('Contact not found in Firebase');
    }
  }


  async deleteContactFirebase(id: number): Promise<void> {
    const firebaseId = await this.getFirebaseIdByContactId(id);
    if (firebaseId) {
      const contactRef = ref(this.db, `contacts/${firebaseId}`);
      await remove(contactRef);
    }
  }
}
