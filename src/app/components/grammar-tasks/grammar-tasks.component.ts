import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { ProgressService } from '../../services/progress.service';
import { GrammarTask } from '../../models/grammar-task.model';
import { GRAMMAR_TASKS } from '../../data/grammar-tasks';

@Component({
  selector: 'app-grammar-tasks',
  templateUrl: './grammar-tasks.component.html',
  styleUrls: ['./grammar-tasks.component.scss'],
  imports: [CommonModule],
  standalone: true
})
export class GrammarTasksComponent implements OnInit {
  tasks: GrammarTask[] = [];
  allDisplayedTasks: GrammarTask[] = [];
  displayedTasks: GrammarTask[] = [];
  
  selectedAnswers: number[] = [];
  results: boolean[] = [];
  
  totalPoints: number = 0;
  currentLevel: number = 1;
  progressPercentage: number = 0;
  
  isDarkMode: boolean = false;
  showingUnansweredOnly: boolean = false;
  showAchievement: boolean = false;
  
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  
  private readonly STORAGE_KEY_RESULTS = 'grammar_results';
  private readonly STORAGE_KEY_SELECTED = 'grammar_selected';
  private readonly STORAGE_KEY_POINTS = 'grammar_points';
  private readonly STORAGE_KEY_DARK_MODE = 'grammar_dark_mode';

  constructor(
    private storageService: StorageService,
    private progressService: ProgressService
  ) { }

  ngOnInit(): void {
    this.initializeTasks();
    this.loadSavedProgress();
    this.updateStats();
    this.checkForAchievements();
  }


  private initializeTasks(): void {
    this.tasks = [...GRAMMAR_TASKS];
    this.allDisplayedTasks = [...this.tasks];
    
    this.selectedAnswers = new Array(this.tasks.length);
    this.results = new Array(this.tasks.length);
    
    this.totalPages = Math.ceil(this.tasks.length / this.itemsPerPage);
    this.updateDisplayedTasks();
  }


  private loadSavedProgress(): void {
    const savedSelected = this.storageService.getItem(this.STORAGE_KEY_SELECTED);
    const savedResults = this.storageService.getItem(this.STORAGE_KEY_RESULTS);
    const savedPoints = this.storageService.getItem(this.STORAGE_KEY_POINTS);
    const savedDarkMode = this.storageService.getItem(this.STORAGE_KEY_DARK_MODE);
    
    if (savedSelected) {
      this.selectedAnswers = JSON.parse(savedSelected);
    }
    
    if (savedResults) {
      this.results = JSON.parse(savedResults);
    }
    
    if (savedPoints) {
      this.totalPoints = parseInt(savedPoints, 10);
    }
    
    if (savedDarkMode) {
      this.isDarkMode = JSON.parse(savedDarkMode);
    }
  }


  private updateStats(): void {
    const answered = this.results.filter(result => result !== undefined).length;
    this.progressPercentage = Math.round((answered / this.tasks.length) * 100);
    
    this.currentLevel = Math.max(1, Math.floor(this.totalPoints / 50) + 1);
    
    this.progressService.updateGrammarProgress(this.progressPercentage);
  }


  private checkForAchievements(): void {
    if (this.totalPoints >= 50) {
      this.showAchievement = true;
      
      setTimeout(() => {
        this.showAchievement = false;
      }, 5000);
    }
  }


  selectAnswer(taskIndex: number, optionIndex: number): void {
    const realIndex = this.getActualIndex(taskIndex);
    
    if (this.results[realIndex] !== undefined) {
      return; 
    }
    
    this.selectedAnswers[realIndex] = optionIndex;
    this.saveProgress();
  }


  checkAnswer(taskIndex: number): void {
    const realIndex = this.getActualIndex(taskIndex);
    
    const task = this.tasks[realIndex];
    const selectedOptionIndex = this.selectedAnswers[realIndex];
    
    const isCorrect = selectedOptionIndex === task.correctAnswer;
    this.results[realIndex] = isCorrect;
    
    if (isCorrect) {
      const pointsAwarded = this.getPointsForDifficulty(task.difficulty);
      this.totalPoints += pointsAwarded;
      this.storageService.setItem(this.STORAGE_KEY_POINTS, this.totalPoints.toString());
      this.checkForAchievements();
    }
    
    this.saveProgress();
    this.updateStats();
    
    if (this.showingUnansweredOnly) {
      this.updateFilteredTasks();
      this.updateDisplayedTasks();
    }
  }


