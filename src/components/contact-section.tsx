"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Phone, MapPin, Send, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Validation helpers
const validateName = (name: string): string | null => {
  if (!name.trim()) return null; // Name is optional in this form
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  if (!/^[a-zA-Z\s]+$/.test(name.trim())) return "Name can only contain letters and spaces";
  return null;
};

const validateEmail = (email: string): string | null => {
  if (!email.trim()) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) return "Please enter a valid email address";
  return null;
};

const validateSubject = (subject: string): string | null => {
  if (!subject.trim()) return null; // Subject is optional
  if (subject.trim().length < 3) return "Subject must be at least 3 characters";
  return null;
};

const validateMessage = (message: string): string | null => {
  if (!message.trim()) return "Message is required";
  if (message.trim().length < 10) return "Please provide at least 10 characters";
  return null;
};

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: string) => {
    let error: string | null = null;
    switch (field) {
      case "name":
        error = validateName(formState.name);
        break;
      case "email":
        error = validateEmail(formState.email);
        break;
      case "subject":
        error = validateSubject(formState.subject);
        break;
      case "message":
        error = validateMessage(formState.message);
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  const validateAll = (): boolean => {
    const nameError = validateName(formState.name);
    const emailError = validateEmail(formState.email);
    const subjectError = validateSubject(formState.subject);
    const messageError = validateMessage(formState.message);

    setErrors({
      name: nameError,
      email: emailError,
      subject: subjectError,
      message: messageError,
    });

    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true,
    });

    return !nameError && !emailError && !subjectError && !messageError;
  };

  const isFormValid = !validateName(formState.name) && !validateEmail(formState.email) && !validateSubject(formState.subject) && !validateMessage(formState.message);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAll()) {
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setFormState({ name: "", email: "", subject: "", message: "" });
        setTouched({});
        setErrors({});
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
        setErrorMessage(
          data.error || "Failed to send message. Please try again."
        );
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setStatus("error");
      setErrorMessage("Failed to send message. Please try again later.");
    }
  };

  return (
    <section id="contact" className="relative pt-24 pb-48 bg-transparent">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                Let's Discuss Your Project
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Ready to take your academic project to the next level? Fill out
                the form or reach out directly.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: <Mail className="w-6 h-6 text-brand-primary" />,
                  title: "Email Us",
                  value: "contact@aqro.com",
                },
                {
                  icon: <Phone className="w-6 h-6 text-brand-secondary" />,
                  title: "Call Us",
                  value: "+91 98234 56789",
                },
                {
                  icon: <MapPin className="w-6 h-6 text-brand-accent" />,
                  title: "Location",
                  value: "Mumbai, India",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-surface-elevated border border-white/5 hover:border-brand-primary/20 transition-colors"
                >
                  <div className="p-3 rounded-xl bg-white/5">{item.icon}</div>
                  <div>
                    <h3 className="font-medium text-white">{item.title}</h3>
                    <p className="text-muted-foreground">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 rounded-3xl blur-xl" />

            <form
              onSubmit={handleSubmit}
              className="relative bg-surface-elevated/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl"
            >
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-muted-foreground"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      autoComplete="name"
                      value={formState.name}
                      onChange={handleChange}
                      onBlur={() => handleBlur("name")}
                      className={cn(
                        "w-full px-4 py-4 sm:py-3 rounded-xl bg-white/5 border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all text-white placeholder:text-white/20",
                        touched.name && errors.name ? "border-red-500" : "border-white/10"
                      )}
                      placeholder="Rahul Sharma"
                    />
                    {touched.name && errors.name && (
                      <p className="text-sm text-red-400">{errors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-muted-foreground"
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="email"
                      value={formState.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur("email")}
                      className={cn(
                        "w-full px-4 py-4 sm:py-3 rounded-xl bg-white/5 border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all text-white placeholder:text-white/20",
                        touched.email && errors.email ? "border-red-500" : "border-white/10"
                      )}
                      placeholder="rahul@example.com"
                    />
                    {touched.email && errors.email && (
                      <p className="text-sm text-red-400">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    onBlur={() => handleBlur("subject")}
                    className={cn(
                      "w-full px-4 py-4 sm:py-3 rounded-xl bg-white/5 border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all text-white placeholder:text-white/20",
                      touched.subject && errors.subject ? "border-red-500" : "border-white/10"
                    )}
                    placeholder="Project Inquiry"
                  />
                  {touched.subject && errors.subject && (
                    <p className="text-sm text-red-400">{errors.subject}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    onBlur={() => handleBlur("message")}
                    rows={4}
                    className={cn(
                      "w-full px-4 py-4 sm:py-3 rounded-xl bg-white/5 border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all text-white placeholder:text-white/20 resize-none",
                      touched.message && errors.message ? "border-red-500" : "border-white/10"
                    )}
                    placeholder="Tell us about your project..."
                  />
                  {touched.message && errors.message && (
                    <p className="text-sm text-red-400">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting" || status === "success" || !isFormValid}
                  className={cn(
                    "w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2",
                    status === "success"
                      ? "bg-status-success text-white"
                      : !isFormValid || status === "submitting"
                        ? "bg-gray-500 cursor-not-allowed text-white"
                        : "bg-gradient-to-r from-brand-primary to-brand-secondary text-white hover:shadow-lg hover:shadow-brand-primary/25 hover:scale-[1.02] active:scale-[0.98]"
                  )}
                >
                  {status === "submitting" ? (
                    <span className="animate-pulse">Sending...</span>
                  ) : status === "success" ? (
                    <>
                      Message Sent <Check className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      Send Message <Send className="w-5 h-5" />
                    </>
                  )}
                </button>

                {status === "error" && (
                  <p className="text-status-error text-sm text-center animate-pulse">
                    {errorMessage || "Please fill in all required fields."}
                  </p>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

