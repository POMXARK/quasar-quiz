<template>
  <div>
    <!-- Кнопка для создания нового вопроса -->
    <q-btn color="primary" class="q-mb-md" icon="add_circle" label="Создать вопрос" @click="goToCreateQuestion" />
    <q-list bordered>
      <!-- Список вопросов, отображаемый с помощью цикла -->
      <q-item v-for="question in questions" :key="question.id" class="question-item">
        <q-item-section>
          <!-- Отображение текста вопроса -->
          <div class="question-text">
            {{ question.text }}
          </div>
          <div class="answers-list">
            <!-- Список вариантов ответов, отображаемый с помощью вложенного цикла -->
            <q-item v-for="(answer, index) in question.answers" :key="index" class="answer-item">
              <q-item-section>
                <!-- Отображение текста варианта ответа с условной классовой привязкой для правильного ответа -->
                <div :class="{ 'correct-answer': answer.isCorrect }">
                  {{ answer.text }}
                </div>
              </q-item-section>
            </q-item>
          </div>
        </q-item-section>
        <q-item-section side>
          <!-- Кнопка для редактирования вопроса -->
          <q-btn color="primary" icon="edit" @click="handleEdit(question.id)" />
          <!-- Кнопка для удаления вопроса -->
          <q-btn color="negative" icon="delete" @click="handleDelete(question.id)" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getQuestions, deleteQuestion } from '../../services/question';

const questions = ref([]); // Состояние для хранения списка вопросов
const router = useRouter(); // Хук маршрутизатора для навигации

// Функция для загрузки вопросов из базы данных
const loadQuestions = async () => {
  // Получаем все вопросы и устанавливаем их в состояние
  questions.value = await getQuestions();
};

// Функция для удаления вопроса по ID
const handleDelete = async (id) => {
  try {
    // Попытка удалить вопрос из базы данных
    await deleteQuestion(id);
    // Перезагружаем список вопросов после удаления
    loadQuestions();
  } catch (error) {
    // Ловим и выводим ошибку в консоль, если что-то пошло не так
    console.error('Ошибка при удалении вопроса:', error);
  }
};

// Функция для редактирования вопроса по ID
const handleEdit = (id) => {
  // Перенаправляем на страницу редактирования вопроса с указанным ID
  router.push({ name: 'EditQuestion', params: { id } });
};

// Функция для перехода на страницу создания нового вопроса
const goToCreateQuestion = () => {
  // Перенаправляем на страницу создания вопроса
  router.push({ name: 'CreateQuestion' });
};

// Загружаем вопросы при монтировании компонента
onMounted(loadQuestions);
</script>

<style scoped>
.question-item {
  margin-bottom: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 16px;
  background-color: #f9f9f9;
}

.question-text {
  font-weight: bold;
  margin-bottom: 8px;
}

.answers-list {
  margin-top: 8px;
}

.answer-item {
  border-bottom: 1px solid #ddd;
  padding: 8px 0;
}

.answer-item:last-child {
  border-bottom: none;
}

.correct-answer {
  color: #4caf50;
  font-weight: bold;
}
</style>
