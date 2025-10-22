<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  remain_time: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['expired'])

const interval = ref(null)
const timer = ref(0)

const minAndSec = (value) => {
  var minutes = Math.floor(parseInt(value, 10) / 60)
  var seconds = parseInt(value, 10) - minutes * 60
  return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
}

onMounted(() => {
  if (props.remain_time) {
    if (props.remain_time > 0) {
      timer.value = props.remain_time
      interval.value = setInterval(() => {
        timer.value -= 1

        if (timer.value == 0) {
          clearInterval(interval.value)
          emit('expired')
        }
      }, 1000)
    } else {
      emit('expired')
    }
  }
})
</script>

<template>
  <span>
    {{ minAndSec(timer) }}
  </span>
</template>
