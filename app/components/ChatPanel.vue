<template>
<v-container fluid class="content-body-right">
  <ChatWindow :topicId="topicId" />
</v-container>
</template>

<script>
export default {
    props: ['topicId'],
}
</script>
