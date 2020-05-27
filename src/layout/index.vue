<template>
  <div>
    <div :class="classObj" class="app-wrapper" v-if="$store.getters.terminalType!=='mgt'">
      <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
      <sidebar class="sidebar-container" />
      <div class="main-container">
        <div class="app-main-content">
          <navbar />
          <app-main />
          <!-- <Footer /> -->
        </div>
      </div>
    </div>
    <div class="app-wrapper" v-if="$store.getters.terminalType==='mgt'">
      <el-container>
        <el-header class="el_header" style="padding: 0;">
          <navbar />
        </el-header>
        <el-container style="height:calc(100vh - 60px);width:100%;">
          <sidebar class="sidebar-container" style="top:60px;padding-bottom:120px;" />
          <div class="main-container" style="width:100%;overflow:hidden;">
            <app-main />
            <!-- <Footer /> -->
          </div>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device
    }),
    classObj () {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside () {
      this.$store.dispatch('closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/css/mixin.scss';
@import '~@/assets/css/variables.scss';
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
  .app-main-content {
    margin-left: 10px;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
</style>
