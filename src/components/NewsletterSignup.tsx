import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Collapse,
  Alert,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { subscribeNewsletter } from "../services/api";
import { palette } from "../theme";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      await subscribeNewsletter(email);
      setStatus("success");
      setEmail("");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrorMsg(msg);
      setStatus("error");
    }
  };

  return (
    <Box
      sx={{
        py: { xs: 7, md: 9 },
        bgcolor: palette.cream,
        position: "relative",
        overflow: "hidden",
        borderTop: `1px solid ${palette.warmGray}`,
        borderBottom: `1px solid ${palette.warmGray}`,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="overline"
            sx={{
              color: palette.primary.main,
              letterSpacing: "0.18em",
              fontSize: "0.75rem",
              fontWeight: 700,
              display: "block",
              mb: 1,
            }}
          >
            STAY IN THE LOOP
          </Typography>
          <Typography
            variant="h3"
            sx={{
              color: palette.text.primary,
              fontWeight: 700,
              fontFamily: '"AmpersandFix", "Playfair Display", serif',
              fontSize: { xs: "1.75rem", md: "2.25rem" },
              mb: 1.5,
              lineHeight: 1.2,
            }}
          >
            Get Exclusive Specials &amp; Updates
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: palette.text.secondary,
              mb: 4,
              maxWidth: 420,
              mx: "auto",
              lineHeight: 1.7,
            }}
          >
            Be the first to know about daily specials, upcoming events, and
            seasonal menus at Corrado's.
          </Typography>

          <Collapse in={status === "success"}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                bgcolor: "#e8f5e9",
                border: "1px solid #c8e6c9",
                borderRadius: 2,
                px: 3,
                py: 2,
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <CheckCircleOutlineIcon
                  sx={{ color: "#2e7d32", fontSize: 28 }}
                />
                <Typography sx={{ color: "#1b5e20", fontWeight: 600 }}>
                  You're subscribed! We'll be in touch soon.
                </Typography>
              </Box>
              <Button
                size="small"
                onClick={() => setStatus("idle")}
                sx={{
                  color: "#1b5e20",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Subscribe another email
              </Button>
            </Box>
          </Collapse>

          <Collapse in={status === "error"}>
            <Alert
              severity="error"
              sx={{ mb: 2, textAlign: "left", borderRadius: 2 }}
              onClose={() => setStatus("idle")}
            >
              {errorMsg}
            </Alert>
          </Collapse>

          {status !== "success" && (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                gap: 1.5,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <TextField
                fullWidth
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                disabled={status === "loading"}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon sx={{ color: palette.text.secondary }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#fff",
                    color: palette.text.primary,
                    borderRadius: 2,
                    "& fieldset": { borderColor: palette.warmGray },
                    "&:hover fieldset": { borderColor: palette.primary.light },
                    "&.Mui-focused fieldset": { borderColor: palette.primary.main },
                    "&.Mui-disabled": { bgcolor: "rgba(0,0,0,0.05)" },
                  },
                  "& input::placeholder": { color: palette.text.secondary, opacity: 0.7 },
                  "& input": { color: palette.text.primary },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={status === "loading" || !email.trim()}
                sx={{
                  flexShrink: 0,
                  px: { sm: 4 },
                  borderRadius: 2,
                  bgcolor: palette.primary.main,
                  color: "#fff",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  "&:hover": { bgcolor: palette.primary.dark },
                  "&.Mui-disabled": { bgcolor: "rgba(0,0,0,0.12)", color: "rgba(0,0,0,0.26)" },
                }}
              >
                {status === "loading" ? "Subscribing…" : "Subscribe"}
              </Button>
            </Box>
          )}

          <Typography
            sx={{
              color: palette.text.secondary,
              fontSize: "0.75rem",
              mt: 2,
              opacity: 0.8,
            }}
          >
            No spam, ever. Unsubscribe at any time.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
