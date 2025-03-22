import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Flashcard } from '../models/flashcard';
import { Sentence } from '../models/sentence';
import { GrammarTask } from '../models/grammar-task.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private flashcardsUrl = 'assets/flashcards.json';
  private sentencesUrl = 'assets/sentences.json';
  private grammarTasksUrl = 'assets/grammar-tasks.json';

  constructor(private http: HttpClient) {}


  getFlashcards(): Observable<Flashcard[]> {
    return this.http.get<Flashcard[]>(this.flashcardsUrl)
      .pipe(
        catchError(error => {
          console.error('Error loading flashcards:', error);
          return of([]);
        })
      );
  }


  getSentences(): Observable<Sentence[]> {
    return this.http.get<Sentence[]>(this.sentencesUrl)
      .pipe(
        catchError(error => {
          console.error('Error loading sentences:', error);
          return of([]);
        })
      );
  }


  getGrammarTasks(): Observable<GrammarTask[]> {
    return this.http.get<GrammarTask[]>(this.grammarTasksUrl)
      .pipe(
        catchError(error => {
          console.error('Error loading grammar tasks:', error);
          return of([]);
        })
      );
  }
}