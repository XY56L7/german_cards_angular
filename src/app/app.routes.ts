import { Routes } from '@angular/router';
import { FlashcardComponent } from './components/flashcard/flashcard.component';
import { SentenceCompletionComponent } from './components/sentence-completion/sentence-completion.component';
import { GrammarTasksComponent } from './components/grammar-tasks/grammar-tasks.component';

export const routes: Routes = [
  { path: '', redirectTo: '/flashcards', pathMatch: 'full' },
  { path: 'flashcards', component: FlashcardComponent },
  { path: 'sentences', component: SentenceCompletionComponent },
  { path: 'grammar', component: GrammarTasksComponent }
];