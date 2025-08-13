import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { 
  ArrowLeft, 
  Share, 
  Download, 
  BookOpen, 
  Sparkles, 
  Twitter,
  Copy,
  RefreshCw
} from 'lucide-react'
import MythCard from '../components/MythCard'
import ChoiceCard from '../components/ChoiceCard'
import ShareModal from '../components/ShareModal'

const StoryPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [mythData, setMythData] = useState(null)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    // Get myth data from session storage
    const storedData = sessionStorage.getItem('mythData')
    if (storedData) {
      try {
        const data = JSON.parse(storedData)
        setMythData(data)
        
        // Start typing animation
        setTimeout(() => {
          setIsTyping(false)
        }, 2000)
      } catch (error) {
        toast.error('Failed to load story data')
        navigate('/')
      }
    } else {
      toast.error('No story data found')
      navigate('/')
    }
  }, [id, navigate])

  const handleChoiceSelect = (choice) => {
    setSelectedChoice(choice)
  }

  const handleShare = async (platform) => {
    const url = window.location.href
    const title = mythData?.title || 'My Ancient Myth'
    const text = `Check out my personalized myth: "${title}" created with Mythosync!`
    
    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          '_blank'
        )
        break
      case 'copy':
        try {
          await navigator.clipboard.writeText(`${text} ${url}`)
          toast.success('Link copied to clipboard!')
        } catch (error) {
          toast.error('Failed to copy link')
        }
        break
      default:
        break
    }
    setShowShareModal(false)
  }

  const handleDownload = () => {
    if (!mythData) return
    
    const content = `
${mythData.title}

${mythData.adapted_story}

Interactive Endings:

${mythData.choices.map((choice, index) => 
  `${index + 1}. ${choice.label}: ${choice.outcome}`
).join('\n\n')}

---
Generated with MythWeaver.fun
Cultural Tradition: ${mythData.meta.culture}
Source Motif: ${mythData.meta.source_motif}
    `.trim()
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${mythData.title.replace(/[^a-zA-Z0-9]/g, '_')}_myth.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Myth downloaded!')
  }

  if (!mythData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-parchment/70">Loading your myth...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight to-midnight-light">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/"
              className="flex items-center text-parchment/70 hover:text-gold transition-colors duration-300 mb-4 sm:mb-0"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Create Another Myth
            </Link>
            
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={() => setShowShareModal(true)}
                className="btn-secondary flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share className="w-4 h-4 mr-2" />
                Share
              </motion.button>
              <motion.button
                onClick={handleDownload}
                className="btn-secondary flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </motion.button>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-gold mb-4 text-shadow-glow">
              {mythData.title}
            </h1>
            
            {/* Decorative divider */}
            <motion.div
              className="flex items-center justify-center mb-6"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent w-64"></div>
              <Sparkles className="w-6 h-6 text-gold mx-4" />
              <div className="h-px bg-gradient-to-r from-gold via-gold to-transparent w-64"></div>
            </motion.div>
            
            <p className="text-parchment/60 capitalize">
              {mythData.meta.culture} Tradition
            </p>
          </motion.div>

          {/* Main Story */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <MythCard 
              story={mythData.adapted_story} 
              isTyping={isTyping}
              onTypingComplete={() => setIsTyping(false)}
            />
          </motion.div>

          {/* Interactive Choices */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <h2 className="text-2xl font-serif font-semibold text-gold mb-6 text-center">
              Choose Your Path
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mythData.choices.map((choice, index) => (
                <ChoiceCard
                  key={choice.id}
                  choice={choice}
                  index={index}
                  isSelected={selectedChoice?.id === choice.id}
                  onSelect={handleChoiceSelect}
                />
              ))}
            </div>
          </motion.div>

          {/* Selected Choice Outcome */}
          <AnimatePresence>
            {selectedChoice && (
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="card bg-gold/5 border-gold/30">
                  <h3 className="text-xl font-serif font-semibold text-gold mb-4">
                    Path of {selectedChoice.label}
                  </h3>
                  <p className="myth-text text-parchment/90">
                    {selectedChoice.outcome}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Metadata */}
          <motion.div
            className="mt-12 p-6 bg-midnight-light/50 rounded-xl border border-gold/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-gold mb-3">About This Myth</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-parchment/70">
              <div>
                <span className="text-gold">Cultural Tradition:</span> {mythData.meta.culture}
              </div>
              <div>
                <span className="text-gold">Source Motif:</span> {mythData.meta.source_motif}
              </div>
              {mythData.meta.generation_time && (
                <div>
                  <span className="text-gold">Generation Time:</span> {mythData.meta.generation_time.toFixed(2)}s
                </div>
              )}

            </div>
          </motion.div>

          {/* Related Books (Affiliate) */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <div className="card">
              <div className="flex items-center mb-4">
                <BookOpen className="w-5 h-5 text-gold mr-2" />
                <h3 className="text-lg font-semibold text-gold">
                  Explore {mythData.meta.culture.charAt(0).toUpperCase() + mythData.meta.culture.slice(1)} Mythology
                </h3>
              </div>
              <p className="text-parchment/70 text-sm mb-4">
                Discover more about this rich cultural tradition with these recommended books:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href={`https://affiliate.example.com/?q=${mythData.meta.culture} mythology`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-midnight border border-gold/20 rounded-lg hover:border-gold/50 transition-all duration-300 block"
                >
                  <div className="text-sm text-parchment/80">
                    {mythData.meta.culture.charAt(0).toUpperCase() + mythData.meta.culture.slice(1)} Mythology Books
                  </div>
                </a>
                <a
                  href="https://www.gutenberg.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-midnight border border-gold/20 rounded-lg hover:border-gold/50 transition-all duration-300 block"
                >
                  <div className="text-sm text-parchment/80">
                    Free Public Domain Texts
                  </div>
                </a>
              </div>
              <p className="text-xs text-parchment/50 mt-3">
                * Affiliate disclosure: We may earn a commission from qualifying purchases.
              </p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            <Link
              to="/"
              className="btn-primary inline-flex items-center text-lg"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Create Another Myth
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onShare={handleShare}
        title={mythData.title}
      />
    </div>
  )
}

export default StoryPage
