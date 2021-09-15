<template>
<v-container fluid class="chatPanel-body">
  <MessagesWindow :topicId="topicId" />
  <MessageBox :topicId="topicId" />
</v-container>
</template>

<script>
export default {
    props: ['topicId'],
}
</script>
