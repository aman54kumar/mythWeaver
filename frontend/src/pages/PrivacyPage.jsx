import { motion } from 'framer-motion'
import { Shield, Eye, Cookie, Database, Mail } from 'lucide-react'

const PrivacyPage = () => {
  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: [
        "Scenarios you submit for myth generation",
        "Basic usage analytics (page views, generation counts)",
        "Technical information (IP address, browser type) for security",
        "No personal identifying information is stored"
      ]
    },
    {
      icon: Database,
      title: "How We Use Your Data",
      content: [
        "Generate personalized myths using OpenAI's API",
        "Improve our service through anonymized analytics",
        "Ensure platform security and prevent abuse",
        "Your scenarios are not stored permanently"
      ]
    },
    {
      icon: Shield,
      title: "Data Protection",
      content: [
        "All data transmission is encrypted (HTTPS)",
        "We use industry-standard security practices",
        "Generated myths are temporarily cached for performance",
        "We comply with content moderation policies"
      ]
    },
    {
      icon: Cookie,
      title: "Cookies & Tracking",
      content: [
        "We use essential cookies for site functionality",
        "Optional analytics cookies (with your consent)",
        "No third-party advertising trackers",
        "You can disable cookies in your browser settings"
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
            <Shield className="w-16 h-16 text-gold mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gold mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-parchment/80 leading-relaxed max-w-2xl mx-auto">
              Your privacy is sacred to us. Here's how we protect your data and respect your digital rights.
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

          {/* Third Party Services */}
          <motion.div
            className="card mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <h2 className="text-xl font-serif font-semibold text-gold mb-4">
              Third-Party Services
            </h2>
            <div className="space-y-4 text-parchment/80">
              <div>
                <h3 className="font-semibold text-gold mb-2">OpenAI</h3>
                <p>We use OpenAI's API to generate myths. Your scenarios are sent to OpenAI for processing but are not stored by them for training purposes. View OpenAI's privacy policy at openai.com/privacy.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gold mb-2">Analytics</h3>
                <p>We may use privacy-focused analytics tools to understand how our service is used. No personal information is collected through analytics.</p>
              </div>
            </div>
          </motion.div>

          {/* Your Rights */}
          <motion.div
            className="card mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <h2 className="text-xl font-serif font-semibold text-gold mb-4">
              Your Rights
            </h2>
            <div className="text-parchment/80 space-y-3">
              <p>
                <strong className="text-gold">Right to Access:</strong> You can request information about any data we may have about you.
              </p>
              <p>
                <strong className="text-gold">Right to Deletion:</strong> You can request deletion of any data associated with your use.
              </p>
              <p>
                <strong className="text-gold">Right to Portability:</strong> You can download your generated myths at any time.
              </p>
              <p>
                <strong className="text-gold">Right to Object:</strong> You can opt out of analytics and non-essential data collection.
              </p>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            className="card mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Mail className="w-8 h-8 text-gold mx-auto mb-4" />
            <h2 className="text-xl font-serif font-semibold text-gold mb-4">
              Questions About Privacy?
            </h2>
            <p className="text-parchment/80 mb-4">
              We're committed to transparency and protecting your privacy. If you have any questions or concerns about how we handle your data, please don't hesitate to reach out.
            </p>
            <a
              href="mailto:privacy@mythosync.com"
              className="btn-primary inline-flex items-center"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Privacy Team
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPage
