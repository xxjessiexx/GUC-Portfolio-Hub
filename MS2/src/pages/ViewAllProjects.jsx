import { useState } from "react";
import AppShellBackground from "../components/ui/AppShellBackground";
import {AppCard} from "../components/ui/AppCard";
import { Button } from "../components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import DashboardLayout from "@/components/layout/DashboardLayout";


import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link2 ,Plus} from "lucide-react";
import { Eye, Pencil, Trash2, Pin } from "lucide-react";
import { Search, GraduationCap,  ChevronDown ,Globe,Lock} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';






const initialProjects = [
  {
    id: 1,
    name: "Smart Campus Assistant",
    course: "CSEN 704",
    description: "Mobile-first campus help and navigation platform.",
    visibility: "Public",
    pinned: true,
    rating: 4.8,
    comments: 5,
    updated: "06 Mar 2026",
  },
  {
    id: 2,
    name: "Lane Detection System",
    course: "Bachelor Project",
    description: "Real-time lane detection using computer vision.",
    visibility: "Public",
    pinned: true,
    rating: 4.6,
    comments: 2,
    updated: "01 Mar 2026",
  },
  {
    id: 3,
    name: "E-Commerce Platform",
    course: "Software Engineering",
    description: "Full-stack e-commerce platform.",
    visibility: "Private",
    pinned: false,
    rating: 4.4,
    comments: 4,
    updated: "21 Feb 2026",
  },
  {
    id: 4,
    name: "AI Content Recommender",
    course: "Machine Learning",
    description: "Recommendation engine for educational content.",
    visibility: "Public",
    pinned: false,
    rating: 4.9,
    comments: 6,
    updated: "11 Feb 2026",
  },
];

export default function ViewAllProjects() {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [filterVisibility, setFilterVisibility] = useState("All");
  const [filterPinned, setFilterPinned] = useState("All");
    
  const deleteProject = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

    // 🔍 Filtering logic
    const filteredProjects = projects.filter((p) => {
      return (
        p.name.toLowerCase().includes(search.toLowerCase()) &&
        (filterVisibility === "All" || p.visibility === filterVisibility)&&
        (filterPinned === "All" ||
        (filterPinned === "Pinned" && p.pinned) ||
        (filterPinned === "Unpinned" && !p.pinned))
      );
    });

  const pinnedProjects = filteredProjects.filter((p) => p.pinned);

    // 📌 Toggle pin
    const togglePin = (id) => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, pinned: !p.pinned } : p
        )
      );
    };

    // 👁 Toggle visibility
    const toggleVisibility = (id) => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                visibility: p.visibility === "Public" ? "Private" : "Public",
              }
            : p
        )
      );
    };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((p) => p.id === active.id);
    const newIndex = projects.findIndex((p) => p.id === over.id);

    setProjects((items) => arrayMove(items, oldIndex, newIndex));
  };


