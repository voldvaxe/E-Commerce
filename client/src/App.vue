<template>
    <v-app>
      <NavBar v-if="$route.name != 'signIn' && $route.name != 'signUp'"></NavBar>

      <v-main class="background">
        <router-view/>
      </v-main>
    </v-app>
</template>

<script>
  import axios from 'axios';
  import store from './store/index';
  import NavBar from './components/NavBar.vue';
  export default {

  components: {
    NavBar
  },
  name: 'App',

  data: () => ({
    //
  }),
  async beforeCreate(){
      const firstLogin = localStorage.getItem('firstLogin')
      if(firstLogin){
          const refreshToken = async () =>{
              const res1 = await axios.get('api/customer/refresh_token', {withCredentials: true})
              store.commit('setToken',res1.data.accesstoken);
              const res2 = await axios.get('api/customer/getInfo', {
                headers: {Authorization: 'Bearer '+ this.token}
              }) 
              store.commit('setInfo',res2.data);
              setTimeout(() => {
                  refreshToken()
              }, 10 * 60 * 1000)
          }
          refreshToken()
      }
      const res2 = await axios.get('api/category',  {
        headers: {Authorization: 'Bearer '  + this.token}
      });
      store.commit('setCategories', res2.data);
  },
  computed: {
    token(){
      return store.state.token;
    }
  },
}
</script>


<style scoped>
.background{
  background-color: #F0F2F5;
}
</style>