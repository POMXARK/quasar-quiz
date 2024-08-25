import { openDB } from 'idb';

const DB_NAME = 'my-database'; // Имя базы данных
const DB_VERSION = 4; // Версия базы данных

const QUESTIONS_STORE = 'questions'; // Имя хранилища вопросов
const USERS_STORE = 'users'; // Имя хранилища пользователей

// Функция для инициализации базы данных
async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Создание хранилища вопросов, если оно не существует
      if (!db.objectStoreNames.contains(QUESTIONS_STORE)) {
        db.createObjectStore(QUESTIONS_STORE, { keyPath: 'id', autoIncrement: true });
      }

      // Создание хранилища пользователей, если оно не существует
      if (!db.objectStoreNames.contains(USERS_STORE)) {
        const userStore = db.createObjectStore(USERS_STORE, { keyPath: 'email' });
        userStore.createIndex('email', 'email', { unique: true });
      }
    },
  });
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
    const db = await initDB(); // Инициализация базы данных
    const sanitizedQuestion = sanitizeQuestion(question); // Очистка вопроса
    await db.add(QUESTIONS_STORE, sanitizedQuestion); // Добавление вопроса в хранилище
    return { success: true };
  } catch (error) {
    console.error('Ошибка при добавлении вопроса:', error); // Ловим и выводим ошибку в консоль
    return { success: false, message: 'Не удалось добавить вопрос.' }; // Возвращаем ошибку
  }
}

// Функция для получения всех вопросов
export async function getQuestions() {
  try {
    const db = await initDB(); // Инициализация базы данных
    return await db.getAll(QUESTIONS_STORE); // Получение всех вопросов из хранилища
  } catch (error) {
    console.error('Ошибка при получении вопросов:', error); // Ловим и выводим ошибку в консоль
    return []; // Возвращаем пустой массив в случае ошибки
  }
}

// Функция для обновления вопроса
export async function updateQuestion(question) {
  try {
    const db = await initDB(); // Инициализация базы данных
    const sanitizedQuestion = sanitizeQuestion(question); // Очистка вопроса
    await db.put(QUESTIONS_STORE, sanitizedQuestion); // Обновление вопроса в хранилище
    return { success: true };
  } catch (error) {
    console.error('Ошибка при обновлении вопроса:', error); // Ловим и выводим ошибку в консоль
    return { success: false, message: 'Не удалось обновить вопрос.' }; // Возвращаем ошибку
  }
}

// Функция для удаления вопроса по его ID
export async function deleteQuestion(id) {
  try {
    const db = await initDB(); // Инициализация базы данных
    await db.delete(QUESTIONS_STORE, id); // Удаление вопроса из хранилища
    return { success: true };
  } catch (error) {
    console.error('Ошибка при удалении вопроса:', error); // Ловим и выводим ошибку в консоль
    return { success: false, message: 'Не удалось удалить вопрос.' }; // Возвращаем ошибку
  }
}

// Функция для сброса флагов вопросов
export async function resetQuestionFlags() {
  try {
    const db = await initDB(); // Инициализация базы данных
    const tx = db.transaction(QUESTIONS_STORE, 'readwrite'); // Открытие транзакции для чтения и записи
    const store = tx.objectStore(QUESTIONS_STORE); // Получение доступа к хранилищу вопросов
    const questions = await store.getAll(); // Получение всех вопросов из хранилища

    // Обновление флага `isAnswered` для всех вопросов
    questions.forEach((question) => {
      if (question.isAnswered) {
        store.put({ ...question, isAnswered: false }); // Сброс флага `isAnswered`
      }
    });

    await tx.done; // Завершение транзакции
    return { success: true }; // Возвращение успешного результата
  } catch (error) {
    console.error('Ошибка при сбросе флагов вопросов:', error); // Ловим и выводим ошибку в консоль
    return { success: false, message: 'Не удалось сбросить флаги вопросов.' }; // Возвращаем ошибку
  }
}
