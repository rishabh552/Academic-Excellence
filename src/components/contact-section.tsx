"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { GlassButton } from "./ui/glass-button";
import SpotlightCard from "./ui/spotlight-card";
import { GradientHeadline } from "./ui/gradient-headline";

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    projectType: "Full Stack",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "", projectType: "Full Stack" });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: "📧",
      title: "Email",
      content: "hello@modernui.com",
      link: "mailto:hello@modernui.com",
    },
    {
      icon: "📱",
      title: "Phone",
      content: "+1 (555) 123-4567",
      link: "tel:+15551234567",
    },
    {
      icon: "📍",
      title: "Location",
      content: "San Francisco, CA 94102",
      link: "https://maps.google.com",
    },
  ];

  const socialLinks = [
    { icon: "🐦", name: "Twitter", url: "#" },
    { icon: "💼", name: "LinkedIn", url: "#" },
    { icon: "📸", name: "Instagram", url: "#" },
    { icon: "📘", name: "Facebook", url: "#" },
  ];

  return (
    <section id="contact" className="relative py-32 bg-transparent">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="mb-6">
              <GradientHeadline text="Get In Touch" className="text-4xl md:text-6xl" />
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              Have a project in mind? Let's discuss how we can help bring your vision to life.
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Left Side - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              <SpotlightCard
                className="bg-card rounded-3xl shadow-2xl p-8 md:p-10 border border-border"
                spotlightColor="rgba(59, 130, 246, 0.15)"
              >
                <h3 className="text-2xl font-bold mb-6 text-foreground">
                  Send us a message
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Input */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Subject Input */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-muted-foreground mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="How can we help you?"
                    />
                  </div>

                  {/* Project Type Input */}
                  <div>
                    <label htmlFor="projectType" className="block text-sm font-medium text-muted-foreground mb-2">
                      Project Type
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      <option value="Full Stack">Full Stack Web App</option>
                      <option value="ML">Machine Learning</option>
                      <option value="DL">Deep Learning</option>
                      <option value="NLP">NLP Project</option>
                      <option value="Mobile">Mobile App</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Message Textarea */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-2">
                      Project Details
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                      placeholder="Tell us about your project requirements..."
                    />
                  </div>

                  {/* Submit Button */}
                  <GlassButton type="submit" className="w-full">
                    {isSubmitted ? "✓ Message Sent!" : "Get a Quote"}
                  </GlassButton>
                </form>
              </SpotlightCard>
            </motion.div>

            {/* Right Side - Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              {/* Contact Cards */}
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={info.title}
                    href={info.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="block"
                  >
                    <SpotlightCard
                      className="p-6 rounded-2xl bg-card border border-border hover:border-blue-300 dark:hover:border-blue-700 shadow-lg hover:shadow-xl transition-all"
                      spotlightColor="rgba(59, 130, 246, 0.15)"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-4xl">{info.icon}</div>
                        <div>
                          <h4 className="text-lg font-bold text-foreground mb-1">
                            {info.title}
                          </h4>
                          <p className="text-muted-foreground">{info.content}</p>
                        </div>
                      </div>
                    </SpotlightCard>
                  </motion.a>
                ))}
              </div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 }}
              >
                <SpotlightCard
                  className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900"
                  spotlightColor="rgba(59, 130, 246, 0.15)"
                >
                  <h4 className="text-xl font-bold text-foreground mb-6">
                    Follow Us
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={social.name}
                        href={social.url}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center space-x-3 p-4 rounded-xl bg-card border border-border hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                      >
                        <span className="text-2xl">{social.icon}</span>
                        <span className="text-sm font-medium text-muted-foreground">
                          {social.name}
                        </span>
                      </motion.a>
                    ))}
                  </div>
                </SpotlightCard>
              </motion.div>

              {/* Business Hours */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1 }}
              >
                <SpotlightCard
                  className="p-6 rounded-2xl bg-card border border-border"
                  spotlightColor="rgba(59, 130, 246, 0.15)"
                >
                  <h4 className="text-lg font-bold text-foreground mb-4">
                    Support Hours
                  </h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Monday - Sunday: 24/7 Support</p>
                    <p>We are always available to help you with your projects.</p>
                  </div>
                </SpotlightCard>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
