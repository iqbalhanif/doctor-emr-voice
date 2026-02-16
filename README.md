# Doctor EMR Voice Assistant

A specialized speech-to-text application for Indonesian doctors to structure medical records into SOAP format automatically.

## Prerequisites
- Node.js installed.
- **Chrome / Edge / Safari** (for Web Speech API support).

## Setup & Run
1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start App**:
    ```bash
    npm run dev
    ```

## How to Use

### 1. Dikte (Raw Mode)
Click **Mulai Rekam** and narrate the entire consultation naturally.
- Use keywords to start sections: **"Subjektif..."**, **"Objektif..."**, etc.
- *Example*: "Keluhan utama demam. Objektif suhu 39. Plan paracetamol."

### 2. Process AI
Click **Proses AI** to automatically split the raw transcript into the SOAP fields.

### 3. Review & Edit
Review the structured data in the SOAP boxes. You can edit them manually if needed.

## Project Structure
- `src/hooks/useSpeechRecognition.js`: Handles microphone input and Indonesian configuration.
- `src/utils/soapParser.js`: Logic to detect keywords and switch SOAP fields.
- `src/components/SOAPEditor.jsx`: The main medical editor interface.
