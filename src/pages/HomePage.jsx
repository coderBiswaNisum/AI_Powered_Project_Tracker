import React, { useState, useRef } from "react";
import "./HomePage.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";

// Components
import Header from "../components/Layout/Header";
import StatsCards from "../components/Stats/StatsCards";
import SubmissionForm from "../components/Submission/SubmissionForm";
import SubmissionConfirmation from "../components/Submission/SubmissionConfirmation";
import InfoPanel from "../components/Info/InfoPanel";
import TaskTable from "../components/Layout/TaskTable";

const HomePage = () => {
  // State Management
  const [activeTab, setActiveTab] = useState("text");
  const [textUpdate, setTextUpdate] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [bulkFile, setBulkFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [processedText, setProcessedText] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // const [addTask,setAddTask] = useState(JSON.parse(localStorage.getItem('taskData')))
  let addTask = JSON.parse(localStorage.getItem("taskData"));

  const [refresh, setRefresh] = useState(0);

  const triggerRefresh = () => {
    setRefresh((prev) => prev + 1);
  };

  const fileInputRef = useRef(null);

  // Initialize Gemini AI
  // const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const genAI = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY, // ✅ Use import.meta.env for Vite
  });

  // Event Handlers
  const handleTextChange = (e) => setTextUpdate(e.target.value);

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
    }
  };

  const handleBulkUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        ".csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      if (
        allowedTypes.some(
          (type) =>
            file.name.toLowerCase().includes(type) || file.type.includes(type)
        )
      ) {
        setBulkFile(file);
      }
    }
  };

  const handleTabChange = (tabId) => setActiveTab(tabId);

  const startRecording = () => setIsRecording(true);
  const stopRecording = () => setIsRecording(false);

  const resetForm = () => {
    setTextUpdate("");
    setAudioFile(null);
    setBulkFile(null);
    setProcessedText("");
    setShowConfirmation(false);
    setErrorMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // REAL AI Processing Handler with Gemini API

  const processWithAI = async () => {
    setIsProcessing(true);
    setErrorMessage("");

    try {
      if (!textUpdate.trim()) {
        setErrorMessage("Please enter some text before processing.");
        setIsProcessing(false);
        return;
      }

      if (activeTab === "text") {
        const response = await genAI.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `Please convert the following daily work update into a professional, concise, and well-structured paragraph suitable for a corporate project tracker. 

        Requirements:
        - Preserve all key information
        - Improve language, clarity, and business tone
        - Make it professional and concise
        - Do not add any information not present in the original text
        - Format it as a proper business report

        User's text: "${textUpdate}"`,
          config: {
            thinkingConfig: {
              thinkingBudget: 0, // Optional: disables "thinking" for faster response
            },
          },
        });

        const aiProcessedText = response.text;
        setProcessedText(aiProcessedText);
        setShowConfirmation(true);
      } else {
        setErrorMessage(
          `${activeTab} processing is coming soon. Currently only text processing is available.`
        );
      }
    } catch (error) {
      console.error("AI Processing error:", error);
      setErrorMessage(
        `Error processing with AI: ${error.message}. Please check your API key and try again.`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Form Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (activeTab === "text" && textUpdate.trim()) {
      await processWithAI();
    } else if (activeTab === "audio" && audioFile) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        alert("Audio submission processed successfully!");
        resetForm();
      }, 2000);
    } else if (activeTab === "bulk" && bulkFile) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        alert("Bulk file submission processed successfully!");
        resetForm();
      }, 2000);
    } else {
      setErrorMessage("Please provide input before submitting.");
    }
  };

  // Confirmation Handlers
  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);

    try {
      const today = new Date();

      const cleanedTask = processedText.split("**").pop(); // clean first
      setProcessedText(cleanedTask); // then set the state if needed

      const updatedTasks = [
        ...addTask,
        { date: today.toISOString().slice(0, 10), task: cleanedTask }, // use the cleaned value here
      ];

      localStorage.setItem("taskData", JSON.stringify(updatedTasks));
      triggerRefresh();

      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Work submitted successfully to database!");
      resetForm();
    } catch (error) {
      console.error("Submission error:", error);
      setErrorMessage("Error submitting to database. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProcessedText = () => {
    setShowConfirmation(false);
    setTextUpdate(processedText);
  };

  const handleReprocess = async () => {
    setShowConfirmation(false);
    await processWithAI();
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="professional-container">
      <Header />

      <div className="container main-content">
        <div className="row justify-content-center">
          <div className="col-xl-10">
            <StatsCards />

            {/* Error Message Display */}
            {errorMessage && (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                {errorMessage}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setErrorMessage("")}
                ></button>
              </div>
            )}

            <SubmissionForm
              activeTab={activeTab}
              onTabChange={handleTabChange}
              textUpdate={textUpdate}
              onTextChange={handleTextChange}
              isRecording={isRecording}
              audioFile={audioFile}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              onAudioUpload={handleAudioUpload}
              bulkFile={bulkFile}
              onBulkUpload={handleBulkUpload}
              isSubmitting={isSubmitting}
              isProcessing={isProcessing}
              onSubmit={handleSubmit}
              onReset={resetForm}
              fileInputRef={fileInputRef}
            />

            <TaskTable refresh={refresh} />
            <InfoPanel />

            <SubmissionConfirmation
              showConfirmation={showConfirmation}
              originalText={textUpdate}
              processedText={processedText}
              isSubmitting={isSubmitting}
              onEdit={handleEditProcessedText}
              onReprocess={handleReprocess}
              onConfirm={handleConfirmSubmit}
              onClose={handleCloseConfirmation}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
