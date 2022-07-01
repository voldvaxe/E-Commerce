<template>
  <div class = 'my-5'>
    <v-card
    :loading="loading"
    class="mx-4 my-4 d-inline-block"
    width="390"
    v-for="(category, i) in categories"
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
  <v-img
      height="300"
      :src=" 'http://127.0.0.1:4000/' + category.image"
    ></v-img>
  <!-------------------------------------------------------->

    <v-card-title class="text-truncate">{{category.name}}</v-card-title>
    <v-card-actions>
    <v-btn color="deep-purple white--text"
      elevation="2"
      @click="id = category._id; editOption = !editOption"
    >Edit the category</v-btn>
    <v-btn color="error"
      elevation="2"
      @click="id = category._id; deleteFunc();"
    >Delete the category</v-btn>
    </v-card-actions>
  </v-card>
  <CategoryDialog @update-options="editOptionProps" :action="'edit the category'" :func="editFunc" :options="editOption" :id="id"/>



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


    <CategoryDialog @update-options="addOptionProps" :action="'Add the category'" :func="addFunc" :options="addOption"/>



  </div>
</template>

<script>
import CategoryDialog from './../components/CategoryDialog';
import store from './../store/index';
import axios from 'axios';
export default {
  name: "CategoriesView",

  components: { CategoryDialog },
  data: ()=>({
    loading: false,
    dialog: false,
    addOption:false,
    editOption: false,
    id: '',
  }),
  methods:{
    reserve () {
        this.loading = true

        setTimeout(() => (this.loading = false), 2000)
      },
    async addFunc(formData){
      await axios.post('api/category', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  'Authorization': 'Bearer '  + this.token
                }});
                const Categories = await axios.get('api/category');
                store.commit('setCategories',Categories.data);
    },
    async editFunc(formData, id){
      await axios.put('api/category/' + id, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  'Authorization': 'Bearer '  + this.token
                }});
                const Categories = await axios.get('api/category');
                store.commit('setCategories',Categories.data);

    },
    async deleteFunc(){
      await axios.delete('api/category/' + this.id, {
      headers: {
        'Authorization': 'Bearer '  + this.token
      }});
      store.commit('deleteCategory', this.id);
      const res = await axios.get('api/product');
      store.commit('setProducts',res.data.products);
    },
    addOptionProps() {
      this.addOption === true ? this.addOption = false : this.addOption = true
    },
    editOptionProps() {
      this.editOption === true ? this.editOption = false : this.editOption = true
    },
  },
  computed: {
    categories : {
      get(){
             return store.state.categories
           },
           set(categories){
             return categories
           } 
    },
token(){
                return store.state.token;
            },
  },
  watch: {
    categories(){
      this.categories = store.state.categories;
    }
  },
};
</script>