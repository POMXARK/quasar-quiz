// eslint-disable-next-line import/no-extraneous-dependencies
import Dexie from 'dexie';

const db = new Dexie('my-database', {
  version: 4,
});

db.version(4).stores({
  questions: '++id, text, answers',
  users: 'email, &email',
});

// Функция для инициализации базы данных
async function initDB() {
  await db.open();
}

// Функция для очистки и форматирования вопроса
function sanitizeQuestion(question) {
  return {
    ...question,
    answers: question.answers.map((answer) => ({
      text: String(answer.text), // Приведение текста ответа к строке
      isCorrect: Boolean(answer.isCorrect), // Приведение значения корректности ответа к булеву типу
    })),
  };
}

// Функция для добавления вопроса
export async function addQuestion(question) {
  try {
    await initDB(); // Инициализация базы данных
    const sanitizedQuestion = sanitizeQuestion(question); // Очистка вопроса
    await db.questions.add(sanitizedQuestion); // Добавление вопроса в хранилище
    return { success: true };
  } catch (error) {
    console.error('Ошибка при добавлении вопроса:', error); // Ловим и выводим ошибку в консоль
    return { success: false, message: 'Не удалось добавить вопрос.' }; // Возвращаем ошибку
  }
}

// Функция для получения всех вопросов
export async function getQuestions() {
  try {
    await initDB(); // Инициализация базы данных
    return await db.questions.toArray(); // Получение всех вопросов из хранилища
  } catch (error) {
    console.error('Ошибка при получении вопросов:', error); // Ловим и выводим ошибку в консоль
    return []; // Возвращаем пустой массив в случае ошибки
  }
}

// Функция для обновления вопроса
export async function updateQuestion(question) {
  try {
    await initDB(); // Инициализация базы данных
    const sanitizedQuestion = sanitizeQuestion(question); // Очистка вопроса
    await db.questions.put(sanitizedQuestion); // Обновление вопроса в хранилище
    return { success: true };
  } catch (error) {
    console.error('Ошибка при обновлении вопроса:', error); // Ловим и выводим ошибку в консоль
    return { success: false, message: 'Не удалось обновить вопрос.' }; // Возвращаем ошибку
  }
}

// Функция для удаления вопроса по его ID
export async function deleteQuestion(id) {
  try {
    await initDB(); // Инициализация базы данных
    await db.questions.delete(id); // Удаление вопроса из хранилища
    return { success: true };
  } catch (error) {
    console.error('Ошибка при удалении вопроса:', error); // Ловим и выводим ошибку в консоль
    return { success: false, message: 'Не удалось удалить вопрос.' }; // Возвращаем ошибку
  }
}

// Функция для сброса флагов вопросов
export async function resetQuestionFlags() {
  try {
    await initDB(); // Инициализация базы данных
    const questions = await db.questions.toArray(); // Получение всех вопросов из хранилища

    // Обновление флага `isAnswered` для всех вопросов
    questions.forEach((question) => {
      if (question.isAnswered) {
        db.questions.put({ ...question, isAnswered: false }); // Сброс флага `isAnswered`
      }
    });

    return { success: true }; // Возвращение успешного результата
  } catch (error) {
    console.error('Ошибка при сбросе флагов вопросов:', error); // Ловим и выводим ошибку в консоль
    return { success: false, message: 'Не удалось сбросить флаги вопросов.' }; // Возвращаем ошибку
  }
}
