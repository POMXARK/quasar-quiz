// user.js
// eslint-disable-next-line import/no-extraneous-dependencies
import Dexie from 'dexie';

const db = new Dexie('my-database');
db.version(4).stores({
  users: 'email, username, password'
});

// Функция для регистрации пользователя в базе данных
export async function registerUserInDB(user) {
  try {
    await db.users.put(user);
    return { success: true };
  } catch (error) {
    console.error('Ошибка при регистрации пользователя:', error);
    return { success: false, message: 'Не удалось зарегистрировать пользователя.' };
  }
}

// Функция для авторизации пользователя
export async function loginUserInDB(identifier, password) {
  try {
    const user = await db.users.get(identifier);
    if (user && user.password === password) {
      return { success: true };
    }
    return { success: false, message: 'Неверный email или пароль.' };
  } catch (error) {
    console.error('Ошибка при авторизации пользователя:', error);
    return { success: false, message: 'Не удалось авторизовать пользователя.' };
  }
}
