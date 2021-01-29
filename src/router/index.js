import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
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
      path: '/profile',
      name: 'Profilis',
      component: () =>
        import("../views/Profile.vue")
    },
    {
      path: '/statistics',
      name: 'Statistika',
      component: () =>
        import("../views/Statistics.vue")
    }
  ]
});
router.beforeEach((to, from, next) => {
  if (to.name !== 'Prisijungimas' && localStorage.token){
    let config= {
      headers: { Authorization: `Bearer ${localStorage.token}` }
  };
  axios.post('http://127.0.0.1:8000/api/auth/refresh','',config)
  .then((resp) => {
      localStorage.token = resp.data.access_token;
      next()
  })
  .catch(error => {
      console.log(error.response.data.message);
      if(error.response.data.message == "Route [login] not defined."){
         next({name: 'Prisijungimas'})
      }
  }); 
  } else if(to.name !== 'Prisijungimas' && !localStorage.token){
     next({name: 'Prisijungimas'})
  } else next()
})
export default router;
