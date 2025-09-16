import ChallengeCreationModal from '../ChallengeCreationModal';
import { InsertChallenge } from '@shared/schema';

export default function ChallengeCreationModalExample() {
  const handleCreate = (challenge: InsertChallenge) => {
    console.log('Challenge created:', challenge);
  };

  return (
    <ChallengeCreationModal onCreateChallenge={handleCreate} />
  );
}