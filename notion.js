const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_API_KEY});
const fs = require('fs');

var IDFile = "data/IDs.json";
var dbInfo;

// Description: Create a new event for Notion calender
//              @parm eventName: name of the event
//              @parm description: description of event
//              @parm people: list of people for the event
//              @parm startDate: start date and time given is ISO 8601
//              @parm endDate: end date and time given is ISO 8601

// Preconditions: people cannot be empty
async function createEvent({ eventName, description, location, people, startDate, endDate }) {

    if (dbInfo === undefined) {
        loadIDsFromJSON();
    }

    try {
        await notion.pages.create({
            parent: { database_id: process.env.NOTION_DATABASE_ID},
            properties: {
                [dbInfo[0].eventID]: { 
                    title: [
                        {
                            type: 'text',
                            text: {
                                content: eventName
                            },
                        },
                    ],
                },        
                [dbInfo[0].descriptionID]: { 
                    rich_text: [
                        { 
                            type: 'text',
                            text: {
                                content: description
                            },
                        },
                    ],
                },
                [dbInfo[0].locationID]: { 
                    rich_text: [
                        { 
                            type: 'text',
                            text: {
                                content: location
                            },
                        },
                    ],
                },
                [dbInfo[0].dateID]: { 
                    date: { 
                    start: startDate, // ISO 8601
                    end: endDate,     // ISO 8601
                    time_zone: "Canada/Pacific"       
                    },
                },
                [dbInfo[0].personID]: { 
                    multi_select: people 
                    
                },
            }
        })
    } catch (err) {
        console.error(err);
    }
}


function loadIDsFromJSON() {
    if (!fs.existsSync(IDFile)) {
        setDatabase();
    } 
    let json = fs.readFileSync(IDFile);
    dbInfo = JSON.parse(json);   
}




/**HELPER FUNCTIONS */
// Description: Get the properties of the databases.S
//              Used to get the IDs for each heading



async function setDatabase() {

    const response = await notion.databases.retrieve({ database_id: process.env.NOTION_DATABASE_ID});

    let databaseID = response.id.replaceAll("-", "");
    let eventID = response.properties.Event.id;
    let descriptionID = response.properties.Description.id;
    let locationID = response.properties.Location.id;
    let personID = response.properties.Person.id;
    let dateID = response.properties.Date.id;

    dbInfo = [ {
            eventID: eventID,
            descriptionID: descriptionID,
            locationID: locationID,
            personID: personID,
            dateID: dateID
        }
    ]
    var json = JSON.stringify(dbInfo, null, 2);
    // write the database information to a JSON file
    fs.writeFile(String(IDFile), json, err => {
        if (err) throw err;
        console.log("Database info is saved!");
    });
    return true;
}
// setDatabase() 


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

module.exports = { createEvent, getTags, setDatabase };