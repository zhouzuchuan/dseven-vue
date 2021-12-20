<template>
  <DsLoadingWrapper v-bind="$attrs" :loading="loading">
    <slot
      :onRequest="handleRemoteRequeset"
      :loading="loading"
      :[dataKey]="data"
    />
  </DsLoadingWrapper>
</template>

<script>
import DsLoadingWrapper from '../LoadingWrapper'
export default {
  name: 'DsRequestWrapper',
  components: { DsLoadingWrapper },
  props: {
    /**
     * 请求函数
     * */
    serveRequest: {
      type: Function,
      default: undefined,
    },

    requestParams: {
      type: Object,
      default() {
        return {}
      },
    },

    /**
     * 默认data数据
     * */
    defaultData: {
      validator() {
        return true
      },
      default() {
        return []
      },
    },

    dataKey: {
      type: String,
      default: 'data',
    },

    requestSwitch: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      loading: false,
      data: JSON.parse(JSON.stringify(this.defaultData)),
    }
  },

  watch: {
    requestParams: {
      immediate: true,
      deep: true,
      handler: 'handleRemoteRequeset',
    },
  },

  methods: {
    handleRemoteRequeset() {
      // 开关没有开启则 返回
      if (!this.requestSwitch) return
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
