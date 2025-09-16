import TopicManager from '@/components/TopicManager';

export default function Topics() {
  return (
    <div className="space-y-6" data-testid="topics-page">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Topics Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage all JEE topics across Physics, Chemistry, and Mathematics. Add custom topics, organize by chapters, and create your personalized study plan.
        </p>
      </div>

      <TopicManager />
    </div>
  );
}