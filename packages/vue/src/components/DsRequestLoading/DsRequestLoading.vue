<template>
  <div v-bind="$attrs">
    <!--  
      @slot  默认vue插槽

       {
        onRequest: () => Promise<any>;
        loading: Boolean;
        [dataField]: any;
      } 
     -->
    <slot :onRequest="onRequest" :loading="loading" :[dataField]="data" />
  </div>
</template>

<script>
export default {
  name: 'DsRequestLoading',
  props: {
    /**
     * 请求函数
     * */
    serveRequest: {
      type: Function,
      default: undefined,
    },

    /**
     * 请求参数 参数变动会触发 serveRequest 请求
     * */
    requestParams: {
      type: Object,
      default() {
        return {}
      },
    },

    /**
     * 组件created 后加载
     * */
    immediate: {
      type: Boolean,
      default: true,
    },

    /**
     * 请求函数返回数据的 承载字段
     *
     * */
    dataField: {
      type: String,
      default: 'data',
    },

    /**
     * 默认data数据
     * */
    defaultData: {
      validator: () => true,
      default: undefined,
    },

    /**
     * 默认 状态
     * */
    defaultLoading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      loading: this.defaultLoading,
      data: JSON.parse(JSON.stringify(this.defaultData)),
    }
  },

  watch: {
    requestParams: {
      deep: true,
      handler: 'onRequest',
    },
  },

  created() {
    if (this.immediate) {
      this.onRequest()
    }
  },

  methods: {
    onRequest() {
      this.loading = true
      const requestFn = this.serveRequest?.(this.requestParams)
      if (typeof requestFn?.then === 'function') {
        requestFn
          .then((data) => {
            if (data) {
              this.data = data
            }
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        this.loading = false
      }
    },
  },
}
</script>
