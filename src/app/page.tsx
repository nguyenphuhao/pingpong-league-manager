import { WelcomeSection } from '@/components/common/welcome-section';
import { Footer } from '@/components/common/footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <WelcomeSection />
      <Footer />
    </div>
  );
}