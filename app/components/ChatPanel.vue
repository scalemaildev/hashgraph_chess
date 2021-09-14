<template>
<v-container fluid class="chatPanel-body">
  <div>
    <MessagesWindow :topicId="topicId" />
  </div>
  <v-row justify="end">
    <v-col align="end">
      <MessageBox :topicId="topicId" />
    </v-col>
  </v-row>
</v-container>
</template>

<script>
export default {
    props: ['topicId'],
}
</script>
