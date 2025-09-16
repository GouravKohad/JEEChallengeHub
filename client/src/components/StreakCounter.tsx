import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingUp, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  studiedToday: boolean;
}

export default function StreakCounter({ currentStreak, longestStreak, totalDays, studiedToday }: StreakCounterProps) {
  const streakPercentage = longestStreak > 0 ? (currentStreak / longestStreak) * 100 : 0;
  
  return (
    <Card className="hover-elevate" data-testid="streak-counter">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className={`p-2 rounded-md ${
            studiedToday ? 'bg-chart-2/20' : 'bg-muted'
          }`}>
            <Zap className={`h-5 w-5 ${
              studiedToday ? 'text-chart-2' : 'text-muted-foreground'
            }`} />
          </div>
          Study Streak
          {studiedToday && (
            <Badge className="bg-chart-2 text-white" data-testid="badge-studied-today">
              Today ✓
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center space-y-2">
          <motion.div 
            className="text-4xl font-bold text-chart-2"
            initial={{ scale: 1 }}
            animate={{ scale: studiedToday ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.5 }}
            data-testid="text-current-streak"
          >
            {currentStreak}
          </motion.div>
          <p className="text-sm text-muted-foreground">
            {currentStreak === 1 ? 'day' : 'days'} current streak
          </p>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-chart-1" />
              <span>Longest Streak</span>
            </div>
            <span className="font-semibold" data-testid="text-longest-streak">{longestStreak} days</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-chart-3" />
              <span>Total Study Days</span>
            </div>
            <span className="font-semibold" data-testid="text-total-days">{totalDays} days</span>
          </div>
        </div>
        
        {/* Streak Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress to longest</span>
            <span>{Math.round(streakPercentage)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div 
              className="bg-chart-2 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(streakPercentage, 100)}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              data-testid="progress-streak"
            />
          </div>
        </div>
        
        {currentStreak === longestStreak && currentStreak > 0 && (
          <motion.div 
            className="text-center p-2 bg-chart-2/10 rounded-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            data-testid="personal-best-badge"
          >
            <p className="text-sm font-medium text-chart-2">🏆 Personal Best!</p>
          </motion.div>
        )}
        
        {!studiedToday && currentStreak > 0 && (
          <motion.div 
            className="text-center p-2 bg-chart-2/10 rounded-md border border-chart-2/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            data-testid="motivation-message"
          >
            <p className="text-sm text-chart-2">Don't break the streak! Study today to keep it going.</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}