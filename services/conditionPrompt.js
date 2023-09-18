import axios from 'axios';

const access_key = process.env.GPT_ACCESS;


const instructions = 
`provide my api with json only, no text outside this,  with just two fields 
   { explanation , json_logic }
considerations
     json_logic should be valid JSONLogic created should include a subset of the following variables   
            TEMPERATURE: number, RAINY : boolean, WINDY: boolean, CLOUDY: boolean, SUNNY: boolean,
            DAY_OF_WEEK: string, one of SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY 
    explanation should be a concise explantion how the jsonlogic will work

result will  be true when... `
    



const  getResult = async (userText) => {
    const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

    // try {
        const response = await axios.post(API_ENDPOINT, {
            model: "gpt-3.5-turbo",
            temperature: 0.2, // more deterministic
            messages: [
              {
                  role: "user",
                  content: instructions + userText
              }
            ],
            functions: [{
              "name": "my_weather_api_input",
              "description": "works out if ok to play an advert based on current weather and json_logic rule ",
              "parameters": {
                  "type": "object",
                  "properties": {
                      "explanation": {
                          "type": "string",
                          "description": "explanation of the json_Logic rule ",
                      },
                      "json_logic": {
                          "type": "object",
                          "description": "must be in JSONlogic",
                      },
                  },
                   "required": ["json_logic", "explanation"],
              },

          }],

        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_key
            }
        });

        return ( response.data ); 

}


export { getResult };






/*

{
  "or": [
    {
      "and": [
        { "==" : [ { "var" : "DAY_OF_WEEK" }, "SATURDAY" ] },
        { "==" : [ { "var" : "RAIN" }, true ] }
      ]
    },
    {
      "and": [
        { "==" : [ { "var" : "DAY_OF_WEEK" }, "SUNDAY" ] },
        { "==" : [ { "var" : "RAIN" }, true ] }
      ]
    },
    {
      "and": [
        { "==" : [ { "var" : "DAY_OF_WEEK" }, "WEDNESDAY" ] },
        { "==" : [ { "var" : "CLOUDY" }, true ] }
      ]
    }
  ]
}
  
$message$
This JSONLogic string represents the condition to show images. It checks if it's a rainy weekend by verifying if it's either Saturday or Sunday and it's raining. It also checks if it's a cloudy hump day, which is Wednesday and it's cloudy. If any of these conditions are true, then images will be shown.
when it's monday and the temperature is between 10 and 30 and the weather is sunny, or it's friday and it's rainy and the temperature less 15

---
1. when it's monday and the temperature is between 10 and 30 and the weather is sunny

OR 2. it's friday and it's rainy and the temperature less 15
---
*/