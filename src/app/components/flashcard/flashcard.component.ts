// src/app/components/flashcard/flashcard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Flashcard } from '../../models/flashcard';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface ExtendedFlashcard extends Flashcard {
  flipped: boolean;
  learned: boolean;
  difficulty: number;
}

@Component({
  selector: 'app-flashcard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.scss'],
  animations: [
    trigger('progressAnimation', [
      transition(':enter', [
        style({ width: '0%' }),
        animate('1s ease-out', style({ width: '{{ progress }}%' })),
      ], { params: { progress: 0 } }),
    ]),
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('achievementAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
})
export class FlashcardComponent implements OnInit {
  allFlashcards: ExtendedFlashcard[] = [];
  flashcards: ExtendedFlashcard[] = [];
  progress: number = 0;
  points: number = 0;
  isDarkMode: boolean = false;
  showOnlyUnlearned: boolean = false;
  
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;

  flavorTags: string[] = [
    'Vanille', 'Schokolade', 'Erdbeere', 
    'Minze', 'Pistazie', 'Kaffee',
    'Karamell', 'Zitrone', 'Heidelbeere',
    'Haselnuss', 'Kirsche', 'Kokosnuss'
  ];
  
  exampleSentences: string[] = [
    'Ich möchte ein Eis mit Vanille, bitte.',
    'Das Schokoladeneis schmeckt köstlich.',
    'Erdbeere ist mein Lieblingsgeschmack.',
    'Die Minze ist sehr erfrischend.',
    'Pistazieneis hat eine schöne grüne Farbe.',
    'Kaffeeeis passt gut zum Dessert.',
    'Der Karamellgeschmack ist sehr süß.',
    'Zitroneneis ist perfekt für den Sommer.',
    'Heidelbeereis hat eine intensive Farbe.',
    'Haselnusseis erinnert mich an Nutella.',
    'Kirscheis schmeckt fruchtig und süß.',
    'Kokosnusseis erinnert mich an den Strand.'
  ];
  
  exampleTranslations: string[] = [
    'I would like an ice cream with vanilla, please.',
    'The chocolate ice cream tastes delicious.',
    'Strawberry is my favorite flavor.',
    'The mint is very refreshing.',
    'Pistachio ice cream has a beautiful green color.',
    'Coffee ice cream goes well with dessert.',
    'The caramel flavor is very sweet.',
    'Lemon ice cream is perfect for summer.',
    'Blueberry ice cream has an intense color.',
    'Hazelnut ice cream reminds me of Nutella.',
    'Cherry ice cream tastes fruity and sweet.',
    'Coconut ice cream reminds me of the beach.'
  ];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getFlashcards().subscribe({
      next: (data) => {
        this.allFlashcards = data.map((card, index) => ({ 
          ...card, 
          flipped: false,
          learned: false,
          difficulty: Math.floor(Math.random() * 3) + 1 
        }));
        
        this.loadProgress();
        
        this.totalPages = Math.ceil(this.allFlashcards.length / this.itemsPerPage);
        this.updateDisplayedCards();
      },
      error: (err) => console.error('Error loading flashcards:', err),
    });
    
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      this.isDarkMode = true;
      document.body.classList.add('dark-mode');
    }
  }
  
  loadProgress(): void {
    const savedFlashcards = localStorage.getItem('flashcards');
    const savedPoints = localStorage.getItem('points');
    
    if (savedFlashcards) {
      const savedData = JSON.parse(savedFlashcards);
      
      this.allFlashcards = this.allFlashcards.map(card => {
        const savedCard = savedData.find((sc: ExtendedFlashcard) => sc.id === card.id);
        if (savedCard) {
          return {
            ...card,
            flipped: savedCard.flipped,
            learned: savedCard.learned
          };
        }
        return card;
      });
    }
    
    if (savedPoints) {
      this.points = parseInt(savedPoints, 10);
    }
    
    this.updateProgress();
  }

  flipCard(index: number): void {
    const actualIndex = this.getActualIndex(index);
    this.allFlashcards[actualIndex].flipped = !this.allFlashcards[actualIndex].flipped;
    
    if (this.allFlashcards[actualIndex].flipped) {
      this.points += 10; 
      
      this.playFlipSound();
    }
    
    this.updateProgress();
    this.saveProgress();
  }
  
  getActualIndex(displayIndex: number): number {
    return (this.currentPage - 1) * this.itemsPerPage + displayIndex;
  }

  updateProgress(): void {
    const flippedCount = this.allFlashcards.filter(card => card.flipped).length;
    this.progress = Math.round((flippedCount / this.allFlashcards.length) * 100);
  }

  playAudio(text: string, event: Event): void {
    event.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = text === this.getGermanTextFromEvent(event) ? 'de-DE' : 'en-US';
    window.speechSynthesis.speak(utterance);
  }
  
  getGermanTextFromEvent(event: Event): string {
    const cardElement = (event.target as HTMLElement).closest('.flashcard');
    if (!cardElement) return '';
    
    const index = Array.from(document.querySelectorAll('.flashcard')).indexOf(cardElement);
    if (index === -1) return '';
    
    const actualIndex = this.getActualIndex(index);
    return this.allFlashcards[actualIndex]?.german || '';
  }
  
  playFlipSound(): void {
    const audio = new Audio('data:audio/mp3;base64,SUQzAwAAAAAAJlRQRTEAAAAcAAAAU291bmRKYXkuY29tIFNvdW5kIEVmZmVjdHMA//uSwAAAAAABLBQAAAL6QWkrN1AAAQAAAT5IdQ8lAAABAAABPkgEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    audio.volume = 0.2;
    audio.play();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode', this.isDarkMode);
    
    localStorage.setItem('darkMode', this.isDarkMode ? 'true' : 'false');
  }

  getFlavorTag(index: number): string {
    const actualIndex = this.getActualIndex(index);
    const tagIndex = actualIndex % this.flavorTags.length;
    return this.flavorTags[tagIndex];
  }
  
  getExampleSentence(index: number): string {
    const actualIndex = this.getActualIndex(index);
    const word = this.allFlashcards[actualIndex]?.german.toLowerCase() || '';
    let sentenceIndex = actualIndex % this.exampleSentences.length;
    
    if (!this.exampleSentences[sentenceIndex].toLowerCase().includes(word) && word.length > 0) {
      return `Ich mag ${word} sehr gern.`;
    }
    
    return this.exampleSentences[sentenceIndex];
  }
  
  getExampleTranslation(index: number): string {
    const actualIndex = this.getActualIndex(index);
    const word = this.allFlashcards[actualIndex]?.english.toLowerCase() || '';
    let sentenceIndex = actualIndex % this.exampleTranslations.length;
    
    if (!this.exampleSentences[sentenceIndex].toLowerCase().includes(this.allFlashcards[actualIndex]?.german.toLowerCase() || '') && word.length > 0) {
      return `I really like ${word} a lot.`;
    }
    
    return this.exampleTranslations[sentenceIndex];
  }
  
  getDifficulty(index: number): string {
    const actualIndex = this.getActualIndex(index);
    const difficulty = this.allFlashcards[actualIndex]?.difficulty || 1;
    
    switch(difficulty) {
      case 1: return 'Leicht';
      case 2: return 'Mittel';
      case 3: return 'Schwer';
      default: return 'Mittel';
    }
  }
  
  getDifficultyClass(index: number): string {
    const actualIndex = this.getActualIndex(index);
    const difficulty = this.allFlashcards[actualIndex]?.difficulty || 1;
    
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

  shuffleCards(): void {
    const shuffled = [...this.allFlashcards]
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    
    this.allFlashcards = shuffled;
    this.updateDisplayedCards();
    
    this.points += 5;
    this.saveProgress();
  }
  
  markAsLearned(index: number, event: Event): void {
    event.stopPropagation(); 
    
    const actualIndex = this.getActualIndex(index);
    this.allFlashcards[actualIndex].learned = true;
    this.points += 20; 
    
    this.playAchievementSound();
    
    this.saveProgress();
    this.updateDisplayedCards();
  }
  
  resetProgress(): void {
    if (confirm('Bist du sicher, dass du deinen Fortschritt zurücksetzen möchtest?')) {
      this.allFlashcards = this.allFlashcards.map(card => ({
        ...card,
        flipped: false,
        learned: false
      }));
      
      this.progress = 0;
      this.points = 0;
      this.saveProgress();
      this.updateDisplayedCards();
    }
  }
  
  toggleFilter(): void {
    this.showOnlyUnlearned = !this.showOnlyUnlearned;
    this.currentPage = 1; 
    this.updateDisplayedCards();
  }
  
  saveProgress(): void {
    const cardsToSave = this.allFlashcards.map(card => ({
      id: card.id,
      flipped: card.flipped,
      learned: card.learned
    }));
    
    localStorage.setItem('flashcards', JSON.stringify(cardsToSave));
    localStorage.setItem('points', this.points.toString());
  }
  
  playAchievementSound(): void {
    const audio = new Audio('data:audio/mp3;base64,SUQzAwAAAAAAJlRQRTEAAAAcAAAAU291bmRKYXkuY29tIFNvdW5kIEVmZmVjdHMA//uSwAAAAAABLBQAAAL6QWkrN1AAAQAAAT5IdQ8lAAABAAABPkgEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    audio.volume = 0.3;
    audio.play();
  }
  
  // Pagination methods
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedCards();
    }
  }
  
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedCards();
    }
  }
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedCards();
    }
  }
  
  updateDisplayedCards(): void {
    let filteredCards = this.allFlashcards;
    
    if (this.showOnlyUnlearned) {
      filteredCards = filteredCards.filter(card => !card.learned);
    }
    
    this.totalPages = Math.ceil(filteredCards.length / this.itemsPerPage);
    
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.flashcards = filteredCards.slice(startIndex, startIndex + this.itemsPerPage);
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
  
  getFlavorClass(index: number): string {
    const flavorTag = this.getFlavorTag(index);
    
    const flavor = flavorTag.toLowerCase();
    
    if (flavor.includes('erdbeere')) {
      return 'flavor-erdbeere';
    } else if (flavor.includes('schokolade')) {
      return 'flavor-schokolade';
    } else if (flavor.includes('vanille')) {
      return 'flavor-vanille';
    } else if (flavor.includes('minze')) {
      return 'flavor-minze';
    } else if (flavor.includes('zitrone')) {
      return 'flavor-zitrone';
    }
    
    return '';
  }
}