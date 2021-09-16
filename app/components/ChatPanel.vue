<template>
<v-container fluid class="chatPanel-wrapper">
  <v-row style="margin-bottom: 0;">
    <v-col align="center" style="margin-bottom: 0; padding-bottom: 0;">
     <h3>Player Chat</h3>
    </v-col>
  </v-row>
  <v-row style="margin-top: 0;">
    <v-col cols="12">
      <MessagesWindow :topicId="topicId" />
    </v-col>
    <v-col cols="12">
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
