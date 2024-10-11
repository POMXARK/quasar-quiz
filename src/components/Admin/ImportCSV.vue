<template>
  <q-page>
    <q-file
      v-model="file"
      filled
      label="Выберите CSV файл"
      accept=".csv"
      @input="handleFileChange"
    />
    <q-table
      v-if="parsedData.length > 0"
      v-model:pagination="pagination"
      :rows="parsedData"
      :columns="columns"
      row-key="id"
      virtual-scroll
      :loading="loading"
    />
    <q-expansion-item
      label="Выбор столбцов"
      :expanded="columns.length > 0"
    >
      <div v-if="columns.length > 0">
        <q-list>
          <q-item v-for="(column, index) in columns" :key="index">
            <q-item-section>{{ column.label }}</q-item-section>
          </q-item>
        </q-list>
        <div>Выбранные столбцы: {{ selectedColumns }}</div>
      </div>
      <q-checkbox
        v-for="(column, index) in columns"
        :key="index"
        v-model="selectedColumns"
        :true-value="column.name"
        :false-value="null"
        :label="column.label"
        class="q-mb-sm"
      />
      <q-btn
        label="Обработать данные"
        color="primary"
        @click="handleDataProcessing"
      />
    </q-expansion-item>

    <q-card v-if="questions.length > 0 || categories.length > 0" class="q-mt-md">
      <q-card-section>
        <q-item-label header>
          Вопросы:
        </q-item-label>
        <q-list>
          <q-item v-for="(question, index) in questions" :key="index">
            <q-item-section>{{ question }}</q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-section>
        <q-item-label header>
          Категории:
        </q-item-label>
        <q-list>
          <q-item v-for="(category, index) in categories" :key="index">
            <q-item-section>{{ category }}</q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import Papa from 'papaparse';
import Dexie from 'dexie';
import { useQuasar } from 'quasar';
import { addQuestion } from 'src/services/question';

// Создаем базу данных Dexie
const db = new Dexie('csvDataDB');
db.version(1).stores({
  dataStore: '++id, Question, Category, Answer',
});

// Объявляем переменные состояния
const $q = useQuasar();
const file = ref(null);
const parsedData = ref([]);
const columns = ref([]);
const selectedColumns = ref([]);
const questions = ref([]);
const categories = ref([]);
const answers = ref([]); // Добавляем для хранения ответов
const loading = ref(false);
const pagination = ref({
  sortBy: 'id',
  descending: false,
  page: 1,
  rowsPerPage: 10,
});

// Функция для парсинга CSV файла
const parseCSV = (file) => {
  loading.value = true;
  Papa.parse(file, {
    header: true, // Используем заголовки из первой строки файла
    complete: (result) => {
      loading.value = false;
      console.log('Результат парсинга:', result);
      const headers = result.meta.fields.map((header) => ({
        name: header,
        label: header,
        field: header,
        sortable: true,
      })); // Получаем заголовки столбцов и создаем объекты для QTable
      columns.value = headers; // Устанавливаем заголовки столбцов в переменную состояния
      parsedData.value = result.data.map((row, index) => ({
        ...row,
        id: index + 1,
      })); // Устанавливаем данные строк в переменную состояния и добавляем id для QTable
      console.log('Столбцы:', columns.value);
    },
    skipEmptyLines: true,
  });
};

// Функция для обработки изменения файла
const handleFileChange = (event) => {
  console.log('Обработка изменения файла:', event.target.files[0]);
  const selectedFile = event.target.files[0];
  file.value = selectedFile;
  parseCSV(selectedFile);
  console.log('Файл успешно загружен:', selectedFile.name); // Добавлено отладочное сообщение
};

// Функция для обработки данных из выбранных столбцов
const handleDataProcessing = async () => {
  if (selectedColumns.value.length === 0) {
    // Выведите сообщение об ошибке, если не выбраны столбцы
    return;
  }

  // Обработайте данные из выбранных столбцов и сохраните их в переменные состояния
  const processedQuestions = [];
  const processedCategories = [];
  const processedAnswers = [];

  parsedData.value.forEach((row) => {
    console.log('row: ', row);
    console.log('row.Category: ', row.Category);
    addQuestion({ text: row.Question, answers: [{ text: row.Answer, isCorrect: true }] });
    // addCategory({ name: row.Category, questions: row.Question })
    // if (selectedColumns.value.includes('Question')) {
    //   processedQuestions.push(row.Question);
    // }
    // if (selectedColumns.value.includes('Category')) {
    //   processedCategories.push(row.Category);
    // }
    // if (selectedColumns.value.includes('Answer')) {
    //   processedAnswers.push(row.Answer);
    // }
  });

  // Сохраните обработанные данные в заданной структуре с помощью Dexie
  // const result = await saveDataToDB(
  //   processedQuestions.map((q, i) => ({
  //     Question: q,
  //     Category: processedCategories[i] || 'Без категории',
  //     Answer: processedAnswers[i] || 'Без ответа',
  //   }))
  // );

  // if (!result.success) {
  //   // Выведите сообщение об ошибке, если данные не сохранены
  //   $q.notify({
  //     color: 'negative',
  //     message: result.message || 'Ошибка при сохранении данных',
  //   });
  //   return;
  // }

  // Обновите переменные состояния для отображения результатов
  questions.value = processedQuestions;
  categories.value = processedCategories;
  answers.value = processedAnswers;

  // Выведите сообщение об успешной обработке данных
  // $q.notify({
  //   color: 'positive',
  //   message: 'Данные успешно обработаны',
  // });
};

// Функция для сохранения данных в Dexie
const saveDataToDB = async (data) => {
  try {
    await db.dataStore.bulkAdd(data);
    $q.notify({
      color: 'positive',
      message: 'Данные успешно сохранены в базу данных',
    });
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Ошибка при сохранении данных в базу данных',
    });
    console.error('Ошибка при сохранении данных в базу данных:', error);
  }
};

// Функция для чтения данных из Dexie
const readDataFromDB = async () => db.dataStore.toArray();

// Чтение данных из Dexie при загрузке компонента
readDataFromDB().then((storedData) => {
  if (storedData.length > 0) {
    console.log('Данные из Dexie:', storedData);
  }
});
</script>

<style scoped>
.q-file {
  max-width: 300px;
}

.q-expansion-item {
  max-width: 600px;
}
</style>
