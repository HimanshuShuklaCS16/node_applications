const mongoclient = require('mongodb').MongoClient;
const assert = require('assert');

const url = "mongodb://localhost:27017/";
const dbname = "conFusion";
const dboper = require("./operations.js");

mongoclient.connect(url).then((client) => {
    console.log("connected correctly to the server");
    const db = client.db(dbname);
    dboper.insertDocument(db,{name:"new",description : "test description"},"dishes")
    .then((result)  => {
        console.log("insert document: \n",result.ops);
        return  dboper.findDocuments(db,"dishes");
    })
    .then((docs) => {
            console.log("found documents: \n",docs);
            return dboper.updateDocument(db,{name:"new"},{description:"updated description"},"dishes");
    })
    .then((result) => {
                console.log("updated document: \n",result.result);
                return dboper.findDocuments(db,"dishes");
    })
    .then((docs) => {
                    console.log("found updated documents:\n",docs);
                    return db.dropCollection("dishes");
    })
    .then((result) => {
                        console.log("dropped collection ",result);
                        return client.close();
                    })
                    .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));