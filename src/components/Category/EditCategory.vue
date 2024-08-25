<template>
  <q-page>
    <q-card>
      <q-card-section>
        <div class="text-h6">Редактировать категорию</div>
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
        <!-- Кнопка для сохранения изменений -->
        <q-btn label="Сохранить" color="primary" @click="innerUpdateCategory" />
        <!-- Кнопка для возврата на страницу списка категорий -->
        <q-btn label="Назад" color="secondary" @click="goBack" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { updateCategory, getCategories } from '../../services/category';
import { getQuestions } from '../../services/question';

// Состояние для хранения названия категории
const categoryName = ref('');
// Состояние для хранения выбранных ID вопросов
const selectedQuestionIds = ref([]);
// Состояние для хранения списка вопросов с ID и текстами
const questionOptions = ref([]);
// Хуки для доступа к роутеру и текущему маршруту
const route = useRoute();
const router = useRouter();

// Функция для загрузки данных категории по её идентификатору
const loadCategory = async () => {
  const categories = await getCategories();
  const category = categories.find((c) => c.id === Number(route.params.id));
  if (category) {
    categoryName.value = category.name;
    selectedQuestionIds.value = category.questions; // Устанавливаем выбранные ID вопросов
  }
};

// Функция для загрузки списка вопросов из базы данных
const loadQuestions = async () => {
  const questions = await getQuestions();
  questionOptions.value = questions.map(q => ({
    label: q.text,
    value: q.id
  }));
};

// Метод для возвращения на предыдущую страницу
const goBack = () => {
  router.back();
};

// Функция для обновления категории
const innerUpdateCategory = async () => {
  try {
    await updateCategory({ id: Number(route.params.id), name: categoryName.value, questions: selectedQuestionIds.value });
    goBack(); // Переход на страницу списка категорий после сохранения
  } catch (error) {
    console.error('Ошибка при обновлении категории:', error);
  }
};

// Загрузка данных категории и вопросов при монтировании компонента
onMounted(() => {
  loadCategory();
  loadQuestions();
});
</script>
