<script>
const COLORS = ['#3b3b3b', 'brown', 'green', 'blue', 'orange'];
</script>

<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  reactive,
  ref,
  watch,
} from 'vue';
import CalendarClass from '../utils/Calendar.js';
import CalendarDatePicker from './CalendarDatePicker.vue';
import CalendarTimeScroller from './CalendarTimeScroller.vue';

const props = defineProps({
  placement: {
    type: String,
    default: 'left',
  },
  color: {
    type: String,
    default: COLORS[0],
  },
});

/* 对外暴露的接口 */
const emit = defineEmits(['onSave']);

const { year, month, date, dayZh, hours, minutes } = CalendarClass.getNowDate();

const dayVisible = ref(false);
const timeVisible = ref(false);
const selectedYear = ref(year);
const selectedMonth = ref(month);
const selectedDate = ref(date);
const selectedDay = ref(dayZh);
const currentHours = ref(hours);
const currentMinutes = ref(minutes);
const offset = reactive({
  top: 0,
  left: 0,
});
const selfRef = ref();
const contentRef = ref();
const calendarRef = ref();

const color = computed(() =>
  COLORS.includes(props.color) ? props.color : COLORS[0]
);

/* 发射到外面的数据 */
const updatedCalendar = computed(() => ({
  year: selectedYear.value,
  month: selectedMonth.value,
  date: selectedDate.value,
  day: selectedDay.value,
  hours: currentHours.value,
  minutes: currentMinutes.value,
}));

/* 主题颜色注入到下面的组件 */
provide('color', color);

onMounted(() => {
  /* 点击其他地方，取消显示 */
  document.body.addEventListener('click', handleClickOtherwhere);
});

onBeforeUnmount(() => {
  document.body.removeEventListener('click', handleClickOtherwhere);
});

/* 监听dayVisible，设置偏移量 */
watch([dayVisible, () => props.placement], async () => {
  //等待dom渲染完之后，后面要重新获取v-show之后的dom尺寸
  await nextTick();
  const {
    top: contentTop,
    left: contentLeft,
    bottom: contentBottom,
    right: contentRight,
  } = contentRef.value.getBoundingClientRect();
  const viewHeight = window.innerHeight;
  const viewWidth = window.innerWidth;

  switch (props.placement) {
    case 'top':
      offset.top = Math.max(-calendarRef.value.offsetHeight, -contentTop);
      offset.left = -(
        (calendarRef.value.offsetWidth - contentRef.value.offsetWidth) /
        2
      );
      break;
    case 'right':
      offset.top = -(
        (calendarRef.value.offsetHeight - contentRef.value.offsetHeight) /
        2
      );
      offset.left =
        contentRef.value.offsetWidth -
        Math.max(contentRight + calendarRef.value.offsetWidth - viewWidth, 0);
      break;
    case 'bottom':
      offset.top =
        contentRef.value.offsetHeight -
        Math.max(
          contentBottom + calendarRef.value.offsetHeight - viewHeight,
          0
        );
      offset.left = -(
        (calendarRef.value.offsetWidth - contentRef.value.offsetWidth) /
        2
      );
      break;
    case 'left':
      offset.top = -(
        (calendarRef.value.offsetHeight - contentRef.value.offsetHeight) /
        2
      );
      offset.left = Math.max(-calendarRef.value.offsetWidth, -contentLeft);
      break;
  }
});

const handleClickOtherwhere = (e) => {
  if (!selfRef.value.contains(e.target)) {
    if (timeVisible.value) {
      timeVisible.value = false;
    } else if (dayVisible.value) {
      dayVisible.value = false;
    }
  }
};

const handleSave = () => {
  emit('onSave', updatedCalendar.value);
  dayVisible.value = false;
};
</script>

<template>
  <div class="calendar" @wheel="(e) => e.preventDefault()" ref="selfRef">
    <div ref="contentRef" @click="dayVisible = true">
      <slot></slot>
    </div>

    <div
      v-show="dayVisible"
      class="calendar-main"
      ref="calendarRef"
      :style="{
        top: `${offset.top}px`,
        left: `${offset.left}px`,
      }"
    >
      <CalendarDatePicker
        @update:selectedYear="(e) => (selectedYear = e)"
        @update:selectedMonth="(e) => (selectedMonth = e)"
        @update:selectedDate="(e) => (selectedDate = e)"
        @update:selectedDay="(e) => (selectedDay = e)"
      />

      <CalendarTimeScroller
        v-model:currentHours="currentHours"
        v-model:currentMinutes="currentMinutes"
        :timeVisible="timeVisible"
        @update:timeVisible="(e) => (timeVisible = e)"
      />

      <div class="calendar-main-button">
        <span
          class="calendar-main-button-item calendar-main-button-save"
          @click="handleSave"
        >
          保存
        </span>
        <span class="calendar-main-button-item" @click="dayVisible = false">
          取消
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.calendar {
  position: relative;
  cursor: default;

  &-main {
    font-size: 1rem;
    border: 1px solid rgba(128, 128, 128, 0.6);
    border-radius: 3px;
    width: fit-content;
    padding: 0.5rem 0.5rem;
    position: absolute;
    z-index: 1;
    background-color: white;

    &-button {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;

      &-item {
        text-align: center;
        border: 1px solid gray;
        border-radius: 5px;
        padding: 0.2rem 0;
        margin: 0.6rem 0;
      }

      &-save {
        border-color: v-bind('color');

        &:hover {
          color: v-bind('color');
        }
      }
    }
  }
}
</style>
