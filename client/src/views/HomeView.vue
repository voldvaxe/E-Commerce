<template>
<div>
  <IntroCarousel class="my-8"/>
  <div class="card" >
      <v-row>
          <v-col cols="3"  v-for="(category, i) in categories" :key="i" class=" ma-0">
            <v-card  @click="cardClick(category)"  >
                  <div :style="{ width:'100%' ,height:'400px', background: `url('http://127.0.0.1:4000/${category.image}')`, backgroundSize: `cover`, backgroundPosition: 'center center' }">
                  </div>
                  <div class="text">{{category.name}}</div>
            </v-card>
          </v-col>
    </v-row>
  </div>
  <Footer class='mt-10'/>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import store from './../store/index'
import IntroCarousel from '../components/IntroCarousel.vue';
import Footer from '../components/Footer.vue'
export default defineComponent({
  name: 'HomeView',

  components: {
    IntroCarousel,
    Footer
  },
  
  computed: {
    categories: ()=>{
      return store.state.categories;
    }
  },
  methods: {
    cardClick:function (category){
      this.$router.push({ name: 'products', params: { id: category._id }}, );
    }
  }
});
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
</style>
