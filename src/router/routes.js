import QuestionComponent from 'components/QuestionComponent.vue';
import EditQuestion from "components/EditQuestion.vue";
import CreateQuestion from "components/CreateQuestion.vue";
import QuestionList from "components/QuestionList.vue";

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
    name: 'QuestionList',
    component: QuestionList,
    meta: { requiresAuth: true }, // Добавляем мета-данные
  },
  { path: '/edit/:id', name: 'EditQuestion', component: EditQuestion, props: true, },
  { path: '/create', name: 'CreateQuestion', component: CreateQuestion, },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
