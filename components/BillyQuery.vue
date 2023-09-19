<template>
  <div>
   
  <v-progress-circular v-if="loading"
    color="primary" indeterminate size="128" width="6"
  ></v-progress-circular>

    <v-container v-if="!loading" >
      <h2>Let's create a custom dynamic condition</h2>

      <v-row>
        <v-col cols="12" md="12">
        So, when would you like me to trigger this Ad Group?
          <v-textarea
            v-model="userInput"
            label=""
            outlined
            placeholder="when it's raining on a sunday"
            rows="4"
          ></v-textarea>
          <v-row>
            <v-btn @click="submitText" color="primary">Ask BILLIE</v-btn>
            <v-btn v-if="explanation" @click="toggleJson"><h6>{{jsonInstruction}}</h6></v-btn>
          </v-row>
          <v-row class="my-4">
            <br />
          </v-row>
          <div  v-if="showJson">
              <h2>BILLIE says...</h2>
              <br />
              <p>this condition executes against weather and other contextual data at runtime:</p>
              <json-viewer 
                v-if="showJson" 
                :value="jsonData"
                copyable
                boxed
                sort>
            </json-viewer>
          </div>
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
        <v-col cols="12" md="12">
          <v-textarea
            v-model="explanation"
            label="Response from Billie! AI"
            outlined
            rows="4"
            readonly
          ></v-textarea>

        <!-- TESTING HERE -->
        <v-row>
        <h2>Let’s make sure we are are on the same page</h2>
        <p>
          Change some of these values and see how it reacts?
        </p>
        </v-row>

        
        <v-row class="flex-col mb-4">
          <br />
          <v-form fast-fail @submit.prevent>
            <v-col cols="12">
             <v-time-picker v-model="values.TIME_PICKER" landscape="landscape"></v-time-picker>
            <v-text-field
              v-model="values.TEMPERATURE"
              label="Temperature"
              single-line
              type="number"
            />
            <v-select
              v-model="values.WEATHER"
              :items="items.WEATHER"
              chips
              label="Weather Status"
              multiple
            ></v-select>
            <v-select
              v-model="values.DAY_OF_WEEK"
              :items="items.DAY_OF_WEEK"
              chips
              label="Day of the week"
            ></v-select>
          </v-col>
          </v-form>
        </v-row>
        </v-col>

        <v-row class="mb-4">
          <h2 :class="resultClass">{{  resultFromTest }}</h2>
        </v-row>

        <v-row class="mb-8">
          <br />
          <completionModal />
        </v-row>
      </v-row>

    </v-container>
  </div>
</template>

<script>
import jsonLogic from 'json-logic-js';
import JsonViewer from 'vue-json-viewer';
import { getResult } from "~/services/conditionPrompt.js";
import completionModal from '~/components/CompletionModal.vue'
export default {
  data() {
    return {
      willPlay: null,
      showJson: false,
      userInput: "",
      explanation: "",
      loading: false,
      jsonData: {},
     // test interface items
     items: {
        WEATHER: ['SUNNY', 'WINDY', 'RAINY', 'CLOUDY'],
        DAY_OF_WEEK: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
      },
      // initial test interface values
      values: {
        TEMPERATURE: 20,
        WEATHER: ['SUNNY'],
        DAY_OF_WEEK: 'MONDAY',
        TIME_PICKER: "14:30"
      }
    };
  },
  components: { JsonViewer, completionModal },
  methods: {
    toggleJson () {
      this.showJson = ! this.showJson;
      console.log (this.showJson);
    },
    async submitText() {
      this.loading = true;

      try {
          const result = await getResult(this.userInput) 
          console.log(result)
          const ourMessage = JSON.parse(result.choices[0].message.content);
          this.jsonData = ourMessage.json_logic;
          this.explanation = ourMessage.explanation;
      } catch (error) {
        console.trace(error)
        console.log ("couldnt submit query " + error.message);
      }
      this.loading = false;
    },
  },
  computed: {
    jsonInstruction() {
      return this.showJson ? "hide json" : "view json";
    },
    testHrsSinceMidnight(){
       const [hours, minutes] =  this.values.TIME_PICKER.split(":");
       return  parseInt(hours) * 60 + parseInt(minutes);
    },
    resultFromTest() {
        try {
            const testData = {
                    TEMPERATURE : this.values.TEMPERATURE,
                    SUNNY : this.values.WEATHER.includes('SUNNY'),
                    RAINY : this.values.WEATHER.includes('RAINY'),
                    WINDY: this.values.WEATHER.includes('WINDY'),
                    CLOUDY: this.values.WEATHER.includes('CLOUDY'),
                    DAY_OF_WEEK: this.values.DAY_OF_WEEK,
                    MINUTES_SINCE_MIDNIGHT: this.testHrsSinceMidnight
            }
            const result = jsonLogic.apply( this.jsonData,  testData );
            const qualifier = result ?  ""    :  "NOT";
        
            return `For these test values your  Adgroup will ${qualifier} play`
        } catch (e) {
            console.log(e)
            return `For these test values your  Adgroup will NOT play`
        }
      },
    resultClass() {
      return this.resultFromTest.includes('NOT') ? 'red--text' : 'green--text';  // :class="resultClass"
    }
  },
};
/*
when it's monday and the temperature is between 10 and 30 and the weather is sunny, or it's friday and it's cloudy and the temperature less 15
*/
</script>

<style scoped>
/* Add your custom styles here */
</style>
