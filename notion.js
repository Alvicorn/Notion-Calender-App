const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_API_KEY});


// Description: Create a new event for Notion calender
//              @parm eventName: name of the event
//              @parm description: description of event
//              @parm alvin: boolean for alvin if tagged for the event
//              @parm kayla: boolean for kayla if tagged for the event
//              @parm startDate: start date and time given is ISO 8601
//              @parm endDate: end date and time given is ISO 8601
async function createEvent({ eventName, description, people, startDate, endDate }) {
    
    
    
    newPage = await notion.pages.create({
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
            [process.env.NOTION_DATE_ID]: { 
                date: { 
                  start: startDate, // ISO 8601
                  end: endDate,     // ISO 8601
                  time_zone: "Canada/Pacific"       
                },
            },
            [process.env.NOTION_TAG_ID]: { 
                multi_select: people.map(person => { 
                    return {id: person.id}
                })
            },
        }
    })

}


// // Description: Create a new event for Notion calender
// //              @parm eventName: name of the event
// //              @parm description: description of event
// //              @parm alvin: boolean for alvin if tagged for the event
// //              @parm kayla: boolean for kayla if tagged for the event
// //              @parm startDate: start date and time given is ISO 8601
// //              @parm endDate: end date and time given is ISO 8601
// async function createEvent({ eventName, description, kayla, alvin, startDate, endDate }) {
    
    
    
//     newPage = await notion.pages.create({
//         parent: { database_id: process.env.NOTION_DATABASE_ID},
//         properties: {
//             [process.env.NOTION_EVENT_ID]: { 
//                 title: [
//                     {
//                         type: 'text',
//                         text: {
//                             content: eventName
//                         },
//                     },
//                 ],
//             },        
//             [process.env.NOTION_DESCRIPTION_ID]: { 
//                 rich_text: [
//                     { 
//                         type: 'text',
//                         text: {
//                             content: description
//                         },
//                     },
//                 ],
//             },
//             [process.env.NOTION_DATE_ID]: { 
//                 date: { 
//                   start: startDate, // ISO 8601
//                   end: endDate,     // ISO 8601
//                   time_zone: "Canada/Pacific"       
//                 },
//             },
//             [process.env.NOTION_TAG_ID]: { 
//                 multi_select: []
//             },
//         }
//     })

//     pageId = newPage.id;
//     // add tags
//     if(alvin === "on" && kayla === "on")
//         bothUpdate(pageId)
//     else if(alvin == "on")
//         alvinUpdate(pageId);
//     else if(kayla === "on")
//         kaylaUpdate(pageId);


// }

async function bothUpdate(pageID) {
    update = await notion.pages.update({
        page_id: pageID,
        properties: {
            [process.env.NOTION_TAG_ID]: { 
                multi_select: [{ id: process.env.NOTION_KAYLA_ID}, { id: process.env.NOTION_ALVIN_ID}]
            },
        }       
    })
}

async function alvinUpdate(pageID) {
    update = await notion.pages.update({
        page_id: pageID,
        properties: {
            [process.env.NOTION_TAG_ID]: { 
                multi_select: [{ id: process.env.NOTION_ALVIN_ID}]
            },
        }       
    })
}

async function kaylaUpdate(pageID) {
    update = await notion.pages.update({
        page_id: pageID,
        properties: {
            [process.env.NOTION_TAG_ID]: { 
                multi_select: [{ id: process.env.NOTION_KAYLA_ID}]
            },
        }       
    })
}


// getTags().then(people => {
//     createEvent({ 
//             eventName: "Test", 
//             description: "test1", 
//             people: people, 
//             startDate: "2022-05-26 15:00:00.000", 
//             endDate: "2022-05-27 15:00:00.000" 
//     });
// })


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
        return notionPropertiesByID(database.properties)[process.env.NOTION_TAG_ID].multi_select.options;

    // let IDArray = notionPropertiesByID(database.properties)[process.env.NOTION_TAG_ID];  
    // // console.log(IDArray.multi_select.options);
    // return IDArray.multi_select.options.map(option => {
    //     return { id: option.id, name: option.name}
    // }); // filter out the colour info
} 


function notionPropertiesByID(properties) {
    return Object.values(properties).reduce((obj, property) => {
        const {id, ...rest} = property;
        return {...obj, [id]: rest};
    }, {});
}

module.exports = { createEvent, getTags };