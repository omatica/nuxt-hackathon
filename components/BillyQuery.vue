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
            <v-btn  @click="toggleJson"><h6>{{jsonInstruction}}</h6></v-btn>
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

        
        <!-- 
          TEMPERATURE: 37,      RAIN : true,       WINDY: true,   CLOUDY: true
          DAY_OF_WEEK: FRIDAY
        -->
        <v-row class="flex-col mb-4">
          <br />
          <v-form fast-fail @submit.prevent>
            <v-col cols="12">
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
              multiple
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
      // initial test values
      /*
	    TEMPERATURE : "27", 
	    RAIN : true,
      WINDY:false,
      CLOUDY:true,
      DAY_OF_WEEK: "FRIDAY",
      weather: {
        statuses: ['SUNNY', 'WINDY', 'RAINY', 'CLOUDY']
      },
      */
     items: {
        WEATHER: ['SUNNY', 'WINDY', 'RAINY', 'CLOUDY'],
        DAY_OF_WEEK: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
      },
      values: {
        TEMPERATURE: 20,
        WEATHER: ['SUNNY'],
        DAY_OF_WEEK: ['MONDAY'],
      }
    };
  },
  components: { JsonViewer, completionModal },
  methods: {
    toggleJson () {
       console.log (">>>>>>>>>");
      console.log (this.showJson);
      this.showJson = ! this.showJson;
      console.log (this.showJson);
    },
    async submitText() {
        this.loading = true;

        try {
            const result = await getResult(this.userInput) 
            const ourMessage = JSON.parse(result.choices[0].message.content);
            this.jsonData = ourMessage.json_logic;
            this.explanation = ourMessage.explanation;

            /*
            this.testData = {
              TEMPERATURE : this.values.TEMPERATURE,
              WEATHER: this.values.WEATHER,
              DAY_OF_WEEK: this.values.DAY_OF_WEEK

              /*
	            RAIN : this.RAIN,
              WINDY: this.WINDY,
              CLOUDY: this.CLOUDY,
              DAY_OF_WEEK: this.DAY_OF_WEEK
              /
            }

            const CAN_SHOW_ADGROUP = jsonLogic.apply( this.jsonData,  this.testData );
            //console.log ({ CAN_SHOW_ADGROUP });
            */
        } catch (e) {
    }
    this.loading = false;
    },
  },
  computed: {
    jsonInstruction(){
      return this.showJson ? "hide json" : "view json";
    },
    resultFromTest(){
      /*
          values: {
            TEMPERATURE: 20,
            WEATHER: ['SUNNY'],
            DAY_OF_WEEK: ['MONDAY'],
          }
      */
      const testData = {
              TEMPERATURE : String(this.values.TEMPERATURE),
	            //SUNNY : this.values.WEATHER.includes('SUNNY'),
	            RAIN : this.values.WEATHER.includes('RAIN'),
              WINDY: this.values.WEATHER.includes('WINDY'),
              CLOUDY: this.values.WEATHER.includes('CLOUDY'),
              DAY_OF_WEEK: this.values.DAY_OF_WEEK[0]
        }
        const result = jsonLogic.apply( this.jsonData,  testData );
        const qualifier = result ?  ""    :  "NOT";
        return `For these test values your  Adgroup will ${qualifier} play`
    },
    resultClass() {
      return this.resultFromTest.includes('NOT') ? 'red--text' : 'text-green';  // :class="resultClass"
    }
  },
};
</script>

<style scoped>
/* Add your custom styles here */
</style>
