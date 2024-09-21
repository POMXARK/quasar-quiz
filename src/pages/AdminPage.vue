<template>
  <q-page>
    <AdminPanel />
  </q-page>
</template>

<script setup>
import { defineComponent } from 'vue';
import AdminPanel from 'components/Admin/AdminPanel.vue';

defineComponent({
  name: 'AdminPage',
});
</script>
