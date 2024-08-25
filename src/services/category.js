import { openDB } from 'idb';

const DB_NAME = 'my-database'; // Имя базы данных
const DB_VERSION = 4; // Версия базы данных
const CATEGORIES_STORE = 'categories'; // Имя хранилища категорий

// Функция для инициализации базы данных
async function initDB() {
  try {
    return await openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < DB_VERSION) {
          if (!db.objectStoreNames.contains(CATEGORIES_STORE)) {
            const categoryStore = db.createObjectStore(CATEGORIES_STORE, { keyPath: 'id', autoIncrement: true });
            categoryStore.createIndex('name', 'name', { unique: true }); // Индекс по имени категории
          }
        }
      },
    });
  } catch (error) {
    console.error('Ошибка при инициализации базы данных:', error);
    throw new Error('Не удалось инициализировать базу данных.');
  }
}

// Функция для получения всех категорий
export async function getCategories() {
  try {
    const db = await initDB();
    // Проверяем, существует ли хранилище категорий
    if (!db.objectStoreNames.contains(CATEGORIES_STORE)) {
      throw new Error(`Хранилище ${CATEGORIES_STORE} не найдено`);
    }
    const transaction = db.transaction(CATEGORIES_STORE, 'readonly'); // Открываем транзакцию на чтение
    const store = transaction.objectStore(CATEGORIES_STORE); // Получаем доступ к хранилищу категорий
    const categories = await store.getAll(); // Получаем все категории

    // Преобразуем строку JSON обратно в массив
    return categories.map((category) => ({
      ...category,
      questions: JSON.parse(category.questions),
    }));
  } catch (error) {
    console.error('Ошибка при получении категорий:', error);
    return [];
  }
}

// Функция для добавления новой категории
export async function addCategory(category) {
  try {
    const db = await initDB();
    if (!db.objectStoreNames.contains(CATEGORIES_STORE)) {
      throw new Error(`Хранилище ${CATEGORIES_STORE} не найдено`);
    }
    const transaction = db.transaction(CATEGORIES_STORE, 'readwrite'); // Открываем транзакцию на запись
    const store = transaction.objectStore(CATEGORIES_STORE); // Получаем доступ к хранилищу категорий

    // Преобразуем массив вопросов в строку JSON
    const categoryToAdd = {
      ...category,
      questions: JSON.stringify(category.questions),
    };

    await store.add(categoryToAdd); // Добавляем категорию в хранилище
    await transaction.done; // Дожидаемся завершения транзакции
    return { success: true };
  } catch (error) {
    console.error('Ошибка при добавлении категории:', error);
    return { success: false, message: 'Не удалось добавить категорию.' };
  }
}

// Функция для обновления существующей категории
export async function updateCategory(category) {
  try {
    const db = await initDB();
    if (!db.objectStoreNames.contains(CATEGORIES_STORE)) {
      throw new Error(`Хранилище ${CATEGORIES_STORE} не найдено`);
    }
    const transaction = db.transaction(CATEGORIES_STORE, 'readwrite'); // Открываем транзакцию на запись
    const store = transaction.objectStore(CATEGORIES_STORE); // Получаем доступ к хранилищу категорий

    // Преобразуем массив вопросов в строку JSON
    const categoryToUpdate = {
      ...category,
      questions: JSON.stringify(category.questions),
    };

    await store.put(categoryToUpdate); // Обновляем категорию в хранилище
    await transaction.done; // Дожидаемся завершения транзакции
    return { success: true };
  } catch (error) {
    console.error('Ошибка при обновлении категории:', error);
    return { success: false, message: 'Не удалось обновить категорию.' };
  }
}

// Функция для удаления категории по идентификатору
export async function deleteCategory(id) {
  try {
    const db = await initDB();
    if (!db.objectStoreNames.contains(CATEGORIES_STORE)) {
      throw new Error(`Хранилище ${CATEGORIES_STORE} не найдено`);
    }
    const transaction = db.transaction(CATEGORIES_STORE, 'readwrite'); // Открываем транзакцию на запись
    const store = transaction.objectStore(CATEGORIES_STORE); // Получаем доступ к хранилищу категорий
    await store.delete(id); // Удаляем категорию по идентификатору
    await transaction.done; // Дожидаемся завершения транзакции
    return { success: true };
  } catch (error) {
    console.error('Ошибка при удалении категории:', error);
    return { success: false, message: 'Не удалось удалить категорию.' };
  }
}

// Функция для получения категории по идентификатору
export async function getCategoryById(id) {
  try {
    const db = await initDB();
    if (!db.objectStoreNames.contains(CATEGORIES_STORE)) {
      throw new Error(`Хранилище ${CATEGORIES_STORE} не найдено`);
    }
    const transaction = db.transaction(CATEGORIES_STORE, 'readonly'); // Открываем транзакцию на чтение
    const store = transaction.objectStore(CATEGORIES_STORE); // Получаем доступ к хранилищу категорий
    const category = await store.get(id); // Получаем категорию по идентификатору

    if (category) {
      // Преобразуем строку JSON обратно в массив
      category.questions = JSON.parse(category.questions);
    }
    return category;
  } catch (error) {
    console.error('Ошибка при получении категории по идентификатору:', error);
    return null;
  }
}
