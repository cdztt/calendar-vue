<script setup>
import { computed, ref } from 'vue';
import NumberScroller from './NumberScroller.vue';

const props = defineProps(['currentHours', 'currentMinutes', 'timeVisible']);
const emit = defineEmits([
  'update:currentHours',
  'update:currentMinutes',
  'update:timeVisible',
]);

const hoursProps = {
  min: 0,
  max: 23,
};
const minutesProps = {
  min: 0,
  max: 59,
  prefixZero: true,
};

const currentHours = ref(props.currentHours);
const currentMinutes = ref(props.currentMinutes);

const displayedTime = computed(
  () =>
    `${props.currentHours} : ${props.currentMinutes < 10 ? '0' + props.currentMinutes : props.currentMinutes}`
);

const handleConfirm = () => {
  emit('update:currentHours', currentHours.value);
  emit('update:currentMinutes', currentMinutes.value);
  emit('update:timeVisible', false);
};

const handleCancel = () => {
  emit('update:timeVisible', false);
};
</script>

<template>
  <div @click="(e) => e.stopPropagation()" class="calendartime">
    <div v-show="timeVisible" class="calendartime-input">
      <div class="calendartime-input-scroller">
        <NumberScroller v-bind="hoursProps" v-model:current="currentHours" />
        <NumberScroller
          v-bind="minutesProps"
          v-model:current="currentMinutes"
        />
      </div>
      <div class="calendartime-input-button">
        <span @click="handleConfirm"> ✔ </span>
        <span @click="handleCancel"> ✖ </span>
      </div>
    </div>

    <div @click="emit('update:timeVisible', true)" class="calendartime-text">
      {{ displayedTime }}
    </div>
  </div>
</template>

<style scoped lang="less">
.calendartime {
  text-align: center;

  &-input {
    background-color: white;
    position: relative;
    top: -248px;
    margin-bottom: -254px; //254px是弹出框的高度

    &-scroller {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    &-button {
      color: orange;
      display: grid;
      grid-template-columns: 1fr 1fr;
      border: 1px solid gray;
      font-size: 1rem;
      font-weight: bold;
      line-height: 2;
    }
  }

  &-text {
    margin: 0.4rem 0;
    padding: 0.2rem 0;
    border: 1px solid rgba(128, 128, 128, 0.6);
    border-radius: 4px;
  }
}
</style>
