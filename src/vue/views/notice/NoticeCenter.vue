<template>
<div class="notice_container">
  <NoticeSideBar></NoticeSideBar>
  <NoticeContent></NoticeContent>
</div>
</template>
<script>
import NoticeSideBar from './sidebar/NoticeSideBar'
import NoticeContent from './content/NoticeContent'
export default {
  components: {
    NoticeSideBar,
    NoticeContent
  },
  data: () => ({
    expand: true
  }),
  methods: {
    methodName () {}
  }
}
</script>
<style lang="scss" scoped>
.notice_container {
    width: 400px;
    height: 100%;
    overflow: hidden;
    @include flex();
}
</style>
