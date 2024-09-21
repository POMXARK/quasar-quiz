// eslint-disable-next-line import/no-extraneous-dependencies
import Dexie from 'dexie';

const db = new Dexie('my-database', {
  version: 4,
});

db.version(4).stores({
  categories: '++id, name, questions',
});

// Функция для инициализации базы данных
async function initDB() {
  await db.open();
}

// Функция для получения всех категорий
export async function getCategories() {
  try {
    await initDB();
    const categories = await db.categories.toArray();
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
    await initDB();
    const categoryToAdd = {
      ...category,
      questions: JSON.stringify(category.questions),
    };
    await db.categories.add(categoryToAdd);
    return { success: true };
  } catch (error) {
    console.error('Ошибка при добавлении категории:', error);
    return { success: false, message: 'Не удалось добавить категорию.' };
  }
}

// Функция для обновления существующей категории
export async function updateCategory(category) {
  try {
    await initDB();
    const categoryToUpdate = {
      ...category,
      questions: JSON.stringify(category.questions),
    };
    await db.categories.put(categoryToUpdate);
    return { success: true };
  } catch (error) {
    console.error('Ошибка при обновлении категории:', error);
    return { success: false, message: 'Не удалось обновить категорию.' };
  }
}

// Функция для удаления категории по идентификатору
export async function deleteCategory(id) {
  try {
    await initDB();
    await db.categories.delete(id);
    return { success: true };
  } catch (error) {
    console.error('Ошибка при удалении категории:', error);
    return { success: false, message: 'Не удалось удалить категорию.' };
  }
}

// Функция для получения категории по идентификатору
export async function getCategoryById(id) {
  try {
    await initDB();
    const category = await db.categories.get(id);
    if (category) {
      category.questions = JSON.parse(category.questions);
    }
    return category;
  } catch (error) {
    console.error('Ошибка при получении категории по идентификатору:', error);
    return null;
  }
}
