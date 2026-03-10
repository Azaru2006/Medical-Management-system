import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function PatientEMR() {

  const { id } = useParams();
  const [records, setRecords] = useState([]);

  useEffect(() => {

    axios
      .get(`http://localhost:5000/api/emr/patient/${id}`)
      .then((res) => {
        setRecords(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

  }, [id]);

  return (
    <div>

      <h2>Patient EMR</h2>

      {records.length === 0 ? (
        <p>No medical records available</p>
      ) : (
        records.map((record) => (
          <div key={record._id}>

            <p><b>Diagnosis:</b> {record.diagnosis}</p>
            <p><b>Symptoms:</b> {record.symptoms}</p>
            <p><b>Prescription:</b> {record.prescription}</p>
            <p><b>Lab Tests:</b> {record.labTests}</p>

            <hr />

          </div>
        ))
      )}

    </div>
  );
}

export default PatientEMR;