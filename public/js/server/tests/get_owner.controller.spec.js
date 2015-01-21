var request = require('request');
describe("GetOwner", function() {
    it("should respond to owner", function (done) {
        request("http://localhost:8888/owner", function (error, response, body) {
            expect(body).toNotBe(null);
            expect(JSON.parse(body).length).toEqual(1);
            expect(JSON.parse(body)[0]._id).toBeDefined();
            expect(JSON.parse(body)[0].first_name).toBeDefined();
            expect(JSON.parse(body)[0].last_name).toBeDefined();
            expect(JSON.parse(body)[0].email).toBeDefined();
            expect(JSON.parse(body)[0].friends).toBeDefined();
            expect(JSON.parse(body)[0].messages).toBeUndefined();
            expect(JSON.parse(body)[0].password).toBeUndefined();
            done();
        });
    });
});