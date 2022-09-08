const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_API_KEY});


// Description: Create a new event for Notion calender
//              @parm eventName: name of the event
//              @parm description: description of event
//              @parm people: list of people for the event
//              @parm startDate: start date and time given is ISO 8601
//              @parm endDate: end date and time given is ISO 8601

// Preconditions: people cannot be empty
async function createEvent({ eventName, description, location, people, startDate, endDate }) {

    try {
        await notion.pages.create({
            parent: { database_id: process.env.NOTION_DATABASE_ID},
            properties: {
                [process.env.NOTION_EVENT_ID]: { 
                    title: [
                        {
                            type: 'text',
                            text: {
                                content: eventName
                            },
                        },
                    ],
                },        
                [process.env.NOTION_DESCRIPTION_ID]: { 
                    rich_text: [
                        { 
                            type: 'text',
                            text: {
                                content: description
                            },
                        },
                    ],
                },
                [process.env.NOTION_LOCATION_ID]: { 
                    rich_text: [
                        { 
                            type: 'text',
                            text: {
                                content: location
                            },
                        },
                    ],
                },
                [process.env.NOTION_DATE_ID]: { 
                    date: { 
                    start: startDate, // ISO 8601
                    end: endDate,     // ISO 8601
                    time_zone: "Canada/Pacific"       
                    },
                },
                [process.env.NOTION_TAG_ID]: { 
                    multi_select: people 
                    
                },
            }
        })
    } catch (err) {
        console.error(err);
    }


}





/**HELPER FUNCTIONS */
// Description: Get the properties of the databases.S
//              Used to get the IDs for each heading
async function getDatabase() {
    const response = await notion.databases.retrieve({ database_id: process.env.NOTION_DATABASE_ID});
    console.log(response);
}
// getDatabase() 


// Description: Get the properties of each tag and store
//              the properties in an array
async function getTags() { 
    const database = await notion.databases.retrieve({ 
        database_id: process.env.NOTION_DATABASE_ID});
        return notionPropertiesByID(database.properties)[process.env.NOTION_TAG_ID].multi_select.options.map(option => {
                return { id: option.id, name: option.name}
            }); // filter out the colour info;
} 


function notionPropertiesByID(properties) {
    return Object.values(properties).reduce((obj, property) => {
        const {id, ...rest} = property;
        return {...obj, [id]: rest};
    }, {});
}

module.exports = { createEvent, getTags };