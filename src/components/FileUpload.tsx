import { Box, Stack, Typography, Button } from "@mui/material";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useRef } from "react";
import { palette, radius } from "../theme";

interface FileUploadProps {
  label: string;
  /** Name of the currently-selected file, if any. */
  fileName?: string;
  /** Error message — switches the control to the error state. */
  error?: string;
  /** Helper/format hint shown when there's no error. */
  helperText?: string;
  /** `accept` attribute for the underlying input. */
  accept?: string;
  buttonLabel?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Optional ref to the native input so the parent can reset its value. */
  inputRef?: React.Ref<HTMLInputElement>;
}

/**
 * Presentational drag-and-drop-style file picker. State stays with the parent
 * form (so the file can be appended to FormData); this just renders the control.
 * Replaces the deeply-nested inline upload markup in Contact.tsx.
 *
 * Phase 2 primitive — see UIUX_PREMIUM_PLAN.md §5 (Contact).
 */
export default function FileUpload({
  label,
  fileName,
  error,
  helperText,
  accept,
  buttonLabel = "Choose File",
  onChange,
  inputRef,
}: FileUploadProps) {
  const fallbackRef = useRef<HTMLInputElement>(null);
  const ref = inputRef ?? fallbackRef;

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2.25 },
        border: `1px dashed ${error ? palette.error.main : palette.warmGray}`,
        borderRadius: `${radius.sm}px`,
        bgcolor: palette.background.default,
        transition: "border-color 0.25s ease",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 0.35 }}>
            {label}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: fileName ? palette.success.main : palette.text.secondary,
              fontWeight: fileName ? 600 : 400,
            }}
          >
            {fileName && <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />}
            {fileName || "Upload your file below."}
          </Typography>
          <Typography
            variant="caption"
            role={error ? "alert" : undefined}
            sx={{ color: error ? palette.error.main : palette.text.secondary }}
          >
            {error || helperText}
          </Typography>
        </Box>
        <Button
          component="label"
          variant="outlined"
          startIcon={<UploadFileOutlinedIcon />}
          sx={{ flexShrink: 0 }}
        >
          {buttonLabel}
          <input hidden ref={ref} type="file" accept={accept} onChange={onChange} />
        </Button>
      </Stack>
    </Box>
  );
}