  retryAnswer(taskIndex: number): void {
    const realIndex = this.getActualIndex(taskIndex);
    
    this.results[realIndex] = undefined as any;
    this.selectedAnswers[realIndex] = undefined as any;
    this.saveProgress();
  }


  shuffleTasks(): void {
    this.allDisplayedTasks = [...this.tasks]
      .sort(() => Math.random() - 0.5);
    
    this.updateDisplayedTasks();
  }


  showUnansweredOnly(): void {
    this.showingUnansweredOnly = !this.showingUnansweredOnly;
    this.currentPage = 1; 
    
    this.updateFilteredTasks();
    this.updateDisplayedTasks();
  }
  

  private updateFilteredTasks(): void {
    if (this.showingUnansweredOnly) {
      const unansweredIndices = this.results
        .map((result, index) => result === undefined ? index : -1)
        .filter(index => index !== -1);
      
      this.allDisplayedTasks = unansweredIndices.map(index => this.tasks[index]);
    } else {
      this.allDisplayedTasks = [...this.tasks];
    }
    
    this.totalPages = Math.ceil(this.allDisplayedTasks.length / this.itemsPerPage);
    
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }
  }


  resetProgress(): void {
    if (confirm('Möchtest du wirklich deinen gesamten Fortschritt zurücksetzen?')) {
      this.selectedAnswers = new Array(this.tasks.length);
      this.results = new Array(this.tasks.length);
      this.totalPoints = 0;
      
      
      this.storageService.removeItem(this.STORAGE_KEY_RESULTS);
      this.storageService.removeItem(this.STORAGE_KEY_SELECTED);
      this.storageService.removeItem(this.STORAGE_KEY_POINTS);
      
      
      if (this.showingUnansweredOnly) {
        this.showingUnansweredOnly = false;
        this.allDisplayedTasks = [...this.tasks];
        this.updateDisplayedTasks();
      }
      
      this.updateStats();
    }
  }

  /**
   * Toggles between light and dark mode
   */
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.storageService.setItem(this.STORAGE_KEY_DARK_MODE, JSON.stringify(this.isDarkMode));
  }

  /**
   * Returns CSS class based on task difficulty
   */
  getDifficultyClass(difficulty: string): string {
    switch (difficulty.toLowerCase()) {
      case 'leicht':
        return 'easy';
      case 'mittel':
        return 'medium';
      case 'schwer':
        return 'hard';
      default:
        return 'medium';
    }
  }

  /**
   * Allows getting difficulty name for display
   */
  getDifficulty(index: number): string {
    return this.displayedTasks[index]?.difficulty || 'Mittel';
  }
  
  /**
   * Converts display index to actual index in the tasks array
   */
  getActualIndex(displayIndex: number): number {
    
    const task = this.displayedTasks[displayIndex];
    
    return this.tasks.findIndex(t => t === task);
  }
  
  /**
   * Gets the global task number (used for display)
   */
  getGlobalTaskNumber(displayIndex: number): number {
    const task = this.displayedTasks[displayIndex];
    const originalIndex = this.tasks.findIndex(t => t === task);
    return originalIndex + 1;
  }

  /**
   * Returns level number based on points
   */
  getLevelNumber(): number {
    return this.currentLevel;
  }

  /**
   * Returns progress percentage
   */
  getProgressPercent(): number {
    return this.progressPercentage;
  }

  /**
   * Toggles filter for unanswered tasks
   */
  toggleFilter(): void {
    this.showUnansweredOnly();
  }
  
  /**
   * Pagination methods
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedTasks();
    }
  }
  
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedTasks();
    }
  }
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedTasks();
    }
  }
  
  updateDisplayedTasks(): void {
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.displayedTasks = this.allDisplayedTasks.slice(startIndex, startIndex + this.itemsPerPage);
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

  /**
   * Saves current progress to storage
   */
  private saveProgress(): void {
    this.storageService.setItem(this.STORAGE_KEY_SELECTED, JSON.stringify(this.selectedAnswers));
    this.storageService.setItem(this.STORAGE_KEY_RESULTS, JSON.stringify(this.results));
  }

  /**
   * Returns points awarded based on task difficulty
   */
  private getPointsForDifficulty(difficulty: string): number {
    switch (difficulty.toLowerCase()) {
      case 'leicht':
        return 5;
      case 'mittel':
        return 10;
      case 'schwer':
        return 15;
      default:
        return 10;
    }
  }
}