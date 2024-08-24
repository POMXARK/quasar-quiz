import { openDB } from 'idb';

const DB_NAME = 'my-database';
const DB_VERSION = 1;
const STORE_NAME = 'users';

// Функция для регистрации пользователя в IndexedDB
export async function registerUserInDB(user) {
  try {
    // Открытие базы данных
    const db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Создание хранилища пользователей, если оно еще не существует
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const userStore = db.createObjectStore(STORE_NAME, { keyPath: 'email' });
          // Создание индекса по email, чтобы гарантировать уникальность
          userStore.createIndex('email', 'email', { unique: true });
        }
      }
    });

    // Создание транзакции для добавления пользователя
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('email');

    // Проверяем, существует ли уже пользователь с таким email
    const existingUser = await index.get(user.email);

    if (existingUser) {
      // Возвращаем ошибку, если пользователь с таким email уже существует
      return { success: false, message: 'User with this email already exists.' };
    }

    // Добавляем нового пользователя
    await store.add(user);

    // Завершаем транзакцию
    await tx.done;

    return { success: true };
  } catch (error) {
    console.error('Error interacting with IndexedDB:', error);
    return { success: false, message: 'Failed to interact with IndexedDB.' };
  }
}

// Функция для авторизации пользователя в IndexedDB
export async function loginUserInDB(identifier, password) {
  try {
    // Открытие базы данных
    const db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Создание хранилища пользователей, если оно еще не существует
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'email' });
        }
      }
    });

    // Создание транзакции для чтения данных пользователя
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    // Получение всех записей из хранилища
    const allUsers = await store.getAll();

    // Поиск пользователя по email или username
    const user = allUsers.find(user => user.email === identifier || user.username === identifier);

    // Проверяем, соответствует ли введённый пароль сохраненному в базе данных
    if (user && user.password === password) {
      return { success: true };
    } else {
      return { success: false, message: 'Invalid email or password.' };
    }
  } catch (error) {
    console.error('Error interacting with IndexedDB:', error);
    return { success: false, message: 'Failed to interact with IndexedDB.' };
  }
}
