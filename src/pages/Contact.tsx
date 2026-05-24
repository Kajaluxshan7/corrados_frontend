import { useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
  Snackbar,
  Alert,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { PageHero, SocialIcon } from '../components';
import { businessInfo } from '../data';
import { palette } from '../theme';
import { API_BASE_URL } from '../config/api';
import { useSiteImages } from "../contexts/SiteImagesContext";
import { usePageMeta } from "../hooks/usePageMeta";

// ─── Subject options ──────────────────────────────────────────────────────────
// `value` is what the backend DTO accepts; `label` is what the user sees.
const subjectOptions = [
  { value: 'general',     label: 'General Inquiry' },
  { value: 'reservation', label: 'Reservation Request' },
  { value: 'event',       label: 'Private Event / Catering' },
  { value: 'careers',     label: 'Careers' },
  { value: 'feedback',    label: 'Feedback' },
] as const;

type SubjectValue = (typeof subjectOptions)[number]['value'];

// ─── Success messages per subject ─────────────────────────────────────────────
const successMessages: Record<SubjectValue, string> = {
  general:     "Thank you for reaching out. We'll get back to you soon.",
  reservation: "Thanks for your reservation request. We'll confirm your table shortly.",
  event:       "Thank you for your event inquiry. We'll follow up with package details soon.",
  careers:     "Thanks for applying to Corrado's. Our team will review your CV and contact you if there's a fit.",
  feedback:    'Thank you for your feedback. We appreciate you taking the time to share it.',
};

// ─── Form state shape ─────────────────────────────────────────────────────────
interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: SubjectValue;
  // Reservation fields
  guestCount: string;
  reservationDate: string;
  reservationTime: string;
  // Private-event fields
  eventType: string;
  eventGuestCount: string;
  eventDate: string;
  // Career fields
  position: string;
  availability: string;
  // Universal
  message: string;
}

const INITIAL_FORM: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: 'general',
  guestCount: '',
  reservationDate: '',
  reservationTime: '',
  eventType: '',
  eventGuestCount: '',
  eventDate: '',
  position: '',
  availability: '',
  message: '',
};

