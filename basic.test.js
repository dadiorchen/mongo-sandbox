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
      name: String,
      comments: [
        {
          body: String,
        }
      ],
      age: Number,
    });

    //instance methods
    kittySchema.methods.speak = function () {
      const greeting = this.name
        ? "Meow name is " + this.name
        : "I don't have a name";
      console.log(greeting);
    }

    //static method
    kittySchema.statics.findByName = function(name){
      return this.find({ name });
    }

    //query method
    kittySchema.query.byName = function(name){
      return this.where({name});
    }

    //virtual
    kittySchema.virtual("ageString").get(function(){
      return this.age + " year";
    });

    //middleware
    kittySchema.pre("save", function(){
      console.log("To save...");
    });


    const Kitten = mongoose.model('Kitten', kittySchema);



    const silence = new Kitten({ 
      name: 'Silence',
      comments: [{
        body: "haha",
      }],
      age: 1,
    });

    //_id is a object
    expect(silence._id.toString()).toMatch(/^.*$/);
    console.log(silence.name); // 'Silence'
    silence.speak();

    await silence.save();
    let r = await Kitten.find({ name: /silence/i });


    console.log("r:", r);

    r = await Kitten.findByName("Silence");
    expect(r).toHaveLength(1);
    expect(r[0]).toMatchObject({
      _id: expect.anything(),
    });

    r = await Kitten.find().byName("Silence");
    expect(r).toHaveLength(1);

    r = await Kitten.findOne({age:1});
    expect(r).toBeDefined();
    expect(r.ageString).toBe("1 year");

  });
});
