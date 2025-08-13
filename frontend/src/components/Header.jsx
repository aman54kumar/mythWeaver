import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Scroll } from 'lucide-react'

const Header = () => {
  return (
    <motion.header 
      className="bg-midnight-light border-b border-gold/20 sticky top-0 z-50 backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              className="p-2 bg-gradient-to-br from-gold to-gold-light rounded-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Scroll className="w-6 h-6 text-midnight" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-gold group-hover:text-shadow-glow transition-all duration-300">
                MythWeaver
              </h1>
              <p className="text-xs text-parchment/60 hidden sm:block">
                Weaving ancient myths into modern stories
              </p>
            </div>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-parchment/80 hover:text-gold transition-colors duration-300 font-medium"
            >
              Create
            </Link>
            <a 
              href="https://github.com/mythweaver/mythweaver" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-parchment/80 hover:text-gold transition-colors duration-300 font-medium"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </motion.header>
  )
}

export default Header
