import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Sentence } from '../../models/sentence';
import { trigger, transition, style, animate } from '@angular/animations';

interface ExtendedSentence extends Sentence {
  difficulty: number;
}

@Component({
  selector: 'app-sentence-completion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sentence-completion.component.html',
  styleUrls: ['./sentence-completion.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('resultAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
    trigger('progressAnimation', [
      transition(':enter', [
        style({ width: '0%' }),
        animate('1s ease-out', style({ width: '{{ progress }}%' })),
      ], { params: { progress: 0 } }),
    ]),
    trigger('achievementAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
})
export class SentenceCompletionComponent implements OnInit {
  allSentences: ExtendedSentence[] = [];
  sentences: ExtendedSentence[] = [];
  answers: string[] = [];
  results: boolean[] = [];
  points: number = 0;
  isDarkMode: boolean = false;
  showHints: boolean[] = [];
  showOnlyUnanswered: boolean = false;
  
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  
  hints: string[] = [
    "Achten Sie auf die Verbform in diesem Satz.",
    "Denken Sie an die richtige Zeitform des Verbs.",
    "Beachten Sie die Übersetzung in Klammern.",
    "Das ist eine besondere Verbform.",
    "Vielleicht müssen Sie ein Modalverb verwenden?",
    "Denken Sie an die Verbkonjugation für dieses Subjekt."
  ];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadSentences();
    this.loadPreferences();
  }
  
  loadSentences(): void {
    this.dataService.getSentences().subscribe({
      next: (data) => {
        this.allSentences = data.map(sentence => ({
          ...sentence,
          difficulty: Math.floor(Math.random() * 3) + 1
        }));
        
        this.answers = new Array(this.allSentences.length).fill('');
        this.results = new Array(this.allSentences.length);
        this.showHints = new Array(this.allSentences.length).fill(false);
        
        this.loadProgress();
        
        this.totalPages = Math.ceil(this.allSentences.length / this.itemsPerPage);
        this.updateDisplayedSentences();
      },
      error: (err) => console.error('Error loading sentences:', err),
    });
  }
  
  loadPreferences(): void {
    const savedDarkMode = localStorage.getItem('sentencesDarkMode');
    if (savedDarkMode === 'true') {
      this.isDarkMode = true;
      document.body.classList.add('dark-mode');
    }
  }
  
  loadProgress(): void {
    const savedAnswers = localStorage.getItem('sentenceAnswers');
    const savedResults = localStorage.getItem('sentenceResults');
    const savedPoints = localStorage.getItem('sentencePoints');
    
    if (savedAnswers) {
      this.answers = JSON.parse(savedAnswers);
    }
    
    if (savedResults) {
      this.results = JSON.parse(savedResults);
    }
    
    if (savedPoints) {
      this.points = parseInt(savedPoints, 10);
    }
  }
  
  saveProgress(): void {
    localStorage.setItem('sentenceAnswers', JSON.stringify(this.answers));
    localStorage.setItem('sentenceResults', JSON.stringify(this.results));
    localStorage.setItem('sentencePoints', this.points.toString());
  }

  checkAnswer(index: number): void {
    const actualIndex = this.getActualIndex(index);
    const userAnswer = this.answers[actualIndex]?.trim().toLowerCase();
    const correctAnswer = this.allSentences[actualIndex].correct.toLowerCase();
    
    this.results[actualIndex] = this.isAnswerCorrect(userAnswer, correctAnswer);
    
    if (this.results[actualIndex]) {
      if (this.results[actualIndex] !== true) {
        this.points += 10;
        this.playSuccessSound();
      }
    } else {
      this.playErrorSound();
    }
    
    this.saveProgress();
  }
  
  isAnswerCorrect(userAnswer: string, correctAnswer: string): boolean {
    const normalizedUserAnswer = userAnswer.replace(/[.,?!]/g, '').trim();
    const normalizedCorrectAnswer = correctAnswer.replace(/[.,?!]/g, '').trim();
    
    return normalizedUserAnswer === normalizedCorrectAnswer;
  }
  
  retryAnswer(index: number): void {
    const actualIndex = this.getActualIndex(index);
    this.answers[actualIndex] = '';
    this.results[actualIndex] = undefined as any;
    this.saveProgress();
  }
  
  toggleHint(index: number, event: Event): void {
    event.preventDefault();
    const actualIndex = this.getActualIndex(index);
    this.showHints[actualIndex] = !this.showHints[actualIndex];
  }
  
  getHint(index: number): string {
    const actualIndex = this.getActualIndex(index);
    const difficulty = this.allSentences[actualIndex]?.difficulty || 1;
    const hintIndex = (actualIndex + difficulty) % this.hints.length;
    return this.hints[hintIndex];
  }
  
  getDifficulty(index: number): string {
    const actualIndex = this.getActualIndex(index);
    const difficulty = this.allSentences[actualIndex]?.difficulty || 1;
    
    switch(difficulty) {
      case 1: return 'Leicht';
      case 2: return 'Mittel';
      case 3: return 'Schwer';
      default: return 'Mittel';
    }
  }
  
  getDifficultyClass(index: number): string {
    const actualIndex = this.getActualIndex(index);
    const difficulty = this.allSentences[actualIndex]?.difficulty || 1;
    
    switch(difficulty) {
      case 1: return 'easy';
      case 2: return 'medium';
      case 3: return 'hard';
      default: return 'medium';
    }
  }
  
  getLevelNumber(): number {
    return Math.floor(this.points / 50) + 1;
  }
  
  getProgressPercent(): number {
    const correctCount = this.results.filter(result => result === true).length;
    return Math.round((correctCount / this.allSentences.length) * 100) || 0;
  }
  
  getSentenceDisplay(sentence: string): string {

    const hintMatch = sentence.match(/___ \(([^)]+)\)/);
    const hint = hintMatch ? hintMatch[1] : '';
    
    let formattedSentence = sentence.replace(/___ \([^)]+\)/, '<span class="blank">___</span>');
    
    if (formattedSentence === sentence) {
      formattedSentence = sentence.replace(/___/, '<span class="blank">___</span>');
    }
    
    if (hint) {
      formattedSentence = formattedSentence.replace('<span class="blank">___</span>', 
        `<span class="blank" title="${hint}">___</span>`);
    }
    
    return formattedSentence;
  }
  
  getActualIndex(displayIndex: number): number {
    return (this.currentPage - 1) * this.itemsPerPage + displayIndex;
  }
  
  shuffleSentences(): void {
    const currentAnswers = [...this.answers];
    const currentResults = [...this.results];
    const currentShowHints = [...this.showHints];
    
    const indices = this.allSentences.map((_, i) => i);
    const shuffledIndices = [...indices]
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    
    const shuffledSentences = shuffledIndices.map(i => this.allSentences[i]);
    this.allSentences = shuffledSentences;
    
    this.answers = shuffledIndices.map(i => currentAnswers[i]);
    this.results = shuffledIndices.map(i => currentResults[i]);
    this.showHints = shuffledIndices.map(i => currentShowHints[i]);
    
    this.points += 5;
    this.saveProgress();
    
    this.updateDisplayedSentences();
  }
  
  resetProgress(): void {
    if (confirm('Bist du sicher, dass du deinen Fortschritt zurücksetzen möchtest?')) {
      this.answers = new Array(this.allSentences.length).fill('');
      this.results = new Array(this.allSentences.length);
      this.showHints = new Array(this.allSentences.length).fill(false);
      this.points = 0;
      this.saveProgress();
    }
  }
  
  toggleFilter(): void {
    this.showOnlyUnanswered = !this.showOnlyUnanswered;
    this.currentPage = 1; 
    this.updateDisplayedSentences();
  }
  
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode', this.isDarkMode);
    
    localStorage.setItem('sentencesDarkMode', this.isDarkMode ? 'true' : 'false');
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedSentences();
    }
  }
  
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedSentences();
    }
  }
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedSentences();
    }
  }
  
  updateDisplayedSentences(): void {
    let filteredSentences = this.allSentences;
    
    if (this.showOnlyUnanswered) {
      filteredSentences = filteredSentences.filter((_, i) => !this.results[i]);
    }
    
    this.totalPages = Math.ceil(filteredSentences.length / this.itemsPerPage);
    
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.sentences = filteredSentences.slice(startIndex, startIndex + this.itemsPerPage);
  }
  
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const totalToShow = 5; 
    
    if (this.totalPages <= totalToShow) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, this.currentPage - Math.floor(totalToShow / 2));
      let end = Math.min(this.totalPages, start + totalToShow - 1);
      
      if (end === this.totalPages) {
        start = Math.max(1, end - totalToShow + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }
  
  playSuccessSound(): void {
    const audio = new Audio('data:audio/mp3;base64,SUQzAwAAAAAAI1RUQEUAAAANAAABVGF1dGhvcgAAAFNvdW5kSmF5Lk5ldA//uSwAAABuglQFTwAAhNhOdKmYAAQAABLRJGluZwAAAA8AAAFVUmVjb3JkaXN0AAAAU291bmRKYXkuTmV0AAAAVElUMgAAAAwAAABTb3VuZCBFZmZlY3QAAEFTRVQAAAANAAABSW50ZXJmYWNlIAxMRUEAAAALAAAARWZmZWN0IFNveQAA');
    audio.volume = 0.3;
    audio.play();
  }
  
  playErrorSound(): void {
    const audio = new Audio('data:audio/mp3;base64,SUQzAwAAAAAAJlRQRTEAAAAcAAAAU291bmRKYXkuY29tIFNvdW5kIEVmZmVjdHMA//uSwAAAAAABLBQAAAL6QWkrN1AAAQAAAT5IdQ8lAAABAAABPkgEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    audio.volume = 0.2;
    audio.play();
  }
}