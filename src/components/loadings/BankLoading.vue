<script setup></script>
<template>
  <div class="card border-gray-200 rounded-4 h-100 bank-card">
    <div class="card-body d-flex flex-column">
      <!-- begin::Header -->
      <h4 class="mb-6 d-flex gap-3">
        <div>
          <Skeletor size="24px" circle />
        </div>

        <Skeletor class="rounded-0" width="100px" />
      </h4>
      <!-- end::Header -->

      <!-- begin::Amount Columns -->
      <div class="d-flex flex-root amount-columns">
        <!-- begin::Item -->
        <Skeletor class="item" width="40%" />
        <!-- end::Item -->

        <!-- begin::Item -->
        <Skeletor class="item" width="50%" />
        <!-- end::Item -->

        <!-- begin::Item -->
        <Skeletor class="item" width="10%" />
        <!-- end::Item -->
      </div>
      <!-- end::Amount Columns -->

      <!-- begin::Main Balances -->
      <div class="value-infos my-6">
        <!-- begin::Item -->
        <div class="item">
          <p class="value">
            <Skeletor class="rounded-0" width="200px" />
          </p>
          <p class="title">
            <Skeletor class="rounded-0" width="100px" />
          </p>
        </div>
        <!-- end::Item -->

      </div>
      <!-- end::Main Balances -->

      <!-- begin::Action -->
      <Skeletor class="btn" />
      <!-- end::Action -->
    </div>
  </div>
</template>
