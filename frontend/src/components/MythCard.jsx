import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const MythCard = ({ story, isTyping, onTypingComplete }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!isTyping) {
      setDisplayedText(story)
      if (onTypingComplete) onTypingComplete()
      return
    }

    if (currentIndex < story.length) {
      const timer = setTimeout(() => {
        setDisplayedText(story.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }, 20) // Adjust speed here (lower = faster)

      return () => clearTimeout(timer)
    } else {
      if (onTypingComplete) onTypingComplete()
    }
  }, [currentIndex, story, isTyping, onTypingComplete])

  // Split text into paragraphs
  const paragraphs = displayedText.split('\n').filter(p => p.trim())

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="myth-text">
        {paragraphs.map((paragraph, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="mb-4 last:mb-0"
          >
            {paragraph}
            {isTyping && index === paragraphs.length - 1 && (
              <motion.span
                className="inline-block w-0.5 h-6 bg-gold ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            )}
          </motion.p>
        ))}
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-gold/30"></div>
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-gold/30"></div>
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-gold/30"></div>
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-gold/30"></div>
    </motion.div>
  )
}

export default MythCard
