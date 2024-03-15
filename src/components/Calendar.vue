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
  watchEffect,
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
  mode: {
    type: String,
    default: 'mondayFirst',
  },
});

/* 对外暴露的接口 */
const emit = defineEmits(['onSave']);

const selectedYear = ref();
const selectedMonth = ref();
const selectedDate = ref();
const currentHours = ref();
const currentMinutes = ref();
const visible = ref(false);
const timeVisible = ref(false);
const selfRef = ref();
const contentRef = ref();
const calendarRef = ref();
const contentRightWithoutScrollBar = ref();
const offset = reactive({
  top: 0,
  left: 0,
});

watchEffect(() => {
  if (visible.value) {
    const { year, month, date, hours, minutes } = CalendarClass.getNowDate();

    selectedYear.value = year;
    selectedMonth.value = month;
    selectedDate.value = date;
    currentHours.value = hours;
    currentMinutes.value = minutes;
  }
});

const color = computed(() =>
  COLORS.includes(props.color) ? props.color : COLORS[0]
);

/* 发射到外面的数据 */
const exposedData = computed(() => {
  const { day, dayZh } = CalendarClass.getDay(
    selectedYear.value,
    selectedMonth.value,
    selectedDate.value
  );
  const year = selectedYear.value;
  const month = selectedMonth.value;
  const date = selectedDate.value;

  return {
    exposed: {
      year,
      month,
      date,
      day,
      dayZh,
      hours: currentHours.value,
      minutes: currentMinutes.value,
    },
    displayed: `${year}年${month}月${date}日星期${dayZh}`,
  };
});

const displayedTime = computed(
  () =>
    `${currentHours.value} : ${
      currentMinutes.value < 10
        ? '0' + currentMinutes.value
        : currentMinutes.value
    }`
);

/* 主题颜色注入到下面的组件 */
provide('color', color);

onMounted(() => {
  /* 点击其他地方，取消显示 */
  document.body.addEventListener('click', handleClickOtherwhere);
});

onBeforeUnmount(() => {
  document.body.removeEventListener('click', handleClickOtherwhere);
});

const handleClickOtherwhere = (e) => {
  if (!selfRef.value.contains(e.target)) {
    timeVisible.value = false;
    visible.value = false;
  }
};

const showCalendar = async () => {
  contentRightWithoutScrollBar.value =
    contentRef.value.getBoundingClientRect().right;
  visible.value = true;
  /* 通过nextTick，分2次渲染，第2次渲染需要使用第1次渲染的数据 */
  await nextTick();

  const {
    top: contentTop,
    left: contentLeft,
    bottom: contentBottom,
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
        Math.max(
          contentRightWithoutScrollBar.value +
            calendarRef.value.offsetWidth -
            viewWidth,
          0
        );
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
};

const handleSave = () => {
  emit('onSave', exposedData.value.exposed);
  visible.value = false;
};

const handleCancel = () => {
  visible.value = false;
};

const showTimeScroller = () => {
  timeVisible.value = true;
};
</script>

<template>
  <div class="calendar" @wheel="(e) => e.preventDefault()" ref="selfRef">
    <div ref="contentRef" @click="showCalendar()">
      <slot></slot>
    </div>

    <div
      v-if="visible"
      class="calendar-main"
      ref="calendarRef"
      :style="{
        top: `${offset.top}px`,
        left: `${offset.left}px`,
      }"
    >
      <CalendarDatePicker
        v-model:selectedYear="selectedYear"
        v-model:selectedMonth="selectedMonth"
        v-model:selectedDate="selectedDate"
        :mode="props.mode"
      />

      <CalendarTimeScroller
        v-if="timeVisible"
        v-model:currentHours="currentHours"
        v-model:currentMinutes="currentMinutes"
        v-model:timeVisible="timeVisible"
      />

      <div @click="showTimeScroller" class="calendar-main-time">
        {{ displayedTime }}
        <span class="calendar-main-time-prompt">(点击选取)</span>
      </div>

      <div class="calendar-main-date">{{ exposedData.displayed }}</div>

      <div class="calendar-main-button">
        <span
          class="calendar-main-button-item calendar-main-button-save"
          @click="handleSave"
        >
          保存
        </span>
        <span class="calendar-main-button-item" @click="handleCancel">
          取消
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.calendar {
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

    &-time {
      margin: 0.4rem 0;
      padding: 0.2rem 0;
      border: 1px solid v-bind('color');
      border-radius: 4px;
      cursor: pointer;
      text-align: center;

      &-prompt {
        font-size: 0.6rem;
      }
    }

    &-date {
      text-align: center;
      font-size: 0.8rem;
      margin-bottom: 0.4rem;
    }

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
