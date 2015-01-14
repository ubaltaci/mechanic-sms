/**
 *
 * Created by uur on 13/10/14.
 */

var Promise = require("bluebird");
var Twilio = require("twilio");

/**
 * Sms Provider - Twilio
 * @param {object} credentials - Credentials contains authKey and authSecret
 * @return {TwilioProvider}
 * @constructor
 */
function TwilioProvider(credentials) {

    if (!(this instanceof TwilioProvider)) {
        return new TwilioProvider(credentials);
    }

    if ( !credentials.authKey || !credentials.authSecret ) {
        throw new Error("authKey and authSecret must be defined in credentials");
    }

    this.credentials = credentials;
    this.client = Twilio(credentials.authKey, credentials.authSecret);
}

/**
 * @param {string[]} dstPhones - destination number or array of destination numbers
 * @param {string} text
 * @param {string} srcAlias
 * @return {Promise}
 */

TwilioProvider.prototype.sendSMS = function (dstPhones, text, srcAlias) {

    var self = this;

    return Promise.map(dstPhones, function (dstPhone) {

        return new Promise(function (resolve, reject) {
            if(dstPhone[0] != "+") {
                dstPhone = "+" + dstPhone;
            }
            self.client.sendMessage({
                from: srcAlias,
                to: dstPhone,
                body: text
            }, function(err, message) {
                if(err) {
                   return reject(err);
                }
                return resolve();
            });
        });
    });
};

module.exports = TwilioProvider;

