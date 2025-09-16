import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Target, CheckCircle2, Pause, Archive } from "lucide-react";
import { useChallenges } from "@/contexts/ChallengeContext";
import ChallengeCard from "@/components/ChallengeCard";
import ChallengeCreationModal from "@/components/ChallengeCreationModal";
import { InsertChallenge } from "@shared/schema";

export default function Challenges() {
  const { state, createChallenge, updateChallenge } = useChallenges();
  const { challenges, loading } = state;
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" data-testid="loading-challenges">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const activeChallenges = challenges.filter(c => c.status === 'active');
  const pausedChallenges = challenges.filter(c => c.status === 'paused');
  const completedChallenges = challenges.filter(c => c.status === 'completed');
  const archivedChallenges = challenges.filter(c => c.status === 'archived');

  const handleCreateChallenge = async (newChallenge: InsertChallenge) => {
    try {
      await createChallenge(newChallenge);
    } catch (error) {
      console.error('Failed to create challenge:', error);
    }
  };

  const handleChallengeAction = async (challengeId: string, action: string) => {
    try {
      const updates: any = {};
      if (action === 'pause') updates.status = 'paused';
      if (action === 'resume' || action === 'start') updates.status = 'active';
      
      await updateChallenge(challengeId, updates);
    } catch (error) {
      console.error(`Failed to ${action} challenge:`, error);
    }
  };

  const EmptyState = ({ title, description, icon: Icon }: { title: string, description: string, icon: any }) => (
    <Card className="text-center py-12">
      <CardContent>
        <Icon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6" data-testid="challenges-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Challenges</h1>
          <p className="text-muted-foreground mt-1">
            Manage all your JEE preparation challenges in one place
          </p>
        </div>
        <ChallengeCreationModal onCreateChallenge={handleCreateChallenge}>
          <Button data-testid="button-create-challenge">
            <Plus className="h-4 w-4 mr-2" />
            Create Challenge
          </Button>
        </ChallengeCreationModal>
      </div>

      {/* Challenge Tabs */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active" className="flex items-center gap-2" data-testid="tab-active">
            <Target className="h-4 w-4" />
            Active ({activeChallenges.length})
          </TabsTrigger>
          <TabsTrigger value="paused" className="flex items-center gap-2" data-testid="tab-paused">
            <Pause className="h-4 w-4" />
            Paused ({pausedChallenges.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2" data-testid="tab-completed">
            <CheckCircle2 className="h-4 w-4" />
            Completed ({completedChallenges.length})
          </TabsTrigger>
          <TabsTrigger value="archived" className="flex items-center gap-2" data-testid="tab-archived">
            <Archive className="h-4 w-4" />
            Archived ({archivedChallenges.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeChallenges.length > 0 ? (
            <div className="grid gap-4">
              {activeChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onStart={(id) => handleChallengeAction(id, 'start')}
                  onPause={(id) => handleChallengeAction(id, 'pause')}
                  onResume={(id) => handleChallengeAction(id, 'resume')}
                  onView={(id) => console.log('View challenge:', id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Active Challenges"
              description="Create a new challenge to start your focused JEE preparation."
              icon={Target}
            />
          )}
        </TabsContent>

        <TabsContent value="paused" className="space-y-4">
          {pausedChallenges.length > 0 ? (
            <div className="grid gap-4">
              {pausedChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onStart={(id) => handleChallengeAction(id, 'start')}
                  onPause={(id) => handleChallengeAction(id, 'pause')}
                  onResume={(id) => handleChallengeAction(id, 'resume')}
                  onView={(id) => console.log('View challenge:', id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Paused Challenges"
              description="Challenges you pause will appear here for easy resumption."
              icon={Pause}
            />
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedChallenges.length > 0 ? (
            <div className="grid gap-4">
              {completedChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onView={(id) => console.log('View challenge:', id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Completed Challenges"
              description="Challenges you complete will appear here as achievements."
              icon={CheckCircle2}
            />
          )}
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
          {archivedChallenges.length > 0 ? (
            <div className="grid gap-4">
              {archivedChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onStart={(id) => handleChallengeAction(id, 'start')}
                  onView={(id) => console.log('View challenge:', id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Archived Challenges"
              description="Challenges you archive for later will appear here."
              icon={Archive}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}