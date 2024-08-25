// user.js

import { openDB } from 'idb';

const DB_NAME = 'my-database';
const DB_VERSION = 4;
const USERS_STORE = 'users';

// Функция для инициализации базы данных
async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Создание хранилища пользователей, если оно не существует
      if (!db.objectStoreNames.contains(USERS_STORE)) {
        const userStore = db.createObjectStore(USERS_STORE, { keyPath: 'email' });
        userStore.createIndex('email', 'email', { unique: true });
      }
    },
  });
}

// Функция для регистрации пользователя в базе данных
export async function registerUserInDB(user) {
  try {
    const db = await initDB();
    const transaction = db.transaction(USERS_STORE, 'readwrite');
    const store = transaction.objectStore(USERS_STORE);

    // Проверка, существует ли уже пользователь с таким email
    const existingUser = await store.get(user.email);

    if (existingUser) {
      return { success: false, message: 'Пользователь с таким email уже существует.' };
    }

    await store.add(user);
    await transaction.done;
    return { success: true };
  } catch (error) {
    console.error('Ошибка при регистрации пользователя:', error);
    return { success: false, message: 'Не удалось зарегистрировать пользователя.' };
  }
}

// Функция для авторизации пользователя
export async function loginUserInDB(identifier, password) {
  try {
    const db = await initDB();
    const transaction = db.transaction(USERS_STORE, 'readonly');
    const store = transaction.objectStore(USERS_STORE);

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
