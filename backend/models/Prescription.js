const mongoose = require("mongoose");

const PrescriptionSchema = new mongoose.Schema({

doctor:{
 type:mongoose.Schema.Types.ObjectId,
 ref:"Doctor"
},

patient:{
 type:mongoose.Schema.Types.ObjectId,
 ref:"Patient"
},

medicines:[
{
 medicine:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Medicine"
 },
 dosage:String,
 instruction:String
}
],

labtests:[
{
 type:mongoose.Schema.Types.ObjectId,
 ref:"LabTest"
}
]

});

module.exports = mongoose.model("Prescription",PrescriptionSchema);