import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Database, ref, set, onValue, remove, push, query, orderByChild, equalTo, get } from '@angular/fire/database';
import { from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs';
import { Contact } from '../contact.model';
import { lastValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { take } from 'rxjs';



interface ContactData{
  id:string;
  name: string;
  surname: string;
  phone: string;
  email: string;
  favorites: boolean;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = [];

  public loadContactsFromFirebase(){
    this.authService.userId.pipe(take(1)).subscribe((userId) => {
      console.log(userId);
      if (!userId) {
        console.error('User not logged in');
        return;
      }
      return this.http.get<{[key:string]:ContactData}>(`https://mrkontakti-default-rtdb.europe-west1.firebasedatabase.app/contacts.json?orderBy="userId"&equalTo="${userId}"`)
      .subscribe((res)=>{
        console.log('Firebase response:', res); // Log the response
        if (res) {
          this.contacts = Object.keys(res).map((key) => {
            const contact = res[key];
            return new Contact(
             contact.id,
              contact.name,
              contact.surname,
              contact.phone,
              contact.email,
              contact.favorites,
              contact.userId
            );
          });
          this.contactsSubject.next(this.contacts); // Update the BehaviorSubject
        }
      });
    });
  }

  private nextId = 6;
  private contactsSubject: BehaviorSubject<Contact[]> = new BehaviorSubject(this.contacts);
  private contactsRef = ref(this.db, 'contacts');

  constructor(private db:Database, private http: HttpClient, private authService: AuthService) {
   }




  getContacts(): Observable<Contact[]> {
    return this.contactsSubject.asObservable();
  }

  getContact(id: string): Contact | undefined {
    const contact = this.contacts.find(contact => contact.id === id);
    return contact;
  }

  addContactFirebase(contact: Contact) {
    const newContactRef = push(this.contactsRef);
    const newContactId = newContactRef.key;
    if (!newContactId) {
      throw new Error('Failed to generate a new contact ID');
    }
    let newContact: Contact;

    this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        newContact = new Contact(
          newContactId, // Generisani ID
          contact.name,
          contact.surname,
          contact.phone,
          contact.email,
          contact.favorites,
          userId! // Postavljanje userId sa sigurnošću da nije null
        );
        return this.http.put(
          `https://mrkontakti-default-rtdb.europe-west1.firebasedatabase.app/contacts/${newContactId}.json`,
          newContact
        );
      })
    ).subscribe((res) => {
      console.log(res);
      // Dodavanje novog kontakta u lokalnu listu
      this.contacts.push(newContact);
      // Ažuriranje BehaviorSubject-a
      this.contactsSubject.next(this.contacts);
    }, (error) => {
      console.error('Failed to add contact:', error);
    });
  }


  private async getFirebaseIdByContactId(contactId: string): Promise<string | null> {
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


  async deleteContactFirebase(id: string): Promise<void> {
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
