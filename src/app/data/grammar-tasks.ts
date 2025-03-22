import { GrammarTask } from '../models/grammar-task.model';

export const GRAMMAR_TASKS: GrammarTask[] = [
  {
    id: 'g1',
    task: 'Welche Form des Artikels ist korrekt? ___ Frau kauft ___ Buch für ___ Kind.',
    options: [
      'Die, ein, das',
      'Der, ein, das',
      'Die, das, ein',
      'Die, ein, ein'
    ],
    correctAnswer: 0,
    difficulty: 'Leicht',
    category: 'Artikel'
  },
  {
    id: 'g2',
    task: 'Wähle die richtige Pluralform von "das Haus".',
    options: [
      'die Hause',
      'die Häuser',
      'die Häusern',
      'die Hausse'
    ],
    correctAnswer: 1,
    difficulty: 'Leicht',
    category: 'Plural'
  },
  {
    id: 'g3',
    task: 'Wie lautet der Akkusativ von "der Mann"?',
    options: [
      'dem Mann',
      'des Mannes',
      'den Mann',
      'der Mann'
    ],
    correctAnswer: 2,
    difficulty: 'Mittel',
    category: 'Kasus'
  },
  {
    id: 'g4',
    task: 'Ergänze den Satz: "Ich gehe ___ Supermarkt."',
    options: [
      'zu dem',
      'in dem',
      'in den',
      'zu den'
    ],
    correctAnswer: 2,
    difficulty: 'Mittel',
    category: 'Präpositionen'
  },
  {
    id: 'g5',
    task: 'Welche Konjugation ist richtig? Ich ___ gestern ins Kino.',
    options: [
      'gehe',
      'ging',
      'gegangen',
      'gehte'
    ],
    correctAnswer: 1,
    difficulty: 'Mittel',
    category: 'Verben'
  },
  {
    id: 'g6',
    task: 'Welches ist das Perfekt von "lesen"?',
    options: [
      'Ich habe gelest',
      'Ich habe gelesen',
      'Ich bin gelesen',
      'Ich bin gelest'
    ],
    correctAnswer: 1,
    difficulty: 'Mittel',
    category: 'Perfekt'
  },
  {
    id: 'g7',
    task: 'Welcher Satz ist im Konjunktiv II?',
    options: [
      'Ich gehe zum Arzt.',
      'Ich werde zum Arzt gehen.',
      'Ich bin zum Arzt gegangen.',
      'Ich würde zum Arzt gehen.'
    ],
    correctAnswer: 3,
    difficulty: 'Schwer',
    category: 'Konjunktiv'
  },
  {
    id: 'g8',
    task: 'Welche dieser Präpositionen verlangt den Dativ?',
    options: [
      'für',
      'ohne',
      'gegen',
      'mit'
    ],
    correctAnswer: 3,
    difficulty: 'Schwer',
    category: 'Präpositionen'
  },
  {
    id: 'g9',
    task: 'Was ist die richtige Relativpronomen? Das ist der Mann, ___ mir geholfen hat.',
    options: [
      'der',
      'den',
      'dem',
      'dessen'
    ],
    correctAnswer: 0,
    difficulty: 'Schwer',
    category: 'Relativsätze'
  },
  {
    id: 'g10',
    task: 'Wähle den richtigen Satz im Passiv.',
    options: [
      'Das Auto fährt schnell.',
      'Der Mann hat das Auto gefahren.',
      'Das Auto wird von dem Mann gefahren.',
      'Das Auto wurde fahren.'
    ],
    correctAnswer: 2,
    difficulty: 'Schwer',
    category: 'Passiv'
  },
  {
    id: 'g11',
    task: 'Wähle den Satz mit der richtigen Wortstellung.',
    options: [
      'In die Stadt ich gehe heute.',
      'Ich gehe heute in die Stadt.',
      'Heute ich gehe in die Stadt.',
      'Gehe ich heute in die Stadt.'
    ],
    correctAnswer: 1,
    difficulty: 'Leicht',
    category: 'Satzbau'
  },
  {
    id: 'g12',
    task: 'Finde den Satz mit dem korrekten Adjektivdeklination.',
    options: [
      'Der alt Mann geht spazieren.',
      'Der alte Mann geht spazieren.',
      'Der alter Mann geht spazieren.',
      'Der alten Mann geht spazieren.'
    ],
    correctAnswer: 1,
    difficulty: 'Mittel',
    category: 'Adjektive'
  },
  {
    id: 'g13',
    task: 'Welche Zeitform wird hier verwendet? "Er hatte das Buch gelesen."',
    options: [
      'Präsens',
      'Perfekt',
      'Präteritum',
      'Plusquamperfekt'
    ],
    correctAnswer: 3,
    difficulty: 'Schwer',
    category: 'Zeitformen'
  },
  {
    id: 'g14',
    task: 'Was ist die richtige Form des Imperativs für "kommen" (du)?',
    options: [
      'Kommst!',
      'Komme!',
      'Komm!',
      'Kommen!'
    ],
    correctAnswer: 2,
    difficulty: 'Leicht',
    category: 'Imperativ'
  },
  {
    id: 'g15',
    task: 'Welches Wort ist ein Modalverb?',
    options: [
      'gehen',
      'spielen',
      'können',
      'machen'
    ],
    correctAnswer: 2,
    difficulty: 'Leicht',
    category: 'Modalverben'
  }
]; 