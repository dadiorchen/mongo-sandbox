const mongoose = require('mongoose');

describe("Unit test, mock mongo", () => {

  it("", async () => {

    const speciesSchema  = new mongoose.Schema({
      name: String,
    });
    const Species = mongoose.model('Species', speciesSchema);

    const kittySchema = new mongoose.Schema({
      name: String,
      comments: [
        {
          body: String,
        }
      ],
      age: Number,
      species: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Species' 
      },
    });

    kittySchema.methods.speak = function () {
      const greeting = this.name
        ? "Meow name is " + this.name
        : "I don't have a name";
      console.log(greeting);
    }

    //static method
    kittySchema.statics.findByName = function(name){
      console.log("findByName...");
      return this.find({ name });
    }

    const Kitten = mongoose.model('Kitten', kittySchema);

    Kitten.find = jest.fn()
      .mockResolvedValue([{
        _id: "xxx",
      }]);

    r = await Kitten.findByName("Silence");
    expect(r).toHaveLength(1);
    expect(r[0]).toMatchObject({
      _id: expect.anything(),
    });

    Kitten.find = jest.fn(() => ({
      byName: jest.fn()
        .mockResolvedValue([{
          _id: "xxx",
        }]),
    }));

    r = await Kitten.find().byName("Silence");
    expect(r).toHaveLength(1);

    //mock
    Kitten.findOne = jest.fn()
      .mockResolvedValue({
        ageString: "1 year",
        species: "xxxx",
      });
    r = await Kitten.findOne({age:1});
    expect(r).toBeDefined();
    expect(r.ageString).toBe("1 year");

    //populate
    console.log("r species:", r.species);
    expect(r.species.toString()).toMatch(/[0-9a-z]+/);

    //mock
    Kitten.findOne = jest.fn()
      .mockReturnValue({
        populate: jest.fn()
          .mockResolvedValue({
            species: {
              _id: "xxx",
            },
          }),
      });
    r = await Kitten.findOne({age:1})
      .populate("species");

    console.log("r species:", r.species);
    expect(r.species).toMatchObject({
      _id: expect.anything(),
    });

  });
});
