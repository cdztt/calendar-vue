<script setup>
import { computed, inject, ref } from 'vue';

const props = defineProps(['min', 'max', 'current']);
const emit = defineEmits(['update:current']);
const color = inject('color');

const getTimeNumber = (num) => {
  const range = props.max - props.min + 1;
  return (num + range) % range;
};

const isScrollable = ref(false);

const numbers = computed(() => {
  const numbers = [];

  for (let i = -4; i <= 4; i++) {
    if ((i === -4 || i === 4) && isScrollable.value) {
      numbers.push(i === -4 ? '▲' : '▼');
    } else {
      numbers.push(getTimeNumber(props.current + i));
    }
  }

  return numbers;
});

const handleWheel = (e) => {
  let newNumber;

  if (e.deltaY < 0) {
    newNumber = props.current - 1;
  } else {
    newNumber = props.current + 1;
  }

  emit('update:current', getTimeNumber(newNumber));
};

const handleClick = (n) => {
  let newNumber;

  if (n === '▲') {
    newNumber = props.current - 1;
  } else if (n === '▼') {
    newNumber = props.current + 1;
  } else {
    newNumber = n;
  }

  emit('update:current', getTimeNumber(newNumber));
};
</script>

<template>
  <div @wheel="handleWheel" class="numberscroller">
    <div
      v-for="n of numbers"
      :key="n"
      @click="handleClick(n)"
      @mouseover="isScrollable = true"
      @mouseout="isScrollable = false"
      :class="{
        'numberscroller-current': n === props.current,
        'numberscroller-arrow': n === '▲' || n === '▼',
      }"
    >
      {{ n >= 0 && n < 10 ? '0' + n : n }}
    </div>
  </div>
</template>

<style scoped lang="less">
.numberscroller {
  border: 1px solid gray;

  &-current {
    border-top: 1px dotted v-bind('color');
    border-bottom: 1px dotted v-bind('color');
  }
  &-arrow {
    color: v-bind('color');
  }
}
</style>
