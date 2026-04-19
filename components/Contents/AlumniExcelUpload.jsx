import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import * as XLSX from "xlsx";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Upload,
  FileSpreadsheet,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

// Kolom wajib di Excel
const REQUIRED_COLUMNS = ["nama", "angkatan"];
// Kolom opsional
const OPTIONAL_COLUMNS = ["industri", "posisi"];
// Semua kolom yang dikenali
const ALL_COLUMNS = [...REQUIRED_COLUMNS, ...OPTIONAL_COLUMNS];

export default function AlumniExcelUpload() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [parseError, setParseError] = useState("");

  // ===================== DRAG & DROP =====================
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  }, []);

  // ===================== FILE PROCESSING =====================
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (selectedFile) => {
    setParseError("");
    setUploadResult(null);

    // Validasi tipe file
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];
    const validExtensions = [".xlsx", ".xls", ".csv"];
    const fileExt = selectedFile.name
      .substring(selectedFile.name.lastIndexOf("."))
      .toLowerCase();

    if (!validTypes.includes(selectedFile.type) && !validExtensions.includes(fileExt)) {
      setParseError("Format file tidak didukung. Gunakan file .xlsx, .xls, atau .csv");
      return;
    }

    // Validasi ukuran file (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setParseError("Ukuran file terlalu besar. Maksimal 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Ambil sheet pertama
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Konversi ke JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (jsonData.length === 0) {
          setParseError("File Excel kosong atau tidak memiliki data.");
          return;
        }

        // Cek apakah kolom wajib ada (case-insensitive matching)
        const fileColumns = Object.keys(jsonData[0]).map((col) =>
          col.toLowerCase().trim()
        );
        const missingRequired = REQUIRED_COLUMNS.filter(
          (col) => !fileColumns.includes(col)
        );

        if (missingRequired.length > 0) {
          setParseError(
            `Kolom wajib tidak ditemukan: ${missingRequired.join(", ")}. ` +
              `Pastikan header Excel minimal ada: nama, angkatan.`
          );
          return;
        }

        // Normalisasi key ke lowercase
        const normalizedData = jsonData.map((row) => {
          const normalizedRow = {};
          Object.keys(row).forEach((key) => {
            const lowerKey = key.toLowerCase().trim();
            if (ALL_COLUMNS.includes(lowerKey)) {
              normalizedRow[lowerKey] = row[key];
            }
          });
          // Pastikan field opsional selalu ada (walau kosong)
          if (!normalizedRow.industri) normalizedRow.industri = "";
          if (!normalizedRow.posisi) normalizedRow.posisi = "";
          return normalizedRow;
        });

        // Filter row yang nama dan angkatan-nya kosong
        const filteredData = normalizedData.filter(
          (row) => row.nama || row.angkatan
        );

        if (filteredData.length === 0) {
          setParseError("Tidak ada data valid yang ditemukan di file.");
          return;
        }

        setFile(selectedFile);
        setPreviewData(filteredData);
      } catch (err) {
        console.error("Parse error:", err);
        setParseError("Gagal membaca file. Pastikan file tidak corrupt.");
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  // ===================== DOWNLOAD TEMPLATE =====================
  const downloadTemplate = () => {
    const templateData = [
      {
        nama: "Ahmad Fauzi",
        angkatan: 2020,
        industri: "Teknologi",
        posisi: "Software Engineer",
      },
      {
        nama: "Siti Nurhaliza",
        angkatan: 2019,
        industri: "Perbankan",
        posisi: "Data Analyst",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);

    // Set lebar kolom
    ws["!cols"] = [
      { wch: 25 }, // nama
      { wch: 12 }, // angkatan
      { wch: 20 }, // industri
      { wch: 25 }, // posisi
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Alumni");
    XLSX.writeFile(wb, "template_alumni.xlsx");
    toast.success("Template berhasil didownload!");
  };

  // ===================== UPLOAD TO API =====================
  const handleUpload = async () => {
    if (previewData.length === 0) return;

    setIsUploading(true);
    setUploadResult(null);

    try {
      const response = await axios.post("/api/alumni-bulk", {
        data: previewData,
      });

      setUploadResult(response.data);

      if (response.data.errors.length === 0) {
        toast.success(response.data.message);
        // Redirect setelah 2 detik jika semua berhasil
        setTimeout(() => {
          router.push("/alumni");
        }, 2000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan saat upload data";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  // ===================== RESET =====================
  const handleReset = () => {
    setFile(null);
    setPreviewData([]);
    setUploadResult(null);
    setParseError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ===================== RENDER =====================
  return (
    <div className="excel__upload__container">
      {/* Info Kolom & Download Template */}
      <div className="excel__info__bar">
        <div className="excel__info__columns">
          <AlertTriangle size={18} />
          <span>
            Kolom wajib: <strong>nama</strong>, <strong>angkatan</strong>. Kolom
            opsional: <strong>industri</strong>, <strong>posisi</strong>
          </span>
        </div>
        <button
          type="button"
          className="excel__template__btn"
          onClick={downloadTemplate}
        >
          <Download size={16} />
          Download Template
        </button>
      </div>

      {/* Drag & Drop Zone */}
      {!file && (
        <div
          className={`excel__dropzone ${isDragging ? "excel__dropzone--active" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
          <div className="excel__dropzone__icon">
            <FileSpreadsheet size={48} />
          </div>
          <p className="excel__dropzone__title">
            {isDragging
              ? "Lepaskan file di sini..."
              : "Drag & drop file Excel di sini"}
          </p>
          <p className="excel__dropzone__subtitle">
            atau klik untuk memilih file
          </p>
          <p className="excel__dropzone__formats">
            Format: .xlsx, .xls, .csv (maks. 5MB)
          </p>
        </div>
      )}

      {/* Error Parsing */}
      {parseError && (
        <div className="excel__error__message">
          <XCircle size={18} />
          <span>{parseError}</span>
        </div>
      )}

      {/* File Info & Actions */}
      {file && (
        <div className="excel__file__info">
          <div className="excel__file__details">
            <FileSpreadsheet size={22} />
            <div>
              <p className="excel__file__name">{file.name}</p>
              <p className="excel__file__meta">
                {previewData.length} data ditemukan •{" "}
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button
            type="button"
            className="excel__remove__btn"
            onClick={handleReset}
            title="Hapus file"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}

      {/* Preview Table */}
      {previewData.length > 0 && !uploadResult && (
        <div className="excel__preview">
          <h4 className="excel__preview__title">
            Preview Data ({previewData.length} baris)
          </h4>
          <div className="excel__preview__table__wrapper">
            <table className="excel__preview__table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Angkatan</th>
                  <th>Industri</th>
                  <th>Posisi</th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{row.nama || <span className="excel__empty__cell">-</span>}</td>
                    <td>{row.angkatan || <span className="excel__empty__cell">-</span>}</td>
                    <td>{row.industri || <span className="excel__empty__cell">-</span>}</td>
                    <td>{row.posisi || <span className="excel__empty__cell">-</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Upload Button */}
          <div className="excel__upload__actions">
            <button
              type="button"
              className="excel__cancel__btn"
              onClick={handleReset}
              disabled={isUploading}
            >
              Batal
            </button>
            <button
              type="button"
              className="excel__submit__btn"
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? (
                <>Mengupload...</>
              ) : (
                <>
                  <Upload size={18} />
                  Upload {previewData.length} Data ke Database
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Upload Result */}
      {uploadResult && (
        <div className="excel__result">
          <h4 className="excel__result__title">Hasil Upload</h4>

          {/* Summary */}
          <div className="excel__result__summary">
            <div className="excel__result__card excel__result__card--success">
              <CheckCircle size={24} />
              <div>
                <span className="excel__result__number">
                  {uploadResult.inserted}
                </span>
                <span className="excel__result__label">Berhasil</span>
              </div>
            </div>
            {uploadResult.errors.length > 0 && (
              <div className="excel__result__card excel__result__card--error">
                <XCircle size={24} />
                <div>
                  <span className="excel__result__number">
                    {uploadResult.errors.length}
                  </span>
                  <span className="excel__result__label">Gagal</span>
                </div>
              </div>
            )}
          </div>

          {/* Error Details */}
          {uploadResult.errors.length > 0 && (
            <div className="excel__result__errors">
              <h5>Detail Error:</h5>
              <div className="excel__result__errors__list">
                {uploadResult.errors.map((err, index) => (
                  <div key={index} className="excel__result__error__item">
                    <span className="excel__result__error__row">
                      Baris {err.row}
                    </span>
                    <span className="excel__result__error__name">
                      {err.nama}
                    </span>
                    <span className="excel__result__error__msg">
                      {err.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action after result */}
          <div className="excel__upload__actions">
            <button
              type="button"
              className="excel__cancel__btn"
              onClick={handleReset}
            >
              Upload Lagi
            </button>
            <button
              type="button"
              className="excel__submit__btn"
              onClick={() => router.push("/alumni")}
            >
              Lihat Semua Alumni
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
