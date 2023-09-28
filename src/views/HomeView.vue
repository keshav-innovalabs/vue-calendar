<template>
  <div class="home">
    <Schedular/>
    <Calendar/>
  </div>
</template>

<script>
import Schedular from '@/components/Schedular.vue'

export default {
  name: 'HomeView',
  components: {
    Schedular,
  }
}
</script>
