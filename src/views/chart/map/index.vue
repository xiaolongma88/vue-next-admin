<template>
	<div class="layout-padding" style="height: 100%">
    <MapContainer></MapContainer>
	</div>
</template>

<script setup lang="ts" name="funEchartsMap">
import {defineAsyncComponent} from "vue";

const MapContainer = defineAsyncComponent(() => import('/src/views/chart/map/MapContainer.vue'));

</script>
