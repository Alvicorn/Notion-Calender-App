require("dotenv").config();
const express = require('express');
const { createEvent, getTags } = require('./notion')
const app = express();

app.set('views', './views');

app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/Notion-API-Calender/views"));


// load tags initially
let tags = [];
let originalTags = [];
getTags().then(data => {
    tags = data;
    tags.forEach(tag => {originalTags.push(tag);});

    // write to json
    var json = JSON.stringify(tags, null, 2);
    var fs = require('fs');
    fs.writeFile("data/people.json", json, 'utf8', err => {
        if (err) {
            return console.log(err);
        } else {    
            console.log("people.json is populated");
        }
    });
});

// update tags everyday
setInterval(async () => {
    tags = await getTags();
    // only update the json file if the lists are different
    const tagsUpdated = (tags, originalTags) => {
        return (
          tags.length === originalTags.length && 
          tags.every((el) => originalTags.includes(el))
        );
    };
    if (tagsUpdated) {
        // write to json
        var json = JSON.stringify(tags, null, 2);
        var fs = require('fs');
        fs.writeFile("data/people.json", json, 'utf8', err => {
            if (err) {
                return console.log(err);
            } else {    
                console.log("people.json is updated");
            }
        });
        // update originalTags
        tags.forEach(tag => {originalTags.push(tag);});
    }


}, 1000 * 60 * 60 * 24 ); // 1000 ms/second * 60 seconds/minute * 60 minutes/hour * 24 hours/day 



app.get("/", (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
})

