import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Send, Check, Copy, ExternalLink, RotateCcw } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

export function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState({});
  const [phase, setPhase] = useState('editing');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [submitWarning, setSubmitWarning] = useState(null);

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = 'Please sign your name on the letter.';
    if (!email.trim()) {
      next.email = 'Please include your return email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'That does not look like a valid email address.';
    }
    if (!subject.trim()) next.subject = 'Add a short subject line for your note.';
    if (message.trim().length < 8) {
      next.message = 'Write at least a few words before folding the letter.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const triggerLaunchAnimation = () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setPhase('sent');
      return;
    }

    setPhase('folding');
    window.dispatchEvent(
      new CustomEvent('rocket-ignite-burst', {
        detail: {
          x: window.innerWidth * 0.45,
          y: window.innerHeight * 0.55,
          count: 24,
        },
      })
    );

    window.setTimeout(() => {
      setPhase('launching');
    }, 520);

    window.setTimeout(() => {
      setPhase('sent');
    }, 1220);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || phase !== 'editing') return;
    setSubmitWarning(null);

    if (honeypot.trim().length > 0) {
      triggerLaunchAnimation();
      return;
    }

    if (!validate()) return;

    const endpoint = PORTFOLIO_DATA.contact.formEndpoint.trim();
    const accessKey = PORTFOLIO_DATA.contact.formAccessKey?.trim();
    if (endpoint) {
      setIsSubmitting(true);
      try {
        const payload = {
          ...(accessKey ? { access_key: accessKey } : {}),
          from_name: `${PORTFOLIO_DATA.profile.name} Portfolio`,
          replyto: email.trim(),
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        };
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok || (data && data.success === false)) {
          setSubmitWarning(
            data?.message || 'Could not reach the mail service, please try emailing directly.'
          );
          return;
        }
      } catch {
        setSubmitWarning('Network error while sending. You can also write directly via email.');
        return;
      } finally {
        setIsSubmitting(false);
      }
    }

    triggerLaunchAnimation();
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setErrors({});
    setSubmitWarning(null);
    setPhase('editing');
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PORTFOLIO_DATA.contact.directEmail);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <section
      id="contact"
      className="relative mx-auto max-w-6xl scroll-mt-20 px-4 pb-20 pt-10 sm:px-6 lg:pb-28 lg:pt-14"
    >
      {/* Section Header */}
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium tracking-[0.14em] uppercase text-[var(--accent-amber)]">
          Correspondence Desk
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold text-[var(--text-primary)] sm:text-4xl lg:text-[2.65rem]">
          {PORTFOLIO_DATA.contact.sectionTitle}
        </h2>
        <p className="mt-3 text-[1.15rem] leading-[1.7] text-[var(--text-secondary)]">
          {PORTFOLIO_DATA.contact.sectionSubtitle}
        </p>
      </div>

      {/* Wooden Writing Desk Surface */}
      <div className="wood-grain relative mt-10 overflow-hidden rounded-2xl border-4 border-[#27160c] p-5 shadow-[0_28px_70px_rgba(0,0,0,0.5)] sm:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-12 -top-12 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl"
        />

        <div className="relative z-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Left 8 Columns: Parchment Letter Form */}
          <div className="relative lg:col-span-8">
            <AnimatePresence mode="wait">
              {phase !== 'sent' ? (
                <motion.div
                  key="letter-paper"
                  animate={
                    phase === 'folding'
                      ? { scale: 0.72, rotate: -6, borderRadius: '32px' }
                      : phase === 'launching'
                        ? { y: -760, x: 180, scale: 0.22, rotate: 24, opacity: 0 }
                        : { scale: 1, y: 0, x: 0, rotate: 0, opacity: 1 }
                  }
                  transition={{
                    duration: phase === 'launching' ? 0.65 : 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="ruled-paper relative rounded-lg border border-[#b99b6b] px-6 py-7 shadow-[0_18px_40px_rgba(0,0,0,0.45)] sm:px-12 sm:py-9"
                >
                  {/* Decorative Crimson Wax Seal */}
                  <div
                    aria-hidden="true"
                    className="absolute right-5 top-5 hidden h-12 w-12 items-center justify-center rounded-full bg-[#8c2720] shadow-md sm:flex"
                  >
                    <span className="font-foil text-xs text-amber-200">
                      BB
                    </span>
                  </div>

                  {/* Letter Heading */}
                  <div className="mb-6 pl-5 sm:pl-6">
                    <p className="font-hand text-3xl text-[#523219]">
                      Dear Bavadharani,
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate className="space-y-5 pl-5 sm:pl-6">
                    {/* Honeypot field for spam bots */}
                    <div className="sr-only" aria-hidden="true">
                      <label htmlFor="letter-website">Leave empty</label>
                      <input
                        id="letter-website"
                        name="website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="font-hand block text-xl text-[#4a2c16]"
                        >
                          Your Name
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                          }}
                          placeholder="Reader or recruiter name"
                          className="font-hand mt-1 w-full border-b-2 border-[#1c1a2e]/25 bg-transparent pb-1.5 text-2xl text-[#1c1a2e] placeholder:text-[#1c1a2e]/45 focus:border-[#9e471b] focus:outline-none"
                        />
                        {errors.name && (
                          <p role="alert" className="mt-1 text-sm font-medium text-[#9e271b]">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="contact-email"
                          className="font-hand block text-xl text-[#4a2c16]"
                        >
                          Return Email
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                          }}
                          placeholder="you@example.com"
                          className="font-hand mt-1 w-full border-b-2 border-[#1c1a2e]/25 bg-transparent pb-1.5 text-2xl text-[#1c1a2e] placeholder:text-[#1c1a2e]/45 focus:border-[#9e471b] focus:outline-none"
                        />
                        {errors.email && (
                          <p role="alert" className="mt-1 text-sm font-medium text-[#9e271b]">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="font-hand block text-xl text-[#4a2c16]"
                      >
                        Subject
                      </label>
                      <input
                        id="contact-subject"
                        type="text"
                        value={subject}
                        onChange={(e) => {
                          setSubject(e.target.value);
                          if (errors.subject) setErrors((p) => ({ ...p, subject: undefined }));
                        }}
                        placeholder="Project collaboration, internship opportunity, or book note"
                        className="font-hand mt-1 w-full border-b-2 border-[#1c1a2e]/25 bg-transparent pb-1.5 text-2xl text-[#1c1a2e] placeholder:text-[#1c1a2e]/45 focus:border-[#9e471b] focus:outline-none"
                      />
                      {errors.subject && (
                        <p role="alert" className="mt-1 text-sm font-medium text-[#9e271b]">
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="font-hand block text-xl text-[#4a2c16]"
                      >
                        Your Message
                      </label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          if (errors.message) setErrors((p) => ({ ...p, message: undefined }));
                        }}
                        placeholder="Write your message here..."
                        className="font-hand mt-1 w-full resize-none border-b-2 border-[#1c1a2e]/25 bg-transparent pb-2 text-2xl leading-[36px] text-[#1c1a2e] placeholder:text-[#1c1a2e]/45 focus:border-[#9e471b] focus:outline-none"
                      />
                      {errors.message && (
                        <p role="alert" className="mt-1 text-sm font-medium text-[#9e271b]">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {submitWarning && (
                      <p role="alert" className="text-sm font-medium text-[#9e271b]">
                        {submitWarning}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <span className="font-hand text-xl text-[#523219]">
                        Folds into a paper rocket on launch
                      </span>

                      <button
                        type="submit"
                        disabled={phase !== 'editing' || isSubmitting}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#8c3f2b] px-6 py-2.5 text-base font-medium text-[#f7ead0] shadow-md transition-colors hover:bg-[#733221] disabled:opacity-60 whitespace-nowrap shrink-0"
                      >
                        <Send className="h-4 w-4" aria-hidden="true" />
                        <span>{isSubmitting ? 'Sending...' : 'Fold & Send Letter'}</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="sent-toast"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="parchment-surface flex min-h-[340px] flex-col items-center justify-center rounded-lg border border-[#b99b6b] p-8 text-center shadow-xl"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#45634d] text-[#f7ead0] shadow">
                    <Check className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-display text-3xl font-bold text-[#1c1a2e]">
                    Your message has taken off 🚀
                  </h3>
                  <p className="mt-2 max-w-md text-[1.08rem] leading-[1.68] text-[#2c2536]">
                    {PORTFOLIO_DATA.contact.formEndpoint
                      ? 'Thank you for writing! Your letter has been dispatched.'
                      : 'Preview launch complete! Add your Formspree or EmailJS endpoint in the portfolio data config to deliver live emails, or reach out directly via the address beside this desk.'}
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-6 inline-flex min-h-[42px] items-center gap-2 rounded-lg border border-[#1c1a2e]/25 px-4 py-2 text-sm font-medium text-[#1c1a2e] transition-colors hover:bg-[#1c1a2e]/10"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Write another letter</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right 4 Columns: Inkwell & Quill SVG + Direct Book-Spine Links */}
          <div className="flex flex-col justify-between gap-6 lg:col-span-4">
            <div className="rounded-xl border border-amber-200/15 bg-black/25 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium tracking-wider uppercase text-amber-300/85">
                    Direct Post
                  </p>
                  <p className="mt-0.5 text-sm text-amber-100/75">
                    Write directly to my inbox
                  </p>
                </div>

                <svg
                  width="54"
                  height="64"
                  viewBox="0 0 64 78"
                  fill="none"
                  aria-hidden="true"
                  className="shrink-0"
                >
                  <path
                    d="M36 44C42 26 52 12 60 6C56 19 48 34 39 46L36 44Z"
                    fill="#f3e6c8"
                    stroke="#9c7a49"
                    strokeWidth="1.2"
                  />
                  <path d="M35 48L57 9" stroke="#7a5628" strokeWidth="1.4" strokeLinecap="round" />
                  <rect x="18" y="46" width="22" height="5" rx="1.5" fill="#b98636" />
                  <path
                    d="M14 54C14 51 17 49 20 49H38C41 49 44 51 44 54L46 70C46 73 43 75 40 75H18C15 75 12 73 12 70L14 54Z"
                    fill="#1f2036"
                    stroke="#c79b52"
                    strokeWidth="1.5"
                  />
                  <ellipse cx="29" cy="60" rx="10" ry="3" fill="#3a3d66" opacity="0.55" />
                </svg>
              </div>

              <a
                href={`mailto:${PORTFOLIO_DATA.contact.directEmail}`}
                className="mt-2 block font-display text-[clamp(0.96rem,1.2vw,1.12rem)] font-bold text-[#f3e6c8] underline decoration-amber-300/40 underline-offset-4 hover:text-amber-200 sm:whitespace-nowrap"
              >
                {PORTFOLIO_DATA.contact.directEmail}
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="mt-3 inline-flex min-h-[38px] items-center gap-1.5 rounded-md border border-amber-200/20 bg-black/30 px-3 py-1.5 text-sm font-medium text-amber-100 transition-colors hover:border-amber-300/60"
              >
                {copiedEmail ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
                    <span>Copied email</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Copy address</span>
                  </>
                )}
              </button>
            </div>

            {/* Book-Spine Style Social Links */}
            <div className="space-y-3">
              <p className="text-xs font-medium tracking-wider uppercase text-amber-200/80">
                Library Catalog Links
              </p>

              <a
                href={`mailto:${PORTFOLIO_DATA.contact.directEmail}`}
                className="spine-lighting flex min-h-[48px] items-center justify-between rounded-md border border-amber-200/25 bg-[#8c3f2b] px-4 py-3 text-base font-medium text-[#f7ead0] shadow-md transition-transform hover:-translate-x-1"
              >
                <span className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-amber-200" aria-hidden="true" />
                  <span className="font-foil text-xs text-[#f7ead0]">Email</span>
                </span>
                <span className="text-sm text-amber-100/85">Direct Mail</span>
              </a>

              {PORTFOLIO_DATA.contact.socials.map((soc) =>
                soc.url ? (
                  <a
                    key={soc.label}
                    href={soc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="spine-lighting flex min-h-[48px] items-center justify-between rounded-md border border-amber-200/25 px-4 py-3 text-base font-medium text-[#f7ead0] shadow-md transition-transform hover:-translate-x-1"
                    style={{ backgroundColor: soc.spineColor }}
                  >
                    <span className="font-foil text-xs text-[#f7ead0]">{soc.label}</span>
                    <ExternalLink className="h-4 w-4 text-amber-200" aria-hidden="true" />
                  </a>
                ) : (
                  <div
                    key={soc.label}
                    className="spine-lighting flex min-h-[48px] items-center justify-between rounded-md border border-amber-200/20 px-4 py-3 text-sm text-[#f7ead0]"
                    style={{ backgroundColor: soc.spineColor }}
                  >
                    <span className="font-foil text-xs text-[#f7ead0]">{soc.label}</span>
                    <span className="text-xs text-amber-100/80">{soc.handle}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
