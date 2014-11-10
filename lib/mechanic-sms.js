/**
 *
 * Created by uur on 12/10/14.
 */

var Promise = require("bluebird");
var EscapeTurkish = require("escape-turkish");

var providers = {
    "NEXMO": require("./provider/nexmo-provider")
};

/**
 *
 * @param {string} srcAlias - SMS sender alias
 * @param {string} provider - SMS provider name
 * @param {object} credentials - Credentials contains authKey and authSecret
 * @return {MechanicSms}
 * @constructor
 */
function MechanicSms(srcAlias, provider, credentials) {

    if (!(this instanceof MechanicSms)) {
        return new MechanicSms(srcAlias, provider, credentials);
    }

    if (!providers[provider]) {
        throw new Error("SMS provider not defined: " + provider);
    }

    if (!credentials) {
        throw new Error("Credentials must be defined");
    }

    if (!credentials[provider.toLowerCase()]) {
        throw new Error("Credentials must be defined for provider -> ", provider);
    }
    
    this.srcAlias = srcAlias || "mechanic-sms";
    this.provider = new providers[provider](credentials[provider.toLowerCase()]);
}

/**
 * @param {string[]} dstPhones - destination phone number or array of destination phone numbers
 * @param {string} text
 * @param {string} [srcAlias] - optional parameter defaults to this.srcAlias
 * @return {Promise}
 */
MechanicSms.prototype.sendSMS = function (dstPhones, text, srcAlias) {

    var checkedDstPhones = [];

    srcAlias = srcAlias || this.srcAlias;

    // Do not use forEach if return exist :(
    for (var i = 0; i < dstPhones.length; i++) {
        var dstPhone = dstPhones[i];
        var checkedDstPhone;
        try {
            checkedDstPhone = this._phoneNumberCheck(dstPhone);
            checkedDstPhones.push(checkedDstPhone);
        }
        catch (e) {
            return Promise.reject(e);

        }
    }

    return this.provider.sendSMS(checkedDstPhones, EscapeTurkish(text), srcAlias);
};

/**
 * @param phoneNumber
 * @return {string} - checked and may altered phone number
 * @private
 */
MechanicSms.prototype._phoneNumberCheck = function (phoneNumber) {

    if (!(typeof phoneNumber == "string" || phoneNumber instanceof String)) {
        throw new Error("Phone number must be string: " + phoneNumber);
    }

    // Check all digits whether number or not
    for (var i = 0; i < phoneNumber.length; i++) {
        var digit = phoneNumber[i];
        if (!(digit >= "0" && digit <= "9")) {
            throw new Error("Only numeric characters allowed in phone number: " + phoneNumber);
        }
    }

    if (phoneNumber.length === 12) {
        // Phone number should contain country code and its length should be 12
        if (phoneNumber[0] == "9" && phoneNumber[1] == "0") {
            // If phone number starts with 90
            // then we can assume that its a number belongs to Turkey
            if (phoneNumber[2] == "5") {
                // Phone number must continue as 905..
            }
            else {
                throw new Error("Phone number is not a valid number for Turkey country code: " + phoneNumber);
            }
        }
        else {
            // Another country code other than Turkey
        }
        // Valid phone number
        return phoneNumber;
    }
    else if (phoneNumber.length === 11 && phoneNumber[0] == "0" && phoneNumber[1] == "5") {
        // If phone number's length is 11, then it must continue 05....
        // then we can assume that its a number belongs to Turkey
        return "9" + phoneNumber;
    }
    else if (phoneNumber.length === 10 && phoneNumber[0] == "5") {
        // If phone number's length is 10, then it must continue 5....
        // then we can assume that its a number belongs to Turkey
        return "90" + phoneNumber;
    }
    else {
        throw new Error("Not a valid phone number: " + phoneNumber);
    }
};

module.exports = MechanicSms;