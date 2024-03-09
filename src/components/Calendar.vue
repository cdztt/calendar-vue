<script setup>
import { computed, inject, nextTick, reactive, ref, watch } from 'vue';
import CalendarClass from '../utils/Calendar.js';
import CalendarDatePicker from './CalendarDatePicker.vue';
import CalendarTimeScroller from './CalendarTimeScroller.vue';

const props = defineProps({
  placement: {
    type: String,
    default: 'topleft'
  }
})
const emit = defineEmits(['onSave'])

const { dayVisible, setDayVisible } = inject('calendar-day-visible')
const { year, month, date, dayZh, hours } = CalendarClass.getNowDate()

const selectedYear = ref(year)
const selectedMonth = ref(month)
const selectedDate = ref(date)
const selectedDay = ref(dayZh)
const currentHours = ref(hours + 2)
const currentMinutes = ref(0)

const updatedCalendar = computed(() => ({
  year: selectedYear.value,
  month: selectedMonth.value,
  date: selectedDate.value,
  day: selectedDay.value,
  hours: currentHours.value,
  minutes: currentMinutes.value
}))

const contentRef = ref()
const calendarRef = ref()
const selfRef = inject('calendar-self')

const offset = reactive({
  top: 0,
  left: 0
})

/* 监听dayVisible，设置偏移量 */
watch([dayVisible, () => props.placement], async () => {
  await nextTick()//等待dom渲染完之后，后面要重新获取v-show之后的dom尺寸

  switch (props.placement) {
    case 'topleft':
      offset.top = -calendarRef.value.offsetHeight
      offset.left = -calendarRef.value.offsetWidth
      break
    case 'top':
      offset.top = -calendarRef.value.offsetHeight
      offset.left = -((calendarRef.value.offsetWidth - contentRef.value.offsetWidth) / 2)
      break
    case 'topright':
      offset.top = -calendarRef.value.offsetHeight
      offset.left = contentRef.value.offsetWidth
      break
    case 'right':
      offset.top = -((calendarRef.value.offsetHeight - contentRef.value.offsetHeight) / 2)
      offset.left = contentRef.value.offsetWidth
      break
    case 'bottomright':
      offset.top = contentRef.value.offsetHeight
      offset.left = contentRef.value.offsetWidth
      break
    case 'bottom':
      offset.top = contentRef.value.offsetHeight
      offset.left = -((calendarRef.value.offsetWidth - contentRef.value.offsetWidth) / 2)
      break
    case 'bottomleft':
      offset.top = contentRef.value.offsetHeight
      offset.left = -calendarRef.value.offsetWidth
      break
    case 'left':
      offset.top = -((calendarRef.value.offsetHeight - contentRef.value.offsetHeight) / 2)
      offset.left = -calendarRef.value.offsetWidth
      break
  }
})

const handleSave = () => {
  emit('onSave', updatedCalendar.value)
  setDayVisible(false)
}
  ;
</script>
<template>
  <div class="calendar" @wheel="e => e.preventDefault()" ref="selfRef">
    <div ref="contentRef" @click="setDayVisible(true)">
      <slot></slot>
    </div>

    <div v-show="dayVisible" class="calendar-main theme-background-color" ref="calendarRef"
      :style="{ top: `${offset.top}px`, left: `${offset.left}px` }">
      <CalendarDatePicker @update:selectedYear="e => selectedYear = e" @update:selectedMonth="e => selectedMonth = e"
        @update:selectedDate="e => selectedDate = e" @update:selectedDay="e => selectedDay = e" />
      <CalendarTimeScroller v-model:currentHours="currentHours" v-model:currentMinutes="currentMinutes" />

      <div class="calendar-main-button">
        <span class="calendar-main-button-item calendar-main-button-save" @click="handleSave">
          保存
        </span>
        <span class="calendar-main-button-item" @click="setDayVisible(false)">
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
        border-color: orange;

        &:hover {
          color: orange;
        }
      }
    }
  }
}
</style>