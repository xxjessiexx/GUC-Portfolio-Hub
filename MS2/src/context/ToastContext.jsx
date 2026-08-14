import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import SideToast from "@/components/ui/SideToast";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toastData, setToastData] = useState({
    open: false,
    title: "",
    description: "",
    type: "success",
  });

  useEffect(() => {
    if (!toastData.open) return;

    const timer = setTimeout(() => {
      setToastData((current) => ({
        ...current,
        open: false,
      }));
    }, 4000);

    return () => clearTimeout(timer);
  }, [toastData.open]);

  const showToast = ({
    title,
    description = "",
    type = "success",
  }) => {
    setToastData({
      open: true,
      title,
      description,
      type,
    });
  };

  const hideToast = () => {
    setToastData((current) => ({
      ...current,
      open: false,
    }));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <SideToast
        open={toastData.open}
        title={toastData.title}
        description={toastData.description}
        type={toastData.type}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used inside ToastProvider"
    );
  }

  return context;
}