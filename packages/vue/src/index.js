import LoadingWrapper from './components/LoadingWrapper'
import RequestLoading from './components/RequestLoading'

const components = [LoadingWrapper, RequestLoading]

const install = function (Vue, opts = {}) {
  components.forEach((component) => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  LoadingWrapper,
  RequestLoading,
}
