import Storage from '../services/storage';
import { Question } from '../store/models';
import { byId } from './find';

// Get all test progress objects stored in storage
export const getStorageTests = () => Storage.read({ key: 'TESTS_IN_PROGRESS' });

// Get test progress for a given test from storage
export const getTestFromStorage = (
  slug?: string | null,
  questions?: Question[] | null
) => {
  const storageTests = getStorageTests();

  if (storageTests && slug && questions) {
    const storageTest: StorageTestProgress = storageTests[slug];

    if (storageTest) {
      const testProgress: TestProgress = {
        slug,
        currentQuestion: storageTest.currentQuestion,
        testAnswers: storageTest.testAnswers.map(({ questionId, answerId }) => {
          // Get full question object by stored question ID
          const originalQuestion = questions.find(byId(questionId));
          return {
            question: originalQuestion!,
            // Get full answer object by stored answer ID
            answer: originalQuestion?.options.find(byId(answerId)),
          };
        }),
      };

      return testProgress;
    }
  }

  return undefined;
};

// Save test progress to storage
export const saveTestToStorage = (newTest: TestProgress) => {
  const storageTest: StorageTestProgress = {
    currentQuestion: newTest.currentQuestion,
    testAnswers: newTest.testAnswers.map(testAnswer => ({
      // Store only question/answer IDs:
      questionId: testAnswer.question.id,
      answerId: testAnswer.answer?.id,
    })),
  };

  const storageTests = getStorageTests();
  Storage.write({
    key: 'TESTS_IN_PROGRESS',
    value: { ...storageTests, [newTest.slug]: storageTest },
  });
};

// Clear given test progress from storage
export const clearTestFromStorage = (slug: string) => {
  const storageTests = getStorageTests();
  if (storageTests?.[slug]) {
    delete storageTests[slug];
    Storage.write({ key: 'TESTS_IN_PROGRESS', value: storageTests });
  }
};
