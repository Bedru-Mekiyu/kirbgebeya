import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { TextField } from "@mui/material";

import { Box, IconButton, Snackbar, Typography } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import React from "react";
import Modal from "react-modal";
import ClipLoader from "react-spinners/ClipLoader";

Modal.setAppElement("#root");

const Profile = ({
  isOpen,
  onRequestClose,
  formData,
  errors,
  createLoading,
  error,
  handleChange,
  handleUpdate,
  vertical = "top",
  horizontal = "center",
  t,
  setError,
  snackbarOpen,
  setSnackbarOpen,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit User Modal"
      className="Modal absolute w-full h-full bg-gray-700 bg-opacity-75 flex justify-center items-center z-50"
      overlayClassName="Overlay fixed inset-0"
    >
      <style>{`
      .hidden-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .hidden-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `}</style>
      <div className="bg-white p-6 rounded-lg max-h-[76vh] relative max-w-md overflow-y-auto hidden-scrollbar">
        <div className="flex justify-between items-center">
          <Typography variant="h6" gutterBottom>
            {t("user.editUserProfile")}
          </Typography>
          <div className="flex justify-end">
            <IconButton onClick={onRequestClose}>
              <HighlightOffIcon />
            </IconButton>
          </div>
        </div>
        <div>
          <form onSubmit={handleUpdate}>
            <TextField
              className="rounded border border-gray-300"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="fullName"
              label={t("user.fullName")}
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              autoComplete="given-name"
              autoFocus
            />
            <TextField
              className="rounded border border-gray-300"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="user_name"
              label={t("user.userName")}
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              autoComplete="given-name"
            />
            <TextField
              className="mb-4 px-4 py-2 rounded border border-gray-300"
              variant="outlined"
              margin="normal"
              fullWidth
              id="email"
              label={t("user.emailAddress")}
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            <div className="flex items-center mb-4">
              <div className="mr-2 text-gray-700 text-l">+251</div>
              <TextField
                className="flex-1 px-4 py-2 rounded border border-gray-300"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="phone_number"
                label={t("user.phone_number")}
                name="phone_number"
                autoComplete="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                error={!!errors.phone_number}
                helperText={errors.phone_number}
              />
            </div>
            <TextField
              className="mb-4 px-4 py-2 rounded border border-gray-300"
              variant="outlined"
              margin="normal"
              fullWidth
              type="password"
              id="current_password"
              label={t("user.currentPassword")}
              name="current_password"
              value={formData.current_password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <TextField
              className="mb-4 px-4 py-2 rounded border border-gray-300"
              variant="outlined"
              margin="normal"
              fullWidth
              type="password"
              id="new_password"
              label={t("user.newPassword")}
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              autoComplete="new-password"
              error={!!errors.new_password}
              helperText={errors.new_password}
            />
            <TextField
              className="mb-4 px-4 py-2 rounded border border-gray-300"
              variant="outlined"
              margin="normal"
              fullWidth
              type="password"
              id="confirm_password"
              label={t("user.confirmPassword")}
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              autoComplete="new-password"
              error={!!errors.confirm_password}
              helperText={errors.confirm_password}
              required={!!formData.new_password}
            />
            <div className="flex justify-end py-4 ">
              {createLoading ? (
                <ClipLoader
                  color="#3182CE"
                  loading={createLoading}
                  data-testid="loader"
                  size={30}
                />
              ) : (
                <button
                  type="submit"
                  variant="contained"
                  style={{ backgroundColor: "#3182CE", color: "white" }}
                  className="text-white py-2 px-10 rounded transition-all duration-200 self-stretch mt-4"
                >
                  {t("user.update")}
                </button>
              )}
            </div>
          </form>
          {error && (
            <Box sx={{ width: 500 }}>
              <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={!!error}
                onClose={() => setError(null)}
                autoHideDuration={2000}
                key={vertical + horizontal}
              >
                <MuiAlert
                  onClose={() => setError(null)}
                  severity="error"
                  sx={{ width: "100%" }}
                >
                  {error}
                </MuiAlert>
              </Snackbar>
            </Box>
          )}
          {snackbarOpen && (
            <Snackbar
              anchorOrigin={{ vertical, horizontal }}
              open={snackbarOpen}
              onClose={() => setSnackbarOpen(false)}
              autoHideDuration={2000}
              key={vertical + horizontal}
            >
              <MuiAlert
                onClose={() => setSnackbarOpen(false)}
                severity="success"
              >
                {"Profile Updated Successfully"}
              </MuiAlert>
            </Snackbar>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default Profile;
