<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Router
import { useRoute } from 'vue-router'

// Store
import { usePayStore } from '@/stores/pay'

// Hooks
import useRedirectPayment from '@/composables/useRedirectPayment'

// Alert
import { appendAlert } from '@/assets/js/Alerts'

// Props
const props = defineProps({

  isMobile: {
    type: Boolean
  }
})

const emit = defineEmits(['changeBG'])

// ----- START ----- //

// Generals
const store = usePayStore()
const route = useRoute()
const { redirect, convertCodeToStatus, convertCodeToColor } = useRedirectPayment()

// Refs
const leftTime = ref(0)
const interval = ref(null)

// Computeds
const query = computed(() => route.query)
const paymentTransactions = computed(() => store.getPaymentTransactions)

// Functions

/**
 * Copy
 */
const copy = (text) => {
  navigator.clipboard.writeText(text)
  appendAlert('Copied to clipboard', {
    color: 'success',
    type: 'alert'
  })
}

const minAndSec = (value) => {
  var minutes = Math.floor(parseInt(value, 10) / 60)
  var seconds = parseInt(value, 10) - minutes * 60
  return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
}

const startTimer = () => {
  if (leftTime.value === 0) {
    leftTime.value = 20

    interval.value = setInterval(() => {
      leftTime.value -= 1

      if (leftTime.value == 0) {
        goHome()
      }
    }, 1000)
  }
}

const goHome = () => {
  clearInterval(interval.value)
  redirect(query.value.code)
}

onMounted(() => {
  startTimer()
})
</script>

<template>
  <!-- begin::Info -->
  <div class="auto-infos">
    <!-- begin::Item -->
    <div class="item">
      <p class="title">Status</p>
      <p :class="`value text-${convertCodeToColor(query.code)}`">
        {{ convertCodeToStatus(query.code) }}
      </p>
    </div>
    <!-- end::Item -->

    <!-- begin::Item -->
    <div class="item" v-if="!isMobile">
      <p class="title">Transaction Count</p>
      <p class="value">{{ paymentTransactions.length }}</p>
    </div>
    <!-- end::Item -->

    <!-- begin::Item -->
    <div class="item">
      <p class="title">Time</p>
      <p class="value">23.07.20 | 07:28</p>
    </div>
    <!-- end::Item -->
  </div>
  <!-- end::Info -->

  <!-- begin::Spacer -->
  <div class="border-bottom border-gray-400 w-100 mt-4 mb-10"></div>
  <!-- end::Spacer -->

  <!-- begin::Info -->
  <div class="auto-infos payment-transactions">
    <div class="item" v-for="(item, index) in paymentTransactions" :key="index">
      <p class="title d-flex align-items-center gap-2">
        TaxID
        <span class="d-flex align-items-center h-24px bg-primary text-white px-2 rounded fs-8">
          {{ item.amount }} {{ item?.token?.tokenInfo?.symbol }} ({{
            item?.token?.tokenInfo?.network?.name
          }})
        </span>
      </p>
      <a
        :href="`${item?.token?.tokenInfo?.network?.explorer_address?.hash}${item.hash}`"
        target="_blank"
        rel="noopener noreferrer"
        class="value text-break fs-8 text-hover-primary"
      >
        {{ item.hash }}
      </a>
    </div>
  </div>
  <!-- end::Info -->

  <!-- begin::Action -->
  <div class="d-flex flex-wrap gap-4 mt-5">
    <button type="button" class="btn border-0 bg-gray-200 p-0 w-40px h-40px">
      <inline-svg
        :src="`/media/icons/shapes/${$filters.shapeStatus('print')}.svg`"
        width="19"
        height="19"
      ></inline-svg>
    </button>
    <button type="button" @click="goHome()" class="btn btn-primary flex-grow-1">
      Go Home ({{ minAndSec(leftTime) }})
    </button>
  </div>
  <!-- end::Action -->
</template>
