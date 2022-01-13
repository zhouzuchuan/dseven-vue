<template>
  <div
    class="ds-loading-wrapper"
    :style="{
      minHeight: height + (typeof height === 'number' ? 'px' : ''),
      '--ds-loading-mask-color': backgroundColor,
    }"
  >
    <div v-if="loading" class="ds-loading-wrapper_state">
      <slot name="loading">{{ loadingText }}</slot>
    </div>
    <template v-if="mask">
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
      default: 'loading...',
    },

    /**
     * 高度
     * */
    height: {
      type: [String, Number],
      default: 'auto',
    },

    /**
     * mask 为 true 才生效 默认为 '#fff'
     * */
    backgroundColor: {
      type: String,
      default: '#fff',
    },

    /**
     *  是否是展示遮罩 默认为 true
     * */
    mask: {
      type: Boolean,
      default: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.ds-loading-wrapper {
  position: relative;
  z-index: 0;

  --ds-loading-mask-color: #fff;

  &_state {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;

    &::after {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      content: '';
      background: var(--ds-loading-mask-color);
      opacity: 0.8;
      z-index: -1;
    }
  }
}
</style>
