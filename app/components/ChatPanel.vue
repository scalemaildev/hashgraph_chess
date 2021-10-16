<template>
<v-container fluid class="content-body chat-panel">
  <div align="center">
    <h3>Player Chat</h3>
  </div>
  <MessagesWindow :topicId="topicId" />
  <MessageBox :topicId="topicId" />
</v-container>
</template>

<script>
export default {
    props: ['topicId', 'userType'],
}
</script>
