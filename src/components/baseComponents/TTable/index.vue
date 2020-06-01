<template>
  <div class="t-table">
    <div class="toolbar_top" v-if="isShow('toolbar')">
      <slot name="toolbar"></slot>
    </div>
    <!-- :style="{'width': $store.getters.tableWidth,'transition': 'width .3s'}" -->
    <el-table
      ref="el-table"
      :data="table.data"
      :height="height? fixHeight? fixHeight: undefined: $store.getters.tableHeight - otherHeight"
      @cell-dblclick="cellDblclick"
      v-bind="$attrs"
      v-on="$listeners"
      border
    >
      <!-- 复选框 -->
      <!-- <div v-if="table.selection">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
      </div>-->
      <!-- 序列号/复选框 -->
      <div v-if="table.firstColumn">
        <el-table-column
          :type="table.firstColumn.type"
          width="50"
          :label="table.firstColumn.label"
          align="center"
          v-if="table.firstColumn.type==='index'"
        >
          <template slot-scope="scope">
             <span>\{{isShowPagination?((table.currentPage - 1 ) * table.pageSize + scope.$index + 1):scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :type="table.firstColumn.type"
          width="50"
          :label="table.firstColumn.label"
          align="center"
          :reserve-selection="table.firstColumn.isPaging||false"
          v-if="table.firstColumn.type!=='index'"
        ></el-table-column>
      </div>
      <slot name="begin"></slot>

      <el-table-column
        v-for="(item, index) in table.column"
        :key="index"
        :type="item.type"
        :label="item.label"
        :prop="item.prop"
        :min-width="item['min-width'] || item.minWidth || item.width"
        :sortable="item.sort"
        :align="item.align || 'center'"
        show-overflow-tooltip
        v-bind="$attrs"
        v-on="$listeners"
      >
        <template slot-scope="scope">
          <div v-if="!item.filters" :style="{color:txtChangeColor(scope)}">\{{scope.row[item.prop]}}</div>
          <div v-if="item.filters" :style="{color:txtChangeColor(scope)}">
            <span
              v-if="item.filters.param"
            >\{{scope.row[item.prop] |constantKey2Value(item.filters.param)}}</span>
            <span
              v-if="!item.filters.param&&item.filters.method==='￥'"
            >\{{scope.row[item.prop] |currencyFilter}}</span>
            <span
              v-if="!item.filters.param&&item.filters.method==='%'"
            >\{{scope.row[item.prop] |percentFilter}}</span>
            <span
              v-if="!item.filters.param&&item.filters.method==='time'"
            >\{{scope.row[item.prop] |timeFormatFilter}}</span>
            <span
              v-if="!item.filters.param&&item.filters.method==='date'"
            >\{{scope.row[item.prop] |dateFormatFilter}}</span>
          </div>
        </template>
      </el-table-column>
      <slot></slot>

      <el-table-column
        v-if="table.operator"
        :fixed="table.operatorConfig && table.operatorConfig.fixed"
        :label="(table.operatorConfig && table.operatorConfig.label) || '操作'"
        :min-width="(table.operatorConfig && table.operatorConfig.width || table.operatorConfig.minWidth) || 100"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            v-for="(item, index) in table.operator"
            :key="index"
            @click="item.fun(scope.row)"
            :type="item.type"
            size="small"
            v-show="checkIsShow (scope, item)"
          >{{item.text}}</el-button>
        </template>
      </el-table-column>
      <slot name="end"></slot>
    </el-table>

    <el-pagination
      v-show="table.data && table.data.length && isShowPagination"
      :current-page="table.currentPage"
      @current-change="handlesCurrentChange"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="table.pageSize"
      :layout="size?'total, prev, pager, next':'total, sizes, prev, pager, next, jumper'"
      :total="table.total"
      v-bind="$attrs"
      v-on="$listeners"
      background
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'TTable',
  props: {
    // table所需数据
    table: {
      type: Object,
      default: () => {
        return {}
      },
      required: true
    },
    // 是否固定高度
    height: {
      type: Boolean,
      default: true
    },
    // 是否需要固定表头
    fixHeight: {
      type: String || Number,
      default: ''
    },
    // 是否需要显示切换页条数
    size: {
      type: Boolean,
      default: false
    },
    // 是否显示分页
    isShowPagination: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      tableHeight: 0,
      otherHeight: 0
    }
  },
  computed: {
    // 按钮权限数组
    btnPremissions () {
      return this.$store.getters.buttons
    }
  },
  mounted () {
    const topHeight = this.isShow('toolbar') ? 42 : 0
    const bottomHeight = 72
    this.$nextTick(() => {
      this.otherHeight =
        this.$parent.$el.childNodes[0].getBoundingClientRect().height +
        topHeight +
        bottomHeight +
        10
    })
  },
  methods: {
    // 是否显示按钮
    checkIsShow (scope, item) {
      // return (!item.show || item.show.val.includes(scope.row[item.show.key])) &&
      //   !(item.noshow && item.noshow.val.includes(scope.row[item.noshow.key])) &&
      //   (item.resCode ? this.btnPremissions.includes(item.resCode) : true)
      let isNoshow = false
      if (item.noshow) {
        item.noshow.map(rs => {
          rs.isShow = typeof rs.val === 'string' ? (rs.val === 'isHasVal' ? (scope.row[rs.key] ? 'true' : 'false') : 'true') : (rs.val.includes(scope.row[rs.key]) ? 'false' : 'true')
        })
        isNoshow = item.noshow.every(key => {
          return key.isShow === 'true'
        })
      } else {
        isNoshow = true
      }
      return (!item.show || item.show.val.includes(scope.row[item.show.key])) && isNoshow && (item.resCode ? this.btnPremissions.includes(item.resCode) : true)
    },
    // 双击单元格复制提示
    cellDblclick (row, column, cell, event) {
      this.$copyText(row[column.property]).then(event => {
        // console.log('复制成功', event)
        this.$message.success('已复制')
        // eslint-disable-next-line handle-callback-err
      }, error => {
        this.$message.error('复制失败')
        // console.log('复制失败', error)
      })
    },
    // 控制表格字体颜色
    txtChangeColor (scope) {
      if (this.table.changeColor && scope.row[this.table.changeColor.key] === this.table.changeColor.val) {
        return this.table.changeColor.txtStyle
      } else {
        return ''
      }
    },
    // 当前页码
    handlesCurrentChange (val) {
      this.$emit('page-change', val)
    },
    isShow (name) {
      return Object.keys(this.$slots).includes(name)
    }
  }
}
</script>
<style lang="scss">
.t-table {
  z-index: 0;
  background-color: #fff;
  padding: 10px;
  // border-radius: 4px;
  .el-pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    // margin-right: 60px;
    margin-right: calc(2% - 20px);
    background-color: #fff;
  }
  .el-table__body-wrapper {
    cursor: pointer;
  }
  .el-table th,
  .el-table td {
    padding: 8px 0;
  }
  .el-table--border th:first-child .cell,
  .el-table--border td:first-child .cell {
    padding-left: 5px;
  }
  .el-table .cell {
    padding: 0 5px;
  }
  .el-table::before {
    // height: 0;
  }
  .el-table--group::after,
  .el-table--border::after {
    // width: 0;
  }
  .el-table--scrollable-y .el-table__fixed-right {
    right: 8px !important;
  }
  .toolbar_top {
    margin-bottom: 10px;
    display: flex;
    height: 32px;
    .toolbar {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
    .el-select {
      margin: 0 10px;
      width: 120px;
    }
  }
  .el-table--scrollable-y .el-table__body-wrapper {
    overflow-x: auto;
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      margin-top: 110px;
      width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
      // height: 1px;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #b3b3b3;
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      background: #ededed;
    }
  }
}
</style>
