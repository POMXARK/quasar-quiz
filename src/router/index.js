import { route } from 'quasar/wrappers';
import {
  createRouter, createMemoryHistory, createWebHistory, createWebHashHistory,
} from 'vue-router';
import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route((/* { store, ssrContext } */) => {
  // Определяем режим маршрутизации на основе переменной окружения
  const routerHistory = process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory;
  const createHistory = process.env.SERVER ? createMemoryHistory : routerHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    // Если маршрут требует авторизации
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!isAuthenticated) {
        // Если не авторизован, перенаправляем на главную страницу
        next('/');
      } else {
        next(); // Продолжить навигацию
      }
    } else {
      next(); // Продолжить навигацию, если маршрут не требует авторизации
    }
  });

  return Router;
});
