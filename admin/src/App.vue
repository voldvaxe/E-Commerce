<template>
  <v-app>
    
    <NavBar v-if='$route.name !== "signIn" && $route.name !== "signUp"'/>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import NavBar from './components/NavBar.vue';
import axios from 'axios';
import store from './store/index'
export default {
  name: 'App',
  components: {
    NavBar,
  },
  data: () => ({
    //
  }),
  async beforeCreate(){
      const firstLogin = localStorage.getItem('firstLogin')
      if(firstLogin){
          const refreshToken = async () =>{
              const res1 = await axios.get('/api/admin/refresh_token', {withCredentials: true})
              store.commit('setToken',res1.data.accesstoken);
              const res2 = await axios.get('api/product');
              store.commit('setProducts',res2.data.products);
              const res3 = await axios.get('api/category',  {
                headers: {Authorization: 'Bearer '  + this.token}
              });
              store.commit('setCategories', res3.data);
              setTimeout(() => {
                  refreshToken()
              }, 10 * 60 * 1000)
          }
          refreshToken()
      }
      
  },
  computed: {
    token(){
      return store.state.token;
    }
  },
};
</script>
