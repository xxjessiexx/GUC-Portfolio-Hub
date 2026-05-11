import { useState } from "react";

import { updateProject } from "@/data/demoStore";
import {
  getDisplayName,
  makeId,
} from "@/utils/projectPage/projectPageHelpers";
import { getInvitationStatus } from "@/utils/projectPage/normalizeProjectForPage";

function getStudentNotificationTargets(project) {
  if (!project) return [];

  const acceptedCollaborators = (project.collaboratorIds || []).filter(
    (id) => getInvitationStatus(project, id) === "accepted"
  );

  return Array.from(
    new Set([project.ownerId, ...acceptedCollaborators].filter(Boolean))
  );
}

export function useProjectTasks({
  project,
  tasks,
  setTasks,
  setProject,
  isBachelorProject,
  canAddInstructorFeedback,
  loggedInUser,
  makeNotification,
}) {
  const [showTaskPopup, setShowTaskPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assigneeId: "",
    assignee: "",
    deadline: "",
    status: "pending",
  });

  const [taskFeedbackDrafts, setTaskFeedbackDrafts] = useState({});

  const storeTasks = (nextTasks) => {
    if (!project?.id || !Array.isArray(nextTasks)) return;

    const orderedTasks = nextTasks.map((task, index) => ({
      ...task,
      order: index,
    }));

    setTasks(orderedTasks);

    setProject((current) =>
      current ? { ...current, tasks: orderedTasks } : current
    );

    updateProject(project.id, {
      tasks: orderedTasks,
      updatedAt: new Date().toISOString(),
    });
  };

  const updateTaskStatus = (id, newStatus) => {
    storeTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  const addTask = () => {
    if (!project || !newTask.title.trim()) return;

    const selectedMember = project.team.find(
      (member) => String(member.id) === String(newTask.assigneeId)
    );

    const nextTask = {
      id: makeId("task"),
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      assigneeId: isBachelorProject ? project.ownerId : newTask.assigneeId,
      assignee: isBachelorProject
        ? project.ownerName
        : selectedMember?.name || newTask.assignee || "Unassigned",
      deadline: newTask.deadline,
      status: newTask.status || "pending",
      feedback: [],
      order: tasks.length,
    };

    storeTasks([...tasks, nextTask]);

    setNewTask({
      title: "",
      description: "",
      assigneeId: "",
      assignee: "",
      deadline: "",
      status: "pending",
    });

    setShowTaskPopup(false);
  };

  const openEditPopup = (task) => {
    setEditingTask(task);
    setShowEditPopup(true);
  };

  const saveEditedTask = () => {
    if (!project || !editingTask) return;

    const selectedMember = project.team.find(
      (member) => String(member.id) === String(editingTask.assigneeId)
    );

    storeTasks(
      tasks.map((task) =>
        task.id === editingTask.id
          ? {
              ...editingTask,
              assignee: selectedMember?.name || editingTask.assignee,
            }
          : task
      )
    );

    setShowEditPopup(false);
    setEditingTask(null);
  };

  const deleteTask = (taskId) => {
    storeTasks(tasks.filter((task) => task.id !== taskId));
  };

  const addTaskFeedback = (taskId, messageOverride = "") => {
    if (!project || !canAddInstructorFeedback) return;

    const message = (messageOverride || taskFeedbackDrafts[taskId] || "").trim();
    if (!message) return;

    const nextTasks = tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            feedback: [
              ...(task.feedback || []),
              {
                id: makeId("task-feedback"),
                authorId: loggedInUser.id,
                authorName: getDisplayName(loggedInUser),
                message,
                createdAt: new Date().toISOString(),
              },
            ],
          }
        : task
    );

    storeTasks(nextTasks);

    setTaskFeedbackDrafts((current) => ({
      ...current,
      [taskId]: "",
    }));

    getStudentNotificationTargets(project).forEach((userId) => {
      makeNotification(
        userId,
        "New task feedback",
        `${getDisplayName(loggedInUser)} commented on a task in ${project.title}.`,
        project.id
      );
    });
  };

  const deleteTaskFeedback = (taskId, feedbackId) => {
    storeTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              feedback: (task.feedback || []).filter(
                (item) => item.id !== feedbackId
              ),
            }
          : task
      )
    );
  };

  const editTaskFeedback = (taskId, feedbackId, nextMessage = "") => {
    const task = tasks.find((item) => item.id === taskId);
    const feedback = task?.feedback?.find((item) => item.id === feedbackId);

    if (!feedback || feedback.authorId !== loggedInUser?.id) return;

    const cleanMessage = String(nextMessage || "").trim();
    if (!cleanMessage) return;

    storeTasks(
      tasks.map((item) =>
        item.id === taskId
          ? {
              ...item,
              feedback: (item.feedback || []).map((entry) =>
                entry.id === feedbackId
                  ? {
                      ...entry,
                      message: cleanMessage,
                      updatedAt: new Date().toISOString(),
                    }
                  : entry
              ),
            }
          : item
      )
    );

    getStudentNotificationTargets(project).forEach((userId) => {
      makeNotification(
        userId,
        "Task feedback updated",
        `${getDisplayName(loggedInUser)} updated feedback on a task in ${project.title}.`,
        project.id
      );
    });
  };

  return {
    showTaskPopup,
    setShowTaskPopup,
    showEditPopup,
    setShowEditPopup,
    editingTask,
    setEditingTask,
    newTask,
    setNewTask,
    taskFeedbackDrafts,
    setTaskFeedbackDrafts,
    storeTasks,
    updateTaskStatus,
    addTask,
    openEditPopup,
    saveEditedTask,
    deleteTask,
    addTaskFeedback,
    deleteTaskFeedback,
    editTaskFeedback,
  };
}
