<template>
  <n-calendar
    v-model:value="value"
    #="{ year, month, date }"

  >
    {{ year }}-{{ month }}-{{ date }}
  </n-calendar>
</template>

<!--    :is-date-disabled="isDateDisabled"
    @update:value="handleUpdateValue" -->

<script>
import { defineComponent, ref } from "vue";
import { useMessage } from "naive-ui";
import { isYesterday, addDays } from "date-fns/esm";

export default defineComponent({
  setup() {
    const message = useMessage();
    return {
      value: ref(addDays(Date.now(), 1).valueOf()),
      handleUpdateValue(_, { year, month, date }) {
        message.success(`${year}-${month}-${date}`);
      },
      isDateDisabled(timestamp) {
        if (isYesterday(timestamp)) {
          return true;
        }
        return false;
      }
    };
  }
});
</script>