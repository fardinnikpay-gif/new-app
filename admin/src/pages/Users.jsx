import { useCallback, useEffect, useState } from "react";
import { Users as UsersIcon } from "lucide-react";
import { deleteUser, getAdminUsers } from "../api/userApi";
import PageHeader from "../components/common/PageHeader";
import Pagination from "../components/common/Pagination";
import SearchInput from "../components/common/SearchInput";
import UserDetailModal from "../components/users/UserDetailModal";
import UsersTable from "../components/users/UsersTable";
import Button from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import useAsync from "../hooks/useAsync";
import useConfirmDelete from "../hooks/useConfirmDelete";
import usePagedQuery from "../hooks/usePagedQuery";
import { getUserDisplayName } from "../utils/user";

const INITIAL_QUERY = { search: "" };
const FIRST_PAGE = 1;

export default function Users() {
  const { params, setPage, setSearch, reset } = usePagedQuery(INITIAL_QUERY);
  const { data, loading, error, reload } = useAsync(
    (signal) => getAdminUsers(params, signal),
    [params]
  );
  // userId is kept after closing so the modal does not flip while it animates out.
  const [viewer, setViewer] = useState({ open: false, userId: null });

  const page = params.page;
  const users = data?.users ?? [];
  const hasSearch = Boolean(params.search);

  // Deleting the last row of a page (other than page 1) goes back one page; otherwise refetch.
  const handleDeleted = useCallback(() => {
    if (users.length === 1 && page > FIRST_PAGE) setPage(page - 1);
    else reload();
  }, [users.length, page, setPage, reload]);

  const deletion = useConfirmDelete(deleteUser, {
    successMessage: "User deleted",
    onDeleted: handleDeleted,
  });

  const openUser = useCallback((user) => setViewer({ open: true, userId: user._id }), []);
  const closeUser = useCallback(() => setViewer((prev) => ({ ...prev, open: false })), []);

  // The URL can point past the last page (e.g. ?page=99): jump to the real last page.
  useEffect(() => {
    if (loading || !data) return;
    if (data.users.length === 0 && data.total > 0 && page > FIRST_PAGE) {
      setPage(Math.max(data.pages, FIRST_PAGE));
    }
  }, [loading, data, page, setPage]);

  const emptyState = hasSearch ? (
    <EmptyState
      icon={UsersIcon}
      title="No users match your search"
      message="Try a different name, email or phone number."
      action={
        <Button variant="outline" onClick={reset}>
          Clear search
        </Button>
      }
    />
  ) : (
    <EmptyState
      icon={UsersIcon}
      title="No users yet"
      message="Customers will appear here after they sign up."
    />
  );

  const targetName = deletion.target ? getUserDisplayName(deletion.target) : "";

  return (
    <>
      <PageHeader title="Users" />

      <div className="mb-4">
        <SearchInput
          value={params.search ?? ""}
          onChange={setSearch}
          placeholder="Search by name, email or phone"
          label="Search users"
        />
      </div>

      {error ? (
        <ErrorState title="Could not load users" message={error.message} onRetry={reload} />
      ) : (
        <>
          <UsersTable
            users={users}
            loading={loading}
            onView={openUser}
            onDelete={deletion.askDelete}
            emptyState={emptyState}
          />
          {data && <Pagination page={page} pages={data.pages} total={data.total} onChange={setPage} />}
        </>
      )}

      <UserDetailModal userId={viewer.userId} open={viewer.open} onClose={closeUser} />

      <ConfirmDialog
        open={deletion.open}
        title="Delete user?"
        message={`"${targetName}" will be permanently deleted. This action cannot be undone.`}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={deletion.confirm}
        onClose={deletion.cancel}
        loading={deletion.deleting}
      />
    </>
  );
}