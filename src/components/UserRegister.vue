<template>
  <q-form @submit.prevent="registerUser">
    <q-input
      v-model="name"
      label="Name"
      filled
      :rules="[val => !!val || 'Name is required']"
    />
    <q-input
      v-model="email"
      label="Email"
      type="email"
      filled
      :rules="[val => !!val || 'Email is required']"
    />
    <q-input
      v-model="password"
      label="Password"
      type="password"
      filled
      :rules="[val => !!val || 'Password is required']"
    />
    <q-btn label="Register" type="submit" color="primary" />
    <q-btn label="Login" flat @click="$emit('switch-to-login')" />
    <p v-if="errorMessage" class="text-negative">
      {{ errorMessage }}
    </p>
  </q-form>
</template>

<script setup>
import { ref } from 'vue';
import { registerUserInDB } from '../services/indexedDB'; // Импортируем функцию для работы с IndexedDB

const name = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');

// Функция для регистрации пользователя
async function registerUser() {
  try {
    const result = await registerUserInDB(
      { name: name.value, email: email.value, password: password.value },
    );
    if (result.success) {
      name.value = '';
      email.value = '';
      password.value = '';
      errorMessage.value = '';
      alert('Registration successful! Please log in.');
    } else {
      errorMessage.value = result.message;
    }
  } catch (error) {
    console.error('Error registering user:', error);
    errorMessage.value = 'Failed to register.';
  }
}
</script>
