import { useState } from 'react';
import { Dropdown, Modal, Button } from 'react-bootstrap';
import { FiMoreHorizontal } from 'react-icons/fi';
import useCommunityStore from '../store/communityStore';
import "./PostActionsDropdown.css";

const PostActionsDropdown = ({ post, userInfo }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const { updatePost, deletePost, fetchPosts } = useCommunityStore();

  const handleUpdate = async () => {
    try {
      await updatePost(post._id, editedContent);
      setShowEditModal(false);
      await fetchPosts();
    } catch (error) {
      console.error('Edit error:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(post._id);
      setShowDeleteModal(false);
      await fetchPosts();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  if (post.user?._id !== userInfo?._id) return null;

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle variant="link" className="p-0">
          <FiMoreHorizontal className="text-muted" />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setShowEditModal(true)}>
            Edit
          </Dropdown.Item>
          <Dropdown.Item 
            onClick={() => setShowDeleteModal(true)}
            className="text-danger"
          >
            Delete
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            className="form-control"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows="5"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this post?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PostActionsDropdown;