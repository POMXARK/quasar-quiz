<template>
  <div>
    <!-- Кнопка для создания новой категории -->
    <q-btn color="primary" class="q-mb-md" icon="add_circle" label="Создать категорию" @click="goToCreateCategory" />
    <!-- Список категорий -->
    <q-list bordered>
      <!-- Отображение каждой категории с помощью цикла -->
      <q-item v-for="category in categories" :key="category.id" class="category-item">
        <q-item-section>
          <!-- Отображение текста категории -->
          <div class="category-text">
            {{ category.name }}
          </div>
        </q-item-section>
        <q-item-section side>
          <!-- Кнопка для редактирования категории -->
          <q-btn color="primary" icon="edit" @click="handleEdit(category.id)" />
          <!-- Кнопка для удаления категории -->
          <q-btn color="negative" icon="delete" @click="handleDelete(category.id)" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getCategories, deleteCategory } from '../../services/category';

// Состояние для хранения списка категорий
const categories = ref([]);
// Хук для доступа к роутеру
const router = useRouter();

// Функция для загрузки списка категорий из базы данных
const loadCategories = async () => {
  categories.value = await getCategories();
};

// Функция для удаления категории по её идентификатору
const handleDelete = async (id) => {
  try {
    await deleteCategory(id);
    loadCategories(); // Обновление списка категорий после удаления
  } catch (error) {
    console.error('Ошибка при удалении категории:', error);
  }
};

// Функция для перехода на страницу редактирования категории
const handleEdit = (id) => {
  router.push({ name: 'EditCategory', params: { id } });
};

// Функция для перехода на страницу создания новой категории
const goToCreateCategory = () => {
  router.push({ name: 'CreateCategory' });
};

// Загрузка категорий при монтировании компонента
onMounted(loadCategories);
</script>

<style scoped>
.category-item {
  margin-bottom: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 16px;
  background-color: #f9f9f9;
}

.category-text {
  font-weight: bold;
}
</style>
