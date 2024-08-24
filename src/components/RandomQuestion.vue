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
import { getQuestions, updateQuestion, resetQuestionFlags } from '../services/indexedDB';

const currentQuestion = ref(null);
const shuffledAnswers = ref([]);
const selectedAnswers = ref([]);
const result = ref(null);

// Функция для получения и сортировки вопросов по проценту правильных ответов
async function fetchRandomQuestion() {
  let questions = await getQuestions();

  // Сортируем вопросы по убыванию процента правильных ответов
  questions = questions.sort((a, b) => (b.correctPercentage || 0) - (a.correctPercentage || 0));

  const unansweredQuestions = questions.filter(q => !q.isAnswered);

  if (unansweredQuestions.length === 0) {
    currentQuestion.value = null;
    await resetQuestionFlags(); // Сбрасываем флаги, если нет новых вопросов
    return;
  }

  const randomIndex = Math.floor(Math.random() * unansweredQuestions.length);
  currentQuestion.value = unansweredQuestions[randomIndex];

  shuffledAnswers.value = shuffleArray(currentQuestion.value.answers.map((a, index) => ({
    label: a.text,
    value: index
  })));

  selectedAnswers.value = [];
  result.value = null;
}

// Функция для перемешивания массива
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Функция для вычисления CSS класса опций
function optionClass(option) {
  if (!currentQuestion.value) return '';

  const answer = currentQuestion.value.answers[option.value];
  const isSelected = selectedAnswers.value.includes(option.value);
  const isCorrect = answer.isCorrect;

  if (result.value) {
    // Устанавливаем классы в зависимости от состояния ответа
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

// Функция для отображения результатов и обновления данных вопроса
async function showResults() {
  if (!currentQuestion.value) return;

  const correctAnswers = currentQuestion.value.answers.filter(a => a.isCorrect);
  const totalCorrectAnswers = correctAnswers.length;
  const totalAnswers = currentQuestion.value.answers.length;

  // Получаем все выбранные ответы
  const selectedAnswerIndices = selectedAnswers.value;
  const selectedAnswersData = selectedAnswerIndices.map(index => currentQuestion.value.answers[index]);

  // Подсчитываем правильные и неправильные выбранные ответы
  const correctSelectedAnswers = selectedAnswersData.filter(a => a.isCorrect);
  const incorrectSelectedAnswers = selectedAnswersData.filter(a => !a.isCorrect);
  const totalSelectedAnswers = selectedAnswersData.length;

  let correctPercentage;

  if (totalSelectedAnswers === totalAnswers) {
    // Если выбраны все варианты, корректируем процент за неверные ответы
    const incorrectPercentage = (incorrectSelectedAnswers.length / totalAnswers) * 100;
    correctPercentage = 100 - incorrectPercentage;
  } else {
    // Если не все варианты выбраны
    correctPercentage = totalCorrectAnswers === 0 ? 0 : (correctSelectedAnswers.length / totalCorrectAnswers) * 100;
  }

  // Убедимся, что процент не отрицательный
  correctPercentage = Math.max(correctPercentage, 0);

  result.value = {
    correctAnswers,
    incorrectAnswers: incorrectSelectedAnswers,
    correctPercentage: Math.round(correctPercentage)
  };

  // Обновление статуса вопроса и процента правильных ответов в IndexedDB
  await updateQuestion({ ...currentQuestion.value, isAnswered: true, correctPercentage });
}

// Автоматическая загрузка случайного вопроса при монтировании компонента
onMounted(() => {
  fetchRandomQuestion();
});
</script>

<style scoped>
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
