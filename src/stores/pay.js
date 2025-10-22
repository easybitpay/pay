// Axios
import api from '@/core/services/api'

// Vue
import { ref, computed } from 'vue'

// Pinia
import { defineStore } from 'pinia'

// Alert
import { appendAlert } from '@/assets/js/Alerts'

// Store
export const usePayStore = defineStore('pay', () => {
  // ----- States -----
  const paymentThemeID = ref(1)
  const payLoading = ref(false)
  const invoiceCode = ref('')
  const invoiceDetail = ref(null)
  const paymentDetail = ref(null)
  const userInputs = ref(null)
  const selectedCoin = ref(null)
  const selectedNetwork = ref(null)
  const paymentTransactions = ref(null)

  // Computeds
  const getPaymentThemeID = computed(
    () => localStorage.getItem('paymentThemeID') || paymentThemeID.value
  )

  const getInvoiceCode = computed(() =>
    invoiceCode.value ? invoiceCode.value : localStorage.getItem('invoiceCode')
  )

  const getInvoiceDetail = computed(() =>
    invoiceDetail.value
      ? invoiceDetail.value
      : JSON.parse(localStorage.getItem(`invoiceDetail_${getInvoiceCode.value}`) || '{}')
  )

  const getPaymentDetail = computed(() =>
    paymentDetail.value
      ? paymentDetail.value
      : JSON.parse(localStorage.getItem(`paymentDetail_${getInvoiceCode.value}`) || '{}')
  )

  const getUserInputs = computed(() =>
    userInputs.value
      ? userInputs.value
      : JSON.parse(localStorage.getItem(`userInputs_${getInvoiceCode.value}`) || '{}')
  )

  const getSelectedCoin = computed(() =>
    selectedCoin.value
      ? selectedCoin.value
      : JSON.parse(localStorage.getItem(`selectedCoin_${getInvoiceCode.value}`) || '{}')
  )

  const getSelectedNetwork = computed(() =>
    selectedNetwork.value
      ? selectedNetwork.value
      : JSON.parse(localStorage.getItem(`selectedNetwork_${getInvoiceCode.value}`) || '{}')
  )

  const getPaymentTransactions = computed(() =>
    paymentTransactions.value
      ? paymentTransactions.value
      : JSON.parse(localStorage.getItem(`paymentTransactions_${getInvoiceCode.value}`) || '[]')
  )

  // ----- Function -----
  function setMainLoading(status) {
    payLoading.value = status
  }

  function setThemeInfo(invoice) {
    const themeID = invoice.app.payment_theme_id
    if (themeID) {
      paymentThemeID.value = themeID
      localStorage.setItem('paymentThemeID', themeID)
    }
  }

  function setInvoiceCode(payload) {
    localStorage.setItem('invoiceCode', payload)
    invoiceCode.value = payload
  }

  function setInvoiceDetail(responce) {
    invoiceDetail.value = responce.invoice
    localStorage.setItem(`invoiceDetail_${responce.invoiceID}`, JSON.stringify(responce.invoice))
  }

  function setPaymentDetail(response) {
    paymentDetail.value = response.detail
    localStorage.setItem(`paymentDetail_${response.invoiceID}`, JSON.stringify(response.detail))
  }

  function setUserInputs(payload) {
    userInputs.value = payload.inputs
    localStorage.setItem(`userInputs_${payload.invoiceID}`, JSON.stringify(payload.inputs))
  }

  function setSelectedCoin(payload) {
    selectedCoin.value = payload.coin
    localStorage.setItem(`selectedCoin_${payload.invoiceID}`, JSON.stringify(payload.coin))
  }

  function setSelectedNetwork(payload) {
    selectedNetwork.value = payload.network
    localStorage.setItem(`selectedNetwork_${payload.invoiceID}`, JSON.stringify(payload.network))
  }

  function setPaymentTransactions(response) {
    localStorage.setItem(
      `paymentTransactions_${response.invoiceID}`,
      JSON.stringify(response.transactions)
    )

    if (
      paymentTransactions.value &&
      paymentTransactions.value.length < response.transactions.length
    ) {
      const audio = new Audio('/media/transaction.mp3')
      audio.play()
      appendAlert('New transaction received!', {
        color: 'success',
        type: 'alert'
      })
    }

    paymentTransactions.value = response.transactions
  }

  function refreshPayStore() {
    localStorage.removeItem(`selectedCoin_${getInvoiceCode.value}`)
    localStorage.removeItem(`selectedNetwork_${getInvoiceCode.value}`)
    localStorage.removeItem(`invoiceDetail_${getInvoiceCode.value}`)
    localStorage.removeItem(`paymentDetail_${getInvoiceCode.value}`)
    localStorage.removeItem(`paymentTransactions_${getInvoiceCode.value}`)
    localStorage.removeItem(`invoiceCode`)
    localStorage.removeItem(`paymentThemeID`)

    invoiceCode.value = ''
    invoiceDetail.value = null
    paymentDetail.value = null
    userInputs.value = null
    selectedCoin.value = null
    selectedNetwork.value = null
    paymentTransactions.value = null
  }

  /**
   * Get Payment Info
   * @param {invoice code} payload
   */
  async function getPaymentInfo(payload) {
    try {
      setMainLoading(true)

      const { data } = await api.get(`invoices/${payload}`)

      setMainLoading(false)

      //
      const { invoice, tokens_prices } = data

      //
      setInvoiceDetail({ invoiceID: payload, invoice })

      setThemeInfo(invoice)

      //
      return tokens_prices
    } catch (error) {
      return false
    }
  }

  /**
   * Get Payment Info
   * @param {invoice code, params} payload
   */
  async function getPaymentDetails(payload) {
    try {
      const { data } = await api.get(`wallet/${payload.incoiceID}`, {
        params: payload.params
      })

      //
      const detail = data

      //
      setPaymentDetail({
        invoiceID: payload.incoiceID,
        detail
      })

      //
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Get App Payment Info
   * @param {invoice code, params , content} payload
   */
  async function getAppPaymentDetails(payload) {
    try {
      const { data } = await api.post(`wallet/${payload.incoiceID}`, payload.content, {
        params: payload.params
      })

      //
      const detail = data

      //
      setPaymentDetail({
        invoiceID: payload.incoiceID,
        detail
      })

      //
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Check Payment Status
   */
  async function paymentCheckStatus(payload) {
    try {
      // Request
      const { data } = await api.get(`invoices/status/${payload}`)

      //
      const { transactions, invoice_status, invoice, tokens_prices } = data

      //
      setPaymentTransactions({
        invoiceID: payload,
        transactions
      })

      setInvoiceDetail({
        invoice
      })

      //
      return { tokens_prices, invoice_status }
    } catch (error) {
      console.log(error)
      return false
    }
  }

  /**
   * Cancel Payment
   */
  async function cancelPayment(payload) {
    try {
      // Request
      await api.get(`invoices/cancel/${payload}`)

      //
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Fake Payment
   */
  async function fakePayment(payload) {
    try {
      // Request
      await api.get(`invoices/pay-fake/${payload.code}/${payload.token_id}/${payload.amount}`)

      //
      return true
    } catch (error) {
      return false
    }
  }

  return {
    payLoading,
    getPaymentThemeID,
    getInvoiceCode,
    getInvoiceDetail,
    getPaymentDetail,
    getUserInputs,
    getSelectedCoin,
    getSelectedNetwork,
    getPaymentTransactions,

    setInvoiceCode,
    setUserInputs,
    setSelectedCoin,
    setSelectedNetwork,
    refreshPayStore,
    getPaymentInfo,
    getPaymentDetails,
    getAppPaymentDetails,
    paymentCheckStatus,
    cancelPayment,
    fakePayment
  }
})
