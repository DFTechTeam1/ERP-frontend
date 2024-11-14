<style lang="scss" scoped>
	.custom-navigation {
        border-radius: 6px;
        width: 100%;
        gap: 6px;
        padding: 6px;
        background: #f6f6f6;
        overflow-x: scroll;

        .nav-wrapper {
	        display: flex;
	        align-items: center;
        }

        .nav {
            width: 100%;
            border: none;
            outline: none;
            padding: 8px 12px;
            border-radius: 4px;
            text-align: center;
            cursor: pointer;
            font-size: 14px;
            background-color: #fff;
        }

        .nav.active {
            background-color: rgba(115, 103, 240, .5);
            font-weight: bold;
        }
    }
</style>

<template>
	<!-- custom navigation -->
    <div class="custom-navigation">
    	<div class="nav-wrapper">
	        <button class="nav"
	        	v-for="(button, b) in props.buttons"
	        	:key="b"
	            :class="{
	            	'active': model == button.href
	            }"
	            @click.prevent="model = button.href">
	            {{ button.text }}
	        </button>
    	</div>
    </div>
</template>

<script setup>
const props = defineProps({
	buttons: {
		default: null,
	}
})

const model = defineModel()
</script>