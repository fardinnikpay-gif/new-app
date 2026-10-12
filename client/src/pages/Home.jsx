import Seo from "../components/common/Seo";
import HeroSlider from "../components/home/HeroSlider";

export default function Home() {
  return (
    <>
      <Seo title="Home" description="Discover the latest in contemporary fashion." />
      <HeroSlider />
      {/* Temporary block to test the overlap. Step 12 replaces it with the real sections. */}
      <div className="relative z-10 min-h-screen bg-white" />
    </>
  );
}