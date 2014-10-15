/**
 *
 * Created by uur on 12/10/14.
 */

var MechanicSms = require("../lib/mechanic-sms");

var expect = require("chai").expect;
var credentials;
var mechanicSms;

describe("Mechanic SMS Test", function () {
    var provider = "NEXMO";
    var senderAlias = "TEST";

    describe("Not Valid Parameters", function () {
        it("should fail with no credentials", function () {
            expect(function () {
                new MechanicSms(senderAlias, provider, credentials);
            }).to.throw(Error);
        });

        it("should fail with authKey and/or authSecret missing in credentials", function () {
            expect(function () {
                new MechanicSms(senderAlias, provider, {
                    "authKey": "",
                    "authSecret": ""
                });
            }).to.throw(Error);
            expect(function () {
                new MechanicSms(senderAlias, provider, {
                    "authKey": "*******"
                });
            }).to.throw(Error);
            expect(function () {
                new MechanicSms(senderAlias, provider, {
                    "authSecret": "******"
                });
            }).to.throw(Error);
        });

        it("should fail with not valid provider name", function () {
            expect(function () {
                new MechanicSms(senderAlias, "*****", {
                    "authKey": "",
                    "authSecret": ""
                });
            }).to.throw(Error);
        });
    });

    describe("Valid Credentials", function () {
        var msgToSend = "Merhaba, inanılmaz fırsatlar seni bekliyor, http://goo.gl/od8tlB linkine tıkla, MacBook Pro kazanma şansını kaçırma";

        before(function (done) {
            try {
                credentials = require("./credentials.json");
                mechanicSms = new MechanicSms(senderAlias, provider, credentials);
                done();
            }
            catch (error) {
                done(error);
            }
        });

        it.skip("should do what for empty list", function (done) {
            mechanicSms.sendSMS([], msgToSend).then(function (results) {
                done();
            }).catch(function (error) {
                done(error);
            });
        });

        it.skip("should deliver sms to valid numbers", function (done) {
            var phoneNumbers = ["5313787806", "05351035351"];
            mechanicSms.sendSMS(phoneNumbers, msgToSend).then(function (results) {
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