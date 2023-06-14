const express = require("express");
const seatRouter = express.Router();
const { seatModel } = require("../Models/seatModel");

// This Route is created for getting all Seats details.
seatRouter.get("/", async (req, res) => {
  try {
    let seat = await seatModel.find().sort({seatNumber:1});
    res.json({ seats: seat });
  } catch (error) {
    res.json({ err: error });
  }
});

// This Route is created for booking seates.
// First of all it is getting all availible seats and if availible seats are greater then or equal to 
// input then it proceed further otherwise it returns seats not availible.

seatRouter.patch("/book", async (req, res) => {
  try {
    const seatAvail = await seatModel.find({ isBooked: false }).sort({seatNumber:1});

    if (seatAvail.length < req.body.number) {
      if(seatAvail.length<1){
      res.json({ message: "Sorry No Seat are availible" });

      }else{

        res.json({ message: `Only ${seatAvail.length} seats availible` });
      }
    } else {
      const seat = await seatModel.find().sort({seatNumber:1});
      let reservedSeats;
      let count = 0;

// In this loop it is checking for seats availible in one line.
// if seats are availible then it returns seat numbers.

      for (let i = 0; i <= seat.length; i = i + 7) {
        let arr = [];

        for (let j = i; j < i + 7; j++) {
          if (seat[j].isBooked == false) {
            arr.push(seat[j].seatNumber);
            if (arr.length == req.body.number) {
              count++;
              await seatModel.updateMany(
                { seatNumber: { $in: arr } },
                { $set: { isBooked: true } }
              );
              reservedSeats = arr;

              break;
            }
          } else {
            arr = [];
          }
          if (seat[j + 1] == undefined) {
            break;
          }
        }
        if (count == 1) {
          break;
        }
      }

// If no seats are availible in one line then it will go in this condition and book nearest seats.
// and it will return seats number as output.
      if (count === 0) {
        let i = 0;
        let j = 0;
        let arr = [];
        let min = +Infinity;
        while (j < seatAvail.length) {
          if (j < req.body.number - 1) {
            j++;
          } else {
            if (seatAvail[j].seatNumber - seatAvail[i].seatNumber < min) {
              arr = [];
              min = seatAvail[j].seatNumber - seatAvail[i].seatNumber;
              for (let k = i; k <= j; k++) {
                arr.push(seatAvail[k].seatNumber);
              }
            }
            i++;
            j++;
          }
        }
        await seatModel.updateMany(
          { seatNumber: { $in: arr } },
          { $set: { isBooked: true } }
        );

        res.json({ seatNo: arr });
      } else {
        res.json({ seatNo: reservedSeats });
      }
    }
  } catch (error) {
    res.json({ err: error });
  }
});


// This Route is created for adding new seats.
// This is only accessible for admins.
seatRouter.post("/add", async (req, res) => {
  try {
    const seat = await seatModel.insertMany(req.body);
    res.json({ message: "seats added successfully" });
  } catch (error) {
    res.json({ err: error });
  }
});


// This Route is created for reset all seats availible.
// This is only accessible for admins.
seatRouter.patch("/reset", async (req, res) => {
  try {
    await seatModel.updateMany({}, { $set: { isBooked: false } });
    res.json({ message: "seats reseted successfully" });
  } catch (error) {
    res.json({ err: error });
  }
});

module.exports = { seatRouter };
