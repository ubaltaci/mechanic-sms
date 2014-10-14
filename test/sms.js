/**
 *
 * Created by uur on 12/10/14.
 */

var MechanicSms = require("../lib/mechanic-sms");

var expect = require("chai").expect;
var credentials;
var mechanicSms;

describe("mechanic-sms", function () {

    before(function () {
        try {
            credentials = require("./credentials.json");
            mechanicSms = new MechanicSms("TEST", "NEXMO", credentials);
        }
        catch (e) {
            // ??
        }
    });

    it(" -> sms should be delivered to spesified number", function (done) {

        mechanicSms.sendSMS(["905416258925", "05313787806"], "Wasssap up?").then(function (results) {
            var isOK = true;
            var messages = [];
            results.forEach(function(result) {
                if (result.status !== "success") {
                    isOK = false;
                    messages.push(result.message);
                }
            });

            if(!isOK) {
                done(new Error(messages));
            }
            else {
                done();
            }

        }).catch(function(error) {
            done(error);
        });
    });
});