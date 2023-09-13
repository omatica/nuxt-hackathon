<template>
  <div>
   
<v-progress-circular v-if="loading"
  color="primary" indeterminate size="128" width="6"
></v-progress-circular>



    <v-container v-if="!loading" >
      <v-row>
        <v-col cols="12" md="12">
          please show this adgroup when...
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
import jsonLogic from 'json-logic-js';
import JsonViewer from 'vue-json-viewer';
import { getResult } from "~/services/conditionPrompt.js";
export default {
  data() {
    return {
      userInput: "",
      explanation: "",
      loading: false,
      jsonData: {},
      // initial test values
	    TEMPERATURE : 27, 
	    RAIN : true,
      WINDY:false,
      CLOUDY:true,
      DAY_OF_WEEK: "FRIDAY"
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

            // initial test of data
            const testData = {
	            TEMPERATURE : this.TEMPERATURE,
	            RAIN : this.RAIN,
              WINDY: this.WINDY,
              CLOUDY: this.CLOUDY,
              DAY_OF_WEEK: this.DAY_OF_WEEK
            };

            const CAN_SHOW_ADGROUP = jsonLogic.apply( this.jsonData, testData );
            console.log ({ CAN_SHOW_ADGROUP });

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
