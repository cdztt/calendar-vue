<script setup>
import CalendarClass from '../utils/Calendar.js';
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
};

const initHours = props.currentHours;
const initMinutes = props.currentMinutes;

const handleConfirm = () => {
  emit('update:timeVisible', false);
};

const handleCancel = () => {
  emit('update:currentHours', initHours);
  emit('update:currentMinutes', initMinutes);
  emit('update:timeVisible', false);
};

const handleCurrentTime = () => {
  const { hours, minutes } = CalendarClass.getNowDate();
  emit('update:currentHours', hours);
  emit('update:currentMinutes', minutes);
};
</script>

<template>
  <div @click="(e) => e.stopPropagation()" class="calendartime">
    <div class="calendartime-scroller">
      <NumberScroller
        v-bind="hoursProps"
        :current="props.currentHours"
        @update:current="(e) => emit('update:currentHours', e)"
      />
      <NumberScroller
        v-bind="minutesProps"
        :current="props.currentMinutes"
        @update:current="(e) => emit('update:currentMinutes', e)"
      />
    </div>

    <div class="calendartime-buttons">
      <span @click="handleConfirm" class="calendartime-buttons-item">
        确定
      </span>
      <span @click="handleCurrentTime" class="calendartime-buttons-item">
        当前
      </span>
      <span @click="handleCancel" class="calendartime-buttons-item">
        取消
      </span>
    </div>
  </div>
</template>

<style scoped lang="less">
.calendartime {
  height: 250px;
  text-align: center;
  background-color: white;
  position: relative;
  top: -250px;
  margin-bottom: -250px;

  &-scroller {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  &-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 1rem;
    border: 1px solid gray;
    font-size: 0.8rem;
    line-height: 2;
    &-item {
      &:hover {
        font-weight: bold;
      }
    }
  }
}
</style>
