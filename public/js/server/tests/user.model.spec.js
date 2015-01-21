var Model = require("../models/user"),
    dbMockup = {};

describe("Models", function(){
    it("should  create a new model", function(next){
        var model = new Model(dbMockup);
        expect(model.db).toBeDefined();
        next();
    });
});