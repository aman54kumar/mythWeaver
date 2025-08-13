import { motion, AnimatePresence } from 'framer-motion'
import { X, Twitter, Copy, Facebook, Link } from 'lucide-react'

const ShareModal = ({ isOpen, onClose, onShare, title }) => {
  const shareOptions = [
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-blue-500 hover:bg-blue-600',
      description: 'Tweet your myth'
    },
    {
      id: 'copy',
      name: 'Copy Link',
      icon: Copy,
      color: 'bg-gray-600 hover:bg-gray-700',
      description: 'Copy to clipboard'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      description: 'Share on Facebook'
    }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="card max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-serif font-semibold text-gold">
                    Share Your Myth
                  </h3>
                  <p className="text-parchment/60 text-sm mt-1">
                    {title}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gold/10 rounded-lg transition-colors duration-300"
                >
                  <X className="w-5 h-5 text-parchment/70" />
                </button>
              </div>
              
              {/* Share Options */}
              <div className="space-y-3">
                {shareOptions.map((option, index) => (
                  <motion.button
                    key={option.id}
                    onClick={() => onShare(option.id)}
                    className="w-full flex items-center p-4 bg-midnight hover:bg-midnight-light 
                             border border-gold/20 hover:border-gold/40 rounded-lg
                             transition-all duration-300 group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`p-2 rounded-lg ${option.color} transition-colors duration-300`}>
                      <option.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-4 text-left">
                      <div className="text-parchment font-medium group-hover:text-gold transition-colors duration-300">
                        {option.name}
                      </div>
                      <div className="text-parchment/60 text-sm">
                        {option.description}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
              
              {/* Footer */}
              <div className="mt-6 p-4 bg-gold/5 rounded-lg border border-gold/20">
                <p className="text-xs text-parchment/60 text-center">
                  Help others discover the magic of ancient storytelling
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ShareModal