app.post("/", (req, res) => {
    let eventName = req.body.eventName;
    let description = req.body.description;
    let location = req.body.location;
    let people = [];
    people = req.body.people;
    let startDate = req.body.startDate; //returns a string with date in iso 8601
    let endDate = req.body.endDate; //returns a string with date in iso 8601
    
    // filter the people names and get their peopleIDs by comparing with all possible tags
    let peopleIDs = [];
    if (people != null) {
        if (Array.isArray(people)) { // list of more than one tag
            people.forEach(person => {
                for (let i = 0; i < tags.length; i++) {
                    if (tags[i].name == person) {
                        console.log(tags[i])
                        peopleIDs.push(tags[i]);
                    }
                }
            })
        } else { // only one tag
            for (let i = 0; i < tags.length; i++) {
                if (tags[i].name == people) {
                    console.log(tags[i])
                    peopleIDs.push(tags[i]);
                }
            }
        }
    }

    // dealing with recurring events
    let recurringCheckbox = req.body.recurringCheckbox;
    let monday = req.body.monday;
    let tuesday = req.body.tuesday;
    let wednesday = req.body.wednesday;
    let thursday = req.body.thursday;
    let friday = req.body.friday;
    let saturday = req.body.saturday;
    let sunday = req.body.sunday;
    let recurrences = req.body.recurrences;
    let forever = req.body.forever;

    // setting default values for events
    if(eventName === "")
        eventName = "Untitled Event";
    if (startDate === "")
        startDate = new Date();
    else 
        startDate = new Date(startDate);
    if (endDate === "")
        endDate = new Date();
    else
        endDate = new Date(endDate);


    // for non-recurring events
    if (recurringCheckbox === "on") {
        
        if(recurrences === "")
            recurrences = "0";

        // indicate how many repeats
        let repeat = parseInt(recurrences); // repeat by weeks
        if(forever === "on")
            repeat = 52 * 100 // repeat 100 years

        

        let dayOftheWeek = startDate.getDay(); // DOTW is emumerated starting from 0 for sunday
        // verify that at least one day of the week is repeated
        switch(dayOftheWeek) {
            case 0: // Sunday
                sunday = "on";
                break;
            case 1: // Monday
                monday = "on";
                break;
            case 2: // Tuesday
                tuesday = "on";
                break;
            case 3: // Wednesday
                wednesday = "on";
                break;
            case 4: // Thursday
                thursday = "on";
                break;
            case 5: // Friday
                friday = "on";
                break;
            case 6: // Saturday
                saturday = "on";
                break;
        }

        // an array of the week order
        let weekOrder = [];
        for(let i=0; i < 7; i++)
            weekOrder[i] = ((dayOftheWeek+i) % 7)

        // loop through each week starting from the startDate DOTW
        for(let weekNum = 0; weekNum < repeat; weekNum++) {
            let day = 0;
            while(day < 7) {
                startDate.setHours(startDate.getHours() - 7); // account for PST
                endDate.setHours(endDate.getHours() - 7); // account for PST
                let currentDay = weekOrder[day];
    
                if(currentDay === 0 && sunday === "on") {
                    createEvent({ eventName: eventName, 
                        description: description, 
                        location: location,
                        people: (Array.isArray(peopleIDs) ? peopleIDs  : [peopleIDs].map(id => {
                            console.log(id.name);
                            return {id: id.id};
                        })),
                        startDate: startDate, 
                        endDate: endDate });
                }

                else if(currentDay === 1 && monday === "on") {
                    createEvent({ eventName: eventName, 
                        description: description, 
                        location: location,
                        people: (Array.isArray(peopleIDs) ? peopleIDs  : [peopleIDs].map(id => {
                            console.log(id.name);
                            return {id: id.id};
                        })),
                        startDate: startDate, 
                        endDate: endDate }); 
                }

                else if(currentDay === 2 && tuesday === "on") {
                    createEvent({ eventName: eventName, 
                        description: description, 
                        location: location,
                        people: (Array.isArray(peopleIDs) ? peopleIDs  : [peopleIDs].map(id => {
                            console.log(id.name);
                            return {id: id.id};
                        })),
                        startDate: startDate, 
                        endDate: endDate });
                }

                else if(currentDay === 3 && wednesday === "on") {
                    createEvent({ eventName: eventName, 
                        description: description, 
                        location: location,
                        people: (Array.isArray(peopleIDs) ? peopleIDs  : [peopleIDs].map(id => {
                            console.log(id.name);
                            return {id: id.id};
                        })),
                        startDate: startDate, 
                        endDate: endDate });
                }

                else if(currentDay === 4 && thursday === "on") {
                    createEvent({ eventName: eventName, 
                        description: description, 
                        location: location,
                        people: (Array.isArray(peopleIDs) ? peopleIDs  : [peopleIDs].map(id => {
                            console.log(id.name);
                            return {id: id.id};
                        })),
                        startDate: startDate, 
                        endDate: endDate });
                }

                else if(currentDay === 5 && friday === "on") {
                    createEvent({ eventName: eventName, 
                        description: description, 
                        location: location,
                        people: (Array.isArray(peopleIDs) ? peopleIDs  : [peopleIDs].map(id => {
                            console.log(id.name);
                            return {id: id.id};
                        })),
                        startDate: startDate, 
                        endDate: endDate });  
                }

                else if(currentDay === 6 && saturday === "on") {
                    createEvent({ eventName: eventName, 
                        description: description, 
                        location: location,
                        people: (Array.isArray(peopleIDs) ? peopleIDs  : [peopleIDs].map(id => {
                            console.log(id.name);
                            return {id: id.id};
                        })),
                        startDate: startDate, 
                        endDate: endDate }); 
                }

                // set up for the next day
                startDate.setHours(startDate.getHours()+7);
                endDate.setHours(endDate.getHours()+7);
                startDate.setDate(startDate.getDate() + 1);
                endDate.setDate(endDate.getDate() + 1);
                day++;
            }
        }
    }

    else {

        createEvent({ eventName: eventName, 
            description: description, 
            location: location,
            people: (Array.isArray(peopleIDs) ? peopleIDs  : [peopleIDs].map(id => {
                console.log(id.name);
                return {id: id.id};
            })),
            startDate: startDate, 
            endDate: endDate });
    }

    res.redirect("/results");
})
app.get("/results", (req, res) => {
    res.sendFile(__dirname + "/views/results.html");
})

app.listen(process.env.PORT);
