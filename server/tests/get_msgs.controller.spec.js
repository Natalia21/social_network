var request = require('request');
describe('GetMsgs', function() {
    it('should respond one dialogue', function (done) {
        request('http://localhost:8888/messages/1/2/3', function (error, response, body) {
            expect(body).toNotBe(null);
            JSON.parse(body).forEach(function(index){
                expect(index.from).toBeDefined();
                expect(index.to).toBeDefined();
                expect(index.text).toBeDefined();
                expect(index.time).toBeDefined();
            });
            done();
        });
    });
    it('should respond dialogues', function (done) {
        request('http://localhost:8888/messages/1', function (error, response, body) {
            expect(body).toNotBe(null);
            JSON.parse(body).forEach(function(index){
                expect(index.from).toBeDefined();
                expect(index.to).toBeDefined();
                expect(index.text).toBeDefined();
                expect(index.time).toBeDefined();
            });
            done();
        });
    });
});