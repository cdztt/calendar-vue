<script setup>
import { computed, inject, ref, shallowRef, watchEffect } from 'vue';
import CalendarClass from '../utils/Calendar.js';

const props = defineProps([
  'selectedYear',
  'selectedMonth',
  'selectedDate',
  'mode',
]);
const emit = defineEmits([
  'update:selectedYear',
  'update:selectedMonth',
  'update:selectedDate',
]);

const color = inject('color');

const calendar = ref();
const selectedDay = shallowRef();

const weekNames = computed(() =>
  props.mode === 'mondayFirst'
    ? ['一', '二', '三', '四', '五', '六', '日']
    : ['日', '一', '二', '三', '四', '五', '六']
);

/* 不响应年月日 */
const { selectedYear, selectedMonth, selectedDate } = props;

watchEffect(() => {
  /* 响应mode */
  calendar.value = new CalendarClass(selectedYear, selectedMonth, props.mode);
});

/* 每个日期的类 */
const dayClass = (date, month, year) => {
  return {
    selected:
      date === selectedDay.value?.date &&
      month === selectedDay.value?.month &&
      year === selectedDay.value?.year,
    currentday:
      date === selectedDate && month === selectedMonth && year === selectedYear,
    othermonth:
      year !== selectedYear ||
      (year === selectedYear && month !== selectedMonth),
  };
};

const handleSelectDay = (date, month, year) => {
  emit('update:selectedYear', year);
  emit('update:selectedMonth', month);
  emit('update:selectedDate', date);
  selectedDay.value = { date, month, year };
};

const handleDecreaseMonth = () => {
  calendar.value.decreaseMonth();
};

const handleIncreaseMonth = () => {
  calendar.value.increaseMonth();
};
</script>

<template>
  <div class="calendardate">
    <tr class="calendardate-month">
      <td colspan="5" class="calendardate-month-text">
        {{ `${calendar.year}年${calendar.month}月` }}
      </td>
      <td @click="handleDecreaseMonth" class="calendardate-month-arrow">▲</td>
      <td @click="handleIncreaseMonth" class="calendardate-month-arrow">▼</td>
    </tr>

    <tr>
      <td v-for="day of weekNames" :key="day">
        {{ day }}
      </td>
    </tr>

    <tr v-for="(week, i) of calendar.daysInWeekOfMonth" :key="i">
      <td
        v-for="({ date, month, year }, j) of week"
        :key="j"
        :class="dayClass(date, month, year)"
        @click="handleSelectDay(date, month, year)"
      >
        {{ date }}
      </td>
    </tr>
  </div>
</template>

<style scoped lang="less">
.calendardate {
  height: 250px;
  &-month {
    &-text {
      text-align: left;
    }
    &-arrow {
      color: v-bind('color');
    }
  }
}

td {
  text-align: center;
  padding: 0.2rem 0.4rem;
}

.selected {
  outline: 2px solid;
  outline-offset: -4px;
  outline-color: white;
  color: white;
  background-color: v-bind('color');
}

.currentday {
  outline: 2px solid v-bind('color');
  outline-offset: -4px;
}

.othermonth {
  color: gray;
}
</style>
