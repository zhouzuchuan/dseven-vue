import * as components from './components'

const install = function (Vue, opts = {}) {
  ;(function registerComponents(components) {
    if (components) {
      for (const key in components) {
        const component = components[key]
        if (component && !registerComponents(component.$_ds_subcomponents)) {
          Vue.component(key, component)
        }
      }
      return true
    }
    return false
  })(components)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
}
