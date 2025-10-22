<script setup></script>

<template>
  <!-- begin::Main Box -->
  <div class="d-flex flex-column flex-root z-2">
    <div class="d-flex flex-column flex-root justify-content-center">
      <!-- begin::Container -->
      <div class="container d-flex flex-column align-items-center pb-8 pt-8">
        <!-- begin::Logo -->
        <inline-svg src="media/images/logo/Logo.svg" class="mb-6"></inline-svg>
        <!-- end::Logo -->

        <!-- begin::Card -->
        <div class="card mw-448px w-100 min-h-400px">
          <div class="card-body d-flex flex-column justify-content-between">
            <p class="mb-0"></p>
            <!-- <h1 class="text-center text-danger">Seems there is nothing here</h1> -->

            <div>
                <h1 class="text-center mb-0" style="font-size: 5rem;">404</h1>
                <p class="mb-0 text-center">Seems there is nothing here</p>
            </div>

            <RouterLink class="btn btn-primary w-100" to="/"> Back to home </RouterLink>
          </div>
        </div>
        <!-- end::Card -->
      </div>
      <!-- end::Container -->
    </div>

    <!-- begin::Copyright -->
    <div>
      <small class="text-white text-center neue-machina fw-light d-block mb-4">
        2023 © easybitpay
      </small>
    </div>
    <!-- end::Copyright -->
  </div>
  <!-- end::Main Box -->

  <!-- begin::Backgroun Image -->
  <div
    class="position-fixed bottom-0 w-100 h-53vh auth-bg error"
    style="background-image: url('media/images/banner/auth-bg.jpg')"
  ></div>
  <!-- end::Backgroun Image -->
</template>
