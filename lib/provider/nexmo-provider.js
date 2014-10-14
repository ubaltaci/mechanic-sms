/**
 *
 * Created by uur on 13/10/14.
 */

var Promise = require("bluebird");
var Request = Promise.promisifyAll(require("request"));

var endpoint = "https://rest.nexmo.com/sms/json";

/**
 * Sms Provider - Nexmo
 * @param {object} credentials - Credentials contains authKey and authSecret
 * @return {NexmoProvider}
 * @constructor
 */
function NexmoProvider(credentials) {

    if (!(this instanceof NexmoProvider)) {
        return new NexmoProvider(credentials);
    }

    if ( !credentials.authKey || !credentials.authSecret ) {
        throw new Error("authKey and authSecret must be defined in credentials");
    }

    this.credentials = credentials;
}

/**
 * @param {string[]} dstPhones - destination number or array of destination numbers
 * @param {string} text
 * @param {string} srcAlias
 * @return {Promise}
 */

NexmoProvider.prototype.sendSMS = function (dstPhones, text, srcAlias) {

    var self = this;

    return Promise.map(dstPhones, function (dstPhone) {

        return Request.postAsync({
            uri: endpoint,
            body: {
                "api_key": self.credentials.authKey,
                "api_secret": self.credentials.authSecret,
                "from": srcAlias,
                "to": dstPhone,
                "text": text
            },
            json: true,
            timeout: 10000 // Defaults to 10sec
        }).spread(function (response, body) {

            var message = body && body.messages && body.messages[0];

            if (response.statusCode === 200 && message) {

                if ( message.status == 0 ) {
                    return {
                        status: "success",
                        message: message["message-id"]
                    }
                }
                else {
                    return {
                        status: "error",
                        message: message["error-text"]
                    }
                }

            }
            else {
                return {
                    status: "error",
                    message: "Nexmo not reachable or post body not suitable, response code: " + response.statusCode
                }
            }
        });

    });
};

module.exports = NexmoProvider;

