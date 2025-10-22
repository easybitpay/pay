<script setup>
// Vue
import { computed, ref, onMounted, onUnmounted } from 'vue'

// Router
import { useRoute, useRouter } from 'vue-router'

// Store
import { usePayStore } from '@/stores/pay'

// Hooks
import useIconImage from '@/composables/useIconImage'
import useRedirectPayment from '@/composables/useRedirectPayment'

// Components
import PayCountDown from '../../components/globals/PayCountDown.vue'

// Alert
import { appendAlert } from '@/assets/js/Alerts'

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'

// Import Swiper styles
import 'swiper/css'

import 'swiper/css/navigation'

// import required modules
import { Navigation } from 'swiper/modules'

const modules = [Navigation]

// Props
const props = defineProps({
  sandbox: {
    type: Boolean,
    default: false
  },
  isMobile: {
    type: Boolean
  }
})

const emit = defineEmits(['changeBG'])

// ----- START ----- //

// Generals
const store = usePayStore()
const route = useRoute()
const router = useRouter()
const { iconImage, storageImage } = useIconImage()
const { cancelPayment, cancelLoading, redirectPaymentStatus } = useRedirectPayment(props.sandbox)

// Refs
const loading = ref(true)
const interval = ref(null)
const assumePayment = ref('')
const fakePayLoading = ref(false)

// Computeds
const invoiceCode = computed(() => route.params.id)
const userInputs = computed(() => store.getUserInputs)
const selectedCoin = computed(() => store.getSelectedCoin)
const selectedNetwork = computed(() => store.getSelectedNetwork)
const paymentDetail = computed(() => store.getPaymentDetail)
const invoiceDetail = computed(() => store.getInvoiceDetail)
const paymentTransactions = computed(() => store.getPaymentTransactions)

