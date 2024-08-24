// router/routes.js

import RandomQuestion from 'components/RandomQuestion.vue';
import EditQuestion from "components/EditQuestion.vue";
import CreateQuestion from "components/CreateQuestion.vue";
import QuestionList from "components/QuestionList.vue";
import AdminPage from "pages/AdminPage.vue";

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: 'random-question',
        name: 'RandomQuestion',
        component: RandomQuestion,
        meta: { requiresAuth: true }, // Добавляем мета-данные
      },
      { path: 'edit/:id', name: 'EditQuestion', component: EditQuestion, props: true },
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