export default function Contact() {
  usePageMeta({
    title: "Contact Us | Corrado's Restaurant Whitby",
    description: "Get in touch with Corrado's Restaurant & Bar — 38 Baldwin Street, Whitby, ON. Call (905) 655-3100, email us, or send a message. Open 7 days, 12 pm–10:30 pm. Reservations, catering enquiries & career opportunities welcome.",
    ogImage: "/orrdos/exterior-sign-flags.jpg",
  });
  const { getImage } = useSiteImages();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState('');
  const [resumeError, setResumeError] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; severity: 'success' | 'error'; message: string }>({
    open: false,
    severity: 'success',
    message: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isReservation  = form.subject === 'reservation';
  const isCareer       = form.subject === 'careers';
  const isPrivateEvent = form.subject === 'event';

  // ─── Field helpers ──────────────────────────────────────────────────────────
  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = e.target.value as SubjectValue;
    setForm((prev) => ({ ...prev, subject: next }));
    if (next !== 'careers') {
      setResumeFile(null);
      setResumeFileName('');
      setResumeError('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) { setResumeFile(null); setResumeFileName(''); setResumeError(''); return; }

    const validExtensions = ['pdf', 'doc', 'docx'];
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!validExtensions.includes(ext)) {
      setResumeFile(null);
      setResumeFileName('');
      setResumeError('Please upload a PDF, DOC, or DOCX file.');
      e.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setResumeFile(null);
      setResumeFileName('');
      setResumeError('File must be under 5 MB.');
      e.target.value = '';
      return;
    }

    setResumeFile(file);
    setResumeFileName(file.name);
    setResumeError('');
  };

  // ─── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isCareer && !resumeFile) {
      setResumeError('Please upload your CV in PDF, DOC, or DOCX format.');
      return;
    }

    setSubmitting(true);

    // Build FormData — backend accepts multipart for the optional cvFile
    const data = new FormData();

    // Combine first + last name into the single `name` field the DTO expects
    data.append('name', `${form.firstName.trim()} ${form.lastName.trim()}`.trim());
    data.append('email', form.email.trim());
    if (form.phone.trim()) data.append('phone', form.phone.trim());
    data.append('subject', form.subject);

    // Subject-specific fields
    if (isReservation) {
      if (form.guestCount)      data.append('guestCount', form.guestCount);
      if (form.reservationDate) data.append('reservationDate', form.reservationDate);
      if (form.reservationTime) data.append('reservationTime', form.reservationTime);
    }

    if (isPrivateEvent) {
      // Fold event type and guest count into the message for clarity;
      // also send guestCount as a proper field and eventDate as reservationDate.
      if (form.eventGuestCount) data.append('guestCount', form.eventGuestCount);
      if (form.eventDate)       data.append('reservationDate', form.eventDate);
    }

    if (isCareer) {
      if (form.position.trim()) data.append('position', form.position.trim());
      if (resumeFile)           data.append('cvFile', resumeFile);
    }

    // Build the message, prepending context fields where useful
    let messageBody = form.message.trim();
    if (isPrivateEvent && form.eventType.trim()) {
      messageBody = `Event Type: ${form.eventType.trim()}\n\n${messageBody}`;
    }
    if (isCareer && form.availability.trim()) {
      messageBody = `Availability: ${form.availability.trim()}\n\n${messageBody}`;
    }
    data.append('message', messageBody);

    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        body: data,
        // Do NOT set Content-Type — browser sets it with the correct boundary for multipart
      });

      if (!res.ok) {
        // NestJS AllExceptionsFilter shape: { statusCode, message, errorId? }
        // ValidationPipe joins array messages server-side; message is always a string here.
        const body = await res.json().catch(() => ({})) as Record<string, unknown>;
        const raw = body.message;
        const serverMsg = Array.isArray(raw)
          ? raw.join('; ')
          : typeof raw === 'string' && raw.length
          ? raw
          : null;

        // Map HTTP status codes to friendly copy when the server message isn't helpful
        const fallbacks: Record<number, string> = {
          400: 'Some fields are invalid. Please check your entries and try again.',
          413: 'The uploaded file is too large. Maximum size is 5 MB.',
          415: 'Invalid file type. Please upload a PDF, DOC, or DOCX.',
          429: 'Too many requests. Please wait a moment before trying again.',
          500: 'We could not send your message right now. Please try again in a few minutes, or contact us directly by phone or email.',
          503: 'Our messaging service is temporarily unavailable. Please try again shortly.',
        };

        throw new Error(
          serverMsg ?? fallbacks[res.status] ?? 'Something went wrong. Please try again.',
        );
      }

      // Success — reset form
      setForm(INITIAL_FORM);
      setResumeFile(null);
      setResumeFileName('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setToast({ open: true, severity: 'success', message: successMessages[form.subject] });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setToast({ open: true, severity: 'error', message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="We'd love to hear from you. Get in touch with us for reservations, inquiries, or feedback."
        backgroundImage={getImage(
          "hero_contact",
          "/restaurant/antipasto-platter.jpeg",
        )}
      />

      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: palette.background.default }}>
        <Container>
          <Grid container spacing={5}>
            {/* ─── Contact Info ─────────────────────────────────────────── */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: palette.primary.main,
                  mb: 1,
                  letterSpacing: "0.15em",
                }}
              >
                GET IN TOUCH
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  fontSize: { xs: "1.5rem", md: "2rem" },
                }}
              >
                Visit Us Today
              </Typography>

              <Stack spacing={3}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                  <PlaceIcon sx={{ color: palette.primary.main, mt: 0.3 }} />
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontSize: "0.8rem", mb: 0.3 }}
                    >
                      ADDRESS
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: palette.text.secondary }}
                    >
                      {businessInfo.address}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                  <PhoneIcon sx={{ color: palette.primary.main, mt: 0.3 }} />
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontSize: "0.8rem", mb: 0.3 }}
                    >
                      PHONE
                    </Typography>
                    <Typography
                      component="a"
                      href={`tel:${businessInfo.phone}`}
                      variant="body2"
                      sx={{
                        color: palette.text.secondary,
                        textDecoration: "none",
                        "&:hover": { color: palette.primary.main },
                      }}
                    >
                      {businessInfo.phone}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                  <EmailIcon sx={{ color: palette.primary.main, mt: 0.3 }} />
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontSize: "0.8rem", mb: 0.3 }}
                    >
                      EMAIL
                    </Typography>
                    <Typography
                      component="a"
                      href={`mailto:${businessInfo.email}`}
                      variant="body2"
                      sx={{
                        color: palette.text.secondary,
                        textDecoration: "none",
                        "&:hover": { color: palette.primary.main },
                      }}
                    >
                      {businessInfo.email}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                  <AccessTimeIcon
                    sx={{ color: palette.primary.main, mt: 0.3 }}
                  />
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontSize: "0.8rem", mb: 0.3 }}
                    >
                      HOURS
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: palette.text.secondary }}
                    >
                      {businessInfo.hours}
                    </Typography>
                  </Box>
                </Box>
              </Stack>

              {/* Social */}
              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontSize: "0.8rem", mb: 1.5 }}
                >
                  FOLLOW US
                </Typography>
                <Stack direction="row" spacing={1}>
                  {businessInfo.social.map((s) => (
                    <Button
                      key={s.name}
                      variant="outlined"
                      size="small"
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        minWidth: "auto",
                        p: 1,
                        borderColor: palette.warmGray,
                        color: palette.text.secondary,
                        "&:hover": {
                          borderColor: palette.primary.main,
                          color: palette.primary.main,
                        },
                      }}
                    >
                      <SocialIcon icon={s.icon} size={16} />
                    </Button>
                  ))}
                </Stack>
              </Box>

              {/* Order CTA */}
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  href={businessInfo.orderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<ShoppingBagOutlinedIcon />}
                  fullWidth
                >
                  Order Online
                </Button>
              </Box>
            </Grid>

            {/* ─── Contact Form ─────────────────────────────────────────── */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Card>
                <CardContent
                  sx={{
                    p: { xs: 3, md: 4 },
                    borderTop: `3px solid ${palette.primary.main}`,
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    Send Us a Message
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: palette.text.secondary, mb: 3 }}
                  >
                    Choose the reason for your enquiry and we'll tailor the
                    details you can send us.
                  </Typography>

                  <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      {/* Name */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="First Name"
                          required
                          variant="outlined"
                          value={form.firstName}
                          onChange={set("firstName")}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          required
                          variant="outlined"
                          value={form.lastName}
                          onChange={set("lastName")}
                        />
                      </Grid>

                      {/* Contact */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          required
                          variant="outlined"
                          value={form.email}
                          onChange={set("email")}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Phone"
                          type="tel"
                          variant="outlined"
                          value={form.phone}
                          onChange={set("phone")}
                        />
                      </Grid>

                      {/* Subject */}
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Subject"
                          select
                          required
                          variant="outlined"
                          value={form.subject}
                          onChange={handleSubjectChange}
                        >
                          {subjectOptions.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      {/* ── Reservation fields ── */}
                      {isReservation && (
                        <>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                              fullWidth
                              label="Guest Count"
                              type="number"
                              required
                              variant="outlined"
                              slotProps={{ htmlInput: { min: 1, max: 30 } }}
                              value={form.guestCount}
                              onChange={set("guestCount")}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                              fullWidth
                              label="Preferred Date"
                              type="date"
                              required
                              variant="outlined"
                              slotProps={{ inputLabel: { shrink: true } }}
                              value={form.reservationDate}
                              onChange={set("reservationDate")}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                              fullWidth
                              label="Preferred Time"
                              type="time"
                              required
                              variant="outlined"
                              slotProps={{ inputLabel: { shrink: true } }}
                              value={form.reservationTime}
                              onChange={set("reservationTime")}
                            />
                          </Grid>
                        </>
                      )}

                      {/* ── Private event fields ── */}
                      {isPrivateEvent && (
                        <>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              fullWidth
                              label="Event Type"
                              required
                              variant="outlined"
                              placeholder="Birthday, corporate dinner, shower…"
                              value={form.eventType}
                              onChange={set("eventType")}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField
                              fullWidth
                              label="Guest Count"
                              type="number"
                              required
                              variant="outlined"
                              slotProps={{ htmlInput: { min: 10, max: 300 } }}
                              value={form.eventGuestCount}
                              onChange={set("eventGuestCount")}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField
                              fullWidth
                              label="Event Date"
                              type="date"
                              required
                              variant="outlined"
                              slotProps={{ inputLabel: { shrink: true } }}
                              value={form.eventDate}
                              onChange={set("eventDate")}
                            />
                          </Grid>
                        </>
                      )}

                      {/* ── Career fields ── */}
                      {isCareer && (
                        <>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              fullWidth
                              label="Position of Interest"
                              required
                              variant="outlined"
                              placeholder="Server, kitchen staff, bartender…"
                              value={form.position}
                              onChange={set("position")}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              fullWidth
                              label="Availability"
                              required
                              variant="outlined"
                              placeholder="Full-time, evenings, weekends…"
                              value={form.availability}
                              onChange={set("availability")}
                            />
                          </Grid>

                          {/* CV upload */}
                          <Grid size={{ xs: 12 }}>
                            <Box
                              sx={{
                                p: { xs: 2, sm: 2.25 },
                                border: `1px dashed ${resumeError ? palette.primary.main : palette.warmGray}`,
                                borderRadius: 1.5,
                                bgcolor: palette.background.default,
                              }}
                            >
                              <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={2}
                                alignItems={{ xs: "flex-start", sm: "center" }}
                                justifyContent="space-between"
                              >
                                <Box>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{ mb: 0.35 }}
                                  >
                                    Resume / CV
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: resumeFileName
                                        ? palette.text.primary
                                        : palette.text.secondary,
                                    }}
                                  >
                                    {resumeFileName ||
                                      "Upload your CV in PDF, DOC, or DOCX format."}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: resumeError
                                        ? palette.primary.main
                                        : palette.text.secondary,
                                    }}
                                  >
                                    {resumeError ||
                                      "Accepted formats: PDF, DOC, DOCX · Max 5 MB"}
                                  </Typography>
                                </Box>
                                <Button
                                  component="label"
                                  variant="outlined"
                                  startIcon={<UploadFileOutlinedIcon />}
                                  sx={{ flexShrink: 0 }}
                                >
                                  Choose File
                                  <input
                                    hidden
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    onChange={handleResumeChange}
                                  />
                                </Button>
                              </Stack>
                            </Box>
                          </Grid>
                        </>
                      )}

                      {/* Message */}
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={5}
                          required
                          variant="outlined"
                          label={
                            isCareer
                              ? "Cover Letter / Notes"
                              : isReservation
                                ? "Reservation Notes"
                                : isPrivateEvent
                                  ? "Event Details"
                                  : "Message"
                          }
                          helperText={
                            isReservation
                              ? "Let us know about high chairs, allergies, celebrations, or seating preferences."
                              : isPrivateEvent
                                ? "Share timing, menu expectations, room setup, or any special requirements."
                                : isCareer
                                  ? "Tell us about your availability, experience, and what role you are interested in."
                                  : "Have a question or feedback? Leave us a message and we will reply shortly."
                          }
                          slotProps={{
                            htmlInput: { minLength: 10, maxLength: 2000 },
                          }}
                          value={form.message}
                          onChange={set("message")}
                        />
                      </Grid>

                      {/* Submit */}
                      <Grid size={{ xs: 12 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          size="large"
                          fullWidth
                          sx={{ py: 1.5 }}
                          disabled={submitting}
                          startIcon={
                            submitting ? (
                              <CircularProgress size={18} color="inherit" />
                            ) : undefined
                          }
                        >
                          {submitting
                            ? "Sending…"
                            : isCareer
                              ? "Submit Application"
                              : isReservation
                                ? "Request Reservation"
                                : isPrivateEvent
                                  ? "Send Event Inquiry"
                                  : "Send Message"}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Google Maps embed */}
      <Box sx={{ height: { xs: 300, md: 400 }, bgcolor: palette.warmGray }}>
        <Box
          component="iframe"
          title="Corrado's Restaurant Location"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(businessInfo.address)}&z=16&output=embed`}
          loading="lazy"
          width="100%"
          height="100%"
          sx={{ border: 0, display: "block" }}
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Box>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