const qrCode = computed(
  () =>
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${paymentDetail.value.walletAddress}`
)

const convertPricePerBase = computed(() => {
  const base_amount = +invoiceDetail.value.amount
  const must_pay_amount = +selectedCoin.value.amount

  return (base_amount / must_pay_amount).toFixed(2)
})

const filledPercent = computed(() => {
  const paid = +invoiceDetail.value.paid
  const mustPaid = +invoiceDetail.value.amount

  return ((paid * 100) / mustPaid).toFixed(0)
})

const convertFillToColor = computed(() => {
  if (filledPercent.value < 30) return 'danger'
  if (filledPercent.value < 70) return 'warning'
  return 'success'
})

// Functions

const back = () => {
  router.push({
    name: props.sandbox ? 'select-coin-sandbox' : 'select-coin',
    params: { id: invoiceCode.value }
  })
}

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

/**
 * Fake Payment & Redirect
 */
const fakePayment = async (token_id) => {
  // start loading
  fakePayLoading.value = true

  // set variable
  const code = invoiceCode.value
  const amount = assumePayment.value || selectedNetwork.value.amount_remain

  // request
  await store.fakePayment({ code, token_id, amount }).then((res) => {
    if (res) {
      payment_check_status()
    }
  })

  // start loading
  fakePayLoading.value = false
}

/**
 * Get Payment Detail
 */
const get_payment_detail = async () => {
  const invoice_code = invoiceCode.value

  // return to select token page , if user not select token and come from link
  if (!selectedNetwork.value.token_id || !invoiceDetail.value.app) {
    router.push({ name: 'select-coin', params: { id: invoice_code } })
    return
  }

  const token_id = selectedNetwork.value.token_id
  const appType = invoiceDetail.value.app.type
  const { name, email, amount } = userInputs.value

  // start loading
  loading.value = true

  // set variable
  let content = {
    name: '',
    email: '',
    amount: ''
  }
  const incoiceID = appType == 1 ? invoice_code : invoice_code.split('a')[1]
  let params = new URLSearchParams()
  params.set('token_id', token_id)
  if (appType == 1) {
    if (name) {
      params.set('name', name)
    }
    if (email) {
      params.set('email', email)
    }
    if (amount) {
      params.set('amount', amount)
    }
  } else {
    if (name) {
      content.name = name
    }
    if (email) {
      content.email = email
    }
    if (amount) {
      content.amount = amount
    }
  }

  await store[`${appType == 1 ? 'getPaymentDetails' : 'getAppPaymentDetail'}`]({
    incoiceID,
    params,
    content
  }).then((res) => {
    if (res) {
      payment_check_status()

      interval.value = setInterval(() => {
        payment_check_status()
      }, 30000)
    } else {
      router.push({
        name: props.sandbox ? 'select-coin-sandbox' : 'select-coin',
        params: { id: invoice_code }
      })
    }
  })

  // stop loading
  loading.value = false
}

/**
 * Payment Check Status
 */
const payment_check_status = async () => {
  await store.paymentCheckStatus(invoiceCode.value).then((res) => {
    if (res.invoice_status) {
      clearInterval(interval.value)

      redirectPaymentStatus(res.invoice_status)
    } else {
      let prices = res.tokens_prices

      for (let i = 0; i < prices.length; i++) {
        const token = prices[i]
        if (selectedNetwork.value.token_id === token.token_id) {
          store.setSelectedNetwork({
            network: {
              ...token.token.network,
              token_id: token.token.id,
              symbol: token.token.symbol,
              price: token.price,
              amount: token.amount,
              amount_filled: token.amount_filled,
              amount_remain: token.amount_remain,
              payable: token.payable
            },
            invoiceID: invoiceCode.value
          })
        }
      }
    }
  })
}

const getWithoutLast = (address) => {
  let stringWithoutLast10 = address.substring(0, address.length - 10)
  return stringWithoutLast10
}

const getLastEight = (address) => {
  let last10Characters = address.substring(address.length - 10)
  return last10Characters
}

onMounted(() => {
  get_payment_detail()
})

onUnmounted(() => {
  clearInterval(interval.value)
})
</script>

<template>
  <!-- begin::Info -->
  <div class="auto-infos">
    <!-- begin::Item -->
    <div class="item" v-if="!isMobile">
      <p class="title">Status</p>
      <p :class="`value text-${convertFillToColor}`">{{ filledPercent }}%</p>
    </div>
    <!-- end::Item -->

    <!-- begin::Item -->
    <div class="item">
      <p class="title">Coin</p>
      <p class="value">{{ selectedCoin.symbol || 'not Selected' }}</p>
    </div>
    <!-- end::Item -->

    <!-- begin::Item -->
    <div class="item">
      <p class="title">Netrwok</p>
      <p class="value">
        {{ selectedNetwork.name ? `${selectedNetwork.name.toUpperCase()}` : 'not Selected' }}
      </p>
    </div>
    <!-- end::Item -->

    <!-- begin::Item -->
    <div class="item">
      <p class="title">Expiration Time</p>
      <p class="value">
        <PayCountDown
          :key="paymentDetail.remain_time"
          :remain_time="paymentDetail.remain_time"
          @expired="redirectPaymentStatus(1)"
        />
      </p>
    </div>
    <!-- end::Item -->
  </div>
  <!-- end::Info -->

  <!-- begin::Spacer -->
  <div class="border-bottom border-gray-400 w-100 mt-4 mb-10"></div>
  <!-- end::Spacer -->

  <!-- begin::Qr Code -->
  <div class="d-flex flex-column flex-md-row align-items-center gap-4">
    <div v-if="loading">
      <Skeletor size="140px" />
    </div>
    <img :src="qrCode" alt="qr-code" width="140" v-else />

    <div class="gatway-inputs-width">
      <!-- begin::Coin & Price -->
      <div class="form-control d-flex align-items-center gap-2 ps-2 mb-4">
        <img
          :src="iconImage(selectedCoin.symbol)"
          :alt="selectedCoin.symbol"
          class="small-coin-icon"
        />
        {{ selectedNetwork.amount_remain }} {{ selectedCoin.symbol }}
      </div>
      <!-- end::Coin & Price -->

      <!-- begin::Address -->
      <div
        class="w-100 position-relative d-flex align-items-center mb-4"
        @click="copy(paymentDetail.walletAddress)"
      >
        <Skeletor width="100%" height="40px" class="rounded" v-if="loading" />

        <template v-else>
          <div class="form-control px-9 cursor-pointer d-flex align-items-center">
            <span class="ellipsis">{{ getWithoutLast(paymentDetail.walletAddress) }}</span>
            <span>{{ getLastEight(paymentDetail.walletAddress) }}</span>
          </div>

          <!-- begin::Icon -->
          <inline-svg
            src="media/icons/icons/wireless.svg"
            class="position-absolute start-8px svg-icon-primary"
          ></inline-svg>
          <!-- end::Icon -->

          <!-- begin::Icon -->
          <inline-svg
            src="media/icons/icons/copy.svg"
            class="position-absolute end-8px svg-icon-gray-500 cursor-pointer"
          ></inline-svg>
          <!-- end::Icon -->
        </template>
      </div>
      <!-- end::Address -->

      <!-- begin::Assume Payment -->
      <div class="w-100 position-relative d-flex align-items-center" v-if="sandbox">
        <Skeletor width="100%" height="40px" class="rounded" v-if="loading" />

        <template v-else>
          <input
            type="text"
            class="form-control ps-9"
            v-model="assumePayment"
            placeholder="Assume payment"
          />

          <!-- begin::Icon -->
          <img
            :src="iconImage(selectedCoin.symbol)"
            :alt="selectedCoin.symbol"
            class="small-coin-icon position-absolute start-8px"
          />
          <!-- end::Icon -->
        </template>
      </div>
      <!-- end::Assume Payment -->
    </div>
  </div>
  <!-- end::Qr Code -->

  <div class="text-center pt-4">
    Waiting for payment
    <span class="spinner-border spinner-border-sm" role="status"></span>
  </div>

  <template v-if="paymentTransactions.length">
    <!-- begin::Spacer -->
    <div class="border-bottom border-gray-400 w-100 mt-10 mb-4"></div>
    <!-- end::Spacer -->

    <!-- begin::Info -->
    <div class="auto-infos payment-transactions custom-scroll overflow-auto mh-200px">
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
  </template>

  <!-- begin::Action -->
  <div class="d-flex flex-column gap-4 mt-5">
    <!-- begin::Fake Payment -->
    <button
      v-if="sandbox"
      type="button"
      :disabled="fakePayLoading"
      @click="fakePayment(selectedNetwork.token_id)"
      class="btn btn-primary w-100"
    >
      {{
        fakePayLoading
          ? 'Loading...'
          : `Assume ${assumePayment || selectedNetwork.amount_remain} ${
              selectedCoin.symbol
            } is paid`
      }}
    </button>
    <!-- end::Fake Payment -->

    <div class="d-flex flex-wrap gap-4">
      <button type="button" @click="back" class="btn border-0 bg-gray-200 p-0 w-40px h-40px">
        <inline-svg src="media/icons/icons/arrow-left.svg" class="svg-icon-primary"></inline-svg>
      </button>

      <button
        type="button"
        :disabled="cancelLoading"
        @click="cancelPayment"
        class="btn btn-danger flex-grow-1 text-white"
      >
        {{ cancelLoading ? 'Loading...' : 'Cancel' }}
      </button>
    </div>
  </div>
  <!-- end::Action -->
</template>
