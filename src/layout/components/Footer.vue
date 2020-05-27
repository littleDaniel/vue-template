<template>
  <div
    class="footer"
    :style="{marginLeft:$store.getters.terminalType === 'mgt'?'10px':'0'}"
  >
    <div>简单汇信息科技（珠海）有限公司版权所有 粤ICP备17093348号-2</div>
    <div
      class="t-margin-top-5"
    >©2017-2023 JIANDANH INFORMATION TECH (ZHUHAI) CO., LTD All Rights Reserved.</div>
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.footer {
  height: 53px;
  background: #fff;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
