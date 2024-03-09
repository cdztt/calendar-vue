import { ref } from 'vue';

export default function useState(initialState) {
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
