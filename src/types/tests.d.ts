// Question data & corresponding answer
interface TestAnswer {
  question: import('../store/models').Question;
  answer?: import('../store/models').QuestionOption | null;
}

// Keeps track of a test's progress:
// Includes index of the current question
// and all answers & questions they belong.
interface TestProgress {
  slug: string;
  currentQuestion?: number;
  testAnswers: TestAnswer[];
}

// Temporary object stored in session storage (storing only relevant IDs)
interface StorageTestProgress {
  currentQuestion?: number;
  testAnswers: {
    questionId: number;
    answerId?: number;
  }[];
}
