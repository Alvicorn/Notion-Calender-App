require("dotenv").config();
const express = require('express');
const { createEvent } = require('./notion')
const app = express();

app.set('views', './views');

app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/Notion-API-Calender/views"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
})

app.post("/", (req, res) => {
    let eventName = req.body.eventName;
    let description = req.body.description;
    let kayla = req.body.kayla; // returns a string "on" or "off"
    let alvin = req.body.alvin; // returns a string "on" or "off"
    let startDate = req.body.startDate; //returns a string with date in iso 8601
    let endDate = req.body.endDate; //returns a string with date in iso 8601
    
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
                        kayla: kayla, 
                        alvin: alvin, 
                        startDate: startDate, 
                        endDate: endDate });  
                }

                else if(currentDay === 1 && monday === "on") {
                    createEvent({ eventName: eventName, 
                        description: description, 
                        kayla: kayla, 
                        alvin: alvin, 
                        startDate: startDate, 
                        endDate: endDate });  
                }

                else if(currentDay === 2 && tuesday === "on") {
                    createEvent({ eventName: eventName, 
                        description: description, 
                        kayla: kayla, 
                        alvin: alvin, 
                        startDate: startDate, 
                        endDate: endDate });  
                }

                else if(currentDay === 3 && wednesday === "on") {
                    createEvent({ eventName: eventName, 
                        description: description, 
                        kayla: kayla, 
                        alvin: alvin, 
                        startDate: startDate, 
                        endDate: endDate });  
                }

                else if(currentDay === 4 && thursday === "on") {
                    createEvent({ eventName: eventName, 
                        description: description, 
                        kayla: kayla, 
                        alvin: alvin, 
                        startDate: startDate, 
                        endDate: endDate });  
                }

                else if(currentDay === 5 && friday === "on") {
                    createEvent({ eventName: eventName, 
                        description: description, 
                        kayla: kayla, 
                        alvin: alvin, 
                        startDate: startDate, 
                        endDate: endDate });  
                }

                else if(currentDay === 6 && saturday === "on") {
                    createEvent({ eventName: eventName, 
                        description: description, 
                        kayla: kayla, 
                        alvin: alvin, 
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
            kayla: kayla, 
            alvin: alvin, 
            startDate: startDate, 
            endDate: endDate });
    }

        

    // res.send("return: "+ recurringCheckbox);
    res.redirect("/results");
})
app.get("/results", (req, res) => {
    res.sendFile(__dirname + "/views/results.html");
})

app.listen(process.env.PORT);
