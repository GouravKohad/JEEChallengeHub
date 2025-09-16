import DashboardStats from '../DashboardStats';

export default function DashboardStatsExample() {
  // todo: remove mock functionality
  return (
    <DashboardStats 
      totalChallenges={8}
      activeChallenges={3}
      completedChallenges={4}
      currentStreak={12}
      totalStudyHours={156}
      tasksCompleted={89}
    />
  );
}