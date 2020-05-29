<template>
  <div class="navbar">
    <hamburger
      :toggle-click="toggleSideBar"
      :is-active="sidebar.opened"
      class="hamburger-container"
      v-if="terminalType!=='mgt'"
    />
    <div class="middle">
      <div class="name" :style="{marginLeft:terminalType==='mgt'?'60px':''}">
        <div class="logo">
          <img src="@/assets/img/newLogo.png" />
          <span>XXXXX平台</span>
        </div>
      </div>
    </div>
    <div class="right-menu">
      <el-dropdown
        class="avatar-container flex-box flex-ver right-menu-item hover-effect"
      >
        <div class="avatar-wrapper">
          <img src="@/assets/img/jdhlogo.png" class="user-avatar" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <span style="display:block;" @click="dialogFormVisible = true">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="link-guide right-menu-item">
        <div class="name">{{userName}}</div>
        <div class="line"></div>
        <div class="ent-name t-oneline-overflow-hidden" @click="openSelectEnt">
          {{currentEnt.entName}}
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
      <!-- <t-dialog
        title="请选择企业"
        class="ent-choose"
        :visible="dialogSelectEnt"
        @update:visible="cancel"
      >
        <div class="select-ent-box flex-box flex-col">
          <div
            style="width:100%;"
            v-for="item in entList"
            :key="item.id"
            class="radio-line-item t-overflow-hidden"
            :class="entSelectType===item.id?'radioSelected':''"
            @click="selectType(item)"
          >
            <i v-if="entSelectType===item.id" class="el-icon-check icon-check"></i>
            {{item.entName}}
            <span style="color:#999;">(企业编码:{{item.entCode}})</span>
          </div>
        </div>
      </t-dialog> -->
      <t-dialog
        title="修改密码"
        :visible="dialogFormVisible"
        @update:visible="cancel"
        :isCancel="false"
      >
        <el-form
          :model="resetForm"
          status-icon
          :rules="resetFormRules"
          ref="resetForm"
          label-width="100px"
        >
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input type="password" clearable v-model="resetForm.oldPassword" show-password></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input type="password" clearable v-model="resetForm.newPassword" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="repeatNewPassword">
            <el-input type="password" clearable v-model="resetForm.repeatNewPassword" show-password></el-input>
          </el-form-item>
          <div class="btn" style="text-align: center;">
            <el-button @click="reset">重置</el-button>
            <el-button type="danger" @click="save">确定</el-button>
          </div>
        </el-form>
      </t-dialog>
    </div>
  </div>
</template>

