// router/routes.js

import RandomQuestion from 'components/Question/RandomQuestion.vue';
import EditQuestion from 'components/Question/EditQuestion.vue';
import CreateQuestion from 'components/Question/CreateQuestion.vue';
import AdminPage from 'pages/AdminPage.vue';
import ListCategory from 'components/Category/ListCategory.vue';
import CreateCategory from 'components/Category/CreateCategory.vue';
import EditCategory from 'components/Category/EditCategory.vue';

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: '/categories',
        name: 'ListCategory',
        component: ListCategory,
      },
      {
        path: '/create-category',
        name: 'CreateCategory',
        component: CreateCategory,
      },
      {
        path: '/edit-category/:id',
        name: 'EditCategory',
        component: EditCategory,
        props: true,
      },
      {
        path: 'random-question',
        name: 'RandomQuestion',
        component: RandomQuestion,
        meta: { requiresAuth: true }, // Добавляем мета-данные
      },
      {
        path: 'edit/:id', name: 'EditQuestion', component: EditQuestion, props: true,
      },
      { path: 'create', name: 'CreateQuestion', component: CreateQuestion },
      {
        path: 'admin-page',
        name: 'AdminPage',
        component: AdminPage,
        meta: { requiresAuth: true },
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
