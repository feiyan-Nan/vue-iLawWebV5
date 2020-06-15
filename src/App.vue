<template lang="pug">
    #app
        router-view
        router-view(name="footer")
        img(src="../static/img/dragging.png" id="dragImage")
</template>

<script>
import db from '@/plugin/db'
export default {
  name: 'App',
  data () {
    return {
      currHeight: 0
    }
  },
  created () {
    // 将用户信息存储到store
    this.$store.commit('USER_INITIAL', {
      userId: db.ls.get('userid'), // 兼容ilaw临时字段，请勿在vue项目中使用
      id: db.ls.get('userid'),
      name: db.ls.get('name'),
      pic: db.ls.get('pic'),
      userPic: db.ls.get('pic') // 兼容ilaw临时字段，请勿在vue项目中使用
    })
  },
  async mounted () {
    this.observerHeight()
  },
  methods: {
    listenHeight () {
      const height = window.document.getElementById('app').scrollHeight
      let iframe = window.parent.document.getElementById('v5Iframe')
      if (this.currHeight !== height && iframe) {
        this.currHeight = height
        iframe.style.height = `${height}px`
      }
    },
    observerHeight () {
      let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
      const target = document.querySelector('#app')
      let observer = new MutationObserver(item => {
        this.$nextTick(() => {
          this.listenHeight()
        })
      })
      const config = {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true }
      observer.observe(target, config)
    }
  }
}
</script>

<style lang="scss">
@import './styles/global.scss';
@import './styles/animation.scss';
@import './styles/transition.scss';

html,body {height: 100%;width: 100%;}

#app {
    color: #4A4A4A;
    width: 100%;

    .max-height {
        height: 100vh;
    }
}

#dragImage {position: fixed}

</style>
