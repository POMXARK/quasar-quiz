<template>
  <q-form @submit.prevent="loginUser">
    <q-input
      v-model="login"
      label="Email or Username"
      filled
      :rules="[val => !!val || 'Email or Username is required']"
    />
    <q-input
      v-model="password"
      label="Password"
      type="password"
      filled
      :rules="[val => !!val || 'Password is required']"
    />
    <q-btn label="Login" type="submit" color="primary" />
    <q-btn label="Register" @click="$emit('switch-to-register')" flat />
    <p v-if="errorMessage" class="text-negative">{{ errorMessage }}</p>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // Импортируем useRouter для работы с роутером
import { loginUserInDB } from '../services/indexedDB'; // Импортируем функцию для работы с IndexedDB

const login = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter(); // Используем useRouter для доступа к роутеру

// Проверка авторизации при монтировании компонента
onMounted(() => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  if (isAuthenticated) {
    router.push('/questions'); // Перенаправляем на компонент вопросов, если уже авторизован
  }
});

// Функция для авторизации пользователя
async function loginUser() {
  try {
    const result = await loginUserInDB(login.value, password.value);
    if (result.success) {
      login.value = '';
      password.value = '';
      errorMessage.value = '';
      localStorage.setItem('isAuthenticated', 'true'); // Сохраняем состояние авторизации
      router.push('/questions'); // Перенаправляем на компонент вопросов после успешной авторизации
    } else {
      errorMessage.value = result.message;
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    errorMessage.value = 'Failed to login.';
  }
}
</script>
