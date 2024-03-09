<script setup>
import { computed, ref } from 'vue';

const props = defineProps(['min', 'max', 'current', 'prefixZero']);
const emit = defineEmits(['update:current']);

const isScrollable = ref(false);

const numbers = computed(() => {
  const range = props.max - props.min + 1;
  const numbers = [];

  for (let i = -4; i <= 4; i++) {
    if ((i === -4 || i === 4) && isScrollable.value) {
      numbers.push(i === -4 ? '▲' : '▼');
    } else {
      numbers.push((props.current + i + range) % range);
    }
  }

  return numbers;
});

const handleWheel = (e) => {
  let newNumber;

  if (e.deltaY < 0) {
    newNumber = props.current === props.min ? props.max : props.current - 1;
  } else {
    newNumber = props.current === props.max ? props.min : props.current + 1;
  }

  emit('update:current', newNumber);
};

const handleClickNumber = (n) => {
  let newNumber;

  if (n === '▲') {
    newNumber = props.current - 1;
  } else if (n === '▼') {
    newNumber = props.current + 1;
  } else {
    newNumber = n;
  }

  emit('update:current', newNumber);
};

const showedNumber = (n) => {
  if (!props.prefixZero) return n;
  if (typeof n === 'number' && n >= 0 && n < 10) return '0' + n;
  return n;
};
</script>

<template>
  <div @wheel="handleWheel" class="numberscroller">
    <div
      v-for="n of numbers"
      :key="n"
      @click="handleClickNumber(n)"
      @mouseover="isScrollable = true"
      @mouseout="isScrollable = false"
      :class="{
        'numberscroller-current': n === props.current,
      }"
      class="none-user-select"
    >
      {{ showedNumber(n) }}
    </div>
  </div>
</template>

<style scoped lang="less">
.numberscroller {
  border: 1px solid gray;

  &-current {
    border-top: 1px solid orange;
    border-bottom: 1px solid orange;
  }
}
</style>
