<script setup>
import { Skeletor } from 'vue-skeletor'
</script>

<template>
  <div class="card gradient-loading-box application-card shadow-none">
    <div class="card-body d-flex flex-column flex-lg-row align-items-start align-items-lg-end">
      <div class="d-flex flex-column align-items-start w-100 overflow-auto">
        <div class="mb-4">
          <!-- begin::Type -->
          <Skeletor width="68px" height="1.5rem" class="rounded" />
          <!-- end::Type -->
        </div>

        <!-- begin::Share Type -->
        <p class="mb-0 fs-7 ls-base text-gray-600">
          <Skeletor width="75px" class="rounded-0" />
        </p>
        <!-- end::Share Type -->

        <!-- begin::Name -->
        <h2 class="name">
          <Skeletor width="150px" height="2rem" class="rounded-0" />
        </h2>
        <!-- end::Name -->

        <!-- begin::Info -->
        <div class="infos mt-6">
          <!-- begin::Item -->
          <div class="item">
            <p class="value">
              <Skeletor width="85px" height="1.5rem" class="rounded-0" />
            </p>
            <p class="title">
              <Skeletor height="1rem" class="rounded-0" />
            </p>
          </div>
          <!-- end::Item -->

          <!-- begin::Item -->
          <div class="item">
            <p class="value">
              <Skeletor width="85px" height="1.5rem" class="rounded-0" />
            </p>
            <p class="title">
              <Skeletor height="1rem" class="rounded-0" />
            </p>
          </div>
          <!-- end::Item -->

          <!-- begin::Item -->
          <div class="item">
            <p class="value">
              <Skeletor width="85px" height="1.5rem" class="rounded-0" />
            </p>
            <p class="title">
              <Skeletor height="1rem" class="rounded-0" />
            </p>
          </div>
          <!-- end::Item -->

          <!-- begin::Item -->
          <div class="item">
            <p class="value">
              <Skeletor width="85px" height="1.5rem" class="rounded-0" />
            </p>
            <p class="title">
              <Skeletor height="1rem" class="rounded-0" />
            </p>
          </div>
          <!-- end::Item -->
        </div>
        <!-- end::Info -->
      </div>
    </div>
  </div>
</template>
