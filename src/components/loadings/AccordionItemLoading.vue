<script setup></script>
<template>
  <div class="accordion">
    <div class="accordion-item" v-for="item in 2" :key="item">
      <h2 class="accordion-header">
        <button class="accordion-button loading" type="button">
          <Skeletor class="rounded-0" width="100px" />

          <Skeletor size="1.5rem" class="rounded-0" />
        </button>
      </h2>
    </div>
  </div>
</template>
