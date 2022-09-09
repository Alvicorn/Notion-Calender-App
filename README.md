# Notion Calendar Event Creator
This desktop application is designed to create an event (singleton or recurring) and add each event(s) to a shared Notion calender. The app takes advantage of web technologies through Electron.js.


## Getting Started
### Part A Setting Up Notion
   
   1. Create a [Notion](https://www.notion.so) account.
   2. Go to [My Integrations](https://www.notion.so/my-integrations) create a new integration. 
   3. Once the secret key is generated, save it and do not share it!
   4. Go back to your Notion home page a create a new database.
   5. //insert how to add integration to the api key//
   6. Get the Notion database id by extracting it from the URL. The id is the substring after the root address and before the query [?].
   >www.notion.so/<b style="color:red">396d2555e131486d820d11de290db628</b>?v=6a0661562a7a4b7fa7033bdf5c219361

   7. Finally, create the following schema (order does not matter). Note that the schema reflects the names of the heading: 
   
|Title|Description|Tag|Date|Description|    
|-----|:---------:|--:|---:|----------:|




---
---


## Development
* To run, type in the terminal
```
npm start
```
