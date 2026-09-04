import { useEffect, useRef, useState } from "react";
import { Film, RefreshCw, Trash2, UploadCloud } from "lucide-react";
import { getProjectFile } from "@/utils/projectPage/projectFiles";

function formatBytes(bytes) {
  const value = Number(bytes || 0);
  if (!value) return "";
  if (value < 1024 * 1024) return `${Math.max(1, Math.round(value / 1024))} KB`;
  return `${(value / (1024 * 1024)).toFixed(value >= 10 * 1024 * 1024 ? 0 : 1)} MB`;
}

export default function ProjectVideoUploadField({
  file,
  onChange,
  error,
  helper = "Optional. MP4 or WebM works best for in-browser playback.",
}) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");

  useEffect(() => {
    let objectUrl = "";
    let cancelled = false;

    async function resolvePreview() {
      setPreviewUrl("");
      setPreviewError("");

      if (!file) return;

      if (typeof file === "string") {
        setPreviewUrl(file);
        return;
      }

      if (file instanceof File || file instanceof Blob) {
        objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        return;
      }

      if (file?.url) {
        setPreviewUrl(file.url);
        return;
      }

      if (file?.id) {
        setPreviewLoading(true);

        try {
          const saved = await getProjectFile(file.id);
          if (!saved?.file || cancelled) {
            if (!cancelled) setPreviewError("Saved video could not be loaded.");
            return;
          }

          objectUrl = URL.createObjectURL(saved.file);
          if (!cancelled) setPreviewUrl(objectUrl);
        } catch {
          if (!cancelled) setPreviewError("Saved video could not be loaded.");
        } finally {
          if (!cancelled) setPreviewLoading(false);
        }
      }
    }

    resolvePreview();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const fileName = file?.name || "Project demo video";
  const fileMeta = [file?.type?.replace("video/", "")?.toUpperCase(), formatBytes(file?.size)]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-[color:var(--ink)]">Project Demo Video</p>
          <p className="mt-1 text-xs font-semibold text-[color:var(--muted)]">
            Show the project in action before someone opens the full workspace.
          </p>
        </div>

        {file ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-xl border border-[#355872]/12 bg-white/80 px-3 text-xs font-black text-[#355872] transition hover:bg-white"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Replace
          </button>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-[1.45rem] border border-[#355872]/12 bg-[#EEF5F8] shadow-[0_14px_34px_rgba(53,88,114,0.08)]">
        {file ? (
          <>
            <div className="relative bg-[#101820]">
              {previewUrl ? (
                <video
                  src={previewUrl}
                  controls
                  preload="metadata"
                  playsInline
                  className="aspect-video w-full bg-[#101820] object-contain"
                  onError={() =>
                    setPreviewError(
                      "This file is saved, but the browser cannot preview its codec. Use MP4 (H.264) or WebM."
                    )
                  }
                />
              ) : (
                <div className="flex aspect-video items-center justify-center px-8 text-center">
                  <div>
                    <Film className="mx-auto h-8 w-8 text-white/45" />
                    <p className="mt-3 text-sm font-black text-white/80">
                      {previewLoading ? "Loading preview…" : "Preview unavailable"}
                    </p>
                    {previewError ? (
                      <p className="mx-auto mt-1 max-w-sm text-xs font-semibold leading-5 text-white/50">
                        {previewError}
                      </p>
                    ) : null}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-[#183247]">{fileName}</p>
                {fileMeta ? (
                  <p className="mt-0.5 text-[11px] font-bold text-[#7890A0]">{fileMeta}</p>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => onChange(null)}
                className="inline-flex h-9 items-center gap-2 rounded-xl px-3 text-xs font-black text-red-500 transition hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex min-h-[150px] w-full items-center gap-4 px-5 py-5 text-left transition hover:bg-white/55"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#7AAACE]/20 text-[#355872]">
              <UploadCloud className="h-5 w-5" />
            </span>

            <span>
              <span className="block text-sm font-black text-[#183247]">Upload demo video</span>
              <span className="mt-1 block text-xs font-semibold leading-5 text-[#748A99]">
                MP4 or WebM recommended. You’ll see the real preview here before saving.
              </span>
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm"
        className="sr-only"
        onChange={(event) => {
          const nextFile = event.target.files?.[0] || null;
          onChange(nextFile);
          event.target.value = "";
        }}
      />

      {error ? (
        <p className="text-xs font-semibold leading-5 text-red-500">{error}</p>
      ) : (
        <p className="text-xs font-semibold leading-5 text-[color:var(--muted)]">{helper}</p>
      )}
    </div>
  );
}
