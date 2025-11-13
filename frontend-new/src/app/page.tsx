import { Hero } from '@/components/home/Hero';
import { CategorySection } from '@/components/home/CategorySection';
import { BestSeller } from '@/components/home/BestSeller';
import { LatestCollection } from '@/components/home/LatestCollection';

export default function Home() {
  return (
    <>
      <Hero />
      <CategorySection />
      <BestSeller />
      <LatestCollection />
    </>
  );
}
