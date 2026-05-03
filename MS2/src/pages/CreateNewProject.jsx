import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function CreateNewProject() {
  const [formData, setFormData] = useState({
    title: "",
    type: "course",
    courseName: "",
    thesisFile: null,
    description: "",
    github: "",
    liveDemo: "",
    video: null,
    tags: [],
    tagInput: "",
    collaborators: [],
    collabEmail: "",
    visibility: "private",
  });

  const handleSubmit = () => {
    console.log("Submitting...");
    console.log(formData);
  };

  const addCollaborator = () => {
    if (
      formData.collabEmail.trim() &&
      !formData.collaborators.includes(formData.collabEmail.trim())
    ) {
      setFormData({
        ...formData,
        collaborators: [
          ...formData.collaborators,
          formData.collabEmail.trim(),
        ],
        collabEmail: "",
      });
    }
  };

  const removeCollaborator = (email) => {
    setFormData({
      ...formData,
      collaborators: formData.collaborators.filter((c) => c !== email),
    });
  };

  const addTag = () => {
    if (
      formData.tagInput.trim() &&
      !formData.tags.includes(formData.tagInput.trim())
    ) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.tagInput.trim()],
        tagInput: "",
      });
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 pb-20">

        {/* ✅ SAME CARD AS DASHBOARD */}
        <AppCard className="max-w-5xl mx-auto p-8">

          {/* Title */}
          <h1 className="text-2xl font-bold mb-6 text-[color:var(--ink)]">
            Create New Project
          </h1>

          {/* Project Title */}
          <div className="mb-4">
            <Label>Project Title *</Label>
            <Input
              placeholder="E-Commerce Platform"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          {/* Project Type */}
          <div className="mb-4">
            <Label>Project Type *</Label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full h-10 px-3 rounded-md border border-[var(--border)] bg-[var(--input)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            >
              <option value="course">Course Project</option>
              <option value="thesis">Thesis</option>
            </select>
          </div>

          {/* Course Name */}
          {formData.type === "course" && (
            <div className="mb-4">
              <Label>Course Name *</Label>
              <Input
                placeholder="Software Engineering"
                value={formData.courseName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    courseName: e.target.value,
                  })
                }
              />
            </div>
          )}

          {/* Thesis Upload */}
          {formData.type === "thesis" && (
            <div className="mb-4">
              <Label>Upload Thesis PDF *</Label>
              <Input
                type="file"
                accept="application/pdf"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    thesisFile: e.target.files[0],
                  })
                }
              />
            </div>
          )}

          {/* Description */}
          <div className="mb-4">
            <Label>Description *</Label>
            <textarea
              placeholder="Describe your project, features, technologies used..."
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full min-h-[120px] px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--input)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            />
          </div>

          {/* GitHub + Live */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label>GitHub Repository</Label>
              <Input
                placeholder="https://github.com/your-project"
                value={formData.github || ""}
                onChange={(e) =>
                  setFormData({ ...formData, github: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Live Demo URL</Label>
              <Input
                placeholder="https://your-demo.com"
                value={formData.liveDemo || ""}
                onChange={(e) =>
                  setFormData({ ...formData, liveDemo: e.target.value })
                }
              />
            </div>
          </div>

          {/* Video */}
          <div className="mb-4">
            <Label>Project Demo Video *</Label>
            <Input
              type="file"
              accept="video/*"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  video: e.target.files[0],
                })
              }
            />
          </div>

          {/* Tags */}
          <div className="mb-4">
            <Label>Tags</Label>

            <div className="flex gap-2">
              <Input
                placeholder="e.g. React, AI, Mobile App"
                value={formData.tagInput}
                onChange={(e) =>
                  setFormData({ ...formData, tagInput: e.target.value })
                }
                onKeyDown={(e) => e.key === "Enter" && addTag()}
              />

              <button
                type="button"
                onClick={addTag}
                className="px-4 rounded-md bg-[var(--primary)] text-white font-bold"
              >
                +
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-semibold"
                >
                  {tag}
                  <button onClick={() => removeTag(tag)}>×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Collaborators */}
          <div className="mb-4">
            <Label>Collaborators</Label>

            <div className="flex gap-2">
              <Input
                placeholder="teammate@email.com"
                value={formData.collabEmail}
                onChange={(e) =>
                  setFormData({ ...formData, collabEmail: e.target.value })
                }
              />

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="px-4 rounded-md bg-[var(--primary)] text-white font-bold">
                    +
                  </button>
                </AlertDialogTrigger>

                <AlertDialogContent className="bg-[var(--dark)] text-white border border-white/10">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Invite Collaborator
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Enter the email of your teammate to invite them.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <Input
                    placeholder="teammate@email.com"
                    value={formData.collabEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        collabEmail: e.target.value,
                      })
                    }
                  />

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={addCollaborator}>
                      Invite
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {formData.collaborators.map((email) => (
                <span
                  key={email}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-semibold"
                >
                  {email}
                  <button onClick={() => removeCollaborator(email)}>×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Visibility */}
          <div className="mb-6">
            <Label>Visibility</Label>
            <select
              value={formData.visibility}
              onChange={(e) =>
                setFormData({ ...formData, visibility: e.target.value })
              }
              className="w-full h-10 px-3 rounded-md border border-[var(--border)] bg-[var(--input)] text-[var(--foreground)] text-sm"
            >
              <option value="private">
                Private (Only you and collaborators)
              </option>
              <option value="public">
                Public (Visible to everyone)
              </option>
            </select>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-bold hover:opacity-90"
          >
            Create Project
          </button>

        </AppCard>
      </div>
    </DashboardLayout>
  );
}