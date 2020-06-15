export default {
  methods: {
    dispatch (componentName, eventName, params) {
      let component = this.$parent
      let name = component.$options.componentName
      while (component && (!name || name !== componentName)) {
        component = component.$parent
        if (component) {
          name = component.$options.componentName
        }
      }
      if (component) {
        component.$emit.apply(component, [eventName].concat(params))
      }
    }
  }
}
