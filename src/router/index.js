import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Pagrindinis',
      component: Home
    },
    {
      path: '/admin',
      name: 'Prisijungimas',
      component: () =>
        import("../views/Login.vue")
    },
    {
      path: '/schedule',
      name: 'Tvarkarastis',
      props: true,
      component: () =>
        import("../views/Schedule.vue")
    },
    {
      path: '/statistics',
      name: 'Statistika',
      component: () =>
        import("../views/Statistics.vue")
    }
  ]
});

export default router;
