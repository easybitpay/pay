<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Hook
import useIconImage from '@/composables/useIconImage'

// Store
import { useAppStore } from '@/stores/app'

// Props
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    required: false
  },
  items: {
    type: Array,
    required: true
  },
  selected: {
    type: [Object],
    required: true
  },
  showImage: {
    type: Boolean,
    default: false
  },
  showImageKey: {
    type: String,
    required: false
  },
  showCoinNetwork: {
    type: Boolean,
    default: false
  },
  show: {
    type: String,
    default: 'symbol'
  },
  check: {
    type: String,
    default: 'id'
  },
  btnSize: {
    type: String,
    default: 'md'
  },
  toggleClass: {
    type: String,
    required: false,
    default: ''
  },
  svgIcon: {
    type: String,
    required: false
  },
  svgIconColor: {
    type: String,
    required: false
  },
  width: {
    Type: String,
    default: '100'
  },
  grouped: {
    type: String,
    required: false
  }
})

// Emit
const emit = defineEmits(['change', 'update'])

// ----- START ----- //
const store = useAppStore()

const { iconImage, storageImage } = useIconImage()

const networks = computed(() => store.networks)

const search = ref('')

/**
 * Show Network Name
 */
const showNetwork = (networkID) => {
  let networkName = ''

  for (let i = 0; i < networks.value.length; i++) {
    const network = networks.value[i]
    if (network.id === networkID) {
      networkName = network.name
      break
    }
  }

  return networkName
}

/**
 * Filtered Items
 */
const filteredItems = () => {
  var all = props.items,
    item = search.value

  if (!item) {
    return all
  }

  item = item.trim().toLowerCase()

  all = all.filter((currentItem) => {
    if (props.show) {
      if (currentItem[props.show].toLowerCase().indexOf(item) !== -1) {
        return currentItem
      }
    }

    if (currentItem.symbol) {
      if (currentItem.symbol.toLowerCase().indexOf(item) !== -1) {
        return currentItem
      }
    }
  })

  return all
}

const selectItem = (e, item) => {
  const menu = e.target.offsetParent
  menu.classList.remove('show')
  emit('change', item)
  emit('update')
}

onMounted(() => {
  const myDropdown = document.getElementById('selectDropdown')

  /**
   * Dropdown Fire On Hide
   */
  myDropdown.addEventListener('hide.bs.dropdown', () => {
    emit('update')
  })
})
</script>

<template>
  <div :class="`dropdown w-${width} ${grouped ? 'grouped-dropdown' : ''}`" id="selectDropdown">
    <a
      :class="`btn btn-${btnSize} bg-gray-100 border-gray-200 dropdown-toggle justify-content-between w-100 ${toggleClass}`"
      role="button"
      :disabled="disabled"
      id="dropdownMenuLink"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      data-bs-auto-close="outside"
      data-bs-offset="0,0"
    >
      <!-- begin::Icon -->
      <div v-if="svgIcon">
        <inline-svg
          :src="svgIcon"
          :class="`me-1 ${svgIconColor ? `svg-icon-${svgIconColor}` : ''}`"
        ></inline-svg>
      </div>
      <!-- end::Icon -->

      <!-- begin::Grouped -->
      <span class="d-none d-sm-block text-start" style="min-width: 130px" v-if="grouped">{{
        grouped
      }}</span>
      <!-- end::Grouped -->

      <!-- begin::Show Selected -->
      <div
        :class="[
          {
            'd-flex align-items-center gap-2 text-gray-800 active select-dropdown-text-content': true
          },
          { 'with-svg': svgIcon }
        ]"
        v-if="selected && Object.keys(selected).length"
      >
        <img
          v-if="showImage"
          class="small-coin-icon"
          :src="
            selected.logo
              ? storageImage(selected.logo, 24)
              : iconImage(showImageKey ? selected[showImageKey] : selected.symbol)
          "
          :alt="selected[show]"
        />

        <span class="ellipsis text-start" style="--ellipsis-width: 100%">
          {{ selected[show] }}
          <span v-if="showCoinNetwork" class="fs-9 text-gray-600">
            {{ selected.network?.name || showNetwork(selected.network_id) }}
          </span>
        </span>
      </div>
      <!-- end::Show Selected -->

      <!-- begin::Show Placeholder -->
      <div
        v-else
        :class="[
          { 'select-dropdown-text-placeholder text-start': true },
          { 'd-block d-sm-none': grouped },
          { 'with-svg': svgIcon }
        ]"
      >
        <span class="text-gray-600 ellipsis" style="--ellipsis-width: 100%">
          {{ placeholder }}
        </span>
      </div>
      <!-- end::Show Placeholder -->
    </a>

    <!-- begin::Dropdown Menu -->
    <ul :class="`dropdown-menu gap-0 ${btnSize}-triangle w-100`" aria-labelledby="dropdownMenuLink">
      <!-- begin::Search Input -->
      <div class="position-relative d-flex align-items-center mb-6" v-if="items.length > 10">
        <input
          type="text"
          class="form-control form-control-sm"
          placeholder="Search anything"
          v-model="search"
        />

        <!-- begin::Icon -->
        <inline-svg
          src="media/icons/icons/search.svg"
          class="position-absolute end-16px"
        ></inline-svg>
        <!-- end::Icon -->
      </div>
      <!-- end::Search Input -->

      <!-- begin::Items -->
      <div class="custom-scroll d-flex flex-column gap-2">
        <!-- begin::Item -->
        <li
          v-for="(item, index) in filteredItems()"
          :key="index"
          @click="(e) => selectItem(e, item)"
        >
          <a :class="[{ 'dropdown-item': true }, { active: selected[check] === item[check] }]">
            <div class="d-flex align-items-center gap-2">
              <img
                v-if="showImage"
                class="small-coin-icon"
                :src="
                  item.logo
                    ? storageImage(item.logo, 24)
                    : iconImage(showImageKey ? item[showImageKey] : item.symbol)
                "
                :alt="item[show]"
              />
              {{ item[show] }}
              <span v-if="showCoinNetwork" class="fs-9 text-gray-600">
                {{ item.network?.name || showNetwork(item.network_id) }}
              </span>
            </div>
          </a>
        </li>
        <!-- end::Item -->
      </div>
      <!-- end::Items -->
    </ul>
    <!-- end::Dropdown Menu -->
  </div>
</template>
