import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Database, ref, set, onValue, remove, push, query, orderByChild, equalTo, get } from '@angular/fire/database';
import { from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs';
import { Contact } from '../contact.model';
import { lastValueFrom } from 'rxjs';



interface ContactData{
  id:string;
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

  private loadContactsFromFirebase(){
    return this.http.get<{[key:string]:ContactData}>(`https://mrkontakti-default-rtdb.europe-west1.firebasedatabase.app/contacts.json`)
    .subscribe((res)=>{
      console.log('Firebase response:', res); // Log the response
      if (res) {
        this.contacts = Object.keys(res).map((key) => {
          const contact = res[key];
          return new Contact(
            parseInt(contact.id.toString(), 10), // Convert id to number
            contact.name,
            contact.surname,
            contact.phone,
            contact.email,
            contact.favorites
          );
        });
        this.contactsSubject.next(this.contacts); // Update the BehaviorSubject
      }
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

  addContactFirebase(contact: Contact) {
    const newContactRef = push(this.contactsRef);
    const newContactId = newContactRef.key;

    if (newContactId) {
        const contactWithId = { ...contact, id: parseInt(newContactId, 10) };

        return this.http.put(`https://mrkontakti-default-rtdb.europe-west1.firebasedatabase.app/contacts/${newContactId}.json`, contactWithId)
            .subscribe((res) => {
                console.log(res);
                // Add the new contact to the local list
                this.contacts.push(contactWithId);
                // Update the BehaviorSubject
                this.contactsSubject.next(this.contacts);
            });
    } else {
        throw new Error('Failed to generate a unique ID for the new contact');
    }
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
        const url = `https://mrkontakti-default-rtdb.europe-west1.firebasedatabase.app/contacts/${firebaseId}.json`;
        await lastValueFrom(this.http.put(url, contact));
        console.log(`Contact with id ${contact.id} updated successfully`);
        // Update the local list
        const index = this.contacts.findIndex(c => c.id === contact.id);
        if (index !== -1) {
            this.contacts[index] = contact;
            this.contactsSubject.next(this.contacts);
        }
    } else {
        throw new Error('Contact not found in Firebase');
    }
  }


  async deleteContactFirebase(id: number): Promise<void> {
    const firebaseId = await this.getFirebaseIdByContactId(id);
    if (firebaseId) {
      const url = `https://mrkontakti-default-rtdb.europe-west1.firebasedatabase.app/contacts/${firebaseId}.json`;
      this.http.delete(url).subscribe(() => {
        console.log(`Contact with id ${id} deleted successfully`);
        // Optionally, update local contacts list and BehaviorSubject
        this.contacts = this.contacts.filter(contact => contact.id !== id);
        this.contactsSubject.next(this.contacts);
      });
    } else {
      throw new Error('Contact not found in Firebase');
    }
  }
}
