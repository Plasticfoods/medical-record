const Patient = require("../models/patient");
const Doctor = require("../models/doctor");

module.exports.add_prescription = async (req, res) => {
  const healthID = req.params.healthID;
  const chiefComplaints = Object.values(req.body.chiefComplaints);
  const medicines = Object.values(req.body.medicines);
  const investigations = Object.values(req.body.investigations);
  const advices = Object.values(req.body.advices);
  const notes = req.body.notes.note;
  const diagnosis = req.body.diagnosis.diagno;
  const procedureConducted = req.body.procedureConducted.procedure;
  const { doctor, doctormobile, hospital } = req.body;


  try {
    const patient = await Patient.findOneAndUpdate({ healthID },
      {
        $push: {
          prescriptions: {
            doctor,
            doctormobile,
            hospital,
            notes,
            diagnosis,
            procedureConducted,
            chiefComplaints,
            medicines,
            investigations,
            advices,
          },
        },
      }
    );

    const doctorID = req.doctor._id
    const doctor = await Doctor.findOneAndUpdate({ _id: doctorID }, {
      $push: {
        prescriptions: {
          doctor,
          doctormobile,
          hospital,
          notes,
          diagnosis,
          procedureConducted,
          chiefComplaints,
          medicines,
          investigations,
          advices,
        },
      },
    }, { new: true });

    res.status(200).json({ patient });
  } catch (err) {
    res.status(404).json({ msg: "Something Went Wrong!" });
  }
};

module.exports.view_prescription = async (req, res) => {
  const healthID = req.params.healthID;
  const id = req.params.id;
  try {
    const patient = await Patient.findOne({ healthID });
    const prescription = patient.prescriptions.filter((pres) => pres._id == id);
    res.status(200).json({ prescription: prescription[0], patient });
  } catch (err) {
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

module.exports.view_prescription2 = async (req, res) => {
  const { prescriptionID } = req.params
  try {
    let prescription = null;
    let patient = null;
    let flag = false;
    
    const patients = await Patient.find();
    patients.forEach(currPatient => {
      currPatient.prescriptions.forEach(pres => {
        if (pres._id == prescriptionID) {
          prescription = pres;
          patient = currPatient;
          flag = true;
          return; // Exit the function
        }
      });
      if(flag) return; // Exit the function
    });
    res.status(200).json({ prescription, patient });
  } catch (err) {
    console.log('Error while fetching prescriptions from doctor view', err)
    res.status(500).json({ message: "Something Went Wrong" });
  }
}
