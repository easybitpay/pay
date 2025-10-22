import { ref } from 'vue'

export default function useForm() {
  const feedBacks = ref([])
  const showFeedBacks = () => {
    feedBacks.value = document.querySelectorAll('.invalid-feedback')

    awaitForClick()
  }

  const awaitForClick = () => {
    feedBacks.value.forEach((item) => {
      item.classList.add('d-flex')
      const parent = item.parentElement
      parent.addEventListener('click', () => {
        const input = parent.querySelector('input')

        if (input) {
          input.focus()
        }
        item.classList.remove('d-flex')
      })
    })
  }

  return {
    showFeedBacks
  }
}
