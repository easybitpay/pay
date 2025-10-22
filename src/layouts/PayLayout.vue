<script setup>
// Vue
import { computed, onBeforeUnmount, onBeforeMount, ref, onMounted } from 'vue'

// Hooks
import useIconImage from '@/composables/useIconImage'

// Store
import { usePayStore } from '@/stores/pay'

// Components
import GatewayInfo from '../components/pay/GatewayInfo.vue'

// Props
const props = defineProps({
  sandbox: {
    type: Boolean,
    default: false
  }
})

const sandbox = JSON.parse(localStorage.getItem('sandbox') || 'false')
if (sandbox || props.sandbox) {
  document.body.classList.add('sandbox')
  localStorage.setItem('sandbox', true)
}

// ----- START ----- //

// Generals
const store = usePayStore()
const { storageImage } = useIconImage()

// Refs
const isMobile = ref(false)
const errorStatus = ref(false)
const timeout = ref(null)

// Computeds
const paymentThemeID = computed(() => store.getPaymentThemeID)
const invoiceDetail = computed(() => store.getInvoiceDetail)

// Functions
const changeBG = () => {
  clearTimeout(timeout)

  errorStatus.value = true

  timeout.value = setTimeout(() => {
    errorStatus.value = false
  }, 5000)
}

onMounted(() => {
  const checkIsMobile = () => {
    isMobile.value = window.matchMedia('(max-width: 768px)').matches
  }

  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
})

onBeforeUnmount(() => {
  localStorage.removeItem('sandbox')
  payStore.refreshPayStore()
})

onBeforeMount(() => {
  localStorage.removeItem('paymentThemeID')
  localStorage.removeItem('sandbox')
})
</script>

<template>
  <div :class="`pay-layout type-${paymentThemeID}`">
    <!-- begin::Main Box -->
    <div class="d-flex flex-column flex-root z-2 overflow-auto">
      <div class="d-flex flex-column flex-root justify-content-center">
        <!-- begin::Container -->
        <div class="container d-flex flex-column align-items-center pb-8 pt-8">
          <!-- begin::Card -->
          <div class="card mw-624px w-100">
            <div class="card-body">
              <GatewayInfo />

              <RouterView :isMobile="isMobile" @changeBG="changeBG" />

              <ul class="list-unstyled d-flex align-items-center flex-wrap column-gap-8 row-gap-4 mt-8 mb-0">
                <li>
                  <a
                    href="https://easybitpay.com/downloads/easybitpay.apk"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="d-flex align-items-center gap-2"
                  >
                    <inline-svg src="media/icons/icons/phone.svg"></inline-svg>
                    Download App
                  </a>
                </li>

                <li>
                  <a
                    href="https://users.easybitpay.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="d-flex align-items-center gap-2"
                  >
                    <inline-svg src="media/icons/icons/home.svg"></inline-svg>
                    User Panel
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <!-- end::Card -->
        </div>
        <!-- end::Container -->
      </div>

      <!-- begin::Copyright -->
      <div class="container d-flex justify-content-center">
        <div class="mw-624px w-100">
          <small class="text-white neue-machina fw-light d-block mb-4">
            Do not withdraw directty to a crowdfund od ICO address, os your account will niot be
            credited with tokens from such sales.
          </small>
        </div>
      </div>
      <!-- end::Copyright -->
    </div>
    <!-- end::Main Box -->

    <!-- begin::Backgroun Image -->
    <div
      :class="[{ 'payment-bg': true }, { error: errorStatus }]"
      :style="`background-image: url(${
        paymentThemeID == 1
          ? 'media/images/banner/auth-bg.jpg'
          : storageImage(invoiceDetail?.app?.banner)
      })`"
    ></div>
    <!-- end::Backgroun Image -->
  </div>
</template>
