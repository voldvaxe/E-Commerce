
<template>

  <carousel  :autoplay="10000" :wrapAround="true" >
    <slide v-for="(slide,i) in slides" :key="i">
        <div :class="'carousel__item ' + 'back' + i.toString() " >
          <div class="text">{{slide.sentence}}</div>
        </div>
    </slide>
  </carousel>
    
</template>


<script>
import { defineComponent } from 'vue';
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, } from 'vue3-carousel';

export default defineComponent({
  name: 'IntroCarousel.vue',

  components: {
    Carousel,
    Slide,
  },
  data: ()=>({
    slides: [
      {image: "./../assets/1.jpg", sentence: 'enjoy shopping for clothes and shoes.'},
      {image: './../assets/2.jpg',sentence:'discounts up to 50%'},
      {image: './../assets/3.jpg', sentence:'Everything is new, don\'t miss out on offers'},
    ],
  }),
});
</script>

<style scoped>
  
</style>




<style scoped>

.carousel__item {
  min-height: 500px;
  width: 90%;
  background-color: var(--vc-clr-primary);
  color:  var(--vc-clr-white);
  font-size: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: start;
  align-items: flex-end;
  padding:10px;
}


.carousel__prev,
.carousel__next {
  box-sizing: content-box;
  border: 5px solid white;
}
.text{
  font-size:50px;
  background-color: rgba(78, 74, 74, 0.419);
}

.back0{
  background: url('./../assets/1.jpg') 0 0 / cover no-repeat;
}

.back1{
  background: url('./../assets/2.jpg') 0 0 / cover no-repeat;
}

.back2{
  background: url('./../assets/3.jpg') 0 0 / cover no-repeat;
}

</style>

