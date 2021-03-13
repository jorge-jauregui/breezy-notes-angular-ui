import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Note } from './note.model';

import { HttpClient } from '@angular/common/http';
import { API_URL } from '../environments/environment';
import { Observable, of } from 'rxjs';



@Injectable({
  providedIn: 'root'
})

export class RestService {
  jwtKey: string = 'user_jwt'
  private notes: Note[] = [];
  private notesUpdated = new Subject<Note[]>();

  constructor(private readonly http: HttpClient) { }

  register(body: {
    email: string; 
    password: string;
    fname: string;
    lname: string;
  }) {
    this.http
      .post(`${API_URL}/register`, body)
      .toPromise()
      .then((res: string) => {
        localStorage.setItem(this.jwtKey, res)
      });
  }

  logIn(body: {
    email: string;
    password: string;
  }) {
    this.http
      .post(`${API_URL}/auth`, body)
      .toPromise()
      .then(res => {
        localStorage.setItem(this.jwtKey, <string>res)
        const jwt = localStorage.getItem(this.jwtKey);
      });
  }

  checkLogin(): Observable<boolean> {
    const jwt = localStorage.getItem(this.jwtKey)
    if (jwt === null) {// If user is not logged in
      return of(false)
    } else if(jwt === "Email not found") { // If email fails
      return of(false)
    } else if(jwt === "Password not found") { // If password fails
      return of(false)
    } else { // If user is logged in
      return of(true)
    }
  }

  logOut() {
    localStorage.removeItem(this.jwtKey);
    const jwt = localStorage.getItem(this.jwtKey);
  }

  getNoteUpdateListener() {
    return this.notesUpdated.asObservable();
  }

  postNote(note: {
    id: string;
    title: string;
    description: string;
  }) {
    const jwt = localStorage.getItem(this.jwtKey);
    this.http
      .post<{message: string, noteId: string}>(
        `${API_URL}/post-note`, 
        note,
        { headers: { Authorization: `Bearer ${jwt}` }}
        )
      .subscribe((responseData) => {
        const id = responseData.noteId
        note.id = id;
        this.notes.push(note)
        this.notesUpdated.next([...this.notes])
      })
  }

  editNote(note: {
    id;
    title;
    description;
  }) {
    const jwt = localStorage.getItem(this.jwtKey);
    this.http
      .put<any>(
        `${API_URL}/${note.id}`, 
        note,
        { headers: { Authorization: `Bearer ${jwt}` }}
      )
      .subscribe(() => {
        const updatedNotes = [...this.notes]
        const oldNoteIndex = updatedNotes.findIndex(n => n.id === note.id)
        updatedNotes[oldNoteIndex] = note
        this.notes = updatedNotes
        this.notesUpdated.next([...this.notes])
      })
  }

  getUserNotes() {
    const jwt = localStorage.getItem(this.jwtKey);
    this.http
      .get<any>(
        `${API_URL}/user-notes`,
        { headers: { Authorization: `Bearer ${jwt}` } }
      )
      .subscribe((allNotes) => {
        this.notes = allNotes
        this.notesUpdated.next([...this.notes])
      })
  }

  deleteNote(noteId) {
    const jwt = localStorage.getItem(this.jwtKey);

    return this.http
      .delete<any>(
        `${API_URL}/${noteId}`,
        { headers: { Authorization: `Bearer ${jwt}` } }
      )
      .subscribe(() => {
        // Remove deleted note from client with filter() and send back a copy of updated notes
        const updatedNotes = this.notes.filter(note => note.id !== noteId);
        this.notes = updatedNotes;
        this.notesUpdated.next([...this.notes]);
      });

  }
  
  getCar(id: number): Promise<any> {
    const jwt = localStorage.getItem(this.jwtKey);

    return this.http
      .get(
        `${API_URL}/${id}`,
        { headers: { Authorization: `Bearer ${jwt}` } }
      )
      .toPromise();
  }

}
