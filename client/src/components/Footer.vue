<template>
  <v-footer style="background-color: #F0F2F5;" padless>
    <v-col
      class="text-center"
      cols="12"
    >
      {{ new Date().getFullYear() }} — <strong>Created By Mohamed Asaad</strong>
    </v-col>
  </v-footer>
</template>

<script>
    export default {
        name: 'Footer',
    }
</script>
