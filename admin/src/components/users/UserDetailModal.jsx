import Modal from "../ui/Modal";
import UserDetailContent from "./UserDetailContent";

// Shell only: the content (and its request) exists only while the modal is open.
// userId is kept by the page after closing, so nothing flips during the exit animation.
export default function UserDetailModal({ userId, open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="User details">
      {userId && <UserDetailContent key={userId} userId={userId} />}
    </Modal>
  );
}