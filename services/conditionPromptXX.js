import axios from 'axios';

const access_key = process.env.GPT_ACCESS;


const instructions = 
`first provide my api with a concise explanation of the json result, then delimiter,  $delimit$   then, a valid JSONLogic as answer
considerations
    JSONLogic created should include a subset of the following variables   
            TEMPERATURE: number,      RAIN : boolean,       WINDY: boolean,   CLOUDY: boolean
            DAY_OF_WEEK: string, one of SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY 

please show my adgroup if... `
    



const  getResult = async (userText) => {
    const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

    // try {
        const response = await axios.post(API_ENDPOINT, {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "return structure should be explanation  delimiter JSON"
                },
                {
                    role: "user",
                    content: instructions + userText
                }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_key
            }
        });

        return ( response.data ); //

        // Handle the response here
       //  document.getElementById('output').innerText = JSON.stringify(response.data, null, 4);
    // } catch (error) {
    //     console.error('There was an error with the request:', error);
    // }
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

    */