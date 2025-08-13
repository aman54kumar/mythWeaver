import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Scroll } from 'lucide-react'

const Footer = () => {
  return (
    <motion.footer 
      className="bg-midnight-light border-t border-gold/20 mt-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-4 group">
              <div className="p-2 bg-gradient-to-br from-gold to-gold-light rounded-lg">
                <Scroll className="w-5 h-5 text-midnight" />
              </div>
              <h3 className="text-xl font-serif font-bold text-gold">MythWeaver</h3>
            </Link>
            <p className="text-parchment/70 text-sm leading-relaxed max-w-md">
              Transform your modern scenarios into timeless ancient myths. Experience the 
              wisdom of ages through AI-powered storytelling that honors cultural traditions 
              and public domain folklore.
            </p>
            <div className="mt-4 flex items-center text-xs text-parchment/60">
              <span>Made with</span>
              <Heart className="w-3 h-3 mx-1 text-crimson" />
              <span>for storytellers worldwide</span>
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="text-gold font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/privacy" 
                  className="text-parchment/70 hover:text-gold transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-parchment/70 hover:text-gold transition-colors duration-300"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:contact@mythweaver.fun" 
                  className="text-parchment/70 hover:text-gold transition-colors duration-300"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="text-gold font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://www.gutenberg.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-parchment/70 hover:text-gold transition-colors duration-300"
                >
                  Project Gutenberg
                </a>
              </li>
              <li>
                <a 
                  href="https://sacred-texts.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-parchment/70 hover:text-gold transition-colors duration-300"
                >
                  Sacred Texts
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/mythweaver/mythweaver" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-parchment/70 hover:text-gold transition-colors duration-300"
                >
                  Open Source
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Affiliate Disclosure */}
        <div className="mt-8 pt-6 border-t border-gold/10">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-parchment/60">
            <p className="mb-2 md:mb-0">
              © 2025 MythWeaver. All rights reserved. Built with respect for cultural heritage.
            </p>
            <p className="text-center md:text-right">
              This site may contain affiliate links to books and cultural resources.
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer
