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
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getQuestions, updateQuestion } from '../../services/question';

const route = useRoute();
const router = useRouter();
const question = ref({ text: '', answers: [] });
const newAnswerText = ref('');
const newAnswerIsCorrect = ref(false);

// Функция для загрузки вопроса по ID
const loadQuestion = async (id) => {
  try {
    const allQuestions = await getQuestions();
    question.value = allQuestions.find((q) => q.id === id);
    console.log('Loaded question:', question.value); // Отладочный вывод
  } catch (error) {
    console.error('Ошибка при загрузке вопроса:', error);
  }
};

// Метод для возвращения на предыдущую страницу
const goBack = () => {
  router.back();
};

// Функция для обработки отправки формы
const handleSubmit = async () => {
  try {
    // Обновляем вопрос в базе данных
    await updateQuestion(question.value);
    // Перенаправляем на список вопросов после успешного сохранения
    goBack();
  } catch (error) {
    // Ловим и выводим ошибку в консоль, если что-то пошло не так
    console.error('Ошибка при обновлении вопроса:', error);
  }
};

// Функция для добавления нового варианта ответа
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

// Функция для удаления варианта ответа по индексу
const removeAnswer = (index) => {
  // Удаляем ответ из списка по указанному индексу
  question.value.answers.splice(index, 1);
};

// Загрузка вопроса при монтировании компонента
onMounted(() => {
  // Получаем ID вопроса из параметров маршрута
  const id = parseInt(route.params.id, 10);
  // Загружаем вопрос по указанному ID
  loadQuestion(id);
});
</script>

<style scoped>
/* Добавьте стили, если нужно */
</style>
