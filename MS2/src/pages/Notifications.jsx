import DashboardLayout from "@/components/layout/DashboardLayout";
import { useNotifications } from "@/context/NotificationsContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import NotificationsTabs from "@/components/notificationPage/notificationTabs";


export default function Notifications() {
const { notifications } = useNotifications();

const count =  notifications.filter(n => n.unread).length;
const mssg = `You have ${count} unread notifications`;


return(

<DashboardLayout notifications={notifications}>
    <div className="space-y-6">
            <SectionHeader
            title="Notifications"
            subtitle= {mssg}
            />

            <NotificationsTabs notifications={notifications}/>
    </div>
</DashboardLayout>
);
}