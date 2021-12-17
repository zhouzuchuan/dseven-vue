<template>
  <div
    class="ds-loading-wrapper"
    :style="{ minHeight: height + (typeof height === 'number' ? 'px' : '') }"
  >
    <div v-if="loading" class="ds-loading-wrapper_loading">
      <div>
        <slot name="loading">{{ loadingText }}</slot>
      </div>
    </div>
    <template v-if="type === 'mask'">
      <slot />
    </template>
    <template v-else>
      <slot v-if="!loading" />
    </template>
  </div>
</template>

<script>
export default {
  name: 'DsLoadingWrapper',
  props: {
    /**
     * 加载状态
     * */
    loading: {
      type: Boolean,
      default: false,
    },
    /**
     * 加载提示文字
     * */
    loadingText: {
      type: String,
      default: '加载中',
    },
    /**
     * 高度
     * */
    height: {
      type: [String, Number],
      default: 'auto',
    },
    /**
     * 展示类型
     * */
    type: {
      validator(c) {
        return ['mask', 'cover'].includes(c)
      },
      default: 'mask',
    },
  },
}
</script>

<style lang="scss" scoped>
.ds-loading-wrapper {
  position: relative;

  &_loading {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;

    &::after {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      content: '';
      background: rgba(255, 255, 255, 0.9);
    }
    & > :first-child {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 1;
      min-width: 100px;
      font-size: 12px;
      color: #999;
      text-align: center;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
