import { Hero } from '@/components/home/Hero';
import { BestSeller } from '@/components/home/BestSeller';
import { LatestCollection } from '@/components/home/LatestCollection';

export default function Home() {
  return (
    <>
      <Hero />
      <BestSeller />
      <LatestCollection />
    </>
  );
}
