import { useState } from "react";

import { useToast } from "@/context/ToastContext";
import { updateProject } from "@/data/demoStore";
import {
  getDisplayName,
  makeId,
} from "@/utils/projectPage/projectPageHelpers";

function sameId(a, b) {
  return String(a || "") === String(b || "");
}

export function useProjectTasks({
  project,
  tasks,
  setTasks,
  setProject,
  isBachelorProject,
  canManageTasks,
  canAddInstructorFeedback,
  loggedInUser,
  currentUser,
  makeNotification,
}) {
  const { showToast } = useToast();

  const [showTaskPopup, setShowTaskPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [taskErrors, setTaskErrors] = useState({
    title: "",
  });

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assigneeId: "",
    assignee: "",
    deadline: "",
    status: "pending",
  });

  const [taskFeedbackDrafts, setTaskFeedbackDrafts] = useState({});

  const canUpdateThisTaskStatus = (task) => {
    if (!task || !loggedInUser?.id) return false;
    if (canManageTasks) return true;

    return (
      sameId(task.assigneeId, loggedInUser.id) ||
      sameId(task.assignedToId, loggedInUser.id) ||
      sameId(task.userId, loggedInUser.id) ||
      String(task.assignee || "").trim().toLowerCase() ===
        String(currentUser || getDisplayName(loggedInUser)).trim().toLowerCase()
    );
  };

  const storeTasks = (nextTasksOrUpdater) => {
    if (!project?.id || !canManageTasks) return;

    const resolvedTasks =
      typeof nextTasksOrUpdater === "function"
        ? nextTasksOrUpdater(tasks)
        : nextTasksOrUpdater;

    const orderedTasks = (Array.isArray(resolvedTasks) ? resolvedTasks : []).map(
      (task, index) => ({
        ...task,
        order: index,
      })
    );

    setTasks(orderedTasks);

    setProject((current) =>
      current ? { ...current, tasks: orderedTasks } : current
    );

    updateProject(project.id, {
      tasks: orderedTasks,
      updatedAt: new Date().toISOString(),
    });
  };

  const persistTasksWithoutOwnerOnlyCheck = (nextTasks) => {
    if (!project?.id) return;

    const orderedTasks = (Array.isArray(nextTasks) ? nextTasks : []).map(
      (task, index) => ({
        ...task,
        order: Number.isFinite(Number(task.order)) ? Number(task.order) : index,
      })
    );

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
    const selectedTask = tasks.find((task) => sameId(task.id, id));
    if (!canUpdateThisTaskStatus(selectedTask)) return;

    persistTasksWithoutOwnerOnlyCheck(
      tasks.map((task) =>
        sameId(task.id, id) ? { ...task, status: newStatus } : task
      )
    );
  };

  const addTask = () => {
    if (!project || !canManageTasks) {
      showToast({
        title: "Task could not be created",
        description: "You do not have permission to add tasks to this project.",
        type: "error",
      });
      return false;
    }

    const title = newTask.title.trim();

    if (!title) {
      setTaskErrors({
        title: "Task title is required.",
      });

      showToast({
        title: "Unable to create task",
        description: "Please enter a task title.",
        type: "error",
      });

      return false;
    }

    setTaskErrors({
      title: "",
    });

    const selectedMember = (project.team || []).find(
      (member) => sameId(member.id, newTask.assigneeId)
    );

    const nextTask = {
      id: makeId("task"),
      title,
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

    showToast({
      title: "Task created successfully",
      description: `${title} was added to the project.`,
      type: "success",
    });

    return true;
  };

  const openTaskPopup = () => {
    setTaskErrors({
      title: "",
    });
    setShowTaskPopup(true);
  };

  const closeTaskPopup = () => {
    setTaskErrors({
      title: "",
    });
    setShowTaskPopup(false);
  };

  const updateNewTask = (updates) => {
    setNewTask((current) => ({
      ...current,
      ...updates,
    }));

    if (
      Object.prototype.hasOwnProperty.call(updates, "title") &&
      String(updates.title || "").trim()
    ) {
      setTaskErrors((current) => ({
        ...current,
        title: "",
      }));
    }
  };

  const openEditPopup = (task) => {
    if (!canManageTasks) return;
    setEditingTask(task);
    setShowEditPopup(true);
  };

  const saveEditedTask = () => {
    if (!project || !canManageTasks || !editingTask) return;

    const selectedMember = (project.team || []).find(
      (member) => sameId(member.id, editingTask.assigneeId)
    );

    storeTasks(
      tasks.map((task) =>
        sameId(task.id, editingTask.id)
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
    if (!canManageTasks) return;
    storeTasks(tasks.filter((task) => !sameId(task.id, taskId)));
  };

  const addTaskFeedback = (taskId) => {
    if (!project || !canAddInstructorFeedback) return;

    const message = taskFeedbackDrafts[taskId]?.trim();
    if (!message) return;

    const nextTasks = tasks.map((task) =>
      sameId(task.id, taskId)
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

    persistTasksWithoutOwnerOnlyCheck(nextTasks);

    setTaskFeedbackDrafts((current) => ({
      ...current,
      [taskId]: "",
    }));

    makeNotification(
      project.ownerId,
      "New task feedback",
      `${getDisplayName(loggedInUser)} commented on a task in ${project.title}.`,
      project.id
    );
  };

  const deleteTaskFeedback = (taskId, feedbackId) => {
    if (!canAddInstructorFeedback) return;

    const task = tasks.find((item) => sameId(item.id, taskId));
    const feedback = task?.feedback?.find((item) => sameId(item.id, feedbackId));

    if (!feedback || !sameId(feedback.authorId, loggedInUser?.id)) return;

    persistTasksWithoutOwnerOnlyCheck(
      tasks.map((taskItem) =>
        sameId(taskItem.id, taskId)
          ? {
              ...taskItem,
              feedback: (taskItem.feedback || []).filter(
                (item) => !sameId(item.id, feedbackId)
              ),
            }
          : taskItem
      )
    );
  };

  const editTaskFeedback = (taskId, feedbackId) => {
    if (!canAddInstructorFeedback) return;

    const task = tasks.find((item) => sameId(item.id, taskId));
    const feedback = task?.feedback?.find((item) => sameId(item.id, feedbackId));

    if (!feedback || !sameId(feedback.authorId, loggedInUser?.id)) {
      return;
    }

    const nextMessage = window.prompt(
      "Edit task feedback",
      feedback.message || ""
    );

    if (nextMessage === null || !nextMessage.trim()) return;

    persistTasksWithoutOwnerOnlyCheck(
      tasks.map((item) =>
        sameId(item.id, taskId)
          ? {
              ...item,
              feedback: (item.feedback || []).map((entry) =>
                sameId(entry.id, feedbackId)
                  ? {
                      ...entry,
                      message: nextMessage.trim(),
                      updatedAt: new Date().toISOString(),
                    }
                  : entry
              ),
            }
          : item
      )
    );
  };

  return {
    showTaskPopup,
    setShowTaskPopup,
    openTaskPopup,
    closeTaskPopup,
    showEditPopup,
    setShowEditPopup,
    editingTask,
    setEditingTask,
    newTask,
    setNewTask,
    updateNewTask,
    taskErrors,
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
