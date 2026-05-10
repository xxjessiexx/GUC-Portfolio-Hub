import { AppCard } from "@/components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function AdminAnalyticsSection({
  eyebrow,
  title,
  subtitle,
  children,
  variant = "glass",
}) {
  return (
    <AppCard
      variant={variant}
      radius="lg"
      padding="lg"
    >
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
      />

      <div className="mt-6">
        {children}
      </div>
    </AppCard>
  );
}