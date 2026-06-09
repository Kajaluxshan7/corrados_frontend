import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Stack,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import SendIcon from '@mui/icons-material/Send';
import { PageHero, SocialIcon, FileUpload } from '../components';
import { businessInfo } from '../data';
import { palette, fonts, radius, shadows, easing, easingCss, spacingTokens } from '../theme';
import { API_BASE_URL } from '../config/api';
import { useSiteImages } from "../hooks/useSiteImages";
import { usePageMeta } from "../hooks/usePageMeta";

// ─── Brand rgb tokens (for tinted glows / gradients) ─────────────────────────
const TERRA = '190, 89, 83';  // palette.primary.main  (#BE5953)
const GOLD = '201, 169, 110'; // palette.gold          (#C9A96E)
const accentGradient = `linear-gradient(90deg, ${palette.primary.main}, ${palette.gold})`;
const stripGradient = `linear-gradient(90deg, ${palette.primary.main}, ${palette.gold}, ${palette.primary.main})`;

// ─── Subject options ──────────────────────────────────────────────────────────
const subjectOptions = [
  { value: 'general',     label: 'General Inquiry' },
  { value: 'reservation', label: 'Reservation' },
  { value: 'event',       label: 'Private Event' },
  { value: 'careers',     label: 'Careers' },
  { value: 'feedback',    label: 'Feedback' },
] as const;

type SubjectValue = (typeof subjectOptions)[number]['value'];

const successMessages: Record<SubjectValue, string> = {
  general:     "Thank you for reaching out. We'll get back to you soon.",
  reservation: "Thanks for your reservation request. We'll confirm your table shortly.",
  event:       "Thank you for your event inquiry. We'll follow up with package details soon.",
  careers:     "Thanks for applying to Corrado's. Our team will review your CV and contact you if there's a fit.",
  feedback:    'Thank you for your feedback. We appreciate you taking the time to share it.',
};

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: SubjectValue;
  guestCount: string;
  reservationDate: string;
  reservationTime: string;
  eventType: string;
  eventGuestCount: string;
  eventDate: string;
  position: string;
  availability: string;
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

// ─── Shared light-field sx for all TextFields ────────────────────────────────
// White outlined fields on white cards, with a warm terracotta focus glow.
// NOTE: the label keeps a solid white backing + side padding so the notch never
// gets crossed by the border, and animating wrappers must NOT clip it.
const lightFieldSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: '#fff',
    borderRadius: `${radius.sm}px`,
    color: palette.charcoal,
    transition: `box-shadow 0.25s ${easingCss.outExpo}, background 0.2s ease`,
    '& fieldset': { borderColor: palette.warmGray, transition: 'border-color 0.2s ease' },
    '&:hover fieldset': { borderColor: palette.primary.light },
    '&.Mui-focused fieldset': { borderColor: palette.primary.main, borderWidth: '1.5px' },
    '&.Mui-focused': { boxShadow: `0 0 0 3px rgba(${TERRA}, 0.10)` },
  },
  '& .MuiInputLabel-root': {
    color: palette.text.secondary,
    backgroundColor: '#fff',
    paddingLeft: '4px',
    paddingRight: '4px',
  },
  '& .MuiInputLabel-root.Mui-focused': { color: palette.primary.main },
  '& .MuiFormHelperText-root': { color: palette.text.secondary, fontSize: '0.72rem', marginLeft: 0 },
};

// ─── Editorial eyebrow (gold, letter-spaced, with hairline) ──────────────────
function Eyebrow({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        mb: 1.5,
        justifyContent: center ? 'center' : 'flex-start',
      }}
    >
      <Box sx={{ width: 26, height: 2, borderRadius: '2px', background: accentGradient }} />
      <Typography
        variant="caption"
        sx={{ color: palette.gold, letterSpacing: '0.24em', fontWeight: 700, fontSize: '0.7rem' }}
      >
        {children}
      </Typography>
      {center && (
        <Box
          sx={{
            width: 26,
            height: 2,
            borderRadius: '2px',
            background: `linear-gradient(90deg, ${palette.gold}, ${palette.primary.main})`,
          }}
        />
      )}
    </Box>
  );
}

