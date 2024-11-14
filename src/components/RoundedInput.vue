<style lang="scss" scoped>
	.form-control-rounded {
		border: 1px solid rgb(115,103,240);
		border-radius: 20px;
		padding: 8px 14px;
		color: #000;
		outline: none;
		margin-left: 10px;
		width: auto;
	}
</style>

<template>
	<select class="form-control-rounded" v-model="model">
		<option value="" selected>-- Choose --</option>
		<option>By Dates</option>
		<option>By Workload</option>
		<option>By Venue</option>
		<option>By Event class</option>
	</select>
</template>

<script setup>
	const model = defineModel()
</script>