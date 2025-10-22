<script setup>
// Vue
import { ref, computed, onMounted } from 'vue'

// Router
import { useRoute, useRouter } from 'vue-router'

// Store
import { usePayStore } from '@/stores/pay'

// Hooks
import useForm from '@/composables/useForm.js'
import useIconImage from '@/composables/useIconImage'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required, email } from '@vuelidate/validators'

// Components
import SelectDropdown from '../../components/globals/SelectDropdown.vue'

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
const { showFeedBacks } = useForm()
const { iconImage, storageImage } = useIconImage()

// Refs
const step = ref(2)
const showStepOne = ref(false)
const selectedCoin = ref({})
const selectedNetwork = ref({})

const loading = ref(false)

const tokens = ref([])
const networks = ref([])

// Computeds
const invoiceParam = computed(() => route.params.id)
const invoiceCode = computed(() => store.getInvoiceCode)
const invoiceDetail = computed(() => store.getInvoiceDetail)
const userInputs = computed(() => store.getUserInputs)
const paymentTransactions = computed(() => store.getPaymentTransactions)
const customerInfo = computed(() => invoiceDetail.value.customer_info || {})
const payLoading = computed(() => store.payLoading)

const paidAmount = computed(() => {
  const initialValue = 0

  if (!paymentTransactions.value.length) return initialValue

  const sum = paymentTransactions.value.reduce(function (accumulator, curValue) {
    return accumulator + +curValue.amount
  }, initialValue)

  return sum
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

// Vuelidate
const form = ref({
  name: null,
  email: null,
  amount: null,
  token: null,
  network: null
})

const generalRules = {
  token: {
    required: helpers.withMessage('Token is required', required)
  },
  network: {
    required: helpers.withMessage('Network is required', required)
  }
}

const amountRules = {
  amount: {
    required: helpers.withMessage('Amount is required', required)
  }
}

const nameRules = {
  name: {
    required: helpers.withMessage('Name is required', required)
  }
}

const emailRules = {
  email: {
    email: helpers.withMessage("Email isn't valid", email),
    required: helpers.withMessage('Email is required', required)
  }
}

const vGeneral$ = useVuelidate(generalRules, form)
const vAmount$ = useVuelidate(amountRules, form)
const vName$ = useVuelidate(nameRules, form)
const vEmail$ = useVuelidate(emailRules, form)

// Functions

const checkForShowStepOne = () => {
  if (invoiceDetail.value.invoice_items) {
    showStepOne.value = true
    step.value = 1
  }
}

const fillUserDetail = () => {
  const { name, email, amount } = userInputs.value

  form.value.name = name || ''
  form.value.email = email || ''
  form.value.amount = amount || ''
}

/**
 * Toggle Base Coin
 * @param {token} token
 */
const toggleToken = (token) => {
  selectedCoin.value = token
  form.value.token = token.symbol

  store.setSelectedCoin({
    coin: {
      symbol: token.symbol,
      name: token.name
    },
    invoiceID: invoiceCode.value
  })

  toggleNetwork(token.networks[0])
}

/**
 * Toggle Network
 * @param {network} network
 */
const toggleNetwork = (network) => {
  selectedNetwork.value = network
  form.value.network = network.token_id

  store.setSelectedNetwork({
    network: network,
    invoiceID: invoiceCode.value
  })
}

/**
 * Get Invoice Detail
 */
const getInvoiceDetail = async () => {
  store.setInvoiceCode(invoiceParam.value)

  // Start Loading
  loading.value = true

  // Request
  await store.getPaymentInfo(invoiceCode.value).then((res) => {
    if (res) {
      checkForShowStepOne()

      let tokensArray = []
      let networksArray = []

      for (let i = 0; i < res.length; i++) {
        const token = res[i]

        let tokenPushedBefore = false
        let networkPushedBefore = false

        // check network pushed before or not
        for (let n = 0; n < networksArray.length; n++) {
          const network = networksArray[n]
          if (token.token.network.name === network.name) {
            networkPushedBefore = true
          }
        }

        // check token pushed before or not
        for (let t = 0; t < tokensArray.length; t++) {
          const element = tokensArray[t]
          if (token.token.name === element.name) {
            tokenPushedBefore = true
          }
        }

        if (!networkPushedBefore) {
          networksArray.push({
            ...token.token.network,
            symbol: token.token.symbol
          })
        }

        if (!tokenPushedBefore) {
          tokensArray.push({
            name: token.token.name,
            symbol: token.token.symbol,
            logo: token.token.logo,
            networks: [
              {
                ...token.token.network,
                token_id: token.token.id,
                symbol: token.token.symbol,
                price: token.price,
                amount: token.amount,
                amount_filled: token.amount_filled,
                amount_remain: token.amount_remain,
                payable: token.payable
              }
            ]
          })
        } else {
          for (let t = 0; t < tokensArray.length; t++) {
            const element = tokensArray[t]
            if (token.token.name === element.name) {
              element.networks.push({
                ...token.token.network,
                token_id: token.token.id,
                price: token.price,
                amount: token.amount,
                amount_filled: token.amount_filled,
                amount_remain: token.amount_remain,
                payable: token.payable
              })
            }
          }
        }
      }

      tokens.value = tokensArray
      networks.value = networksArray

      if (tokens.value.length === 1 && tokens.value[0].networks.length === 1) {
        toggleToken(tokens.value[0])
        toggleNetwork(tokens.value[0].networks[0])

        if (!showStepOne.value) {
          checkForm()
        }
      }
    }
  })

  // stop loading
  loading.value = false
}

/**
 * Ge To Gateway Page
 */
const checkForm = async () => {
  const generalResult = await vGeneral$.value.$validate()
  let amountResult = true
  let nameResult = true
  let emailResult = true

  if (invoiceDetail.value.app.type == 3) {
    const { need_email, need_name } = invoiceDetail.value.app?.settings

    amountResult = await vAmount$.value.$validate()

    if (need_email === 'true') {
      emailResult = await vEmail$.value.$validate()
    }

    if (need_name === 'true') {
      nameResult = await vName$.value.$validate()
    }
  }

  if (generalResult && amountResult && nameResult && emailResult) {
    router.push({
      name: props.sandbox ? 'gateway-sandbox' : 'gateway',
      params: { id: invoiceCode.value }
    })
  } else {
    emit('changeBG')
    showFeedBacks()
  }
}

onMounted(() => {
  fillUserDetail()
  getInvoiceDetail()
})
</script>

<template>
  <template v-if="customerInfo.name || customerInfo.email">
    <!-- begin::Info -->
    <div class="auto-infos">
      <!-- begin::Item -->
      <div class="item">
        <p class="title">Name</p>
        <p class="value">{{ invoiceDetail.customer_info.name || '-' }}</p>
      </div>
      <!-- end::Item -->

      <!-- begin::Item -->
      <div class="item">
        <p class="title">Email</p>
        <p class="value">{{ invoiceDetail.customer_info.email || '-' }}</p>
      </div>
      <!-- end::Item -->
    </div>
    <!-- end::Info -->

    <!-- begin::Spacer -->
    <div class="border-bottom border-gray-400 w-100 my-4"></div>
    <!-- end::Spacer -->
  </template>

  <template v-if="invoiceDetail?.customer_info?.description">
    <p class="text-gray-800">
      {{ invoiceDetail.customer_info.description }}
    </p>

    <!-- begin::Spacer -->
    <div class="border-bottom border-gray-400 w-100 my-4"></div>
    <!-- end::Spacer -->
  </template>

  <form @submit.prevent="checkForm">
    <!-- begin::Step 1 - Show Preview -->
    <template v-if="step === 1">
      <template v-if="invoiceDetail.invoice_items">
        <!-- begin::Amount Detail Info -->
        <div class="table-responsive">
          <table class="table amount-table">
            <thead>
              <tr>
                <th class="min-w-20px w-20px"></th>
                <th></th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, index) in invoiceDetail.invoice_items" :key="index" class="fs-7">
                <td>
                  {{ index + 1 < 10 ? `0${index + 1}` : index + 1 }}
                </td>
                <td>
                  <div class="max-content">{{ item.title }}</div>
                </td>
                <td class="text-end">
                  <div class="max-content">{{ item.value }} {{ invoiceDetail.base_token }}</div>
                </td>
              </tr>

              <tr class="fs-7">
                <td class="pb-0 pt-3"></td>
                <td class="pb-0 pt-3">
                  <div class="max-content text-primary fw-medium">Total</div>
                </td>
                <td class="text-end pb-0 pt-3">
                  <div class="max-content text-primary fw-medium">
                    {{ invoiceDetail.amount }} {{ invoiceDetail.base_token }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- end::Amount Detail Info -->

        <!-- begin::Spacer -->
        <div class="border-bottom border-gray-400 w-100 my-4"></div>
        <!-- end::Spacer -->
      </template>

      <!-- begin::Info -->
      <div class="auto-infos">
        <!-- begin::Item -->
        <div class="item">
          <p class="title">Base Token</p>
          <div class="value" v-if="invoiceDetail.base_token">
            <div class="d-flex gap-2">
              <img
                :src="iconImage(invoiceDetail.base_token)"
                :alt="invoiceDetail.base_token"
                class="small-coin-icon"
              />
            </div>
          </div>
        </div>
        <!-- end::Item -->

        <!-- begin::Item -->
        <div class="item">
          <p class="title">Available Tokens</p>
          <div class="value" v-if="tokens.length">
            <div class="d-flex gap-2">
              <img
                v-for="(item, index) in tokens"
                :key="index"
                :src="item.logo ? storageImage(item.logo, 32) : iconImage(item.symbol)"
                :alt="item.symbol"
                class="small-coin-icon"
              />
            </div>
          </div>
        </div>
        <!-- end::Item -->
      </div>
      <!-- end::Info -->

      <!-- begin::Action -->
      <div class="d-flex flex-wrap gap-4 mt-28">
        <button type="button" class="btn border-0 bg-gray-200 p-0 w-40px h-40px">
          <inline-svg
            :src="`/media/icons/shapes/${$filters.shapeStatus('language')}.svg`"
            width="18.5"
            height="20"
          ></inline-svg>
        </button>
        <button type="button" @click="step = 2" class="btn btn-primary flex-grow-1">Pay</button>
      </div>

      <!-- end::Action -->
    </template>
    <!-- end::Step 1 - Show Preview -->

    <!-- begin::Step 2 - Get Info -->
    <template v-else>
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
          <p class="title">Amount</p>
          <p class="value">
            {{ selectedNetwork.amount_remain ? selectedNetwork.amount_remain : '-' }}
          </p>
        </div>
        <!-- end::Item -->

        <!-- begin::Item -->
        <div class="item">
          <p class="title">Coin</p>
          <p class="value">{{ selectedCoin.symbol || '-' }}</p>
        </div>
        <!-- end::Item -->

        <!-- begin::Item -->
        <div class="item">
          <p class="title">Netrwok</p>
          <p class="value">
            {{ selectedNetwork.name ? `${selectedNetwork.name.toUpperCase()}` : '-' }}
          </p>
        </div>
        <!-- end::Item -->
      </div>
      <!-- end::Info -->

      <!-- begin::Spacer -->
      <div class="border-bottom border-gray-400 w-100 mt-4 mb-10"></div>
      <!-- end::Spacer -->

      <template v-if="invoiceDetail?.app?.type == 3">
        <!-- begin::Amount -->
        <div class="w-100 position-relative d-flex align-items-center mb-4">
          <input
            type="number"
            min="0.01"
            step="0.01"
            class="form-control ps-9 placeholder-gray-600"
            placeholder="Invoice Total amount"
            v-model="form.amount"
          />

          <div class="invalid-feedback form-control" v-if="vAmount$.amount.$errors.length">
            <span> {{ vAmount$.amount.$errors[0].$message }}</span>
          </div>

          <!-- begin::Icon -->
          <inline-svg
            src="media/icons/icons/crypto.svg"
            class="position-absolute start-8px svg-icon-primary"
          ></inline-svg>
          <!-- end::Icon -->
        </div>
        <!-- end::Amount -->

        <!-- begin::Name -->
        <div class="w-100 position-relative d-flex align-items-center mb-4">
          <input
            type="text"
            class="form-control ps-9 placeholder-gray-600"
            placeholder="Your Name"
            v-model="form.name"
          />

          <div class="invalid-feedback form-control" v-if="vName$.name.$errors.length">
            <span> {{ vName$.name.$errors[0].$message }}</span>
          </div>

          <!-- begin::Icon -->
          <inline-svg
            src="media/icons/icons/mail.svg"
            class="position-absolute start-8px svg-icon-primary"
          ></inline-svg>
          <!-- end::Icon -->
        </div>
        <!-- end::Name -->

        <!-- begin::Email -->
        <div class="w-100 position-relative d-flex align-items-center mb-4">
          <input
            type="email"
            class="form-control ps-9 placeholder-gray-600"
            placeholder="Your Email"
            v-model="form.email"
          />

          <div class="invalid-feedback form-control" v-if="vEmail$.email.$errors.length">
            <span> {{ vEmail$.email.$errors[0].$message }}</span>
          </div>

          <!-- begin::Icon -->
          <inline-svg
            src="media/icons/icons/mail.svg"
            class="position-absolute start-8px svg-icon-primary"
          ></inline-svg>
          <!-- end::Icon -->
        </div>
        <!-- end::Email -->
      </template>

      <!-- begin::Base Coin -->
      <div class="w-100 position-relative d-flex align-items-center mb-4">
        <Skeletor
          width="100%"
          height="40px"
          class="rounded"
          v-if="payLoading && !invoiceDetail.base_token"
        />

        <template v-else>
          <SelectDropdown
            placeholder="Select Coin"
            show="name"
            check="name"
            showImage
            toggleClass="px-2"
            svgIcon="media/icons/icons/crypto.svg"
            svgIconColor="primary"
            :items="tokens"
            :selected="selectedCoin"
            @change="toggleToken"
          />

          <div class="invalid-feedback form-control" v-if="vGeneral$.token.$errors.length">
            <span> {{ vGeneral$.token.$errors[0].$message }}</span>
          </div>
        </template>
      </div>
      <!-- end::Base Coin -->

      <!-- begin::Network -->
      <div class="w-100 position-relative d-flex align-items-center mb-10">
        <Skeletor
          width="100%"
          height="40px"
          class="rounded"
          v-if="payLoading && !invoiceDetail.base_token"
        />

        <template v-else>
          <SelectDropdown
            :disabled="!selectedCoin.networks"
            placeholder="Select Network"
            show="name"
            showImage
            showImageKey="nick_name"
            toggleClass="px-2"
            svgIcon="media/icons/icons/crypto.svg"
            svgIconColor="primary"
            :items="selectedCoin.networks || []"
            :selected="selectedNetwork"
            @change="toggleNetwork"
          />

          <div class="invalid-feedback form-control" v-if="vGeneral$.network.$errors.length">
            <span> {{ vGeneral$.network.$errors[0].$message }}</span>
          </div>
        </template>
      </div>
      <!-- end::Network -->

      <!-- begin::Action -->
      <div class="d-flex flex-wrap gap-4 mt-28">
        <button
          v-if="showStepOne"
          type="button"
          @click="step = 1"
          class="btn border-0 bg-gray-200 p-0 w-40px h-40px"
        >
          <inline-svg src="media/icons/icons/arrow-left.svg" class="svg-icon-primary"></inline-svg>
        </button>

        <button
          type="submit"
          :disabled="payLoading && !invoiceDetail.base_token"
          class="btn btn-primary flex-grow-1"
        >
          Pay
        </button>
      </div>
      <!-- end::Action -->
    </template>
    <!-- end::Step 2 - Get Info -->
  </form>
</template>
