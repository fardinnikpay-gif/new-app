import Seo from "../components/common/Seo";
import HeroSlider from "../components/home/HeroSlider";
import CategoryShowcase from "../components/home/CategoryShowcase";
import NewArrivals from "../components/home/NewArrivals";
import SaleSection from "../components/home/SaleSection";
import BrandsMarquee from "../components/home/BrandsMarquee";
import PromoBanner from "../components/home/PromoBanner";

export default function Home() {
  return (
    <>
      <Seo title="Home" description="Discover the latest in contemporary fashion." />
      <HeroSlider />
      {/* z-10 + bg-white lets these sections slide over the pinned hero */}
      <div className="relative z-10 bg-white">
        <CategoryShowcase />
        <NewArrivals />
        <SaleSection />
        <BrandsMarquee />
        <PromoBanner />
      </div>
    </>
  );
}