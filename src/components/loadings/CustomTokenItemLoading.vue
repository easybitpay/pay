<script setup></script>

<template>
  <!-- begin::Item -->
  <div class="row row-gap-2 ls-base">
    <div class="col-sm-5 col-md-4 col-lg-3 col-xl-2 lh-24px">
      <Skeletor class="rounded-0 mw-200px" />
    </div>

    <div class="col-sm-7 col-md-8 col-lg-9 col-xl-10 d-flex justify-content-start">
      <div class="w-100 w-lg-initial gap-4 d-flex">
        <div>
          <Skeletor size="24" circle />
        </div>

        <Skeletor width="90" class="rounded-0" />
        
        <Skeletor size="24px" circle class="d-none d-sm-block ms-0 ms-lg-16"/>
      </div>
    </div>
  </div>
  <!-- end::Item -->
</template>
