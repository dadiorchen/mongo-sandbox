// getting-started.js
const mongoose = require('mongoose');
const mongodb = require("./mongoClient");

describe("basic", () => {

  it("basic", async () => {
//    await mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true});
    await mongodb.connect();
//    await new Promise((res, rej) => {
//      const db = mongoose.connection;
//      db.on('error', (e) => {
//        console.error(e, 'connection error:')
//      });
//      db.once('open', function() {
//        // we're connected!
//        const kittySchema = new mongoose.Schema({
//          name: String
//        });
//        const Kitten = mongoose.model('Kitten', kittySchema);
//        res();
//      });
//    });
    const kittySchema = new mongoose.Schema({
      name: String
    });
    kittySchema.methods.speak = function () {
      const greeting = this.name
        ? "Meow name is " + this.name
        : "I don't have a name";
      console.log(greeting);
    }
    const Kitten = mongoose.model('Kitten', kittySchema);
    const silence = new Kitten({ name: 'Silence' });
    console.log(silence.name); // 'Silence'
    silence.speak();
    await silence.save();
    const r = await Kitten.find({ name: /silence/i });
    console.log("r:", r);
  });
});
