import { Component, OnInit, OnDestroy } from '@angular/core';
import { RestService } from '../rest.service';
import { Note } from '../note.model'
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit, OnDestroy {

  //Post note
  title: string = ''
  description: string = ''
  id: null

  mode: string = "create";

  notes: Note[] = [];

  //Edit note

  private notesSubscription: Subscription;

  constructor(public rest: RestService) { }

  ngOnInit(): void {
    this.rest.getUserNotes()
    this.notesSubscription = this.rest.getNoteUpdateListener()
    .subscribe((notes: Note[]) => {
      this.notes = notes
    })

  }
  ngOnDestroy() {
    this.notesSubscription.unsubscribe()
  }

  postNote() {
    this.rest.postNote({
      id: this.id,
      title: this.title,
      description: this.description
    })
    this.mode = "create"
    this.title = ''
    this.description = ''
  }

  deleteNote(noteId) {
    this.rest.deleteNote(noteId)
    this.mode = "create"
    this.title = ''
    this.description = ''
  }

  onClickNote(noteTitle, noteDescription, noteId) {
    this.mode = "edit"
    this.title = noteTitle
    this.description = noteDescription
    this.id = noteId
  }

  editNote() {
    this.rest.editNote({
      id: this.id,
      title: this.title,
      description: this.description
    })
    this.mode = "create"
    this.title = ''
    this.description = ''
  }
  
  changeToCreate() {
    this.mode = "create"
    this.title = ''
    this.description = ''
  }




}
