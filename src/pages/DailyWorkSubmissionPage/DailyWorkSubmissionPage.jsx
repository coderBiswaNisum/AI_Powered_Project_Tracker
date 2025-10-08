/*
DailyWorkSubmissionPage.jsx
React + Tailwind single-file component for "Daily Work Submission Page".

Features implemented:
- Three input modes: Text, Audio (record + upload), Bulk (CSV/XLSX)
- Preview processed AI output and allow in-place edits before saving
- Hooks up to backend endpoints: POST /api/process and POST /api/save

Notes / Backend expectations:
- POST /api/process:
  - For text or bulk: JSON { type: 'text'|'bulk', projectId, date, payload }
  - For audio: multipart/form-data with field 'audio', plus projectId/date/lang
  - Returns JSON { success: true, processedText: string, metadata?: {...} }
- POST /api/save:
  - JSON { projectId, date, originalInput, processedText, authorId }
  - Returns { success: true, id }

Optional dependencies (for Excel parsing):
- xlsx (SheetJS) -> `npm install xlsx`

Replace the endpoints above with your PHP backend endpoints as needed.
*/

import React, { useState, useRef, useEffect } from "react";

export default function DailyWorkSubmissionPage() {
  const [inputMode, setInputMode] = useState("text"); // 'text' | 'audio' | 'bulk'

  // Common fields
  const [projectId, setProjectId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");

  // Text mode
  const charLimit = 5000;

  // Audio mode
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioFile, setAudioFile] = useState(null); // if user uploads file
  const [audioLanguage, setAudioLanguage] = useState("en");

  // Bulk mode
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkRows, setBulkRows] = useState([]);

  // AI / Preview
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [processedText, setProcessedText] = useState("");
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    return () => {
      // cleanup media stream
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
    };
  }, []);

  // ----- Audio recording helpers -----
  const startRecording = async () => {
    setStatusMessage(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatusMessage("Audio recording not supported in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      setAudioChunks([]);

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          setAudioChunks((prev) => [...prev, e.data]);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setAudioFile(new File([blob], `recording-${Date.now()}.webm`, { type: blob.type }));
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      setStatusMessage("Could not start recording — permission denied or no microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    setIsRecording(false);
  };

  const onAudioFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setAudioFile(f);
      setAudioUrl(URL.createObjectURL(f));
    }
  };

  // ----- Bulk parsing helpers -----
  const parseCSV = (text) => {
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) return [];
    const headers = lines[0].split(",").map((h) => h.trim());
    const rows = lines.slice(1).map((ln) => {
      const vals = ln.split(",");
      const obj = {};
      headers.forEach((h, i) => (obj[h] = (vals[i] || "").trim()));
      return obj;
    });
    return rows;
  };

  const onBulkFileChange = async (e) => {
    const f = e.target.files[0];
    setBulkFile(f);
    setBulkRows([]);

    if (!f) return;
    const name = f.name.toLowerCase();
    if (name.endsWith(".csv")) {
      const txt = await f.text();
      const rows = parseCSV(txt);
      setBulkRows(rows);
    } else if (name.endsWith(".xls") || name.endsWith(".xlsx")) {
      // try to dynamically import xlsx
      try {
        const XLSX = await import("xlsx");
        const arrayBuffer = await f.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet);
        setBulkRows(rows);
      } catch (err) {
        console.error(err);
        setStatusMessage("To parse Excel files install dependency: npm install xlsx");
      }
    } else {
      setStatusMessage("Unsupported bulk file type. Use .csv, .xls or .xlsx");
    }
  };

  // ----- AI Processing flow -----
  const processWithAI = async () => {
    setStatusMessage(null);
    setLoading(true);
    try {
      if (inputMode === "text") {
        if (!notes.trim()) {
          setStatusMessage("Please enter your day's work before processing.");
          setLoading(false);
          return;
        }
        const payload = {
          type: "text",
          projectId,
          date,
          text: notes,
        };
        const res = await fetch("/api/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data?.success) {
          setProcessedText(data.processedText || "");
          setPreviewOpen(true);
        } else {
          setStatusMessage(data?.error || "Processing failed.");
        }
      } else if (inputMode === "audio") {
        // send multipart form-data
        let fileToSend = audioFile;
        if (!fileToSend) {
          setStatusMessage("Please record or upload an audio file to process.");
          setLoading(false);
          return;
        }
        const fd = new FormData();
        fd.append("audio", fileToSend);
        fd.append("projectId", projectId);
        fd.append("date", date);
        fd.append("language", audioLanguage);

        const res = await fetch("/api/process", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        if (data?.success) {
          setProcessedText(data.processedText || "");
          setPreviewOpen(true);
        } else {
          setStatusMessage(data?.error || "Processing failed.");
        }
      } else if (inputMode === "bulk") {
        if (!bulkRows || bulkRows.length === 0) {
          setStatusMessage("No rows parsed from the bulk file.");
          setLoading(false);
          return;
        }
        const payload = {
          type: "bulk",
          projectId,
          date, // general date or ignored depending on rows
          rows: bulkRows,
        };
        const res = await fetch("/api/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data?.success) {
          setProcessedText(data.processedText || "");
          setPreviewOpen(true);
        } else {
          setStatusMessage(data?.error || "Processing failed.");
        }
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("Network or server error while processing.");
    } finally {
      setLoading(false);
    }
  };

  // ----- Save to master DB -----
  const saveToMaster = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const payload = {
        projectId,
        date,
        originalInput: inputMode === "text" ? notes : inputMode === "audio" ? "(audio submission)" : bulkRows,
        processedText,
      };
      const res = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data?.success) {
        setStatusMessage("Saved successfully to master database.");
        setPreviewOpen(false);
        // clear inputs if desired
        setNotes("");
        setAudioFile(null);
        setAudioUrl(null);
        setBulkFile(null);
        setBulkRows([]);
      } else {
        setStatusMessage(data?.error || "Save failed.");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("Network or server error while saving.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Daily Work Submission</h1>
        <p className="text-sm text-gray-600 mt-1">Choose input type, let the AI format your entry, then save to the project database.</p>
      </header>

      <section className="bg-white shadow rounded p-4 mb-4">
        <div className="flex gap-2 items-center mb-4">
          <label className="text-sm font-medium">Project</label>
          <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="ml-2 border rounded px-2 py-1">
            <option value="">-- Select project --</option>
            <option value="proj-1">Project Alpha</option>
            <option value="proj-2">Project Beta</option>
            <option value="proj-3">Project Gamma</option>
          </select>

          <label className="ml-6 text-sm font-medium">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="ml-2 border rounded px-2 py-1" />
        </div>

        <div className="flex gap-2 mb-4">
          <button className={`px-3 py-1 rounded ${inputMode === "text" ? "bg-blue-600 text-white" : "bg-gray-100"}`} onClick={() => setInputMode("text")}>Text</button>
          <button className={`px-3 py-1 rounded ${inputMode === "audio" ? "bg-blue-600 text-white" : "bg-gray-100"}`} onClick={() => setInputMode("audio")}>Audio</button>
          <button className={`px-3 py-1 rounded ${inputMode === "bulk" ? "bg-blue-600 text-white" : "bg-gray-100"}`} onClick={() => setInputMode("bulk")}>Bulk Upload</button>
        </div>

        {/* Text Mode */}
        {inputMode === "text" && (
          <div>
            <label className="block text-sm font-medium mb-1">Write your work for the day</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={8} maxLength={charLimit} className="w-full border rounded p-2" placeholder="Describe what you did today..." />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <div>{notes.length} / {charLimit} characters</div>
              <div>
                <button className="mr-2 text-sm underline" onClick={() => setNotes("")}>Clear</button>
                <button className="text-sm underline" onClick={() => setNotes((p) => p + "\n- ")}>Add bullet</button>
              </div>
            </div>
          </div>
        )}

        {/* Audio Mode */}
        {inputMode === "audio" && (
          <div>
            <div className="flex gap-4 items-center mb-3">
              <div>
                <label className="text-sm font-medium block">Record or upload audio</label>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => (isRecording ? stopRecording() : startRecording())} className={`px-3 py-1 rounded ${isRecording ? "bg-red-500 text-white" : "bg-green-600 text-white"}`}>
                    {isRecording ? "Stop" : "Record"}
                  </button>
                  <label className="px-3 py-1 bg-gray-100 rounded cursor-pointer">
                    Upload
                    <input type="file" accept="audio/*" className="hidden" onChange={onAudioFileChange} />
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Language</label>
                <select className="ml-2 border rounded px-2 py-1" value={audioLanguage} onChange={(e) => setAudioLanguage(e.target.value)}>
                  <option value="en">English</option>
                  <option value="auto">Detect language</option>
                  <option value="hi">Hindi</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
            </div>

            {audioUrl && (
              <div className="mb-3">
                <audio controls src={audioUrl}></audio>
                <div className="text-xs text-gray-500 mt-1">Recorded audio ready for processing. You can re-record or upload another file.</div>
              </div>
            )}
          </div>
        )}

        {/* Bulk Mode */}
        {inputMode === "bulk" && (
          <div>
            <label className="text-sm font-medium block mb-1">Upload CSV / Excel (rows should contain date, project, summary)</label>
            <input type="file" accept=".csv,.xls,.xlsx" onChange={onBulkFileChange} className="mb-2" />
            <div className="text-sm text-gray-600 mb-2">Preview: {bulkRows.length} rows parsed.</div>
            {bulkRows.length > 0 && (
              <div className="border rounded p-2 max-h-40 overflow-auto text-sm">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr>
                      {Object.keys(bulkRows[0]).slice(0, 6).map((h) => (
                        <th key={h} className="pr-2">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bulkRows.slice(0, 6).map((r, i) => (
                      <tr key={i} className="border-t">
                        {Object.values(r).slice(0, 6).map((v, j) => (
                          <td key={j} className="pr-2">{String(v)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 flex items-center gap-3">
          <button onClick={processWithAI} className="px-4 py-2 rounded bg-indigo-600 text-white flex items-center gap-2" disabled={loading}>
            {loading ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" strokeDasharray="31.415,31.415" fill="none"></circle>
              </svg>
            ) : null}
            Process & Preview
          </button>

          <button onClick={() => { setNotes(""); setAudioFile(null); setAudioUrl(null); setBulkFile(null); setBulkRows([]); setStatusMessage(null); }} className="px-3 py-2 rounded border">Reset</button>

          {statusMessage && <div className="text-sm text-red-600">{statusMessage}</div>}
        </div>
      </section>

      {/* Preview modal (simple panel) */}
      {previewOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white max-w-3xl w-full rounded shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-3">AI-Processed Preview</h2>
            <p className="text-sm text-gray-500 mb-2">You can edit the text before saving to the master database.</p>
            <textarea value={processedText} onChange={(e) => setProcessedText(e.target.value)} rows={10} className="w-full border rounded p-2 mb-3" />

            <div className="flex justify-end gap-2">
              <button onClick={() => setPreviewOpen(false)} className="px-3 py-1 border rounded">Cancel</button>
              <button onClick={saveToMaster} className="px-4 py-2 rounded bg-green-600 text-white" disabled={loading}>{loading ? "Saving..." : "Save to Master DB"}</button>
            </div>
          </div>
        </div>
      )}

      <footer className="text-xs text-gray-500 mt-6">
        Tip: The AI processing happens server-side. Implement a PHP backend route (/api/process) which forwards requests to the ChatGPT (or other) API for reliable formatting, translation and transcription.
      </footer>
    </div>
  );
}
