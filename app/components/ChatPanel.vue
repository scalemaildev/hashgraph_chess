<template>
<v-container fluid class="content-body-right">
  <MessagesWindow :topicId="topicId" />
  <MessageBox :topicId="topicId" />
</v-container>
</template>

<script>
export default {
    props: ['topicId'],
}
</script>