<script>
import permissionMixin from '@/common/permissionMixin'
import { Encryptor } from '@/common/utils'
import { mapGetters } from 'vuex'
import Hamburger from './Hamburger'
export default {
  components: {
    Hamburger
  },
  mixins: [permissionMixin],
  data () {
    const validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入旧密码'))
      } else {
        callback()
      }
    }
    const validatePass1 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入新密码'))
      } else {
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.resetForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogSelectEnt: false,
      entSelectType: '', // 当前选中企业id
      dialogFormVisible: false,
      // 重置密码
      resetForm: {
        oldPassword: '',
        newPassword: '',
        repeatNewPassword: ''
      },
      resetFormRules: {
        oldPassword: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        newPassword: [
          { required: true, validator: validatePass1, trigger: 'blur' }
        ],
        repeatNewPassword: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'device',
      'userName',
      'terminalType',
      'entUserId',
      'redirectEntId'
    ]),
    entList () {
      return this.$store.getters.entList && JSON.parse(this.$store.getters.entList)
    },
    currentEnt () {
      return (this.$store.getters.currentEnterprise && JSON.parse(this.$store.getters.currentEnterprise)) || { entName: '' }
    }
  },
  inject: ['reload'],
  mounted () {
    // console.log(60, this.currentEnt)
    if (this.currentEnt) {
      this.entSelectType = this.currentEnt.id
    }
  },
  methods: {
    // 打开切换企业弹框
    async openSelectEnt () {
      if (this.terminalType === 'mgt') return
      this.dialogSelectEnt = true
      // 获取企业列表信息
      const entResult = await this.$ajaxRequest('get', 'current')
      this.$store.commit('user/SET_ENTLIST', JSON.stringify(entResult.result.entList))
    },
    // 选择企业
    selectType (item) {
      this.entSelectType = item.id
      this.dialogSelectEnt = false
      this.selectEnt(item.id)
    },
    // 切换当前企业
    async selectEnt (id) {
      // 获取当前企业信息
      const res = await this.$ajaxRequest('post', 'selectEnt', { entId: id })
      // console.log(333, res)
      this.$store.commit('user/SET_REDIRECT_ENT_ID', res.result.entIdPcloud)
      this.$store.commit('user/SET_CURRENTENTERPRISE', JSON.stringify(res.result))
      // 获取权限
      this.getMenuTree()
      // 切换企业局部刷新页面
      this.reload()
    },
    toggleSideBar () {
      this.$store.dispatch('toggleSideBar')
    },
    logout () {
      this.$store.dispatch('user/resetToken').then(() => {
        this.$router.push('/login')
      })
    },
    reset () {
      this.resetForm = {
        oldPassword: '',
        newPassword: '',
        repeatNewPassword: ''
      }
    },
    cancel () {
      this.dialogSelectEnt = false
      this.dialogFormVisible = false
    },
    // 保存密码
    save () {
      this.$refs.resetForm.validate(valid => {
        if (valid) {
          let params = {
            oldPassword: Encryptor(this.resetForm.oldPassword),
            newPassword: Encryptor(this.resetForm.newPassword),
            repeatNewPassword: Encryptor(this.resetForm.repeatNewPassword)
          }
          this.changePassword(params)
        } else {
          return false
        }
      })
    },
    async changePassword (params) {
      const res = await this.$ajaxRequest('put', 'changePassword', params)
      if (res && res.status === 200) {
        this.$message({
          message: '修改密码成功,请重新登录!',
          type: 'success'
        })
        this.dialogFormVisible = false
        this.$store.dispatch('user/resetToken').then(() => {
          this.$router.push('/login')
        })
      } else {
        this.$message.error({
          message: res.msg
        })
        this.dialogFormVisible = false
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 60px;
  line-height: 60px;
  border-radius: 0px !important;
  background-color: #fdfdfd;
  border: 1px solid #ccc;
  box-shadow: 0 1px 2px 0 #ccc;
  border-top: none;
  display: flex;
  .hamburger-container {
    flex: 10%;
    line-height: 58px;
    height: 60px;
    text-align: left;
    padding-left: 15px;
  }
  .middle {
    flex: 60%;
    text-align: left;
    .name {
      display: inline-flex;
      line-height: 60px;
      .logo {
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          font-size: 23px;
          padding-left: 5px;
        }
      }
    }
  }
  .right-menu {
    flex: 25%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      text-align: center;
      padding: 0 5px;
      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;
        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
    .screenfull {
      width: 15%;
      margin-top: 3px;
    }
    .avatar-container {
      width: 16%;
      .avatar-wrapper {
        position: relative;
        line-height: 60px;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          vertical-align: middle;
        }
      }
    }
    .link-guide {
      // width: 35%;
      margin-right: 30px;
      div {
        height: 20px;
        line-height: 20px;
        color: #777;
      }
      .name {
        font-size: 14px;
        font-weight: 700;
      }
      .line {
        background: linear-gradient(to right, #ef473a 40%, #fff);
        height: 3px;
        margin-top: 2px;
      }
      .ent-name {
        padding-top: 3px;
        font-size: 12px;
        min-width: 95px;
        cursor: pointer;
      }
    }
  }
  .popover-pwd {
    .title {
      height: 40px;
      line-height: 35px;
      padding-left: 20px;
      font-size: 16px;
      font-weight: 700;
      border-bottom: 1px solid #ccc;
      margin-bottom: 20px;
    }
  }
}
</style>
<style lang="scss">
.navbar {
  .ent-choose {
    .select-ent-box {
      padding: 10px;
    }
    .el-dialog__header {
      padding: 10px;
    }
  }
}
</style>
