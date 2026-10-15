import { privacy } from "../data/policies";
import PolicyPage from "../components/common/PolicyPage";

export default function Privacy() {
  return (
    <PolicyPage policy={privacy} seoDescription="How we collect, use and protect your personal information." />
  );
}