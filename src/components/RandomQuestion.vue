<template>
  <q-page>
    <q-card>
      <q-card-section>
        <div class="text-h6">Ответьте на вопросы</div>
        <q-btn label="Получить вопрос" @click="fetchRandomQuestion" />
      </q-card-section>

      <q-card-section v-if="currentQuestion">
        <div class="text-h6">{{ currentQuestion.text }}</div>
        <div class="q-option-group q-gutter-x-sm">
          <div v-for="option in shuffledAnswers" :key="option.value" :class="optionClass(option)">
            <q-checkbox
              v-model="selectedAnswers"
              :label="option.label"
              :val="option.value"
            />
          </div>
        </div>
        <q-btn label="Отправить" @click="showResults" class="q-mt-md" />
      </q-card-section>

      <q-card-section v-if="result">
        <div class="text-h6">Результаты</div>
        <div>Процент правильных ответов: {{ result.correctPercentage }}%</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getQuestions } from '../services/indexedDB'; // Подключите ваши функции для работы с IndexedDB

const currentQuestion = ref(null);
const shuffledAnswers = ref([]);
const selectedAnswers = ref([]);
const result = ref(null);

// Функция для получения случайного вопроса
async function fetchRandomQuestion() {
  const questions = await getQuestions();
  if (questions.length === 0) return;

  // Выбор случайного вопроса
  const randomIndex = Math.floor(Math.random() * questions.length);
  currentQuestion.value = questions[randomIndex];

  // Перемешивание ответов
  shuffledAnswers.value = shuffleArray(currentQuestion.value.answers.map((a, index) => ({
    label: a.text,
    value: index
  })));

  // Сброс выбранных ответов и результатов
  selectedAnswers.value = [];
  result.value = null;
}

// Функция для перемешивания массива
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Функция для вычисления класса CSS опций
function optionClass(option) {
  if (!currentQuestion.value) return '';

  const answer = currentQuestion.value.answers[option.value];
  const isSelected = selectedAnswers.value.includes(option.value);
  const isCorrect = answer.isCorrect;

  if (result.value) {
    if (isSelected && isCorrect) {
      return 'q-mb-sm bg-green text-white'; // Правильный выбранный ответ
    } else if (isSelected && !isCorrect) {
      return 'q-mb-sm bg-red text-white'; // Неправильный выбранный ответ
    } else if (isCorrect) {
      return 'q-mb-sm bg-light-green text-black'; // Правильный не выбранный ответ
    } else {
      return 'q-mb-sm'; // Не выбранный ответ
    }
  } else {
    return 'q-mb-sm'; // Начальное состояние
  }
}

// Функция для отображения результатов
function showResults() {
  if (!currentQuestion.value) return;

  const correctAnswers = currentQuestion.value.answers.filter(a => a.isCorrect);
  const selectedAnswerIndices = selectedAnswers.value;
  const selectedAnswersData = selectedAnswerIndices.map(index => currentQuestion.value.answers[index]);

  const correctSelectedAnswers = selectedAnswersData.filter(a => a.isCorrect);
  const incorrectSelectedAnswers = selectedAnswersData.filter(a => !a.isCorrect);

  // Учитываем только выбранные ответы
  const totalSelectedAnswers = selectedAnswersData.length;
  const correctPercentage = totalSelectedAnswers === 0 ? 0 : (correctSelectedAnswers.length / totalSelectedAnswers) * 100;

  result.value = {
    correctAnswers,
    incorrectAnswers: incorrectSelectedAnswers,
    correctPercentage: Math.round(correctPercentage)
  };
}

// Автоматическая загрузка случайного вопроса при монтировании компонента
onMounted(() => {
  fetchRandomQuestion();
});
</script>

<style scoped>
/* Добавьте свои стили для выделения правильных и неправильных ответов */
.bg-green {
  background-color: #28a745;
}
.bg-red {
  background-color: #f8d7da;
}
.bg-light-green {
  background-color: #d4edda;
}
.text-white {
  color: white;
}
.text-black {
  color: black;
}
.q-mb-sm {
  margin-bottom: 0.5rem;
}
</style>
