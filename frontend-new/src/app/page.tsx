import { HeroSlider } from '@/components/home/HeroSlider';
import { CategorySection } from '@/components/home/CategorySection';
import { BestSeller } from '@/components/home/BestSeller';
import { LatestCollection } from '@/components/home/LatestCollection';

export default function Home() {
  return (
    <>
      <HeroSlider />
      <CategorySection />
      <BestSeller />
      <LatestCollection />
    </>
  );
}
