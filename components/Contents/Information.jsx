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
    existingInformationCategory || []
  );
  const [tags, setTags] = useState(existingTags || []);
  const [inputValueTag, setInputValueTag] = useState(""); // input tags
  const [status, setStatus] = useState(existingStatus || "");

  const [tempImages, setTempImages] = useState([]);

  // for images uploading
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const uploadImageQueue = [];

  async function createInformation(ev) {
    ev.preventDefault();

    setIsSaving(true); // Start loading to send

    // Upload temporary image to cloudinary only when submit
    if (tempImages.length > 0) {
      const uploadPromises = [];

      for (const tempImage of tempImages) {
        const data = new FormData();
        data.append("file", tempImage.file);

        uploadPromises.push(
          axios.post("/api/upload", data).then((res) => {
            return res.data.links;
          })
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
      setIsUploading(true); // Start spinner

      const newTempImages = [];

      for (const file of files) {
        const previewUrl = URL.createObjectURL(file);
        newTempImages.push({
          file: file,
          previewUrl: previewUrl,
          id: Date.now() + Math.random(),
        });
      }

      setTempImages((prev) => [...prev, ...newTempImages]);
      // Delay simulation to show the spinner (optional)
      setTimeout(() => {
        setIsUploading(false); // Stop spinner
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

  function updateImagesOrder(images) {
    setImages(images);
  }

  function handleDeleteImage(imageObj) {
    if (imageObj.type === "temp") {
      // Delete temporary image
      const updatedTempImages = tempImages.filter(
        (img) => img.id !== imageObj.data.id
      );
      // Revoke URL to prevent memory leak
      URL.revokeObjectURL(imageObj.url);
      setTempImages(updatedTempImages);
    } else {
      // Delete cloudinary image
      const updatedImages = images.filter(
        (img, index) => index !== imageObj.originalIndex
      );
      setImages(updatedImages);
    }
    toast.success("Image deleted successfully");
  }

  // for slug Url
  const handleSlugChange = (ev) => {
    const inputValue = ev.target.value;
    const newSlug = inputValue.replace(/\s+/g, "-"); // replace spaces with hyphens

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
                Array.from(e.target.selectedOptions, (option) => option.value)
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
              Gambar (gambar pertama akan ditampilkan sebagai thumbnail, Kamu
              dapat menyeretkan)
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
        <div className="spinner">
          {isUploading && <Spinner />} {/* Spinner for image upload */}
        </div>
        {!isUploading && allDisplayImages.length > 0 && (
          <div className="image__preview">
            <ReactSortable
              list={allDisplayImages}
              setList={(newList) => {
                // Separate cloudinary and temp images again
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
        <div className="filling__form">
          <label htmlFor="description">
            Konten Informasi (untuk gambar: unggah terlebih dahulu dan salin
            tautannya lalu tempel di ![alt text] (link))
          </label>
          <MarkdownEditor
            value={description}
            onChange={(ev) => setDescription(ev.text)}
            style={{ width: "100%", height: "400px" }} // you can adjust the height as needed
            renderHTML={(text) => (
              <ReactMarkdown
                components={{
                  code: ({ node, inline, className, children, ...props }) => {
                    // for code
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
