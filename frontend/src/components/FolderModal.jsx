import React, { useState, useEffect, useCallback } from "react";
import {
  handlePostFolderBackend,
  handleGetFoldersBackend,
} from "./BackendMethods";
import FolderTemplate from "./FolderTemplate";
import "../styling/FolderModal.css";

function FolderModal() {
  const [showModal, setShowModal] = useState(false);
  const [folderName, setFolderName] = useState("");

  const [folders, setFolders] = useState([]);

  const fetchFolders = useCallback(() => {
    handleGetFoldersBackend("ALL")
      .then((data) => {
        // Update the folders state with the new data
        setFolders(getFolderAndLengths(data));
      })
      .catch((error) => {
        console.error("Error fetching folders:", error);
      });
  }, []); // No dependencies, as useCallback memoizes the function

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const getFolderAndLengths = (data) => {
    const { folders, results } = data;

    // Create an array of objects with folderName and folderLength
    const folderData = folders.map((folderName) => ({
      folderName,
      folderLength: results[folderName].length,
    }));

    return folderData;
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFolderName("");
  };

  const handleCancel = () => {
    closeModal();
  };

  //handle key presses on the modal when open
  const handleKeyPress = (event) => {
    if (event.key === "Escape") {
      handleCancel();
    }
    if (event.key === "Enter") {
      handleCreateFolder();
    }
  };

  const handleInputChange = (e) => {
    setFolderName(e.target.value);
  };

  // will send folder name to backend
  const handleCreateFolder = () => {
    if (folderName.length > 0) {
      handlePostFolderBackend(folderName)
        .then((data) => {
          fetchFolders();
        })
        .catch((error) => {
          console.error("Error posting folder:", error);
        });
    }

    //need to show error if empty
    closeModal();
  };

  return (
    <div className="cookbook-folders-content-container">
      {folders.map((folder, index) => (
        <FolderTemplate folderData={folder} key={index} />
      ))}

      <button
        className={`add-new-folder-btn ${
          showModal ? "new-folder-btn-active" : ""
        }`}
        onClick={openModal}
      >
        + Add new cookbook
      </button>

      {showModal && (
        <div
          className="new-folder-modal-overlay"
          onClick={handleCancel}
          onKeyDown={handleKeyPress}
        >
          <div
            className="new-folder-info-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="new-folder-title">New Folder</h1>
            <input
              className="new-folder-input"
              placeholder="Enter folder name"
              type="text"
              value={folderName}
              onChange={handleInputChange}
              autoFocus
            />
            <div className="modal-folder-action-btns">
              <button className="new-folder-action-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button
                className="new-folder-action-btn"
                onClick={handleCreateFolder}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FolderModal;
