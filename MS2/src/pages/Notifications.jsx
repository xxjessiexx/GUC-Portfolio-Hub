import DashboardLayout from "@/components/layout/DashboardLayout";
import { useNotifications } from "@/context/NotificationsContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import NotificationsTabs from "@/components/notificationPage/notificationTabs";


export default function Notifications() {

const { notifications, unreadCount } = useNotifications();
const mssg = `You have ${unreadCount} unread notifications`;

console.log(notifications);

return(

<DashboardLayout >
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