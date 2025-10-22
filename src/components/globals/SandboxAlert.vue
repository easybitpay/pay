<script setup>
// Store
import { useAppStore } from '@/stores/app'

// ----- START ----- //

// Generals
const store = useAppStore()

// Functions

const exitSandbox = () => {
  store.setSandBoxStatus(false)
}
</script>

<template>
  <div id="sandbox-alert" class="d-flex gap-4">
    <div class="d-none d-md-flex">
      <div class="w-56px h-56px d-flex align-items-center justify-content-center rounded-3 bg-white border border-gray-200">
        <inline-svg :src="`/media/icons/shapes/${$filters.shapeStatus('documentation')}.svg`"></inline-svg>
      </div>
    </div>
    <div class="card border-warning bg-yellow-100 w-100">
      <div
        class="card-body px-4 py-3 d-flex flex-wrap align-items-center justify-content-between gap-4"
      >
        <p class="fs-7 mb-0 ls-base text-gray-800 lh-32px">
          You are in Sand Box, Do you Want Exit?
        </p>

        <!-- begin::Actions -->
        <div class="d-flex gap-4 w-100 w-sm-initial">
          <button
            type="button"
            @click="exitSandbox"
            class="btn btn-sm btn-primary w-100 h-24px ls-base"
          >
            Exit Sandbox
          </button>
        </div>
        <!-- end::Actions -->
      </div>
    </div>
  </div>
</template>
