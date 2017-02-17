/**
 *
 * Created by uur on 13/10/14.
 */

var Promise = require("bluebird");
var Request = Promise.promisifyAll(require("request"));
var Xml2js = Promise.promisifyAll(require("xml2js"));

var endpoint = "http://api.iletimerkezi.com/v1/send-sms/get/";

/**
 * Sms Provider - Nexmo
 * @param {object} credentials - Credentials contains gsm and pwd
 * @return {IletiMerkeziProvider}
 * @constructor
 */
function IletiMerkeziProvider(credentials) {

    if (!(this instanceof IletiMerkeziProvider)) {
        return new IletiMerkeziProvider(credentials);
    }

    if (!credentials.gsm || !credentials.pwd) {
        throw new Error("gsm and pwd must be defined in credentials");
    }

    this.credentials = credentials;
}

/**
 * @param {string[]} dstPhones - destination number or array of destination numbers
 * @param {string} text
 * @param {string} srcAlias
 * @return {Promise}
 */

IletiMerkeziProvider.prototype.sendSMS = function (dstPhones, text, srcAlias) {

    var self = this;

    return Promise.map(dstPhones, function (dstPhone) {

        return Request.getAsync({
            uri: endpoint,
            qs: {
                username: self.credentials.gsm,
                password: self.credentials.pwd,
                text: text,
                receipents: dstPhone,
                sender: srcAlias
            },
            timeout: 10000 // Defaults to 10sec
        }).spread(function (response, body) {

            console.log(body);
            console.log("****");
            console.log(response.statusCode);

            return Xml2js.parseStringAsync(body).then(function (result) {
                var status = result && result.response && result.response.status && result.response.status[0];

                var message = status.message && status.message[0];
                var code = status.code && status.code[0];

                if (code == 200) {
                    return {
                        status: "success",
                        message: message
                    }
                }
                else {
                    return {
                        status: "error",
                        message: "Response Code: " + (code || response.statusCode) +
                        " Response Message: " + message
                    }
                }
            });
        });

    });
};

module.exports = IletiMerkeziProvider;

