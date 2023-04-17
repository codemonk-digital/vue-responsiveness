<template>
  <div>
    <pre v-text="JSON.stringify($matches, null, 2)" />
    <h1>
      Current interval:
      <span>{{ $matches.current }}</span>
    </h1>
    <h3 v-if="$matches.isMax('sm')"><code>sm</code> and below</h3>
    <h3 v-if="$matches.isOnly('md')"><code>md</code> only</h3>
    <h3 v-if="$matches.isMin('lg')"><code>lg</code> and above</h3>
  </div>
</template>
