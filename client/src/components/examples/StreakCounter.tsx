import StreakCounter from '../StreakCounter';

export default function StreakCounterExample() {
  // todo: remove mock functionality
  return (
    <StreakCounter 
      currentStreak={12}
      longestStreak={15}
      totalDays={45}
      studiedToday={true}
    />
  );
}