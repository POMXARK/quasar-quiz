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
    <q-btn label="Register" flat @click="$emit('switch-to-register')" />
    <p v-if="errorMessage" class="text-negative">
      {{ errorMessage }}
    </p>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { loginUserInDB } from '../../services/user';

const login = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

onMounted(() => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  if (isAuthenticated) {
    router.push('/random-question');
  }
});

async function loginUser() {
  try {
    const result = await loginUserInDB(login.value, password.value);
    if (result.success) {
      login.value = '';
      password.value = '';
      errorMessage.value = '';
      localStorage.setItem('isAuthenticated', 'true');
      router.push('/random-question');
    } else {
      errorMessage.value = result.message;
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    errorMessage.value = 'Failed to login.';
  }
}
</script>
