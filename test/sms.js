/**
 *
 * Created by uur on 12/10/14.
 */

var MechanicSms = require("../lib/mechanic-sms");

var expect = require("chai").expect;
var credentials;
var mechanicSmsForNexmo;
var mechanicSmsForTwilio;

describe("Mechanic SMS Test", function () {
    var provider = "NEXMO";
    var provider2 = "TWILIO";
    var senderAlias = "TEST";

    describe("Not Valid Parameters", function () {
        it("should fail with no credentials", function () {
            expect(function () {
                new MechanicSms(senderAlias, provider, credentials);
            }).to.throw(Error);
        });

        it("should fail with if credentials not exist for defined provider", function () {
            expect(function () {
                new MechanicSms(senderAlias, provider, {});
            }).to.throw(Error);
            expect(function () {
                new MechanicSms(senderAlias, provider, {
                    "someOtherProvider": "******"
                });
            }).to.throw(Error);
        });

        it("should fail with not valid provider name", function () {
            expect(function () {
                new MechanicSms(senderAlias, "*****");
            }).to.throw(Error);
        });
    });

    describe("Valid Credentials", function () {
        var msgToSend = "Merhabaa, inanılmaz fırsatlar seni bekliyor, http://goo.gl/od8tlB linkine tıkla, MacBook Pro kazanma şansını kaçırma";

        before(function (done) {
            try {
                credentials = require("./credentials.json");
                mechanicSmsForNexmo = new MechanicSms(senderAlias, provider, credentials);
                mechanicSmsForTwilio = new MechanicSms("+12248364941", provider2, credentials);
                done();
            }
            catch (error) {
                done(error);
            }
        });

        it("should do what for empty list", function (done) {
            mechanicSmsForNexmo.sendSMS([], msgToSend).then(function (results) {
                done();
            }).catch(function (error) {
                done(error);
            });
        });

        it("should deliver sms to valid numbers for twilio", function (done) {
            var phoneNumbers = ["5416258925"];
            mechanicSmsForTwilio.sendSMS(phoneNumbers, msgToSend).then(function (results) {
                expect(results).to.have.length(phoneNumbers.length);
                done();
            }).catch(function (error) {
                done(error);
            });
        });

        it("should deliver sms to valid numbers for nexmo", function (done) {
            var phoneNumbers = ["5416258925"];
            mechanicSmsForNexmo.sendSMS(phoneNumbers, msgToSend).then(function (results) {
                var isOK = true;
                var messages = [];
                results.forEach(function (result) {
                    if (result.status !== "success") {
                        isOK = false;
                        messages.push(result.message);
                    }
                });
                expect(results).to.have.length(phoneNumbers.length);
                expect(isOK).to.be.true;
                expect(messages).to.be.empty;
                done();
            }).catch(function (error) {
                done(error);
            });
        });

    });
});