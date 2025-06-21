<script setup>
const props = defineProps({
    text: String
});
</script>

<template>
    <hr class="hr-text gradient" :data-content="props.text">
</template>

<style lang="scss">
.hr-text {
  border: 0;
  line-height: 1em;
  position: relative;
  text-align: center;
  height: 1.5em;
  font-size: 14px;
  margin: 30px 15px;
}

.hr-text::before {
    content: "";
    background: linear-gradient(to right, transparent, black, transparent);
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 1px;
}

.hr-text::after {
    content: attr(data-content);
    position: relative;
    padding: 0 7px;
    line-height: 1.5em;
    color: #000;
    background-color: #fff  ;
}
</style>