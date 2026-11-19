import { styled } from "@mui/material/styles";

export const StyledRootScrollbar = styled("div")(() => ({
  flexGrow: 1,
  height: "100%",
  overflow: "auto", // Use 'auto' to enable scrollbars only when necessary
}));

export const StyledScrollbar = styled("div")(({ theme }) => ({
  maxHeight: "100%",
  "& .simplebar-scrollbar": {
    display: "none", // Hide the scrollbar
  },
  "& .simplebar-mask": {
    zIndex: "inherit",
  },
}));
