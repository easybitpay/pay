import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePayStore } from '@/stores/pay'

export default function useRedirectPayment(sandbox) {
  const store = usePayStore()
  const route = useRoute()
  const router = useRouter()

  const invoiceCode = computed(() => route.params.id)
  const invoiceDetail = computed(() => store.getInvoiceDetail)
  // const selectedCoin = computed(() => store.getters.getSelectedCoin);
  // const paymentTransactions = computed(() => store.getters.getPaymentTransactions);

  const cancelLoading = ref(false)

  /**
   * Cancel Payment & Redirect
   */
  const cancelPayment = async () => {
    // start loading
    cancelLoading.value = true

    // request
    await store.cancelPayment(invoiceCode.value).then((res) => {
      if (res) {
        redirectPaymentStatus(2)
      }
    })

    // start loading
    cancelLoading.value = false
  }



  const redirectPaymentStatus = (code) => {
    // const transactionsCount = paymentTransactions.value.length;
    // const mustPay = `${selectedCoin.value.amount} ${selectedCoin.value.symbol}`;
    // const paidAmount = `${
    //   !transactionsCount
    //     ? 0
    //     : paymentTransactions.value.reduce(function (accumulator, curValue) {
    //         return accumulator + +curValue.amount;
    //       }, 0)
    // } ${selectedCoin.value.symbol}`;

    router.push({
      name: sandbox ? 'status-sandbox' : 'status',
      params: { id: invoiceCode.value },
      query: { code }
    })
  }

  // Redirect
  const redirect = (code) => {
    let message = ''
    const orderId = invoiceDetail.value?.client_order_identifier || null

    //
    if (code == 1) message = 'Your payment has been expired'
    if (code == 2) message = 'Your payment has been canceled'
    if (code == 10) message = 'Your payment has been paid'

    const redirectURL = `${invoiceDetail.value.app.redirect_url}?orderId=${orderId}&status=${code}&message=${message}`

    //
    window.location = redirectURL
  }

  const convertCodeToStatus = (code) => {
    if (code == 1) return 'Expired'
    if (code == 2) return 'Canceled'
    if (code == 10) return 'Completed'
  }

  const convertCodeToColor = (code) => {
    if (code == 1) return 'danger'
    if (code == 2) return 'danger'
    if (code == 10) return 'success'
  }

  return {
    cancelLoading,
    cancelPayment,
    redirectPaymentStatus,
    redirect,
    convertCodeToStatus,
    convertCodeToColor,
  }
}
