<template>
<v-container fluid class="content-body chat-panel">
  <v-row style="margin-bottom: 0;">
    <v-col align="center" style="margin-bottom: 0; padding-bottom: 0;">
     <h3>Player Chat</h3>
    </v-col>
    <v-col cols="12">
      <MessagesWindow :topicId="topicId" />
    </v-col>
    <v-col cols="12" v-show="userType != 'o'" style="padding-bottom: 0; padding-top: 0;">
      <MessageBox :topicId="topicId" />
    </v-col>
  </v-row>
</v-container>
</template>

<script>
export default {
    props: ['topicId', 'userType'],
}
</script>
