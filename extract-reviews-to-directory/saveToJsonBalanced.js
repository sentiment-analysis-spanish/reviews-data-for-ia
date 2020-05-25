const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const url = process.env["database_url"];
const fs = require("fs");
console.log(url)
const pathoutbundle = "../data/"

MongoClient.connect(url, async function (err, db) {
  if (err) throw err;
  var dbo = db.db("reviews-scraping");

  //db.getCollection('NewsContentScraped').aggregate([
  //  { $match : { newspaper : "elpais" } },
  //  { $sample : { size: 3 } }
  //])

  console.log("Starting search with bad reviews")

  const queryNegative = {"rate": { "$lt": 0.3 }, "$expr": { "$gt": [ { "$strLenCP": "$content" }, 150 ] }}


  const searchPromisified = (query) => {
    return new Promise((resolve, reject)=>{
      dbo.collection("Reviews").find(query).toArray(function (err, result) {
        if (err) return reject(err)
        return resolve(result);
      })
    })
  }

  
  const resultsNegative = await searchPromisified(queryNegative)

  console.log("negative found " + resultsNegative.length)


  let dataNeg = JSON.stringify(resultsNegative);
  fs.writeFileSync(pathoutbundle + "negative_reviews.json", dataNeg);

  console.log("----------------")
  console.log("Starting search with positive reviews")


  //  { $match : { newspaper : "elpais" } },
  //  { $sample : { size: 3 } }
  //]
  const queryPositive = {"rate": { "$gt": 0.8 },"$expr": { "$gt": [ { "$strLenCP": "$content" }, 150 ] }}

  const searchAggragatePromisified = (query) => {
    return new Promise((resolve, reject)=>{
      dbo.collection("Reviews").find(query).limit(resultsNegative.length).toArray(function (err, result) {
        if (err) return reject(err)
        return resolve(result);
      })
    })
  }

  resultsPositive = await searchAggragatePromisified(queryPositive)




  console.log("positive: found " + resultsPositive.length)

  let dataPositive = JSON.stringify(resultsPositive);
  fs.writeFileSync(pathoutbundle + "positive_reviews.json", dataPositive);


  db.close();

});