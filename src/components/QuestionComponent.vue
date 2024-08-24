<template>
  <div class="question-container">
    <div class="question">{{ questionText ?? fakeQuestionText }}</div>
    <div v-for="(option, index) in fakeColorOptions" :key="index" class="answer-option">
      <input
        type="checkbox"
        :id="'option' + index"
        :value="option.value"
        v-model="selectedOptions"
      />
      <label :for="'option' + index">{{ option.label }}</label>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Определяем пропсы для компонента
const props = defineProps({
  questionText: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true,
    default: () => []
  }
});

const fakeQuestionText="Какой ваш любимый цвет?"

// Определяем варианты ответа
const fakeColorOptions = [
  { value: 'red', label: 'Красный' },
  { value: 'blue', label: 'Синий' },
  { value: 'green', label: 'Зеленый' },
  { value: 'yellow', label: 'Желтый' }
];

// Реактивная переменная для хранения выбранных опций
const selectedOptions = ref([]);
</script>

<style scoped>
.question-container {
  margin-bottom: 20px;
}

.question {
  font-size: 18px;
  font-weight: bold;
}

.answer-option {
  display: block;
  margin: 10px 0;
}

.answer-option input {
  margin-right: 10px;
}
</style>
