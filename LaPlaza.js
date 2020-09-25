const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const Alexa = require('ask-sdk');
let skill;

exports.handler = async function (event, context) {
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
            && handlerInput.requestEnvelope.request.intent.name === 'laPlaza';
    },
    async handle(handlerInput) {
        // invoke custom logic of the handler
        const product = String(Alexa.getSlotValue(handlerInput.requestEnvelope, 'product'));
        const cantidad = Number(Alexa.getSlotValue(handlerInput.requestEnvelope, 'cantidad'));
        const speechText = 'none';
        try {
            let data = await ddb.get({
                TableName: "LaPlazaProducts",
                Key: {
                    ProductId: 1,
                    ProductName: "Jeans de Hombre.",
                    ProductQuantity: 22
                }
            }).promise();

            const speechText = ProductQuantity + ProductName + 'agregado a la canasta exitosamente';

        } catch (err) {
            const speechText = ProductName + 'no encontrado, por favor intente mas tarde.';
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

        const speechText = 'Sorry, your skill encountered an error';
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
        const speechText = 'Bienvenido a La Plaza, ¿en qué puedo ayudarle?';
        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};
