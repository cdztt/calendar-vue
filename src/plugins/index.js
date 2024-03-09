import { ref } from 'vue';

function useState(initialState) {
  const state = ref(initialState);

  const setState = (newValue) => {
    if (newValue !== undefined) {
      state.value = newValue;
    } else {
      state.value = !state.value;
    }
  };

  return [state, setState];
}

export default function calendarPlugin(app, options) {
  const [dayVisible, setDayVisible] = useState(false);
  const [timeVisible, setTimeVisible] = useState(false);
  const selfRef = ref();

  app.provide('calendar-day-visible', {
    dayVisible,
    setDayVisible,
  });
  app.provide('calendar-time-visible', {
    timeVisible,
    setTimeVisible,
  });
  app.provide('calendar-self', selfRef);

  const handleClick = (e) => {
    if (!selfRef.value.contains(e.target)) {
      if (timeVisible.value) {
        setTimeVisible(false);
      } else if (dayVisible.value) {
        setDayVisible(false);
      }
    }
  };
  /* 点击其他地方，取消显示 */
  document.body.addEventListener('click', handleClick);
}
