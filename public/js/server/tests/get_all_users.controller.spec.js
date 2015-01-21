var request = require('request');
describe("GetAllUserCtrl", function() {
    it("should respond", function (done) {
        request("http://localhost:8888/users", function (error, response, body) {
            expect(body).toNotBe(null);
            JSON.parse(body).forEach(function(index){
             //   expect(index._id).toBeDefined();
                expect(index.first_name).toBeDefined();
                expect(index.last_name).toBeDefined();
                expect(index.email).toBeDefined();
                expect(index.friends).toBeDefined();
                expect(index.messages).toBeUndefined();
                expect(index.password).toBeUndefined();
            });
            done();
        });
    });
});