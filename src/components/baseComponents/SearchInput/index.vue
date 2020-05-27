
<template>
  <div class="t-input" :class="{'is-error': !hideTips}">
    <el-tooltip :disabled="hideTips" :content="popError" placement="top">
      <el-input
        type="text"
        :placeholder="placeholder"
        clearable
        @blur="verificateVal"
        @keyup.native="updateIsHideTips"
        v-model="currentVal"
        v-bind="$attrs"
        v-on="$listeners"
      >
        <template v-if="appendTitle" slot="append">{{appendTitle}}</template>
      </el-input>
    </el-tooltip>
  </div>
</template>
<script>
/**
*  通用搜索输入框，此控件不依赖外部el-form-item可以单独悬浮框提示规则校验功能，
*  用户未输入或者输入有误悬浮框提示输入规则
*  validate 校验类型
*  clearInput 开启错误校验自动清空
*  searchInput 控件作为一般搜索（而不是表单提交）用不对金额等字段进行输入输出值分别储存
*
*/
export default {
  name: 'SearchInput',
  data () {
    return {
      hideTips: false,
      popError: '',
      oldCurrentVal: '',
      currentVal: this.searchValue,
      rules: {
        currency: /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/, // 金额
        mobileNo: /^1[3456789]\d{9}$/, // 最新手机号
        phone: /^1(3\d|5\d|8\d|4[57]|7\d|9\d)\d{8}$/, // 手机号
        company: /^[\u4E00-\u9FA5a-zA-Z][\u4E00-\u9FA5a-zA-Z0-9\s-,-.]*$/,
        uname: /^[\u4E00-\u9FA5a-zA-Z][\u4E00-\u9FA5a-zA-Z0-9_]*$/,
        zh: /^[\u4e00-\u9fa5]+$/, // 纯中文
        card: /^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12])|91)\d{4}(((((19|20)((\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(\d{2}(0[13578]|1[02])31)|(\d{2}02(0[1-9]|1\d|2[0-8]))|(([13579][26]|[2468][048]|0[48])0229)))|20000229)\d{3}(\d|X|x))|(((\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(\d{2}(0[13578]|1[02])31)|(\d{2}02(0[1-9]|1\d|2[0-8]))|(([13579][26]|[2468][048]|0[48])0229))\d{3}))$/, // 身份证号
        int: /^[0-9]*$/,
        email: /^([a-z0-9A-Z]+[-|._]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/,
        socialCreditCode: /^[0-9A-Z]{18}$/, // 社会统一信用代码
        businessLicence: /^(\d{13}|\d{15})$/, // 营业执照号码
        organizationCode: /^([0-9A-Z]{8}-([0-9]|X))$/, // 组织机构代码证号码
        realName: /^([\u4E00-\u9FA5|a-zA-Z| ])+$/, // 中文或字母
        password: /^((?![a-z]+$)(?![A-Z]+$)(?!\d+$)(?!\W_+$)\S{6,20})$/, // 密码6-20位，至少两种字符
        acctNo: /^\d{4,32}$/, // 银行账号，最多32位
        entName: /^([\u4E00-\u9FA5a-zａ-ｚA-ZＡ-Ｚ0-9０-９()（）]{1,100})$/, // 企业名称或者推荐企业名称，中文字母数字括号,1-100位
        phoneOrTel: /^((((0\d{2,3}-?)?\d{7,8})|\d{10})|(1(3\d|5\d|8\d|4[57]|7\d|9\d)\d{8}))$/
      },
      rulesTips: {
        currency: '请输入最多两位数的小数或整数', // 金额
        mobileNo: '请输入11位数字', // 最新手机号
        phone: '请输入11位数字号码', // 手机号
        company: '请输入中英文数字和-的组合',
        uname: '',
        zh: '请输入纯中文', // 纯中文
        card: '请输入正确格式的证件号', // 身份证号
        int: '',
        email: '请输入正确格式的邮箱',
        socialCreditCode: '', // 社会统一信用代码
        businessLicence: '', // 营业执照号码
        organizationCode: '', // 组织机构代码证号码
        realName: '请输入中文或字母', // 中文或字母
        password: '密码6-20位，至少两种字符', // 密码6-20位，至少两种字符
        acctNo: '银行账号，4-32位数字', // 银行账号，最多32位
        entName: '企业名称或者推荐企业名称，中文字母数字括号,1-100位', // 企业名称或者推荐企业名称，中文字母数字括号,1-100位
        phoneOrTel: '' // 手机或固定电话
      }
    }
  },
  props: {
    searchValue: {
      type: String
    },
    placeholder: {
      type: String,
      default: '请输入金额'
    },
    validateType: {
      type: String,
      default: 'currency'
    },
    appendTitle: {
      type: String
    },
    clearInput: {
      type: Boolean,
      default: false
    },
    bindModel: {
      type: String
    }
  },
  watch: {
    currentVal (val, oldVal) {
      if (val === '' || val === undefined) {
        this.hideTips = false
      }
    }
  },
  mounted () {
    this.initTips()
  },
  methods: {
    // 校验规则
    verificateVal () {
      let isMatchReg = true
      if (this.currentVal === '' || this.currentVal.trim() === '') {
        this.currentVal = ''
        return
      }
      if (this.validateType && this.rules[this.validateType]) {
        isMatchReg = this.rules[this.validateType].test(this.currentVal)
      }
      this.alertErrorTipsAndCorrectVal(isMatchReg)
    },
    // 提示并处理输入值格式
    alertErrorTipsAndCorrectVal (isMatch) {
      if (isMatch) {
        this.hideTips = true
      } else {
        this.hideTips = false
        // 错误输入清空
        this.currentVal = this.clearInput ? '' : this.currentVal
      }
      // 触发父组件事件
      let returnObj = { value: this.currentVal, bindModel: this.bindModel }
      this.$emit('updateModel', returnObj)
    },
    // 格式化金额
    toThousandsNoZero (num) {
      return num ? ((isNaN(parseFloat(num.toString().replace(/,/g, ''))) ? 1 : parseFloat(num.toString().replace(/,/g, '')))).toFixed(2).toString().replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
        return $1 + ','
      }) : ''
    },
    initTips () {
      this.popError = this.rulesTips[this.validateType]
    },
    updateIsHideTips () {
      this.hideTips = this.rules[this.validateType].test(this.currentVal)
    }
  }
}
</script>
