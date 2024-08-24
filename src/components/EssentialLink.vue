<template>
  <q-item
    clickable
    @click="navigate"
  >
    <q-item-section
      v-if="props.icon"
      avatar
    >
      <q-icon :name="props.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ props.title }}</q-item-label>
      <q-item-label caption>
        {{ props.caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { useRouter } from 'vue-router';

defineOptions({
  name: 'EssentialLink',
});

const props = defineProps({
  title: {
    type: String,
    required: true,
  },

  caption: {
    type: String,
    default: '',
  },

  link: {
    type: String,
    default: '#',
  },

  icon: {
    type: String,
    default: '',
  },
});

const router = useRouter();

function navigate() {
  if (props.link.startsWith('http')) {
    // Для внешних ссылок
    window.open(props.link, '_blank', 'noopener noreferrer');
  } else {
    // Для внутренних ссылок
    router.push(props.link);
  }
}
</script>
