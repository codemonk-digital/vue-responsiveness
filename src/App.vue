<template>
  <div>
    <pre v-text="JSON.stringify($matches, null, 2)" />
    <h2 style="color: #fff6">
      Current interval:
      <span style="color: #bada55">{{ $matches.current }}</span>
    </h2>
  </div>
</template>
