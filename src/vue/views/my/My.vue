<template lang="pug">
    div.container
        Calendar
</template>
<script>
import Calendar from './calendar/Main'
export default {
  components: {
    Calendar
  },
  name: 'Mine',
  data () {
    return {}
  }
}
</script>
<style lang="scss" scoped>
.container {
    padding: 0 24px;
}
</style>
