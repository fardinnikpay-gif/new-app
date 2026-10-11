import { Outlet } from "react-router-dom";
import PagePlaceholder from "../../components/common/PagePlaceholder";

export default function AccountLayout() {
  return (
    <PagePlaceholder title="Account">
      <Outlet />
    </PagePlaceholder>
  );
}