<template>
  <q-page>
    <q-card>
      <q-card-section>
        <div class="text-h6">
          Создать категорию
        </div>
        <!-- Поле ввода для названия категории -->
        <q-input v-model="categoryName" label="Название категории" />
        <!-- Поле выбора вопросов -->
        <q-select
          v-model="selectedQuestionIds"
          :options="questionOptions"
          label="Выберите вопросы"
          multiple
          emit-value
          map-options
        />
        <!-- Кнопка для создания категории -->
        <q-btn label="Создать" color="primary" @click="createCategory" />
        <!-- Кнопка для возврата на страницу списка категорий -->
        <q-btn label="Назад" color="secondary" @click="goBack" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { addCategory } from '../../services/category';
import { getQuestions } from '../../services/question';

// Состояние для хранения названия категории
const categoryName = ref('');
// Состояние для хранения выбранных ID вопросов
const selectedQuestionIds = ref([]);
// Состояние для хранения списка вопросов с ID и текстами
const questionOptions = ref([]);
// Хук для доступа к роутеру
const router = useRouter();

// Функция для загрузки списка вопросов из базы данных
const loadQuestions = async () => {
  const questions = await getQuestions();
  questionOptions.value = questions.map((q) => ({
    label: q.text,
    value: q.id,
  }));
};

// Метод для возвращения на предыдущую страницу
const goBack = () => {
  router.back();
};

// Функция для создания новой категории
const createCategory = async () => {
  try {
    await addCategory({ name: categoryName.value, questions: selectedQuestionIds.value });
    goBack(); // Переход на страницу списка категорий после создания
  } catch (error) {
    console.error('Ошибка при создании категории:', error);
  }
};

// Загрузка вопросов при монтировании компонента
onMounted(loadQuestions);
</script>
