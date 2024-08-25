<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label header>
          Essential Links
        </q-item-label>

        <!-- Обновленный список с одной ссылкой на панель администратора -->
        <EssentialLink
          :title="questionLink.title"
          :caption="questionLink.caption"
          :icon="questionLink.icon"
          :link="questionLink.link"
        />

        <EssentialLink
          :title="adminLink.title"
          :caption="adminLink.caption"
          :icon="adminLink.icon"
          :link="adminLink.link"
        />

        <!-- Добавленная ссылка на список категорий -->
        <EssentialLink
          :title="categoryLink.title"
          :caption="categoryLink.caption"
          :icon="categoryLink.icon"
          :link="categoryLink.link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';

defineOptions({
  name: 'MainLayout',
});

// Объект с информацией о ссылке на панель администратора
const adminLink = {
  title: 'Admin Page', // Обновите название на нужное вам
  caption: 'Manage your application',
  icon: 'admin_panel_settings',
  link: '/admin-page', // Обновите путь на нужный вам
};

// Объект с информацией о ссылке на викторину
const questionLink = {
  title: 'Questions', // Название ссылки
  caption: 'View and manage questions',
  icon: 'question_answer', // Иконка для вопросов
  link: '/random-question', // Путь к странице вопросов
};

// Новый объект с информацией о ссылке на список категорий
const categoryLink = {
  title: 'Categories', // Название ссылки на категории
  caption: 'View and manage categories',
  icon: 'category', // Иконка для категорий
  link: '/categories', // Путь к странице списка категорий
};

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
