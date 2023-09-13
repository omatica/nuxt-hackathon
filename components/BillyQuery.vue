<template>
  <div>
   
<v-progress-circular v-if="loading"
  color="primary" indeterminate size="128" width="6"
></v-progress-circular>



    <v-container v-if="!loading" >
      <v-row>
        <v-col cols="12" md="12">
          please show images when...
          <v-textarea
            v-model="userInput"
            label="Enter some text"
            outlined
            rows="4"
          ></v-textarea>
          <v-btn @click="submitText" color="primary">Submit</v-btn>
              <json-viewer
                :value="jsonData"

                copyable
                boxed
                sort>
            </json-viewer>
        </v-col>
      </v-row>
      <v-row v-if="loading">
        <v-col cols="12">
          <v-progress-circular
            indeterminate
            size="64"
            color="primary"
          ></v-progress-circular>
        </v-col>
      </v-row>
      <v-row v-if="explanation">
        <v-col cols="12" md="6">
          <v-textarea
            v-model="explanation"
            label="Response from Chat GPT"
            outlined
            rows="4"
            readonly
          ></v-textarea>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import JsonViewer from 'vue-json-viewer'
import { getResult } from "~/services/conditionPrompt.js";
export default {
  data() {
    return {
      userInput: "",
      explanation: "",
      loading: false,
      jsonData: {}
    };
  },
  components: { JsonViewer },
  methods: {
    async submitText() {
        this.loading = true;
        try {
            const result = await getResult(this.userInput) 
            const ourMessage = JSON.parse(result.choices[0].message.content);
            this.jsonData = ourMessage.json_logic;
            this.explanation = ourMessage.explanation;

        } catch (e) {
    }
    this.loading = false;
    },
  },
};
</script>

<style scoped>
/* Add your custom styles here */
</style>
