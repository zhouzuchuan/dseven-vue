<template>
  <div class="ds-v-pagination d-flex align-center justify-center">
    <div class="ds-v-pagination_total">共{{ total }}条</div>

    <div class="ds-v-pagination_step">
      <v-pagination
        v-model="pageNo"
        :length="pageCount"
        v-bind="$attrs"
        :total="total"
        v-on="$listeners"
      />
    </div>

    <div class="ds-v-pagination_jump d-flex align-center">
      前往
      <v-text-field
        :key="count"
        :value="pageNo"
        outlined
        dense
        hide-details
        @blur="handleJump"
      />
      页
    </div>

    <div class="ds-v-pagination_page">
      <v-select
        v-model="pageSize"
        dense
        :items="sizeOptions"
        item-text="label"
        item-value="value"
        outlined
        hide-details
        attach
        @change="handleChangeSizeSelect"
      />
    </div>

    <!-- <div>
      <v-select
        v-model="pageSize"
        style="max-width: 100px"
        dense
        :items="sizeOptions"
        item-text="label"
        item-value="value"
        outlined
        hide-details
        attach
        @change="handleChangeSizeSelect"
      />
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'DsVPagination',

  props: {
    /** 当前页码 */
    value: {
      type: Number,
      default: 1,
    },

    /** 页面展示的数量 支持 .sync 修饰符 **/
    size: {
      type: Number,
      default: 20,
    },

    /** 每页显示数量 选择器的选项设置 **/
    sizes: {
      type: Array,
      default: () => [10, 20, 30, 50, 100],
    },

    /** 总条目数 **/
    total: {
      type: Number,
      default: 10,
    },
  },

  data() {
    return {
      pageNo: this.value,
      pageSize: this.size,

      count: 0,
    }
  },

  computed: {
    pageCount() {
      return Math.ceil(this.total / this.pageSize) || 1
    },

    sizeOptions() {
      return this.sizes.map((v) => ({
        label: `${v}`,
        value: v,
      }))
    },
  },

  watch: {
    value: {
      immediate: true,
      handler(nv) {
        this.pageNo = nv
      },
    },
    size: {
      immediate: true,
      handler(nv) {
        this.pageSize = nv
      },
    },
    pageNo(v) {
      /**
       * 被绑定模型的更新（页码）
       * @type {Event}
       */
      this.$emit('input', v)
      /**
       * 修改当前页码 触发
       * @type {Event}
       */
      this.$emit('page-change', v)
    },
    pageSize(v) {
      /**
       * 更新绑定的页面数量
       * @type {Event}
       */
      this.$emit('update:size', v)
      /**
       * 需改页面数量 触发
       * @type {Event}
       */
      this.$emit('size-change', v)

      /**
       * 被绑定模型的更新（页码）
       * @type {Event}
       */
      this.$emit('input', 1)
      /**
       * 修改当前页码 触发
       * @type {Event}
       */
      this.$emit('page-change', 1)
    },
  },

  methods: {
    handleChangeSizeSelect(value) {
      this.pageSize = value
    },

    handleJump(event) {
      const newValue = +event.target.value.replace(/[^\d-]/g, '') || 0
      this.pageNo = Math.min(
        Math.max(1, newValue),
        Math.ceil(this.total / this.pageSize)
      )
      this.count++
    },
  },
}
</script>

<style lang="scss">
.ds-v-pagination {
  &_step {
    margin-left: 8px;
  }
  &_jump {
    margin-left: 8px;
    .v-input {
      margin: 0 8px;
      width: 60px;
    }
  }
  &_page {
    margin-left: 8px;
    width: 100px;
  }
}
</style>
