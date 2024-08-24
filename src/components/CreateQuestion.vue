<template>
  <div>
    <!-- Кнопка "Назад" -->
    <q-btn @click="goBack" color="secondary" class="q-mb-md" icon="arrow_back" label="Назад" />

    <q-form @submit.prevent="handleSubmit">
      <q-input v-model="question.text" label="Текст вопроса" />

      <div class="q-mt-md">
        <q-input v-model="newAnswerText" label="Новый вариант ответа" />
        <q-checkbox v-model="newAnswerIsCorrect" label="Указать как правильный ответ" />
        <q-btn @click="addAnswer" color="primary" icon="add" />
      </div>

      <q-list class="q-mt-md">
        <q-item v-for="(answer, index) in question.answers" :key="index">
          <q-item-section>
            <q-input v-model="answer.text" />
            <q-checkbox v-model="answer.isCorrect" label="Правильный ответ" />
          </q-item-section>
          <q-item-section side>
            <q-btn @click="removeAnswer(index)" color="negative" icon="delete" />
          </q-item-section>
        </q-item>
      </q-list>

      <q-btn type="submit" color="primary" class="q-mt-md" icon="save">Сохранить</q-btn>
    </q-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { addQuestion } from '../services/indexedDB'; // Импорт функции добавления вопроса
import { useRouter } from 'vue-router';

const question = ref({ text: '', answers: [] });
const newAnswerText = ref('');
const newAnswerIsCorrect = ref(false);
const router = useRouter();

// Метод для обработки отправки формы
const handleSubmit = async () => {
  try {
    // Попытка добавить вопрос в базу данных
    await addQuestion(question.value);
    // Перенаправление на главную страницу после успешного сохранения
    router.push('/');
  } catch (error) {
    // Ловим и выводим ошибку в консоль, если что-то пошло не так
    console.error('Ошибка при добавлении вопроса:', error);
  }
};

// Метод для добавления нового варианта ответа
const addAnswer = () => {
  if (newAnswerText.value) {
    // Добавляем новый ответ в список вариантов
    question.value.answers.push({
      text: newAnswerText.value,
      isCorrect: newAnswerIsCorrect.value,
    });
    // Очищаем поля ввода после добавления
    newAnswerText.value = '';
    newAnswerIsCorrect.value = false;
  }
};

// Метод для удаления варианта ответа по индексу
const removeAnswer = (index) => {
  // Удаляем ответ из списка по указанному индексу
  question.value.answers.splice(index, 1);
};

// Метод для возвращения на предыдущую страницу
const goBack = () => {
  // Возвращает на предыдущую страницу в истории браузера
  router.back();
};
</script>
