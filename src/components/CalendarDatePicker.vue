<script setup>
import { inject, ref } from 'vue';
import CalendarClass from '../utils/Calendar.js';

const emit = defineEmits([
  'update:selectedYear',
  'update:selectedMonth',
  'update:selectedDate',
  'update:selectedDay',
]);

const color = inject('color');

const nowDate = CalendarClass.getNowDate();

const selectedIndex = ref();
const calendar = ref(
  new CalendarClass(nowDate.year, nowDate.month, nowDate.date)
);

const dayClass = (i, j) => {
  const index = i * 7 + j + 1;

  return {
    selected: index === selectedIndex.value,
    currentday:
      index === calendar.value.currentDayIndex &&
      nowDate.month === calendar.value.month &&
      nowDate.year === calendar.value.year,
    othermonth:
      index < calendar.value.startDayIndexOfCurrentMonth ||
      index > calendar.value.endDayIndexOfCurrentMonth,
  };
};

const handleSelectDate = (i, j, date) => {
  const index = i * 7 + j + 1;
  selectedIndex.value = index;

  let selectedMonth;
  if (index < calendar.value.startDayIndexOfCurrentMonth) {
    selectedMonth = calendar.value.getPreviousMonth();
  } else if (index > calendar.value.endDayIndexOfCurrentMonth) {
    selectedMonth = calendar.value.getNextMonth();
  } else {
    selectedMonth = calendar.value.month;
  }

  emit('update:selectedYear', calendar.value.year);
  emit('update:selectedMonth', selectedMonth);
  emit('update:selectedDate', date);
  emit('update:selectedDay', calendar.value.currentDayInWeek);
};

const handleDecreaseMonth = () => {
  calendar.value.decreaseMonth();
  selectedIndex.value = calendar.value.startDayIndexOfCurrentMonth;

  emit('update:selectedYear', calendar.value.year);
  emit('update:selectedMonth', calendar.value.month);
  emit('update:selectedDate', 1);
  emit('update:selectedDay', calendar.value.currentDayInWeek);
};

const handleIncreaseMonth = () => {
  calendar.value.increaseMonth();
  selectedIndex.value = calendar.value.startDayIndexOfCurrentMonth;

  emit('update:selectedYear', calendar.value.year);
  emit('update:selectedMonth', calendar.value.month);
  emit('update:selectedDate', 1);
  emit('update:selectedDay', calendar.value.currentDayInWeek);
};
</script>

<template>
  <div class="calendardate">
    <tr class="calendardate-month">
      <td colspan="5" class="calendardate-month-text">
        {{ `${calendar.year}年${calendar.month}月` }}
      </td>
      <td @click="handleDecreaseMonth">▲</td>
      <td @click="handleIncreaseMonth">▼</td>
    </tr>

    <tr>
      <td v-for="day of Object.values(CalendarClass.dayMapping)" :key="day">
        {{ day }}
      </td>
    </tr>

    <tr v-for="(week, i) of calendar.daysInWeekOfMonth" :key="i">
      <td
        v-for="(date, j) of week"
        :key="j"
        :class="dayClass(i, j)"
        @click="handleSelectDate(i, j, date)"
      >
        {{ date }}
      </td>
    </tr>
  </div>
</template>

<style scoped lang="less">
.calendardate {
  &-month {
    &-text {
      text-align: left;
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
