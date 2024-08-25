<template>
  <div>
    <!-- Кнопка "Назад" -->
    <q-btn color="secondary" class="q-mb-md" icon="arrow_back" label="Назад" @click="goBack" />

    <q-form @submit.prevent="handleSubmit">
      <q-input v-model="question.text" label="Текст вопроса" />

      <div class="q-mt-md">
        <q-input v-model="newAnswerText" label="Новый вариант ответа" />
        <q-checkbox v-model="newAnswerIsCorrect" label="Указать как правильный ответ" />
        <q-btn color="primary" icon="add" @click="addAnswer" />
      </div>

      <q-list class="q-mt-md">
        <q-item v-for="(answer, index) in question.answers" :key="index">
          <q-item-section>
            <q-input v-model="answer.text" />
            <q-checkbox v-model="answer.isCorrect" label="Правильный ответ" />
          </q-item-section>
          <q-item-section side>
            <q-btn color="negative" icon="delete" @click="removeAnswer(index)" />
          </q-item-section>
        </q-item>
      </q-list>

      <q-btn type="submit" color="primary" class="q-mt-md" icon="save">
        Сохранить
      </q-btn>
    </q-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { addQuestion } from '../../services/question'; // Импорт функции добавления вопроса

const question = ref({ text: '', answers: [] });
const newAnswerText = ref('');
const newAnswerIsCorrect = ref(false);
const router = useRouter();

// Метод для обработки отправки формы
const handleSubmit = async () => {
  try {
    console.log('Submitting question:', question.value); // Отладочный вывод
    await addQuestion(question.value);
    router.push('/');
  } catch (error) {
    console.error('Ошибка при добавлении вопроса:', error);
  }
};

// Метод для добавления нового варианта ответа
const addAnswer = () => {
  if (newAnswerText.value) {
    question.value.answers.push({
      text: newAnswerText.value,
      isCorrect: newAnswerIsCorrect.value,
    });
    newAnswerText.value = '';
    newAnswerIsCorrect.value = false;
  }
};

// Метод для удаления варианта ответа по индексу
const removeAnswer = (index) => {
  question.value.answers.splice(index, 1);
};

// Метод для возвращения на предыдущую страницу
const goBack = () => {
  router.back();
};
</script>
