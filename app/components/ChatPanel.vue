<template>
<v-container fluid class="chatPanel-wrapper">
  <v-row>
    <v-col align="center">
     <h3>Player Chat</h3>
    </v-col>
  </v-row>
  <v-row>
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
