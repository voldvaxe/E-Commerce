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
        
        <v-col cols="3" v-for="(product, i) in products" :key="i" >
          <v-card v-if="product._id !== null" @click="this.product = product; dialog = !dialog" style="position:relative" height="480px" class="pa-1">
            <div  :style = "{ width:'100%', height:'300px', background: `url('http://127.0.0.1:4000/${product.images[0]}')` , backgroundSize: `cover`}"  >
              
            </div>
            <div class="my-2 truncate">
              {{product.name}}
            </div>

              <div style="position:absolute; bottom:5px;left:5px" >
                <strong>
                  {{product.price}}$
                </strong>
                </div>

        <div class="d-flex justify-end">
        </div>
          </v-card>
        </v-col>
      </v-row>
    </div>


        <v-btn v-if="loadMore" @click="$store.dispatch('appendProducts', ++pageNumber)" class="d-block mx-auto">
            Load More
        </v-btn>


        <!----------------------------------------------------------->

  <div class="text-center">
    <v-dialog
      v-model="dialog"
        width="80%"
    >
      <v-card   width="1000px" class="pa-8">

        <v-row>
          <v-col cols="3">
            <vueper-slides fixed-height="300px" :touchable="false">
            <vueper-slide
              v-for="(slide, i) in product.images"
              :key="i"
              :image="'http://127.0.0.1:4000/' + slide">
            </vueper-slide>
          </vueper-slides>
          </v-col>
          <v-col style="position: relative;" cols="9">
            <div width="500px">
              <strong>
                {{product.name}}
              </strong>
            </div>
            
            <div>
              {{product.description}}
            </div>
            <div>
              <strong>
                {{product.price}}$
              </strong>
            </div>
            <div style="position:absolute; bottom:-5px;right:5px">
            <v-btn variant="outlined" @click="dialog = false" color="error" class="mr-2">
              Close
            </v-btn>
            <v-btn @click="addToCart(product._id)" color="info" >
              Add To cart
            </v-btn>
            </div>
            
          </v-col>
        </v-row>

        
      </v-card>
    </v-dialog>
  </div>



        <!----------------------------------------------------------->


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
      dialog: false,
      product: {},
      numberRules: [
        
        v => {
          return !isNaN(v) || 'the value must be a number'
          }
      ],
  }),
  methods: {
    async addToCart(id){
      await axios.post('/api/product/' + id, {quantity :1 }, {
        headers: {
          'Authorization' : 'Bearer ' + store.state.token
        }
      })
      this.dialog = false;
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
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

</style>