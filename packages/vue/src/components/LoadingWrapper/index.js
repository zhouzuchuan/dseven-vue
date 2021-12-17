import Component from './index'

Component.install = function (Vue) {
  Vue.component(Component.name, Component)
}

export default Component
