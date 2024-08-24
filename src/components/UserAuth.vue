<template>
  <q-page class="flex flex-center">
    <!-- Компонент для отображения авторизации или регистрации -->
    <component
      :is="currentComponent"
      @switch-to-register="showRegister"
      @switch-to-login="showLogin"
    />
  </q-page>
</template>

<script setup>
import { shallowRef, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Register from 'components/UserRegister.vue';
import Login from 'components/UserLogin.vue';

// Хук для получения объекта маршрутизации
const router = useRouter();

// Храним текущий отображаемый компонент
const currentComponent = shallowRef(Register);

// Функции для переключения компонентов
function showRegister() {
  currentComponent.value = Register;
}

function showLogin() {
  currentComponent.value = Login;
}

// Функция для проверки состояния авторизации
async function checkAuthStatus() {
  // Здесь нужно добавить логику проверки авторизации пользователя
  const isLoggedIn = false; // Это пример. Замените на реальную проверку.

  if (isLoggedIn) {
    // Если пользователь авторизован, перенаправляем на компонент вопросов
    router.push('/random-question'); // Замените '/questions' на путь к вашему компоненту вопросов
  } else {
    // Если пользователь не авторизован, отображаем компонент авторизации
    currentComponent.value = Login;
  }
}

// Проверяем состояние авторизации при монтировании компонента
onMounted(checkAuthStatus);
</script>

<style>
/* Ваши стили здесь */
</style>
