import { TopicManager } from '@/components/TopicManager';
import { DueReminders } from '@/components/DueReminders';
import { StudyGrowthChart } from '@/components/StudyGrowthChart';
import { BookOpen, Heart } from 'lucide-react';

function Header() {
  return (
    <header className="bg-card border-b border-border shadow-xs">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-serif text-lg font-semibold text-foreground leading-tight">
            Revision Reminder
          </h1>
          <p className="text-xs text-muted-foreground font-sans">Spaced repetition study tracker</p>
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-xl shadow-card mb-8">
      <img
        src="/assets/generated/study-hero.dim_800x400.png"
        alt="Study growth illustration"
        className="w-full h-40 sm:h-52 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-transparent flex items-center">
        <div className="px-6 sm:px-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary-foreground mb-1 drop-shadow">
            Master What You Learn
          </h2>
          <p className="text-primary-foreground/85 font-sans text-sm sm:text-base max-w-sm drop-shadow">
            Add topics, get reminded at the right intervals, and watch your knowledge grow.
          </p>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'revision-reminder'
  );

  return (
    <footer className="border-t border-border mt-16 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground font-sans">
        <p>© {year} Revision Reminder App</p>
        <p className="flex items-center gap-1.5">
          Built with{' '}
          <Heart className="w-3.5 h-3.5 text-accent-foreground fill-accent-foreground" />{' '}
          using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        <HeroSection />

        <div className="space-y-6">
          {/* Topic Management */}
          <TopicManager />

          {/* Due Reminders */}
          <DueReminders />

          {/* Study Growth Chart */}
          <StudyGrowthChart />
        </div>
      </main>

      <Footer />
    </div>
  );
}
