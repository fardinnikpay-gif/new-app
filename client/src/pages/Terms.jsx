import { terms } from "../data/policies";
import PolicyPage from "../components/common/PolicyPage";

export default function Terms() {
  return <PolicyPage policy={terms} seoDescription="The terms that apply when you use our store." />;
}