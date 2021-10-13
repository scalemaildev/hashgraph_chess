<template>
<v-container fluid class="content-body chat-panel">
  <v-row style="margin-bottom: 0;">
    <v-col align="center" style="margin-bottom: 0; padding-bottom: 0;">
     <h3>Player Chat</h3>
    </v-col>
  </v-row>
  <MessagesWindow :topicId="topicId" />
  <div v-show="userType != 'o'">
    <MessageBox :topicId="topicId" />
  </div>
</v-container>
</template>

<script>
export default {
    props: ['topicId', 'userType'],
}
</script>
