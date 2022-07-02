<template>
    <div style="width:90%" class="mx-auto">
      <v-row class="my-8">
        <v-col cols="12" md="3" v-for="(product, i) in cart" :key="i">
          <v-card  style="position:relative" height="480px" class="pa-1">
            <div  :style = "{ width:'100%', height:'300px', background: `url('${URL}${product.product.images[0]}')` , backgroundSize: `cover`}"  >
              
            </div>
            <div class="my-2 truncate">
              {{product.product.name}}
            </div>

              <div style="position:absolute; bottom:5px;left:5px" >
                <strong>
                  {{product.product.price}}$
                </strong>
                </div>

        <div class="d-flex justify-end">
        </div>
          </v-card>
        </v-col>
      </v-row>
      
        <v-btn v-if="cart.length > 0" @click="buyTheCart" class="d-block mx-auto">
            Buy The Cart
        </v-btn>
        <Footer class="mt-8"/>


    </div>
</template>

<script>
import axios from 'axios';
import store from './../store/index'
import Footer from '../components/Footer.vue'
export default {
    name: 'CartView',
    components: {Footer,},
    computed : {
        token(){
            return store.state.token;
        }
    },
    watch:{
         token :{
            async handler(){
                if(this.token){
                    const res = await axios.get('api/customer/getInfo', {
                        headers: {Authorization: 'Bearer '+ this.token}
                    }) 
                    this.cart = res.data.cart;
                }
                
            },
            immediate: true,
        }
    },
    methods: {
        async buyTheCart(){
            const res = await axios.get('api/pay', {
                headers: {Authorization: 'Bearer '+ this.token}
            })
            window.location = res.data.forwardLink;
        }
    },
    data: ()=>({
        cart: {},
        URL : import.meta.env.VITE_APP_BASE_URL,
    })
}
</script>


<style scoped>
.truncate {
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>