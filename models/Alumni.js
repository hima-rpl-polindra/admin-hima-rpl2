const { Schema, models, model } = require("mongoose");

const AlumniSchema = new Schema(
  {
    nama: {
      type: String,
      required: [true, "Nama wajib diisi"],
      trim: true,
      minlength: [2, "Nama minimal 2 karakter"],
      maxlength: [100, "Nama maksimal 100 karakter"],
    },
    angkatan: {
      type: Number,
      required: [true, "Angkatan wajib diisi"],
      min: [1900, "Angkatan tidak valid"],
      max: [
        new Date().getFullYear(),
        "Angkatan tidak boleh melebihi tahun ini",
      ],
    },
    industri: {
      type: String,
      required: [true, "Industri wajib diisi"],
      trim: true,
      maxlength: [100, "Industri maksimal 100 karakter"],
    },
    posisi: {
      type: String,
      required: [true, "Posisi wajib diisi"],
      trim: true,
      maxlength: [100, "Posisi maksimal 100 karakter"],
    },
  },
  {
    timestamps: true,
    collection: "alumni",
  },
);

// Index untuk mempercepat pencarian & sorting
AlumniSchema.index({ angkatan: 1 });
AlumniSchema.index({ nama: "text", posisi: "text" }); // full-text search
AlumniSchema.index({ industri: 1, angkatan: -1 });

export const Alumni = models.Alumni || model("Alumni", AlumniSchema, "alumni");
