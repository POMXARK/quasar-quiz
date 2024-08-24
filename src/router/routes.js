import QuestionComponent from 'components/QuestionComponent.vue';

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
    ],
  },
  {
    path: '/questions',
    name: 'Questions',
    component: QuestionComponent, // Компонент вопросов
    meta: { requiresAuth: true }, // Добавляем мета-данные
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
