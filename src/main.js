const sandbox = JSON.parse(localStorage.getItem('sandbox') || 'false')
if (sandbox) {
  document.body.classList.add('sandbox')
}

import './assets/sass/styles.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'bootstrap'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.config.globalProperties.$filters = {
  // To Locale String Filter
  toLocaleString(value) {
    if (!value) return '0'
    value = +value
    return value.toLocaleString()
  },

  capitalize(value) {
    if (!value) return ''
    value = value.toString().toLowerCase()
    return value.charAt(0).toUpperCase() + value.slice(1)
  },

  shortenAddress(address, startChars = 4, endChars = 4) {
    const length = address.length
    return `${address.substring(0, startChars)}...${address.substring(length - endChars)}`
  },

  shortenText(text, size = 10) {
    if (text.length > size) {
      return text.slice(0, size) + '.'
    } else {
      return text
    }
  },

  shapeStatus(icon, status = 'active') {
    if (status === 'active') {
      let sandbox = JSON.parse(localStorage.getItem('sandbox') || 'false')

      if (sandbox) {
        return `${icon}_yellow`
      } else {
        return `${icon}_blue`
      }
    } else {
      return `${icon}_${status}`
    }
  }
}

import InlineSvg from 'vue-inline-svg'
app.component('inline-svg', InlineSvg)

import 'vue-skeletor/dist/vue-skeletor.css'
import { Skeletor } from 'vue-skeletor'
app.component('Skeletor', Skeletor)

app.mount('#app')
