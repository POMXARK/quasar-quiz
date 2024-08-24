import { openDB } from 'idb';

const DB_NAME = 'my-database';
const DB_VERSION = 1;

// Хранилища для вопросов и пользователей
const QUESTIONS_STORE = 'questions';
const USERS_STORE = 'users';

// Функция для инициализации базы данных
async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Создание хранилища вопросов, если оно еще не существует
      if (!db.objectStoreNames.contains(QUESTIONS_STORE)) {
        db.createObjectStore(QUESTIONS_STORE, { keyPath: 'id', autoIncrement: true });
      }

      // Создание хранилища пользователей, если оно еще не существует
      if (!db.objectStoreNames.contains(USERS_STORE)) {
        const userStore = db.createObjectStore(USERS_STORE, { keyPath: 'email' });
        userStore.createIndex('email', 'email', { unique: true });
      }
    },
  });
}

// Функция для преобразования данных в формат, поддерживаемый IndexedDB
function sanitizeQuestion(question) {
  return {
    ...question,
    answers: question.answers.map(answer => ({
      text: String(answer.text),
      isCorrect: Boolean(answer.isCorrect),
    })),
  };
}

// Функции для работы с вопросами
export async function addQuestion(question) {
  try {
    const db = await initDB();
    const sanitizedQuestion = sanitizeQuestion(question);
    await db.add(QUESTIONS_STORE, sanitizedQuestion);
    return { success: true };
  } catch (error) {
    console.error('Ошибка при добавлении вопроса:', error);
    return { success: false, message: 'Не удалось добавить вопрос.' };
  }
}

// Получение списка всех вопросов
export async function getQuestions() {
  try {
    const db = await initDB();
    return await db.getAll(QUESTIONS_STORE);
  } catch (error) {
    console.error('Ошибка при получении вопросов:', error);
    return [];
  }
}

export async function updateQuestion(question) {
  try {
    const db = await initDB();
    const sanitizedQuestion = sanitizeQuestion(question);
    await db.put(QUESTIONS_STORE, sanitizedQuestion);
    return { success: true };
  } catch (error) {
    console.error('Ошибка при обновлении вопроса:', error);
    return { success: false, message: 'Не удалось обновить вопрос.' };
  }
}

export async function deleteQuestion(id) {
  try {
    const db = await initDB();
    await db.delete(QUESTIONS_STORE, id);
    return { success: true };
  } catch (error) {
    console.error('Ошибка при удалении вопроса:', error);
    return { success: false, message: 'Не удалось удалить вопрос.' };
  }
}

// Функции для работы с пользователями
export async function registerUserInDB(user) {
  try {
    const db = await initDB();
    const tx = db.transaction(USERS_STORE, 'readwrite');
    const store = tx.objectStore(USERS_STORE);
    const index = store.index('email');

    const existingUser = await index.get(user.email);

    if (existingUser) {
      return { success: false, message: 'Пользователь с таким email уже существует.' };
    }

    await store.add(user);
    await tx.done;

    return { success: true };
  } catch (error) {
    console.error('Ошибка при регистрации пользователя:', error);
    return { success: false, message: 'Не удалось зарегистрировать пользователя.' };
  }
}

export async function loginUserInDB(identifier, password) {
  try {
    const db = await initDB();
    const tx = db.transaction(USERS_STORE, 'readonly');
    const store = tx.objectStore(USERS_STORE);

    const allUsers = await store.getAll();
    const user = allUsers.find((user) => user.email === identifier || user.username === identifier);

    if (user && user.password === password) {
      return { success: true };
    }
    return { success: false, message: 'Неверный email или пароль.' };
  } catch (error) {
    console.error('Ошибка при авторизации пользователя:', error);
    return { success: false, message: 'Не удалось авторизовать пользователя.' };
  }
}
