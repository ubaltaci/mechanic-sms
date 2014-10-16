
var MechanicSms = require("../lib/mechanic-sms");

var expect = require("chai").expect;
var credentials;
var mechanicSms;

describe("Mechanic Phone Number Test", function () {
    var provider = "NEXMO";
    var senderAlias = "TEST";

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

    it("should fail with not string inputs", function () {
       expect(function () {
            return mechanicSms._phoneNumberCheck(5313787806);
        }).to.throw(Error);
        expect(function () {
            return mechanicSms._phoneNumberCheck(53137878.06);
        }).to.throw(Error);
        expect(function () {
            return mechanicSms._phoneNumberCheck(null);
        }).to.throw(Error);
    });

    it("should fail with not numeric inputs", function () {
        expect(function () {
            return mechanicSms._phoneNumberCheck("531378****");
        }).to.throw(Error);
        expect(function () {
            return mechanicSms._phoneNumberCheck("+905313787806");
        }).to.throw(Error);
    });

    it("should fail with not valid phone numbers", function () {
        expect(function () {
            return mechanicSms._phoneNumberCheck("53137878");
        }).to.throw(Error);
        expect(function () {
            return mechanicSms._phoneNumberCheck("904313787806");
        }).to.throw(Error);
        expect(function () {
            return mechanicSms._phoneNumberCheck("0905313787806");
        }).to.throw(Error);
    });

    it("should return 12-length phone numbers with valid numeric inputs", function () {
        var phoneNumber = mechanicSms._phoneNumberCheck("5313787806");
        expect(phoneNumber).to.have.length(12);
        expect(phoneNumber).to.be.a("string");
        expect(phoneNumber).to.match(/^90/);

        phoneNumber = mechanicSms._phoneNumberCheck("05313787806");
        expect(phoneNumber).to.have.length(12);
        expect(phoneNumber).to.be.a("string");
        expect(phoneNumber).to.match(/^90/);

        phoneNumber = mechanicSms._phoneNumberCheck("905313787806");
        expect(phoneNumber).to.have.length(12);
        expect(phoneNumber).to.be.a("string");
        expect(phoneNumber).to.match(/^90/);
    });
});