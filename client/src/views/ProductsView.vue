<template>
  <div class="products">
    
    <v-card width="90%" class="mx-auto my-4 pa-4">
      <v-form v-model="valid">
      <v-row>
        
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="regex"
            label="search"
          ></v-text-field>
        </v-col>


        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="lte"
            :rules="numberRules"
            label="price less than"
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="gte"
            :rules="numberRules"
            label="price greater than"
          ></v-text-field>
        </v-col>
      </v-row>
  </v-form>
    </v-card>


    <div style="width:90%" class="mx-auto">
      <v-row class="my-8">
        
        <v-col cols="12" md="3" v-for="(product, i) in products" :key="i" >
          <v-card v-if="product._id !== null" style="position:relative" height="460px" class="pa-1 d-flex  align-content-space-between flex-column" >
            <div>
              <vueper-slides fixed-height="300px" :touchable="false">
              <vueper-slide
                v-for="(slide, i) in product.images"
                :key="i"
                :image="URL+ slide">
              </vueper-slide>
            </vueper-slides>
              <div class="my-1 truncate">
                {{product.name}}
              </div>
                    <div style="font-size:20px">
                    {{product.price}}$
                  </div>
            </div>
            <v-spacer></v-spacer>
                  <v-row  no-gutters align="end" >
                    <v-btn block @click="addToCart(product._id)" color="info" >
                      Add To cart
                    </v-btn>
                    </v-row>
                  
                    
                  
          </v-card>
        </v-col>
      </v-row>
    </div>
      <!------------------------------------------------------>

        <v-snackbar
      v-model="snackbarSuccess"
      app
      vertical
      location="bottom left"
      color="success"
    >

      <p>Added to cart :)</p>

    </v-snackbar>

    <v-snackbar
      v-model="snackbarError"
      app
      vertical
      location="bottom left"
      color="error"
    >

      <p> Please login first :(</p>

    </v-snackbar>

      <!------------------------------------------------------->

        <v-btn v-if="loadMore" @click="$store.dispatch('appendProducts', ++pageNumber)" class="d-block mx-auto">
            Load More
        </v-btn>


          <Footer class="mt-8"/>
  </div>
</template>

<script>
import store from './../store/index'
import Footer from '../components/Footer.vue'
import { VueperSlides, VueperSlide } from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'
import axios from 'axios'

export default {
  name: 'ProductsView',
  components: {
    Footer, VueperSlides, VueperSlide
  },
  computed: {
    products(){
        return store.state.products;
    },
    items(){
      return store.state.categories;
    },
    loadMore(){
      return store.state.loadMore;
    }
  },
  watch : {
    lte() {
      this.pageNumber= 1;
      store.commit('setLte', this.lte);
      store.dispatch('getProducts');
    },
    gte() {
      this.pageNumber= 1;
      store.commit('setGte', this.gte);
      store.dispatch('getProducts');
    },
    regex() {
      this.pageNumber= 1;
      store.commit('setRegex', this.regex);
      store.dispatch('getProducts');
    },
  },
  data: ()=>({
     valid: false,
      lte: '',
      gte: '',
      regex: '',
      searchString: '',
      pageNumber: 1,
      numberRules: [
        
        v => {
          return !isNaN(v) || 'the value must be a number'
          }
      ],
      snackbarSuccess: false,
      snackbarError: false,
      URL : import.meta.env.VITE_APP_BASE_URL,
  }),
  methods: {
    async addToCart(id){
      const firstLogin = localStorage.getItem('firstLogin')
      if(firstLogin){
        await axios.post('/api/product/' + id, {quantity :1 }, {
          headers: {
            'Authorization' : 'Bearer ' + store.state.token
          }
          
        })
        this.snackbarSuccess=true;
      }else{
        this.snackbarError=true;
      }
    }
  },

  beforeMount(){
    
    store.commit('setSelectedCategory',  this.$route.params.id )
    store.dispatch('getProducts');
  }
}
</script>

<style scoped>
.card{
  width:90%;
  margin: 0 auto;
}
.text{
  text-align: center;
  font-size:50px;
}
.truncate {
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

</style>