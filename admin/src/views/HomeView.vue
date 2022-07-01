<template>
  <div>
  </div>
</template>

<script>
export default {
  name: "HomeView",

  components: {},
  beforeCreate(){
      const firstLogin = localStorage.getItem('firstLogin')
      if(!firstLogin) this.$router.push({ name: 'SignIn' })
      else this.$router.push({name: 'categories'})
    }
};
</script>
