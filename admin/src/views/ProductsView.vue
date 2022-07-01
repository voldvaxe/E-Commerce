<template>
  <div class = 'my-5'>
    <v-card
    :loading="loading"
    class="mx-4 my-4 d-inline-block"
    width="374"
    v-for="(product, i) in products"
    :key="i"
  >
    <template slot="progress">
      <v-progress-linear
        color="deep-purple"
        height="10"
        indeterminate
      ></v-progress-linear>
    </template>
<!------------------------------------------------------------------->
  <vueper-slides fixed-height="300px" :touchable="false">
  <vueper-slide
    v-for="(slide, i) in product.images"
    :key="i"
    :image="'http://127.0.0.1:4000/' + slide">
  </vueper-slide>
</vueper-slides>
  <!-------------------------------------------------------->

    <v-card-title class="text-truncate">{{product.name}}</v-card-title>

    <v-card-text class="text-truncate">
        <div>{{product.price}} $</div>
    </v-card-text>
    <v-card-actions>
    <v-btn color="deep-purple  white--text"
      elevation="2"
      @click="id = product._id; editOption = !editOption"
    >Edit the Product</v-btn>
    <v-btn color="error"
      elevation="2"
      @click="id = product._id; deleteFunc();"
    >Delete the Product</v-btn>
    </v-card-actions>
  </v-card>
  <ProductDialog @update-options="editOptionProps"  :action="'Edit the product'" :func="editFunc" :options="editOption" :id="id"/>

    <v-btn
      v-if="loadMore"
      class="d-block mx-auto mt-8 mb-4"
      color="deep-purple white--text"
      large
      @click="load"
    >load more</v-btn>


            <v-fab-transition>
                  <v-btn
                    color="deep-purple"
                    dark
                    bottom
                    right
                    fab
                    fixed
                    @click="addOption = !addOption"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
      </v-fab-transition>


    <ProductDialog @update-options="addOptionProps" :action="'Add the product'" :func="addFunc" :options="addOption"/>



  </div>
</template>

<script>
import ProductDialog from './../components/ProductDialog';
import store from './../store/index';
import { VueperSlides, VueperSlide } from 'vueperslides';
import 'vueperslides/dist/vueperslides.css';
import axios from 'axios';
export default {
  name: "ProductsView",

  components: { VueperSlides, VueperSlide, ProductDialog },
  data: ()=>({
    loading: false,
    dialog: false,
    addOption:false,
    editOption: false,
    id: '',
    loadMore: true,
    pageNumber:1,
  }),
  methods:{
    reserve () {
      
        this.loading = true

        setTimeout(() => (this.loading = false), 2000)
      },
    async addFunc(formData){
      await axios.post('api/product', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  'Authorization': 'Bearer '  + this.token
                }});
                const products = await axios.get('api/product');
                store.commit('setProducts',products.data.products);
    },
    async editFunc(formData, id){
      await axios.put('api/product/' + id, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  'Authorization': 'Bearer '  + this.token
                }});
                const products = await axios.get('api/product');
                store.commit('setProducts',products.data.products);

    },
    async deleteFunc(){
      await axios.delete('api/product/' + this.id, {
                headers: {
                  'Authorization': 'Bearer '  + this.token
                }});
      store.commit('deleteProduct', this.id);
    },
    addOptionProps() {
      this.addOption === true ? this.addOption = false : this.addOption = true
    },
    editOptionProps() {
      this.editOption === true ? this.editOption = false : this.editOption = true
    },
    async load(){
      this.pageNumber++;
      const res = await axios.get('api/product?page=' + this.pageNumber);
      if(res.data.result === 0 || res.data.result < 9)
        this.loadMore = false;
      store.commit('appendProducts',res.data.products);
    }
  },
  computed: {
    products : {
      get(){
             return store.state.products;
           },
           set(products){
             return products
           } 
        },
      token(){
                return store.state.token;
            },
            
  },
  watch: {
    products(){
      this.products = store.state.products;
    }
  },

};
</script>