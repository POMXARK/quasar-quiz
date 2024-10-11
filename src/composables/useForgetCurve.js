import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { openDB } from 'idb';

export function useForgetCurve() {
  const $q = useQuasar();
  const db = ref(null);
  const question = ref(null);
  const lastAskedDate = ref(null);
  const repeatDate = ref(null);

  const calculateRepeatDate = (lastAskedDate) => {
    const currentDate = new Date();
    const difference = currentDate.getTime() - lastAskedDate.getTime();
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (days < 1) {
      return new Date(currentDate.getTime() + (1000 * 60 * 60 * 24));
    } if (days >= 1 && days < 3) {
      return new Date(currentDate.getTime() + (1000 * 60 * 60 * 24 * 3));
    } if (days >= 3 && days < 7) {
      return new Date(currentDate.getTime() + (1000 * 60 * 60 * 24 * 7));
    }
    return new Date(currentDate.getTime() + (1000 * 60 * 60 * 24 * 14));
  };

  const getQuestion = async (questionId) => {
    const transaction = db.value.transaction('questions', 'eadwrite');
    const questionStore = transaction.objectStore('questions');
    const request = questionStore.get(questionId);
    question.value = await request;
  };

  const getLastAskedDate = async (questionId, userId) => {
    const transaction = db.value.transaction('userQuestionResults', 'eadwrite');
    const userQuestionStore = transaction.objectStore('userQuestionResults');
    const index = userQuestionStore.index('questionId');
    const request = index.getAll(IDBKeyRange.only(questionId));
    const results = await request;
    const lastResult = results[results.length - 1];
    lastAskedDate.value = lastResult ? lastResult.createdAt : null;
  };

  const updateRepeatDate = async (questionId, userId, repeatDate) => {
    const transaction = db.value.transaction('forgetCurve', 'eadwrite');
    const forgetCurveStore = transaction.objectStore('forgetCurve');
    const request = forgetCurveStore.get([userId, questionId]);
    const forgetCurve = await request;

    if (forgetCurve) {
      forgetCurve.repeatDate = repeatDate;
      const updateRequest = forgetCurveStore.put(forgetCurve);
      await updateRequest;
    } else {
      const newForgetCurve = {
        userId,
        questionId,
        repeatDate,
      };

      const addRequest = forgetCurveStore.add(newForgetCurve);
      await addRequest;
    }
  };

  const addQuestionResult = async (userId, questionId, isCorrect) => {
    const transaction = db.value.transaction('userQuestionResults', 'eadwrite');
    const userQuestionStore = transaction.objectStore('userQuestionResults');
    const newResult = {
      userId,
      questionId,
      isCorrect,
      createdAt: new Date(),
    };

    const request = userQuestionStore.add(newResult);
    await request;
  };

  const handleQuestionAnswer = async (userId, questionId, isCorrect) => {
    await getQuestion(questionId);
    await getLastAskedDate(questionId, userId);

    if (!isCorrect) {
      repeatDate.value = calculateRepeatDate(lastAskedDate.value);
      await updateRepeatDate(questionId, userId, repeatDate.value);
    }

    await addQuestionResult(userId, questionId, isCorrect);
  };

  const initDB = async () => {
    db.value = await openDB('myDB', 1, {
      upgrade(db) {
        db.createObjectStore('questions', { keyPath: 'id' });
        db.createObjectStore('userQuestionResults', { keyPath: 'id' });
        db.createObjectStore('forgetCurve', { keyPath: 'id' });
      },
    });
  };

  return {
    handleQuestionAnswer,
    initDB,
  };
}
