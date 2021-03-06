var restify = require('restify');
var builder = require('botbuilder');
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: 'a3d2b691-7473-4e53-b5e7-cce343b3feb9'
    , appPassword: 'bLFMFM86@}/quewnmYK784?'
});
//require the csvtojson converter class
var Converter = require("csvtojson").Converter;
// create a new converter object
var converter = new Converter({});
var datasetJSON;
var answerFromBot;
// Listen for messages from users
server.post('/api/messages', connector.listen());
// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("You said: %s", session.message.text);
});
var recognizer = new builder.LuisRecognizer('https://westcentralus.api.cognitive.microsoft.com/luis/v2.0/apps/c7a0386e-2e35-4a29-8045-5b1f6f72823a?subscription-key=20730903132843f284ca37b0bc03438f&spellCheck=true&verbose=true&timezoneOffset=0&q=');
bot.recognizer(recognizer);
// call the fromFile function which takes in the path to your
// csv file as well as a callback function
converter.fromFile("datasetCSV.csv", function (err, result) {
    // if an error has occured then handle it
    if (err) {
        console.log("An Error Has Occured");
        console.log(err);
    }
    // create a variable called json and store
    // the result of the conversion
    var json = result;
    datasetJSON = result;
    // log our json to verify it has worked
    //console.log('json is : ' + JSON.stringify(datasetJSON,null,2));
    bot.dialog('Greetings', function (session, args, next) {
        session.send(args.intent.intent);
    }).triggerAction({
        matches: 'Greetings'
    });
    bot.dialog('cultural_practices', function (session, args, next) {
        session.send('Spray trascel 2 at 2 gram per liter of water');
    }).triggerAction({
        matches: 'cultural_practices'
    });
    bot.dialog('plant_protection', function (session, args, next) {
        session.send('Spray captaf at 2gram per liter of water');
    }).triggerAction({
        matches: 'plant_protection'
    });
    bot.dialog('seeds_planting_material', function (session, args, next) {
        session.send('Sowing seeds of golden acre pride of India Pusa Mukta etc.');
    }).triggerAction({
        matches: 'seeds_planting_material'
    });
    bot.dialog('nutrient_management', function (session, args, next) {
        session.send('Green harvest solution @ 25 grams in 10 litres of water has been adviced to spray during flowering stage.');
    }).triggerAction({
        matches: 'nutrient_management'
    });
});

function findAnswer(jsonObject, intent, entities) {
    var result;
    for (var i in jsonObject) {
        jsonObject[i].intent = jsonObject[i].intent.trim();
        jsonObject[i].entity = jsonObject[i].entity.trim();
        jsonObject[i].entity2 = jsonObject[i].entity2.trim();
    }
    for (var i in jsonObject) {
        if (jsonObject[i].intent == intent) {
            var e1 = checkEntity(entities, jsonObject[i].entity);
            var e2 = checkEntity(entities, jsonObject[i].entity2);
            console.log(e1);
            console.log(e2);
            if (e1 && e2) {
                result = jsonObject[i].answer;
                break;
            }
            else if (e1) {
                result = jsonObject[i].answer;
                break;
            }
            else if (e2) {
                result = jsonObject[i].answer;
                break;
            }
            else {
                result = 'Not Found';
            }
        }
    }
    return result;
}

function checkEntity(array, entity) {
    console.log('array:' + array);
    console.log('entity:' + entity);
    for (var i in array) {
        if (array[i] == entity) return true
    }
    return false;
}