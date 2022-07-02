<template>
    <v-app-bar
    elevation="4"
    >
        <v-btn  class="no-uppercase py-10" @click="$router.push({name: 'home'})" >
            <h1 class="bg">
                Nileevate
            </h1>
        </v-btn>
        <v-spacer></v-spacer>

        <v-btn
            v-if="!firstLogin"
            variant="text"
            color="info"
            @click="$router.push({name: 'signIn'})"
        >
            sign in
        </v-btn>


        <v-btn
         v-if="firstLogin"
            variant="text"
            icon
            color="info"
            @click="$router.push({name: 'cart'})"
        >
            <v-icon>mdi-cart</v-icon>
        </v-btn>
        
        <div class="text-center">
    <v-menu v-if="firstLogin"
      v-model="menu"
      :close-on-content-click="false"
      location="bottom end"
    
    >
      <template v-slot:activator="{ props }">
         <v-btn
        variant="text"
        icon
        color="info"
        class="ml-4"
        v-bind="props"
        >
        <v-icon>mdi-arrow-down-drop-circle-outline</v-icon>
        </v-btn>
      </template>

      <v-card min-width="300">
        <v-list>
          <v-list-item
            :prepend-avatar="URL + info.image"
            :title="info.firstName + ' ' + info.lastName"
            :subtitle="info.email"
          >
            <v-icon>mdi-heart</v-icon>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>
        <v-list>
          <v-list-item
            :title="'address: ' +  info.address"
          >
          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            elevation="0"
            color="error"
            outlined
            @click="logout"
        >logout</v-btn>

          <v-btn
            
            text
            @click="menu = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>

    </v-app-bar>
</template>

<script>
import store from './../store/index'
import axios from 'axios'
export default {
    name: 'NavBar',
    
    data : ()=>({
        menu: false,
        URL : import.meta.env.VITE_APP_BASE_URL,
    }),
    computed:{
        info(){
            return store.state.info;
        },
        firstLogin(){
            return localStorage.getItem('firstLogin');
        }
    },
    methods: {
      async logout(){
      await axios.get('api/customer/logout', {withCredentials: true})
        
      localStorage.removeItem('firstLogin')
      window.location.href = '/';
    },
    }
}
</script>

<style scoped>
h1.bg {
   font-size: 40px;
   background: url('./../assets/4.jpg') 0 0 / cover no-repeat;
   color: #de466c;
   -webkit-background-clip: text;
   -webkit-text-fill-color: transparent;
}
.no-uppercase {
     text-transform: unset !important;
}
</style>