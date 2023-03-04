<template>
  <div>
    <pre v-text="JSON.stringify($matches, null, 2)" />
    <h1>
      Current interval:
      <span>{{ $matches.current }}</span>
    </h1>
  </div>
</template>
