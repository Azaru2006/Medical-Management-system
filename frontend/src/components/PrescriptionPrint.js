import React from "react";

export default function PrescriptionPrint({ prescription }) {
  if (!prescription) return null;

  const handlePrint = () => {
    const content = document.getElementById("rx-print-area").innerHTML;

    const win = window.open("", "_blank");

    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Prescription — ${prescription.patient?.name || ""}</title>

        <style>

          body{
            font-family: Arial, sans-serif;
            padding:40px;
            color:#0f2744;
          }

          .header{
            display:flex;
            justify-content:space-between;
            border-bottom:3px solid #1d6fa4;
            padding-bottom:15px;
            margin-bottom:25px;
          }

          .hospital{
            font-size:22px;
            font-weight:bold;
          }

          .rx{
            background:#1d6fa4;
            color:white;
            padding:6px 14px;
            border-radius:20px;
            font-weight:bold;
          }

          .info{
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:10px;
            margin-bottom:25px;
          }

          .box{
            background:#f5f8fc;
            padding:10px 14px;
            border-left:3px solid #1d6fa4;
          }

          .label{
            font-size:11px;
            text-transform:uppercase;
            color:#7a92ab;
            font-weight:bold;
          }

          .value{
            font-size:14px;
            font-weight:600;
          }

          .section{
            font-size:15px;
            font-weight:bold;
            margin-bottom:10px;
            border-left:4px solid #1d6fa4;
            padding-left:8px;
          }

          ul{
            list-style:none;
            padding:0;
            margin-bottom:25px;
          }

          li{
            padding:8px 12px;
            border-bottom:1px solid #dde3ec;
          }

          .notes{
            background:#f5f8fc;
            padding:12px;
            border-left:4px solid #1d6fa4;
            margin-bottom:35px;
          }

          .footer{
            display:flex;
            justify-content:space-between;
            margin-top:40px;
          }

          .sign{
            text-align:center;
          }

          .line{
            border-top:1px solid black;
            width:160px;
            margin:0 auto 6px;
          }

        </style>
      </head>

      <body>${content}</body>

      </html>
    `);

    win.document.close();
    win.focus();

    setTimeout(() => {
      win.print();
      win.close();
    }, 400);
  };

  return (
    <div>

      <div id="rx-print-area">

        {/* HEADER */}

        <div className="header">

          <div>
            <div className="hospital">🏥 City Hospital</div>
            <div style={{ fontSize: 12, color: "#7a92ab" }}>
              Medical Prescription
            </div>
          </div>

          <div className="rx">Rx</div>

        </div>

        {/* PATIENT + DOCTOR */}

        <div className="info">

          <div className="box">
            <div className="label">Patient</div>
            <div className="value">
              {prescription.patient?.name || "—"}
            </div>
          </div>

          <div className="box">
            <div className="label">Doctor</div>
            <div className="value">
              {prescription.doctor?.name || "—"}
            </div>
          </div>

        </div>

        {/* MEDICINES */}

        <div className="section">💊 Medicines</div>

        <ul>

          {prescription.medicines?.length > 0 ? (

            prescription.medicines.map((m, i) => (

              <li key={i}>

                <strong>{m.medicine?.name}</strong>

                {(m.dosage || m.instruction) && (

                  <div style={{ fontSize: 12, color: "#7a92ab" }}>
                    {m.dosage && `Dosage: ${m.dosage}`}
                    {m.instruction && ` | ${m.instruction}`}
                  </div>

                )}

              </li>

            ))

          ) : (

            <li>No medicines prescribed</li>

          )}

        </ul>

        {/* LAB TESTS */}

        <div className="section">🔬 Lab Tests</div>

        <ul>

          {prescription.labtests?.length > 0 ? (

            prescription.labtests.map((t, i) => (

              <li key={i}>
                {t.testName}
              </li>

            ))

          ) : (

            <li>No lab tests ordered</li>

          )}

        </ul>

        {/* NOTES */}

        {prescription.notes && (

          <div className="notes">

            <div
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                fontWeight: "bold",
                marginBottom: 6,
                color: "#7a92ab"
              }}
            >
              Notes
            </div>

            {prescription.notes}

          </div>

        )}

        {/* SIGNATURES */}

        <div className="footer">

          <div className="sign">
            <div className="line"></div>
            Doctor Signature
          </div>

          <div className="sign">
            <div className="line"></div>
            Authorized Signatory
          </div>

        </div>

      </div>

      {/* PRINT BUTTON */}

      <div style={{ textAlign: "center", marginTop: 20 }}>

        <button
          className="btn btn-primary"
          onClick={handlePrint}
        >
          🖨️ Print / Download
        </button>

      </div>

    </div>
  );
}