// ─── Serif card heading + gold underline ─────────────────────────────────────
function CardHeading({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <>
      <Typography
        component="h2"
        sx={{
          fontFamily: fonts.display,
          color: palette.charcoal,
          fontWeight: 700,
          lineHeight: 1.12,
          letterSpacing: '-0.01em',
          fontSize: { xs: '1.7rem', md: '2rem' },
          textAlign: center ? 'center' : 'left',
        }}
      >
        {children}
      </Typography>
      <Box
        sx={{
          width: 52,
          height: 3,
          borderRadius: '3px',
          background: accentGradient,
          mt: 1.25,
          mx: center ? 'auto' : 0,
        }}
      />
    </>
  );
}

// ─── Contact info row ─────────────────────────────────────────────────────────
function InfoRow({
  icon,
  label,
  children,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: easing.outExpo }}
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: `${radius.md}px`,
            background: `linear-gradient(135deg, rgba(${TERRA}, 0.14), rgba(${GOLD}, 0.12))`,
            border: `1px solid rgba(${TERRA}, 0.20)`,
            boxShadow: `0 2px 8px rgba(${TERRA}, 0.10)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            mt: 0.2,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography
            variant="caption"
            sx={{ color: palette.gold, letterSpacing: '0.14em', fontWeight: 700, display: 'block', mb: 0.25, fontSize: '0.68rem' }}
          >
            {label}
          </Typography>
          {children}
        </Box>
      </Box>
    </motion.div>
  );
}

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

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubjectChange = (val: SubjectValue) => {
    setForm((prev) => ({ ...prev, subject: val }));
    if (val !== 'careers') {
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
      setResumeFile(null); setResumeFileName('');
      setResumeError('Please upload a PDF, DOC, or DOCX file.');
      e.target.value = ''; return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setResumeFile(null); setResumeFileName('');
      setResumeError('File must be under 5 MB.');
      e.target.value = ''; return;
    }
    setResumeFile(file);
    setResumeFileName(file.name);
    setResumeError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isCareer && !resumeFile) { setResumeError('Please upload your CV in PDF, DOC, or DOCX format.'); return; }
    setSubmitting(true);
    const data = new FormData();
    data.append('name', `${form.firstName.trim()} ${form.lastName.trim()}`.trim());
    data.append('email', form.email.trim());
    if (form.phone.trim()) data.append('phone', form.phone.trim());
    data.append('subject', form.subject);
    if (isReservation) {
      if (form.guestCount)      data.append('guestCount', form.guestCount);
      if (form.reservationDate) data.append('reservationDate', form.reservationDate);
      if (form.reservationTime) data.append('reservationTime', form.reservationTime);
    }
    if (isPrivateEvent) {
      if (form.eventGuestCount) data.append('guestCount', form.eventGuestCount);
      if (form.eventDate)       data.append('reservationDate', form.eventDate);
    }
    if (isCareer) {
      if (form.position.trim()) data.append('position', form.position.trim());
      if (resumeFile)           data.append('cvFile', resumeFile);
    }
    let messageBody = form.message.trim();
    if (isPrivateEvent && form.eventType.trim()) messageBody = `Event Type: ${form.eventType.trim()}\n\n${messageBody}`;
    if (isCareer && form.availability.trim())    messageBody = `Availability: ${form.availability.trim()}\n\n${messageBody}`;
    data.append('message', messageBody);
    try {
      const res = await fetch(`${API_BASE_URL}/contact`, { method: 'POST', body: data });
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as Record<string, unknown>;
        const raw = body.message;
        const serverMsg = Array.isArray(raw) ? raw.join('; ') : typeof raw === 'string' && raw.length ? raw : null;
        const fallbacks: Record<number, string> = {
          400: 'Some fields are invalid. Please check your entries and try again.',
          413: 'The uploaded file is too large. Maximum size is 5 MB.',
          415: 'Invalid file type. Please upload a PDF, DOC, or DOCX.',
          429: 'Too many requests. Please wait a moment before trying again.',
          500: 'We could not send your message right now. Please try again in a few minutes, or contact us directly by phone or email.',
          503: 'Our messaging service is temporarily unavailable. Please try again shortly.',
        };
        throw new Error(serverMsg ?? fallbacks[res.status] ?? 'Something went wrong. Please try again.');
      }
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

  const messageLabel = isCareer ? 'Cover Letter / Notes' : isReservation ? 'Reservation Notes' : isPrivateEvent ? 'Event Details' : 'Message';
  const messageHelper = isReservation
    ? 'Let us know about high chairs, allergies, celebrations, or seating preferences.'
    : isPrivateEvent
      ? 'Share timing, menu expectations, room setup, or any special requirements.'
      : isCareer
        ? 'Tell us about your availability, experience, and what role you are interested in.'
        : 'Have a question or feedback? Leave us a message and we will reply shortly.';
  const submitLabel = submitting ? 'Sending…' : isCareer ? 'Submit Application' : isReservation ? 'Request Reservation' : isPrivateEvent ? 'Send Event Inquiry' : 'Send Message';

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(businessInfo.address)}`;

  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="We'd love to hear from you. Get in touch with us for reservations, inquiries, or feedback."
        backgroundImage={getImage("hero_contact", "/restaurant/contact-hero.png")}
        kenBurns
        parallax
        height="55vh"
        overlay={0.38}
        titleSx={{
          background: `linear-gradient(180deg, #FFFFFF 15%, ${palette.gold} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: 'none',
          filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.38))',
        }}
      />

      {/* ─── Main Contact Section ─────────────────────────────────────────── */}
      <Box
        sx={{
          py: spacingTokens.sectionPy,
          bgcolor: palette.background.default,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Soft warm decorative glows — keeps the light theme but adds depth */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            top: -140,
            right: -120,
            width: 460,
            height: 460,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(${GOLD}, 0.12), transparent 70%)`,
            filter: 'blur(20px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            bottom: -160,
            left: -140,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(${TERRA}, 0.08), transparent 70%)`,
            filter: 'blur(20px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <Container sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="flex-start">
            {/* ─── LEFT — Info Panel ───────────────────────────────────────── */}
            <Grid size={{ xs: 12, md: 5 }}>
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, ease: easing.outExpo }}
              >
                {/* Info card */}
                <Box
                  sx={{
                    borderRadius: `${radius.lg}px`,
                    bgcolor: '#fff',
                    border: `1px solid ${palette.warmGray}`,
                    boxShadow: shadows.lg,
                    overflow: 'hidden',
                    transition: `box-shadow 0.4s ${easingCss.outExpo}, transform 0.4s ${easingCss.outExpo}`,
                    '&:hover': { boxShadow: shadows.hover, transform: 'translateY(-3px)' },
                  }}
                >
                  {/* Top accent strip */}
                  <Box aria-hidden sx={{ height: 4, width: '100%', background: stripGradient }} />

                  <Box sx={{ p: { xs: 3, md: 4 } }}>
                    <Eyebrow>CONTACT DETAILS</Eyebrow>
                    <CardHeading>Visit Us</CardHeading>
                    <Typography
                      variant="body2"
                      sx={{ color: palette.text.secondary, mt: 2, mb: 3.5, lineHeight: 1.7 }}
                    >
                      Come dine with us or reach out — we're always happy to help.
                    </Typography>

                    <Stack spacing={3} divider={
                      <Box sx={{ height: '1px', background: `linear-gradient(90deg, transparent, ${palette.warmGray}, transparent)` }} />
                    }>
                      <InfoRow icon={<PlaceIcon sx={{ color: palette.primary.main, fontSize: 18 }} />} label="ADDRESS" delay={0.1}>
                        <Typography
                          component="a"
                          href={directionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="body2"
                          sx={{
                            color: palette.text.primary,
                            lineHeight: 1.6,
                            textDecoration: 'none',
                            transition: 'color 0.2s',
                            display: 'block',
                            '&:hover': { color: palette.primary.main },
                          }}
                        >
                          {businessInfo.address}
                        </Typography>
                      </InfoRow>

                      <InfoRow icon={<PhoneIcon sx={{ color: palette.primary.main, fontSize: 18 }} />} label="PHONE" delay={0.18}>
                        <Typography
                          component="a"
                          href={`tel:${businessInfo.phone}`}
                          variant="body2"
                          sx={{
                            color: palette.text.primary,
                            textDecoration: 'none',
                            transition: 'color 0.2s',
                            '&:hover': { color: palette.primary.main },
                          }}
                        >
                          {businessInfo.phone}
                        </Typography>
                      </InfoRow>

                      <InfoRow icon={<EmailIcon sx={{ color: palette.primary.main, fontSize: 18 }} />} label="EMAIL" delay={0.26}>
                        <Typography
                          component="a"
                          href={`mailto:${businessInfo.email}`}
                          variant="body2"
                          sx={{
                            color: palette.text.primary,
                            textDecoration: 'none',
                            transition: 'color 0.2s',
                            wordBreak: 'break-all',
                            '&:hover': { color: palette.primary.main },
                          }}
                        >
                          {businessInfo.email}
                        </Typography>
                      </InfoRow>

                      <InfoRow icon={<AccessTimeIcon sx={{ color: palette.primary.main, fontSize: 18 }} />} label="HOURS" delay={0.34}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5 }}>
                          <Typography variant="body2" sx={{ color: palette.text.secondary, fontSize: '0.78rem' }}>Mon – Sun</Typography>
                          <Typography variant="body2" sx={{ color: palette.text.primary, fontSize: '0.78rem' }}>12 pm – 10:30 pm</Typography>
                        </Box>
                      </InfoRow>
                    </Stack>

                    {/* Social pills */}
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="caption" sx={{ color: palette.text.secondary, letterSpacing: '0.12em', fontWeight: 600, display: 'block', mb: 1.5 }}>
                        FOLLOW US
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {businessInfo.social.map((s) => (
                          <motion.a
                            key={s.name}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.06, y: -2 }}
                            whileTap={{ scale: 0.96 }}
                            style={{ textDecoration: 'none' }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.75,
                                px: 1.5,
                                py: 0.75,
                                borderRadius: `${radius.pill}px`,
                                bgcolor: palette.cream,
                                border: `1px solid ${palette.warmGray}`,
                                color: palette.text.secondary,
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                transition: 'all 0.2s ease',
                                cursor: 'pointer',
                                '&:hover': {
                                  bgcolor: `rgba(${TERRA}, 0.08)`,
                                  borderColor: palette.primary.main,
                                  color: palette.primary.main,
                                },
                              }}
                            >
                              <SocialIcon icon={s.icon} size={14} />
                              {s.name}
                            </Box>
                          </motion.a>
                        ))}
                      </Stack>
                    </Box>

                    {/* Order CTA */}
                    <Box sx={{ mt: 3 }}>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="contained"
                          href={businessInfo.orderUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          startIcon={<ShoppingBagOutlinedIcon />}
                          fullWidth
                          sx={{
                            py: 1.4,
                            borderRadius: `${radius.md}px`,
                            fontWeight: 600,
                            letterSpacing: '0.04em',
                            bgcolor: palette.primary.main,
                            color: '#fff',
                            boxShadow: `0 4px 24px rgba(${TERRA}, 0.25)`,
                            '&:hover': {
                              bgcolor: palette.primary.dark,
                              boxShadow: `0 6px 32px rgba(${TERRA}, 0.35)`,
                            },
                          }}
                        >
                          Order Online
                        </Button>
                      </motion.div>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            </Grid>

            {/* ─── RIGHT — Form Card ───────────────────────────────────────── */}
            <Grid size={{ xs: 12, md: 7 }}>
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, ease: easing.outExpo }}
              >
                <Box
                  sx={{
                    borderRadius: `${radius.lg}px`,
                    bgcolor: '#fff',
                    border: `1px solid ${palette.warmGray}`,
                    overflow: 'hidden',
                    boxShadow: shadows.lg,
                  }}
                >
                  {/* Top accent strip */}
                  <Box aria-hidden sx={{ height: 4, width: '100%', background: stripGradient }} />

                  {/* Card header */}
                  <Box sx={{ px: { xs: 3, md: 4 }, pt: { xs: 3, md: 4 }, pb: 2.5 }}>
                    <Eyebrow>ENQUIRIES</Eyebrow>
                    <CardHeading>Send a Message</CardHeading>
                    <Typography variant="body2" sx={{ color: palette.text.secondary, mt: 2 }}>
                      Choose the reason for your enquiry and we'll tailor the details.
                    </Typography>
                  </Box>

                  {/* Subject chip row */}
                  <Box sx={{ px: { xs: 3, md: 4 }, pb: 2.5 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 1,
                        flexWrap: 'wrap',
                      }}
                    >
                      {subjectOptions.map((opt) => {
                        const active = form.subject === opt.value;
                        return (
                          <motion.button
                            key={opt.value}
                            onClick={() => handleSubjectChange(opt.value)}
                            type="button"
                            whileHover={{ scale: 1.04, y: -1 }}
                            whileTap={{ scale: 0.96 }}
                            animate={{
                              backgroundColor: active ? palette.primary.main : palette.cream,
                              borderColor: active ? palette.primary.main : palette.warmGray,
                              color: active ? '#fff' : palette.text.secondary,
                              boxShadow: active ? `0 6px 16px rgba(${TERRA}, 0.28)` : '0 0 0 rgba(0,0,0,0)',
                            }}
                            transition={{ duration: 0.2, ease: easing.outExpo }}
                            style={{
                              cursor: 'pointer',
                              padding: '8px 16px',
                              borderRadius: `${radius.pill}px`,
                              border: '1px solid',
                              fontSize: '0.8rem',
                              fontWeight: 500,
                              fontFamily: 'inherit',
                              letterSpacing: '0.02em',
                              outline: 'none',
                            }}
                          >
                            {opt.label}
                          </motion.button>
                        );
                      })}
                    </Box>
                  </Box>

                  {/* Refined gradient hairline divider */}
                  <Box sx={{ mx: { xs: 3, md: 4 }, height: '1px', background: `linear-gradient(90deg, transparent, ${palette.warmGray}, transparent)`, mb: 3 }} />

                  {/* Form */}
                  <Box component="form" onSubmit={handleSubmit} sx={{ px: { xs: 3, md: 4 }, pb: { xs: 3, md: 4 } }}>
                    <Grid container spacing={2}>
                      {/* Name */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="First Name" required variant="outlined" value={form.firstName} onChange={set('firstName')} sx={lightFieldSx} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="Last Name" required variant="outlined" value={form.lastName} onChange={set('lastName')} sx={lightFieldSx} />
                      </Grid>

                      {/* Contact */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="Email" type="email" required variant="outlined" value={form.email} onChange={set('email')} sx={lightFieldSx} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="Phone" type="tel" variant="outlined" value={form.phone} onChange={set('phone')} sx={lightFieldSx} />
                      </Grid>

                      {/* ── Conditional fields with AnimatePresence ── */}
                      <Grid size={{ xs: 12 }}>
                        <AnimatePresence mode="wait">
                          {isReservation && (
                            <motion.div
                              key="reservation"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: easing.outExpo }}
                            >
                              <Grid container spacing={2} sx={{ pt: 1 }}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                  <TextField fullWidth label="Guest Count" type="number" required variant="outlined" slotProps={{ htmlInput: { min: 1, max: 30 } }} value={form.guestCount} onChange={set('guestCount')} sx={lightFieldSx} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                  <TextField fullWidth label="Preferred Date" type="date" required variant="outlined" slotProps={{ inputLabel: { shrink: true } }} value={form.reservationDate} onChange={set('reservationDate')} sx={lightFieldSx} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                  <TextField fullWidth label="Preferred Time" type="time" required variant="outlined" slotProps={{ inputLabel: { shrink: true } }} value={form.reservationTime} onChange={set('reservationTime')} sx={lightFieldSx} />
                                </Grid>
                              </Grid>
                            </motion.div>
                          )}

                          {isPrivateEvent && (
                            <motion.div
                              key="event"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: easing.outExpo }}
                            >
                              <Grid container spacing={2} sx={{ pt: 1 }}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                  <TextField fullWidth label="Event Type" required variant="outlined" placeholder="Birthday, corporate dinner, shower…" value={form.eventType} onChange={set('eventType')} sx={lightFieldSx} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 3 }}>
                                  <TextField fullWidth label="Guest Count" type="number" required variant="outlined" slotProps={{ htmlInput: { min: 10, max: 300 } }} value={form.eventGuestCount} onChange={set('eventGuestCount')} sx={lightFieldSx} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 3 }}>
                                  <TextField fullWidth label="Event Date" type="date" required variant="outlined" slotProps={{ inputLabel: { shrink: true } }} value={form.eventDate} onChange={set('eventDate')} sx={lightFieldSx} />
                                </Grid>
                              </Grid>
                            </motion.div>
                          )}

                          {isCareer && (
                            <motion.div
                              key="careers"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: easing.outExpo }}
                            >
                              <Grid container spacing={2} sx={{ pt: 1 }}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                  <TextField fullWidth label="Position of Interest" required variant="outlined" placeholder="Server, kitchen staff, bartender…" value={form.position} onChange={set('position')} sx={lightFieldSx} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                  <TextField fullWidth label="Availability" required variant="outlined" placeholder="Full-time, evenings, weekends…" value={form.availability} onChange={set('availability')} sx={lightFieldSx} />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                  <Box
                                    sx={{
                                      p: 2.5,
                                      borderRadius: `${radius.md}px`,
                                      border: `1px dashed ${resumeError ? palette.error.main : palette.warmGray}`,
                                      bgcolor: palette.cream,
                                    }}
                                  >
                                    <FileUpload
                                      label="Resume / CV"
                                      fileName={resumeFileName}
                                      error={resumeError}
                                      helperText="Accepted formats: PDF, DOC, DOCX · Max 5 MB"
                                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                      onChange={handleResumeChange}
                                      inputRef={fileInputRef}
                                    />
                                  </Box>
                                </Grid>
                              </Grid>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Grid>

                      {/* Message */}
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={5}
                          required
                          variant="outlined"
                          label={messageLabel}
                          helperText={messageHelper}
                          slotProps={{ htmlInput: { minLength: 10, maxLength: 2000 } }}
                          value={form.message}
                          onChange={set('message')}
                          sx={lightFieldSx}
                        />
                      </Grid>

                      {/* Submit */}
                      <Grid size={{ xs: 12 }}>
                        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                          <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            disabled={submitting}
                            endIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <SendIcon sx={{ fontSize: 16 }} />}
                            sx={{
                              py: 1.6,
                              borderRadius: `${radius.md}px`,
                              fontWeight: 600,
                              fontSize: '0.95rem',
                              letterSpacing: '0.05em',
                              bgcolor: palette.primary.main,
                              boxShadow: `0 4px 24px rgba(${TERRA}, 0.3)`,
                              transition: `all 0.25s ${easingCss.outExpo}`,
                              '&:hover': {
                                bgcolor: palette.primary.dark,
                                boxShadow: `0 8px 36px rgba(${TERRA}, 0.45)`,
                                transform: 'translateY(-1px)',
                              },
                              '&:disabled': { opacity: 0.6 },
                            }}
                          >
                            {submitLabel}
                          </Button>
                        </motion.div>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ─── Map Section ──────────────────────────────────────────────────── */}
      <Box sx={{ bgcolor: palette.cream, pt: 0 }}>
        {/* Map header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: easing.outExpo }}
        >
          <Box sx={{ py: { xs: 5, md: 7 }, textAlign: 'center' }}>
            <Eyebrow center>FIND US</Eyebrow>
            <Typography
              component="h2"
              sx={{
                fontFamily: fonts.display,
                color: palette.charcoal,
                fontWeight: 700,
                letterSpacing: '-0.01em',
                fontSize: { xs: '1.9rem', md: '2.4rem' },
              }}
            >
              In the Heart of Whitby
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mt: 2 }}>
              <Box sx={{ width: 36, height: 1, bgcolor: palette.primary.main, opacity: 0.35 }} />
              <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: palette.primary.main, opacity: 0.6 }} />
              <Box sx={{ width: 36, height: 1, bgcolor: palette.primary.main, opacity: 0.35 }} />
            </Box>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easing.outExpo }}
        >
          <Box
            sx={{
              position: 'relative',
              mx: { xs: 0, md: 4 },
              mb: { xs: 0, md: 4 },
              borderRadius: { xs: 0, md: `${radius.lg}px` },
              overflow: 'hidden',
              height: { xs: 340, md: 460 },
              border: { md: `1px solid ${palette.warmGray}` },
              boxShadow: { md: shadows.lg },
            }}
          >
            <Box
              component="iframe"
              title="Corrado's Restaurant Location"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(businessInfo.address)}&z=16&output=embed`}
              loading="lazy"
              width="100%"
              height="100%"
              sx={{ border: 0, display: 'block', filter: 'grayscale(20%) contrast(1.05)' }}
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />

          </Box>
        </motion.div>
      </Box>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          severity={toast.severity}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
