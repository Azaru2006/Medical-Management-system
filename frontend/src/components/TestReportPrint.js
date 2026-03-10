import React from "react";

export default function TestReportPrint({ report }) {
  if (!report) return null;

  const handlePrint = () => {
    const content = document.getElementById("test-report-print-area").innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test Report — ${report.patient?.name}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Lora:wght@600;700&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'DM Sans', sans-serif; color: #0f2744; background: #fff; padding: 40px; }
          .print-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #1d6fa4; padding-bottom: 20px; margin-bottom: 28px; }
          .hospital-name { font-family: 'Lora', serif; font-size: 26px; font-weight: 700; color: #0f2744; }
          .hospital-sub { font-size: 12px; color: #7a92ab; margin-top: 4px; }
          .report-badge { background: #1d6fa4; color: #fff; padding: 6px 16px; border-radius: 999px; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
          .report-title { font-family: 'Lora', serif; font-size: 18px; font-weight: 700; text-align: center; margin: 0 0 24px; color: #0f2744; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 28px; }
          .info-box { background: #f5f8fc; border-left: 3px solid #1d6fa4; padding: 12px 16px; border-radius: 0 8px 8px 0; }
          .info-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #7a92ab; font-weight: 700; margin-bottom: 3px; }
          .info-value { font-size: 15px; font-weight: 600; color: #0f2744; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          thead tr { background: #0f2744; color: #fff; }
          th { padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; letter-spacing: 0.4px; }
          td { padding: 12px 16px; border-bottom: 1px solid #dde3ec; font-size: 14px; }
          tr:nth-child(even) td { background: #f5f8fc; }
          .remarks-section { background: #f5f8fc; border-left: 4px solid #1d6fa4; padding: 14px 18px; border-radius: 0 8px 8px 0; margin-bottom: 36px; }
          .remarks-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; color: #7a92ab; margin-bottom: 6px; }
          .footer { display: flex; justify-content: space-between; padding-top: 24px; border-top: 1px solid #dde3ec; }
          .sign-block { text-align: center; }
          .sign-line { border-top: 1.5px solid #0f2744; width: 160px; margin: 0 auto 6px; }
          .sign-label { font-size: 12px; font-weight: 600; color: #3d5a80; }
        </style>
      </head>
      <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

  const date = report.date
    ? new Date(report.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
    : "—";

  return (
    <div>
      <div id="test-report-print-area">
        <div className="print-header">
          <div>
            <div className="hospital-name">🏥 City Hospital</div>
            <div className="hospital-sub">Laboratory & Diagnostic Services</div>
          </div>
          <div className="report-badge">Lab Report</div>
        </div>

        <div className="report-title">{report.labtest?.testName || "Lab Test"} — Test Report</div>

        <div className="info-grid">
          <div className="info-box"><div className="info-label">Patient Name</div><div className="info-value">{report.patient?.name || "—"}</div></div>
          <div className="info-box"><div className="info-label">Patient Age</div><div className="info-value">{report.patient?.age || "—"}</div></div>
          <div className="info-box"><div className="info-label">Test Name</div><div className="info-value">{report.labtest?.testName || "—"}</div></div>
          <div className="info-box"><div className="info-label">Report Date</div><div className="info-value">{date}</div></div>
        </div>

        <table>
          <thead>
            <tr><th>Parameter</th><th>Result</th><th>Normal Range</th></tr>
          </thead>
          <tbody>
            {report.items?.length > 0 ? report.items.map((item, i) => (
              <tr key={i}>
                <td>{item.parameter}</td>
                <td><strong>{item.result}</strong></td>
                <td style={{ color: "#7a92ab" }}>{item.normalRange}</td>
              </tr>
            )) : (
              <tr><td colSpan="3" style={{ textAlign: "center", color: "#7a92ab" }}>No parameters recorded</td></tr>
            )}
          </tbody>
        </table>

        {report.remarks && (
          <div className="remarks-section">
            <div className="remarks-label">Remarks</div>
            <div>{report.remarks}</div>
          </div>
        )}

        <div className="footer">
          <div className="sign-block"><div className="sign-line"></div><div className="sign-label">Lab Technician</div></div>
          <div className="sign-block"><div className="sign-line"></div><div className="sign-label">Authorized Signatory</div></div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <button className="btn btn-primary" onClick={handlePrint}>🖨️ Print / Download Report</button>
      </div>
    </div>
  );
}