const mongoclient = require('mongodb').MongoClient;
const assert = require('assert');

const url = "mongodb://localhost:27017/";
const dbname = "conFusion";
const dboper = require("./operations.js");

mongoclient.connect(url,(err,client) => {
    assert.equal(err,null);
    console.log("connected correctly to the server");
    const db = client.db(dbname);
    dboper.insertDocument(db,{name:"test",description : "test description"},"dishes",(result)  => {
        console.log("insert document: \n",result.ops);
        dboper.findDocuments(db,"dishes",(docs) => {
            console.log("found documents: \n",docs);
            dboper.updateDocument(db,{name:"test"},{name:"uthapizza"},"dishes",(result) => {
                console.log("updated document: \n",result.result);
                dboper.findDocuments(db,"dishes",(docs) => {
                    console.log("found updated documents:\n",docs);
                    db.dropCollection("dishes",(result) => {
                        console.log("dropped collection ",result);
                        client.close();
                    });
            });
        });
});
});


 });
 