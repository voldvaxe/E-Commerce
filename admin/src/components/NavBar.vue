<template>
<div>
    <v-app-bar
        app
        elevation="4"
        clipped-left
    >
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <div>
            Admin Panel
        </div>
        <v-spacer></v-spacer>
        <v-btn
            elevation="0"
            color="error"
            outlined
            @click="logout"
        >logout</v-btn>
    </v-app-bar>
    <v-navigation-drawer
    premanant
      v-model="drawer"
      clipped
      app
    >
    <v-avatar
      size="170"
      class="d-block mx-auto mt-8 mb-4"
    >
      <img
        src="./../assets/2.jpg"
        alt="John"
      >
    </v-avatar>
      <v-list
        nav
        dense
      >
        <v-list-item-group
          mandatory
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item>
            <v-list-item-title>Manage Categories</v-list-item-title>
          </v-list-item>

            <v-divider/>
        
          <v-list-item>
            <v-list-item-title>Manage Products</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
</div>
</template>

<script>
import axios from 'axios'
export default {
      data: () => ({
          drawer: true,
          group: 0,
          groupHelper: 0,
      }),
      methods: {
        async logout(){
      await axios.get('api/admin/logout', {withCredentials: true})
        
      localStorage.removeItem('firstLogin')
      this.$router.push({ name: 'signIn' });
    },
      },
      watch: {
          group () {
              if(this.group === 0)
                this.$router.push({name: 'categories'});
              else if (this.group === 1) this.$router.push({name: 'products'});
          },
      },
      beforeMount(){
        if(this.$route.name === 'products')
          this.group = 1;
        else if (this.$route.name === 'categories')
          this.group = 0;
      }
}
  
</script>