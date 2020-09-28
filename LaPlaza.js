const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const Alexa = require('ask-sdk');
let skill;

exports.handler = async function (event, context) {
    debugger;
    //console.log('REQUEST ' + JSON.stringify(event));
    if (!skill) {
        skill = Alexa.SkillBuilders.custom()
            .addErrorHandlers(ErrorHandler)
            .addRequestHandlers(
            // delete undefined built-in intent handlers

            LaunchRequestHandler,
            LaPlazaHandler

            ).create();
    }

    const response = await skill.invoke(event, context);
    //console.log('RESPONSE :' + JSON.stringify(response));
    return response;
};
const LaPlazaHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'LaPlaza';
    },
    async handle(handlerInput) {
        // invoke custom logic of the handler
        const product = String(Alexa.getSlotValue(handlerInput.requestEnvelope, 'product'));
        const cantidad = Number(Alexa.getSlotValue(handlerInput.requestEnvelope, 'cantidad'));
        let speechText = 'Sirve';

        try {
            let data = await ddb.get({
                TableName: "LaPlaza",
                Key: {
                    Name: product
                }
            }).promise();

                speechText = data.Item.Name + 'agregado a la canasta con exito';

        } catch (err) {
            speechText = 'No estoy segura';
        };




        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle(handlerInput) {
        return true;
    },
    handle(handlerInput, error) {
        console.log('Error handled: ' + JSON.stringify(error.message));
        // console.log('Original Request was:', JSON.stringify(handlerInput.requestEnvelope.request, null, 2));

        const speechText = 'No sirve';
        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};




const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Bienvenido a La Plaza, ¿en que puedo ayudarle?';
        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};
