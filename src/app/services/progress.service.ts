import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private flashcardsProgress = new BehaviorSubject<number>(0);
  private sentencesProgress = new BehaviorSubject<number>(0);
  private grammarProgress = new BehaviorSubject<number>(0);
  
  private totalProgress = new BehaviorSubject<number>(0);
  
  constructor() {
    this.calculateTotalProgress();
  }
  
  /**
   * Update the flashcards progress
   * @param progress The new progress value (0-100)
   */
  updateFlashcardsProgress(progress: number): void {
    this.flashcardsProgress.next(progress);
    this.calculateTotalProgress();
  }
  
  /**
   * Update the sentences progress
   * @param progress The new progress value (0-100)
   */
  updateSentencesProgress(progress: number): void {
    this.sentencesProgress.next(progress);
    this.calculateTotalProgress();
  }
  
  /**
   * Update the grammar progress
   * @param progress The new progress value (0-100)
   */
  updateGrammarProgress(progress: number): void {
    this.grammarProgress.next(progress);
    this.calculateTotalProgress();
  }
  
  /**
   * Get the flashcards progress as an observable
   */
  getFlashcardsProgress(): Observable<number> {
    return this.flashcardsProgress.asObservable();
  }
  
  /**
   * Get the sentences progress as an observable
   */
  getSentencesProgress(): Observable<number> {
    return this.sentencesProgress.asObservable();
  }
  
  /**
   * Get the grammar progress as an observable
   */
  getGrammarProgress(): Observable<number> {
    return this.grammarProgress.asObservable();
  }
  
  /**
   * Get the total progress as an observable
   */
  getTotalProgress(): Observable<number> {
    return this.totalProgress.asObservable();
  }
  
  /**
   * Calculate the total progress based on all section progresses
   * @private
   */
  private calculateTotalProgress(): void {
    const flashcards = this.flashcardsProgress.value;
    const sentences = this.sentencesProgress.value;
    const grammar = this.grammarProgress.value;
    
    const total = (flashcards + sentences + grammar) / 3;
    this.totalProgress.next(Math.round(total));
  }
} 