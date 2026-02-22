import Head from "next/head";
import ReactMarkdown from "react-markdown";
import MarkdownEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import Spinner from "../Spinner";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import toast from "react-hot-toast";
import { ReactSortable } from "react-sortablejs";
import { X, Copy } from "lucide-react";

export default function Information({
  _id,
  title: existingTitle,
  slug: existingSlug,
  images: existingImages,
  description: existingDescription,
  informationCategory: existingInformationCategory,
  tags: existingTags,
  status: existingStatus,
}) {
  const [redirect, setRedirect] = useState(false);
  const router = useRouter();

  const [title, setTitle] = useState(existingTitle || "");
  const [slug, setSlug] = useState(existingSlug || "");
  const [images, setImages] = useState(existingImages || []);
  const [description, setDescription] = useState(existingDescription || "");
  const [informationCategory, setInformationCategory] = useState(
    existingInformationCategory || [],
  );
  const [tags, setTags] = useState(existingTags || []);
  const [inputValueTag, setInputValueTag] = useState("");
  const [status, setStatus] = useState(existingStatus || "");

  const [tempImages, setTempImages] = useState([]);

  // for images uploading
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // --- STATE BARU: Untuk loading saat upload gambar di editor ---
  const [isEditorUploading, setIsEditorUploading] = useState(false);

  // State untuk pesan error ukuran file (tampil di UI)
  const [thumbnailSizeError, setThumbnailSizeError] = useState("");
  const [editorSizeError, setEditorSizeError] = useState("");

  async function createInformation(ev) {
    ev.preventDefault();

    setIsSaving(true);

    // Upload temporary image to cloudinary only when submit
    if (tempImages.length > 0) {
      const uploadPromises = [];

      for (const tempImage of tempImages) {
        const data = new FormData();
        data.append("file", tempImage.file);

        uploadPromises.push(
          axios.post("/api/upload", data).then((res) => {
            return res.data.links;
          }),
        );
      }

      try {
        const uploadResults = await Promise.all(uploadPromises);
        const newCloudinaryImages = uploadResults.flat();

        const allImages = [...images, ...newCloudinaryImages];

        const data = {
          title,
          slug,
          images: allImages,
          description,
          informationCategory,
          tags,
          status,
        };

        if (_id) {
          await axios.put("/api/informations", { ...data, _id });
          toast.success("Data Updated");
        } else {
          await axios.post("/api/informations", data);
          toast.success("Information Created");
        }

        setIsSaving(false);
        setRedirect(true);
      } catch (error) {
        setIsSaving(false);
        toast.error("Error uploading images");
      }
    } else {
      // No new images, submit directly
      const data = {
        title,
        slug,
        images,
        description,
        informationCategory,
        tags,
        status,
      };

      try {
        if (_id) {
          await axios.put("/api/informations", { ...data, _id });
          toast.success("Data Updated");
        } else {
          await axios.post("/api/informations", data);
          toast.success("Information Created");
        }

        setIsSaving(false);
        setRedirect(true);
      } catch (error) {
        setIsSaving(false);
        toast.error("Error saving information");
      }
    }
  }

  function handleImageSelection(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);

      const newTempImages = [];

      for (const file of files) {
        if (file.size > 3 * 1024 * 1024) {
          const errMsg = `⚠️ File "${file.name}" terlalu besar (${(file.size / 1024 / 1024).toFixed(1)}MB). Maksimal 3MB per gambar.`;
          setThumbnailSizeError(errMsg);
          toast.error(errMsg);
          setIsUploading(false);
          setTimeout(() => setThumbnailSizeError(""), 5000);
          continue;
        }
        const previewUrl = URL.createObjectURL(file);
        newTempImages.push({
          file: file,
          previewUrl: previewUrl,
          id: Date.now() + Math.random(),
        });
      }

      setTempImages((prev) => [...prev, ...newTempImages]);
      setTimeout(() => {
        setIsUploading(false);
        toast.success("Images selected, will be uploaded when you save");
      }, 500);
    }
  }

  const allDisplayImages = [
    ...images.map((img, index) => ({
      type: "cloudinary",
      url: img,
      originalIndex: index,
      id: `cloudinary-${index}-${img}`,
    })),
    ...tempImages.map((img, index) => ({
      type: "temp",
      url: img.previewUrl,
      data: img,
      originalIndex: index,
      id: `temp-${img.id}`,
    })),
  ];

  if (redirect) {
    router.push("/information");
    return null;
  }

  function handleDeleteImage(imageObj) {
    if (imageObj.type === "temp") {
      const updatedTempImages = tempImages.filter(
        (img) => img.id !== imageObj.data.id,
      );
      URL.revokeObjectURL(imageObj.url);
      setTempImages(updatedTempImages);
    } else {
      const updatedImages = images.filter(
        (img, index) => index !== imageObj.originalIndex,
      );
      setImages(updatedImages);
    }
    toast.success("Image deleted successfully");
  }

  const handleSlugChange = (ev) => {
    const inputValue = ev.target.value;
    const newSlug = inputValue.replace(/\s+/g, "-");
    setSlug(newSlug);
  };

  const addTag = (ev) => {
    if (ev) {
      event.preventDefault();
    }
    const newTag = inputValueTag.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setInputValueTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // --- FUNGSI BARU: Upload gambar langsung dari Editor ---
  const handleEditorImageUpload = async (file) => {
    if (file.size > 3 * 1024 * 1024) {
      const errMsg = `⚠️ File gambar terlalu besar (${(file.size / 1024 / 1024).toFixed(1)}MB). Maksimal 3MB per gambar.`;
      setEditorSizeError(errMsg);
      toast.error(errMsg);
      setTimeout(() => setEditorSizeError(""), 5000);
      return Promise.resolve("");
    }
    setIsEditorUploading(true); // Nyalakan loading overlay

    return new Promise((resolve) => {
      const data = new FormData();
      data.append("file", file);

      axios
        .post("/api/upload", data)
        .then((res) => {
          // resolve mengembalikan URL gambar ke editor
          resolve(res.data.links[0]);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Gagal mengunggah gambar editor");
          resolve(""); // Return string kosong jika gagal
        })
        .finally(() => {
          setIsEditorUploading(false); // Matikan loading overlay
        });
    });
  };

  return (
    <>
      <Head>
        <title>Unggah Informasi</title>
      </Head>
      <form className="content__form" onSubmit={createInformation}>
        {/* Information title */}
        <div className="filling__form">
          <label htmlFor="title">Judul (Title)</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            placeholder="Masukkan judul pendek"
          />
        </div>

        {/* Information slug url*/}
        <div className="filling__form">
          <label htmlFor="slug">Slug (seo friendly url)</label>
          <input
            required
            type="text"
            id="slug"
            value={slug}
            onChange={handleSlugChange}
            placeholder="Masukkan slug url"
          />
        </div>

        {/* Information category*/}
        <div className="filling__form">
          <label htmlFor="category">
            Pilih Kategori (untuk beberapa pilihan tekan ctrl + tombol kiri
            mouse)
          </label>
          <select
            onChange={(e) =>
              setInformationCategory(
                Array.from(e.target.selectedOptions, (option) => option.value),
              )
            }
            value={informationCategory}
            name="category"
            id="category"
            multiple
          >
            <option value="PPKMB POLINDRA 2025">PPKMB POLINDRA 2025</option>
            <option value="PKPS HIMA-RPL 2025">PKPS HIMA-RPL 2025</option>
            <option value="LKMM-D">LKMM-D</option>
            <option value="LKMM-M">LKMM-M</option>
            <option value="Seminar">Seminar</option>
            <option value="Pelatihan">Pelatihan</option>
            <option value="Pengabdian Masyarakat">Pengabdian Masyarakat</option>
          </select>
        </div>

        {/* Information images*/}
        <div className="filling__form">
          <div className="w-full">
            <label htmlFor="image">
              Gambar Thumbnail Utama (Maksimal ukuran file: 3MB)
            </label>
            <input
              type="file"
              id="image"
              className="mt-1"
              accept="image/"
              multiple
              onChange={handleImageSelection}
            />
          </div>
        </div>
        {/* Alert pesan error ukuran file */}
        {thumbnailSizeError && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              border: "1px solid #fca5a5",
              borderRadius: "8px",
              padding: "12px 16px",
              marginTop: "8px",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              animation: "fadeIn 0.3s ease-in-out",
            }}
          >
            <span style={{ fontSize: "20px" }}>🚫</span>
            <div>
              <p
                style={{
                  margin: 0,
                  fontWeight: "600",
                  color: "#991b1b",
                  fontSize: "14px",
                }}
              >
                Upload Gagal!
              </p>
              <p
                style={{
                  margin: "4px 0 0",
                  color: "#b91c1c",
                  fontSize: "13px",
                }}
              >
                {thumbnailSizeError}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setThumbnailSizeError("")}
              style={{
                marginLeft: "auto",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#991b1b",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              ✕
            </button>
          </div>
        )}
        <div className="spinner">
          {isUploading && <Spinner />} {/* Spinner for image upload */}
        </div>
        {!isUploading && allDisplayImages.length > 0 && (
          <div className="image__preview">
            <ReactSortable
              list={allDisplayImages}
              setList={(newList) => {
                const cloudinaryImages = [];
                const tempImagesReordered = [];
                newList.forEach((item) => {
                  if (item.type === "cloudinary") {
                    cloudinaryImages.push(item.url);
                  } else {
                    tempImagesReordered.push(item.data);
                  }
                });

                setImages(cloudinaryImages);
                setTempImages(tempImagesReordered);
              }}
              animation={200}
              className="image__sortable"
            >
              {allDisplayImages.map((imageObj) => (
                <div key={imageObj.id} className="upload__image">
                  <img
                    src={imageObj.url}
                    alt="image"
                    className="object__cover"
                  />
                  <div className="delete__image">
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(imageObj)}
                    >
                      <X />
                    </button>
                  </div>
                </div>
              ))}
            </ReactSortable>
          </div>
        )}

        {/* Markdown description */}
        <div className="filling__form" style={{ position: "relative" }}>
          <label htmlFor="description">
            Konten Informasi (Klik icon gambar di toolbar untuk upload langsung
            dari galeri. Maksimal ukuran file: 3MB)
          </label>

          {/* Alert pesan error ukuran file di area editor */}
          {editorSizeError && (
            <div
              style={{
                backgroundColor: "#fee2e2",
                border: "1px solid #fca5a5",
                borderRadius: "8px",
                padding: "12px 16px",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "20px" }}>🚫</span>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontWeight: "600",
                    color: "#991b1b",
                    fontSize: "14px",
                  }}
                >
                  Upload Gagal!
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    color: "#b91c1c",
                    fontSize: "13px",
                  }}
                >
                  {editorSizeError}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditorSizeError("")}
                style={{
                  marginLeft: "auto",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#991b1b",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Overlay Loading saat upload gambar di editor */}
          {isEditorUploading && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                zIndex: 50,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                backdropFilter: "blur(2px)",
              }}
            >
              <Spinner />
              <p
                style={{ marginTop: "10px", fontWeight: "600", color: "#555" }}
              >
                Mengunggah gambar...
              </p>
            </div>
          )}

          <MarkdownEditor
            value={description}
            onChange={(ev) => setDescription(ev.text)}
            style={{ width: "100%", height: "400px" }}
            // --- INI KUNCINYA: Menambahkan handler upload ---
            onImageUpload={handleEditorImageUpload}
            // ------------------------------------------------
            renderHTML={(text) => (
              <ReactMarkdown
                components={{
                  code: ({ node, inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || "");

                    if (inline) {
                      return <code>{children}</code>;
                    } else if (match) {
                      return (
                        <div style={{ position: "relative" }}>
                          <pre
                            style={{
                              padding: "0",
                              borderRadius: "5px",
                              overflowX: "auto",
                              whiteSpace: "pre-wrap",
                            }}
                            {...props}
                          >
                            <code>{children}</code>
                          </pre>
                          <button
                            type="button"
                            style={{
                              position: "absolute",
                              top: "0",
                              right: "0",
                              zIndex: "1",
                            }}
                            onClick={() =>
                              navigator.clipboard.writeText(children)
                            }
                          >
                            <Copy />
                          </button>
                        </div>
                      );
                    } else {
                      return <code {...props}>{children}</code>;
                    }
                  },
                }}
              >
                {text}
              </ReactMarkdown>
            )}
          />
        </div>

        {/* Tags */}
        <div className="filling__form">
          <label htmlFor="tag">Tagar (tags)</label>
          {tags.map((tag) => (
            <div key={tag} className="position__tag">
              {tag}
              <button onClick={() => removeTag(tag)}>
                <X size={30} />
              </button>
            </div>
          ))}
          <input
            type="text"
            id="tag"
            value={inputValueTag}
            onChange={(ev) => setInputValueTag(ev.target.value)}
            onKeyDown={(ev) => {
              if (ev.key === "Enter") {
                ev.preventDefault();
                addTag();
              }
            }}
            placeholder="Masukkan tagar"
          />
        </div>
        <div className="form__button">
          <button onClick={addTag}>Tambah</button>
        </div>
        {/* Information status */}
        <div className="filling__form">
          <label htmlFor="status">Status</label>
          <select
            onChange={(ev) => setStatus(ev.target.value)}
            value={status}
            name="status"
            id="status"
          >
            <option value="">Tidak memilih</option>
            <option value="draft">Draf</option>
            <option value="publish">Mengunggah</option>
          </select>
        </div>
        <div className="form__button">
          <button type="submit" disabled={isSaving}>
            {isSaving ? "Menyimpan.." : "Simpan"}
          </button>
        </div>
      </form>
    </>
  );
}
