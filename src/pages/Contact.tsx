import { useState } from 'react';
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

const subjectOptions = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'reservation', label: 'Reservation Request' },
  { value: 'private-event', label: 'Private Event / Catering' },
  { value: 'careers', label: 'Careers' },
  { value: 'feedback', label: 'Feedback' },
] as const;

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [subject, setSubject] = useState('general');
  const [resumeFileName, setResumeFileName] = useState('');
  const [resumeError, setResumeError] = useState('');
  const [submitMessage, setSubmitMessage] = useState(
    "Thank you for your message! We'll get back to you soon.",
  );

  const isReservation = subject === 'reservation';
  const isCareer = subject === 'careers';
  const isPrivateEvent = subject === 'private-event';

  const handleSubjectChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const nextSubject = event.target.value;
    setSubject(nextSubject);

    if (nextSubject !== 'careers') {
      setResumeFileName('');
      setResumeError('');
    }
  };

  const handleResumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setResumeFileName('');
      setResumeError('');
      return;
    }

    const validExtensions = ['pdf', 'doc', 'docx'];
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';

    if (!validExtensions.includes(extension)) {
      setResumeFileName('');
      setResumeError('Please upload a PDF, DOC, or DOCX file.');
      event.target.value = '';
      return;
    }

    setResumeFileName(file.name);
    setResumeError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isCareer && !resumeFileName) {
      setResumeError('Please upload your CV in PDF, DOC, or DOCX format.');
      return;
    }

    const successMessages: Record<string, string> = {
      general: "Thank you for reaching out. We'll get back to you soon.",
      reservation:
        "Thanks for your reservation request. We'll confirm your table shortly.",
      'private-event':
        "Thank you for your event inquiry. We'll follow up with package details soon.",
      careers:
        "Thanks for applying to Corrado's. Our team will review your CV and contact you if there's a fit.",
      feedback: 'Thank you for your feedback. We appreciate you taking the time to share it.',
    };

    setSubmitMessage(successMessages[subject]);
    setSubmitted(true);
  };

  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="We'd love to hear from you. Get in touch with us for reservations, inquiries, or feedback."
        backgroundImage="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80"
      />

      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: palette.background.default }}>
        <Container>
          <Grid container spacing={5}>
            {/* Contact Info */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography
                variant="subtitle2"
                sx={{ color: palette.primary.main, mb: 1, letterSpacing: '0.15em' }}
              >
                GET IN TOUCH
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                Visit Us Today
              </Typography>

              <Stack spacing={3}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <PlaceIcon sx={{ color: palette.primary.main, mt: 0.3 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', mb: 0.3 }}>
                      ADDRESS
                    </Typography>
                    <Typography variant="body2" sx={{ color: palette.text.secondary }}>
                      {businessInfo.address}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <PhoneIcon sx={{ color: palette.primary.main, mt: 0.3 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', mb: 0.3 }}>
                      PHONE
                    </Typography>
                    <Typography
                      component="a"
                      href={`tel:${businessInfo.phone}`}
                      variant="body2"
                      sx={{ color: palette.text.secondary, textDecoration: 'none', '&:hover': { color: palette.primary.main } }}
                    >
                      {businessInfo.phone}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <EmailIcon sx={{ color: palette.primary.main, mt: 0.3 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', mb: 0.3 }}>
                      EMAIL
                    </Typography>
                    <Typography
                      component="a"
                      href={`mailto:${businessInfo.email}`}
                      variant="body2"
                      sx={{ color: palette.text.secondary, textDecoration: 'none', '&:hover': { color: palette.primary.main } }}
                    >
                      {businessInfo.email}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <AccessTimeIcon sx={{ color: palette.primary.main, mt: 0.3 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', mb: 0.3 }}>
                      HOURS
                    </Typography>
                    <Typography variant="body2" sx={{ color: palette.text.secondary }}>
                      {businessInfo.hours}
                    </Typography>
                  </Box>
                </Box>
              </Stack>

              {/* Social */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', mb: 1.5 }}>
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
                        minWidth: 'auto',
                        p: 1,
                        borderColor: palette.warmGray,
                        color: palette.text.secondary,
                        '&:hover': { borderColor: palette.primary.main, color: palette.primary.main },
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

            {/* Contact Form */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Card>
                <CardContent sx={{ p: { xs: 3, md: 4 }, borderTop: `3px solid ${palette.primary.main}` }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    Send Us a Message
                  </Typography>
                  <Typography variant="body2" sx={{ color: palette.text.secondary, mb: 3 }}>
                    Choose the reason for your enquiry and we'll tailor the details you can send us.
                  </Typography>
                  <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="First Name"
                          required
                          variant="outlined"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          required
                          variant="outlined"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          required
                          variant="outlined"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Phone"
                          type="tel"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Subject"
                          select
                          required
                          variant="outlined"
                          value={subject}
                          onChange={handleSubjectChange}
                        >
                          {subjectOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      {isReservation && (
                        <>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                              fullWidth
                              label="Guest Count"
                              type="number"
                              required
                              variant="outlined"
                              inputProps={{ min: 1, max: 30 }}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                              fullWidth
                              label="Preferred Date"
                              type="date"
                              required
                              variant="outlined"
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                              fullWidth
                              label="Preferred Time"
                              type="time"
                              required
                              variant="outlined"
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                        </>
                      )}

                      {isPrivateEvent && (
                        <>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              fullWidth
                              label="Event Type"
                              required
                              variant="outlined"
                              placeholder="Birthday, corporate dinner, shower..."
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField
                              fullWidth
                              label="Guest Count"
                              type="number"
                              required
                              variant="outlined"
                              inputProps={{ min: 10, max: 300 }}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField
                              fullWidth
                              label="Event Date"
                              type="date"
                              required
                              variant="outlined"
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                        </>
                      )}

                      {isCareer && (
                        <>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              fullWidth
                              label="Position of Interest"
                              required
                              variant="outlined"
                              placeholder="Server, kitchen staff, bartender..."
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              fullWidth
                              label="Availability"
                              required
                              variant="outlined"
                              placeholder="Full-time, evenings, weekends..."
                            />
                          </Grid>
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
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={2}
                                alignItems={{ xs: 'flex-start', sm: 'center' }}
                                justifyContent="space-between"
                              >
                                <Box>
                                  <Typography variant="subtitle2" sx={{ mb: 0.35 }}>
                                    Resume / CV
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: resumeFileName ? palette.text.primary : palette.text.secondary }}>
                                    {resumeFileName || 'Upload your CV in PDF, DOC, or DOCX format.'}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: resumeError ? palette.primary.main : palette.text.secondary }}>
                                    {resumeError || 'Accepted formats: PDF, DOC, DOCX'}
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

                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label={
                            isCareer
                              ? 'Cover Letter / Notes'
                              : isReservation
                                ? 'Reservation Notes'
                                : isPrivateEvent
                                  ? 'Event Details'
                                  : 'Message'
                          }
                          multiline
                          rows={5}
                          required
                          variant="outlined"
                          helperText={
                            isReservation
                              ? 'Let us know about high chairs, allergies, celebrations, or seating preferences.'
                              : isPrivateEvent
                                ? 'Share timing, menu expectations, room setup, or any special requirements.'
                                : isCareer
                                  ? 'Tell us about your availability, experience, and what role you are interested in.'
                                  : 'Have a question or feedback? Leave us a message and we will reply shortly.'
                          }
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          size="large"
                          fullWidth
                          sx={{ py: 1.5 }}
                        >
                          {isCareer
                            ? 'Submit Application'
                            : isReservation
                              ? 'Request Reservation'
                              : isPrivateEvent
                                ? 'Send Event Inquiry'
                                : 'Send Message'}
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

      {/* Map placeholder */}
      <Box
        sx={{
          height: { xs: 300, md: 400 },
          bgcolor: palette.warmGray,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Box
          component="iframe"
          title="Corrado's Restaurant Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2870.0!2d-78.9426!3d43.8745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDUyJzI4LjIiTiA3OMKwNTYnMzMuNCJX!5e0!3m2!1sen!2sca!4v1234567890"
          width="100%"
          height="100%"
          sx={{ border: 0 }}
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={submitted}
        autoHideDuration={5000}
        onClose={() => setSubmitted(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSubmitted(false)} severity="success" sx={{ width: '100%' }}>
          {submitMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
