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

### 1. Rekam & Proses
- Klik tombol **Mulai Rekam**.
- Ucapkan hasil pemeriksaan secara natural.
  - *Sebutkan "Subjektif", "Objektif", "Assessment", "Plan" untuk memisahkan bagian.*
- Teks akan muncul secara **real-time**.
- Klik tombol **Stop & Proses AI** saat selesai.
- *AI akan otomatis membersihkan kata sambung (yang, dan, dll) dan menyusun format SOAP.*

### 2. Review Hasil
- Periksa kolom S-O-A-P yang sudah terisi rapi.
- Edit jika diperlukan, lalu klik **Simpan ke EMR**.

## Project Structure
- `src/hooks/useSpeechRecognition.js`: Handles microphone input and Indonesian configuration.
- `src/utils/soapParser.js`: Logic to detect keywords and switch SOAP fields.
- `src/components/SOAPEditor.jsx`: The main medical editor interface.