function SortableProject({ p, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: p.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded p-4 flex justify-between items-center ${
        isDragging ? "shadow-xl scale-[1.02]" : ""
      }`}
    >
      {/* LEFT SIDE with drag handle */}
      <div className="flex items-center gap-4">

        {/* 🔥 DRAG HANDLE (dots) */}
        <div
          {...listeners}
          {...attributes}
          className="flex flex-col gap-1 cursor-grab active:cursor-grabbing"
        >
          {[...Array(6)].map((_, i) => (
            <span key={i} className="w-1 h-1 bg-gray-400 rounded-full"></span>
          ))}
        </div>

        {children.left}
      </div>

      {/* MIDDLE */}
      {children.middle}

      {/* RIGHT */}
      {children.right}
    </div>
  );
}

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <SectionHeader 
            title="My Projects"
            subtitle="Manage, edit, and organize your projects."
            action={
              <span
                onClick={() => navigate("/create-project")}
                className="rounded-2xl px-6 py-3 text-white font-semibold 
                          bg-[#2C4E80] shadow-md hover:bg-[#243f69] transition-all cursor-pointer"
              >
                
                + Create Project
              </span>
            }
          />
          
    

        {/* Filters */}
      <AppCard className="p-4 flex items-center gap-4 flex-wrap rounded-2xl bg-white/60 backdrop-blur-md">

            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input
                type="text"
                placeholder="Search my projects"
                className="pl-9 bg-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* 🎓 Course */}
            <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-white/70">
              <GraduationCap size={16} className="text-gray-500" />
              <select className="bg-transparent outline-none text-sm">
                <option>Course</option>
                <option>CSEN</option>
                <option>MET</option>
                <option>DMET</option>
                <option>BI</option>
                <option>Mechatronics</option>
              </select>
            
            </div>

            {/* 👁 Visibility */}
            <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-white/70">
              <Eye size={16} className="text-gray-500" />
              <select
            value={filterVisibility}
            onChange={(e) => setFilterVisibility(e.target.value)}
            className="bg-transparent outline-none text-sm"
          >
            <option value="All">Visibility</option>   {/* ✅ important */}
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
              
            </div>

            {/* 📌 Pinned */}
            <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-white/70">
              <Pin size={16} className="text-gray-500 rotate-45" strokeWidth={2.5} />
            <select
            value={filterPinned}
            onChange={(e) => setFilterPinned(e.target.value)}
            className="bg-transparent outline-none text-sm"
          >
            <option value="All">none</option>
            <option value="Pinned">Pinned</option>
            <option value="Unpinned">Unpinned</option>
          </select>
              
            </div>

            {/* ⬇ Sort */}
              <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-white/70">
                <span className="text-sm text-gray-500">Sort by</span>
                <select className="bg-transparent outline-none text-sm font-medium">
                  <option>Updated</option>
                  <option>Name</option>
                </select>
              
              </div>
      </AppCard>


        {/* 📌 Pinned */}
        {pinnedProjects.length > 0 && (
          <AppCard className="p-4">
            <Label className="mb-1 text-lg font-semibold text-[#2C4E80]">
              Pinned on Portfolio
            </Label>

            <p className="text-sm text-gray-500 mt-0 mb-4">
              Projects highlighted at the top of your portfolio
            </p>

            <div className="flex gap-4">
              {pinnedProjects.map((p) => (
                <div
                  key={p.id}
                  className="border rounded p-3 flex justify-between w-80"
                >
                  <div>
                    <h3 className="font-semibold">{p.name}</h3>
                    <p className="text-sm text-gray-500">{p.course}</p>
                  </div>

                <button
          onClick={() => togglePin(p.id)}
          className={`flex items-center justify-center w-10 h-10 rounded-full border transition ${
            p.pinned
              ? "bg-yellow-100 border-yellow-300 text-yellow-600"
              : "bg-white border-gray-200 text-gray-400 hover:bg-gray-100"
          }`}
        >
           <Pin size={16} strokeWidth={2.5} className="rotate-45" />
        </button>
                </div>
              ))}
            </div>
          </AppCard>
        )}

        {/* 📊 All Projects */}
        <AppCard className="p-4">
          <Label className="font-semibold mb-4">All My Projects</Label>
                <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1.5fr_1fr] px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                    <span>Project</span>
                    <span>Updated</span>
                    <span>Portfolio Visibility</span>
                    <span>Pinned to Top</span>
                    <span>Rating / Comments</span>
                    <span className="text-right">Actions</span>
              </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={projects.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
        <div className="space-y-3">

          {filteredProjects.map((p) => (

            <SortableProject key={p.id} p={p}>

              {{
                left: (
                  <div>
                    <h3 className="font-semibold text-2xl">
                      {p.name}
                    </h3>

                    <p className="text-blue-500 font-medium">
                      {p.course}
                    </p>

                    <p className="text-sm text-gray-500">
                      {p.description}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {p.updated}
                    </p>
                  </div>
                ),

                middle: (
                  <div className="flex items-center gap-6">

                    {/* VISIBILITY */}
                    <div className="relative w-fit">

                      <select
                        value={p.visibility}
                        onChange={(e) => {
                          const value = e.target.value;

                          setProjects((prev) =>
                            prev.map((proj) =>
                              proj.id === p.id
                                ? { ...proj, visibility: value }
                                : proj
                            )
                          );
                        }}
                        className={`appearance-none pl-10 pr-8 py-2 rounded-xl border text-sm font-medium cursor-pointer
                        ${
                          p.visibility === "Public"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        <option value="Public">Public</option>
                        <option value="Private">Private</option>
                      </select>

                      <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        {p.visibility === "Public" ? (
                          <Globe size={16} className="text-green-600" />
                        ) : (
                          <Lock size={16} className="text-gray-500" />
                        )}
                      </span>

                      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ChevronDown size={14} className="text-gray-400" />
                      </span>

                    </div>

                    {/* PIN */}
                    <button
                      onClick={() => togglePin(p.id)}
                      className={`flex items-center justify-center w-10 h-10 rounded-full border transition ${
                        p.pinned
                          ? "bg-yellow-100 border-yellow-300 text-yellow-600"
                          : "bg-white border-gray-200 text-gray-400 hover:bg-gray-100"
                      }`}
                    >
                      <Pin
                        size={16}
                        strokeWidth={2.5}
                        className="rotate-45"
                      />
                    </button>

                    {/* RATING */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-medium">
                        {p.rating}
                      </span>

                      <span className="text-yellow-400">
                        ★
                      </span>

                      <span className="text-gray-400">
                        •
                      </span>

                      <span>
                        {p.comments} comments
                      </span>
                    </div>

                  </div>
                ),

                right: (
                  <div className="flex gap-2">

                    <button className="p-2 rounded border hover:bg-gray-100">
                      <Eye size={16} />
                    </button>

                    <button className="p-2 rounded border hover:bg-gray-100">
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => {
                        if (
                          confirm("Are you sure you want to delete this project?")
                        ) {
                          deleteProject(p.id);
                        }
                      }}
                      className="p-2 rounded border hover:bg-red-100 text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>

                    <button
                      onClick={() => togglePin(p.id)}
                      className={`flex items-center justify-center w-10 h-10 rounded-full border transition ${
                        p.pinned
                          ? "bg-yellow-100 border-yellow-300 text-yellow-600"
                          : "bg-white border-gray-200 text-gray-400 hover:bg-gray-100"
                      }`}
                    >
                      <Pin
                        size={16}
                        strokeWidth={2.5}
                        className="rotate-45"
                      />
                    </button>

                  </div>
                ),
              }}

            </SortableProject>

          ))}

        </div>
      </SortableContext>
</DndContext>
           
        </AppCard>
       </div>
    </DashboardLayout>
  );
}