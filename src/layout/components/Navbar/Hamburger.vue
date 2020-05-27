<template>
  <div @click="toggleClick">
    <i class="hamburger i-icon icon iconfont icon-hamburger" :class="{'is-active':isActive}"></i>
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    toggleClick: {
      type: Function,
      default: null
    }
  }
}
</script>

<style scoped>
.hamburger {
  display: inline-block;
  cursor: pointer;
  font-size: 30px;
  height: 55px;
  line-height: 58px;
  transform: rotate(90deg);
  transition: 0.38s;
  transform-origin: 50% 50%;
}

.hamburger.is-active {
  transform: rotate(0deg);
}
</style>
