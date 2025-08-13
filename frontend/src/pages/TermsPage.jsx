import { motion } from 'framer-motion'
import { FileText, AlertTriangle, Users, Gavel, Scale } from 'lucide-react'

const TermsPage = () => {
  const sections = [
    {
      icon: FileText,
      title: "Acceptance of Terms",
      content: [
        "By using MythWeaver, you agree to these terms of service",
        "These terms may be updated periodically with notice",
        "Continued use constitutes acceptance of updated terms",
        "You must be 13 years or older to use this service"
      ]
    },
    {
      icon: Users,
      title: "User Responsibilities",
      content: [
        "Provide appropriate, non-offensive content for myth generation",
        "Respect cultural traditions and avoid harmful stereotypes",
        "Do not submit copyrighted material or personal information",
        "Use the service for lawful purposes only"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Content Guidelines",
      content: [
        "No hate speech, harassment, or discriminatory content",
        "No explicit, violent, or inappropriate material",
        "No attempts to generate misleading or harmful information",
        "Content may be moderated using automated systems"
      ]
    },
    {
      icon: Scale,
      title: "Intellectual Property",
      content: [
        "Generated myths are inspired by public domain sources",
        "You retain rights to your original scenario submissions",
        "MythWeaver retains rights to improve the service",
        "AI-generated content may have limited copyright protection"
      ]
    }
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Gavel className="w-16 h-16 text-gold mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gold mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-parchment/80 leading-relaxed max-w-2xl mx-auto">
              Fair and transparent terms that protect both creators and our community of storytellers.
            </p>
            <p className="text-parchment/60 mt-4 text-sm">
              Last updated: December 2024
            </p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                className="card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gold/10 rounded-lg">
                    <section.icon className="w-6 h-6 text-gold" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-serif font-semibold text-gold mb-4">
                      {section.title}
                    </h2>
                    <ul className="space-y-2">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <div className="w-2 h-2 bg-gold/60 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-parchment/80">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Service Availability */}
          <motion.div
            className="card mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <h2 className="text-xl font-serif font-semibold text-gold mb-4">
              Service Availability
            </h2>
            <div className="text-parchment/80 space-y-3">
              <p>
                <strong className="text-gold">Uptime:</strong> We strive for 99% uptime but cannot guarantee uninterrupted service. Maintenance windows will be announced when possible.
              </p>
              <p>
                <strong className="text-gold">Rate Limits:</strong> To ensure fair access, we implement rate limiting. Free users may have usage restrictions during peak times.
              </p>
              <p>
                <strong className="text-gold">Service Changes:</strong> We may modify or discontinue features with reasonable notice. Core myth generation will remain free.
              </p>
            </div>
          </motion.div>

          {/* Liability */}
          <motion.div
            className="card mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <h2 className="text-xl font-serif font-semibold text-gold mb-4">
              Limitation of Liability
            </h2>
            <div className="text-parchment/80 space-y-3">
              <p>
                MythWeaver is provided "as is" without warranties. Generated content is for entertainment and educational purposes. We are not liable for:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Accuracy or cultural appropriateness of generated content</li>
                <li>Any decisions made based on generated myths</li>
                <li>Service interruptions or data loss</li>
                <li>Third-party actions or content</li>
              </ul>
            </div>
          </motion.div>

          {/* Cultural Respect */}
          <motion.div
            className="card mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <h2 className="text-xl font-serif font-semibold text-gold mb-4">
              Cultural Respect Policy
            </h2>
            <div className="text-parchment/80 space-y-3">
              <p>
                We are committed to honoring cultural traditions and avoiding appropriation:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Our AI is trained to respect cultural contexts and avoid stereotypes</li>
                <li>We use only public domain sources and folkloric motifs</li>
                <li>Sacred or sensitive cultural elements are avoided</li>
                <li>We welcome feedback from cultural communities</li>
              </ul>
              <p className="mt-4">
                If you believe our service has misrepresented your culture, please contact us immediately at <a href="mailto:cultural@mythosync.com" className="text-gold hover:underline">cultural@mythosync.com</a>.
              </p>
            </div>
          </motion.div>

          {/* Dispute Resolution */}
          <motion.div
            className="card mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <h2 className="text-xl font-serif font-semibold text-gold mb-4">
              Dispute Resolution
            </h2>
            <div className="text-parchment/80 space-y-3">
              <p>
                For any disputes or concerns:
              </p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Contact us directly to resolve the issue informally</li>
                <li>If unresolved, disputes will be governed by [Your Jurisdiction] law</li>
                <li>Arbitration may be required for significant disputes</li>
                <li>Class action lawsuits are waived where legally permissible</li>
              </ol>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            className="card mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <FileText className="w-8 h-8 text-gold mx-auto mb-4" />
            <h2 className="text-xl font-serif font-semibold text-gold mb-4">
              Questions About These Terms?
            </h2>
            <p className="text-parchment/80 mb-4">
              We believe in clear, fair terms. If you have questions about any part of our terms of service, we're here to help explain them.
            </p>
            <a
              href="mailto:legal@mythosync.com"
              className="btn-primary inline-flex items-center"
            >
              <FileText className="w-4 h-4 mr-2" />
              Contact Legal Team
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default TermsPage
