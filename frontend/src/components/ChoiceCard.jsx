import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

const ChoiceCard = ({ choice, index, isSelected, onSelect }) => {
  return (
    <motion.div
      className={`choice-card relative overflow-hidden ${isSelected ? 'selected' : ''}`}
      initial={{ opacity: 0, y: 20, rotateY: -15 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ 
        delay: index * 0.2,
        duration: 0.6,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -5,
        rotateY: 5,
        scale: 1.02
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(choice)}
    >
      {/* Background glow effect */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-gold/10 to-gold-light/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-serif font-semibold text-gold">
            {choice.label}
          </h3>
          <motion.div
            animate={{ 
              x: isSelected ? 5 : 0,
              rotate: isSelected ? 90 : 0
            }}
            transition={{ duration: 0.3 }}
          >
            <ChevronRight className="w-5 h-5 text-gold/60" />
          </motion.div>
        </div>
        
        <p className="text-parchment/70 text-sm leading-relaxed">
          {choice.outcome.length > 100 
            ? `${choice.outcome.substring(0, 100)}...`
            : choice.outcome
          }
        </p>
        
        {isSelected && (
          <motion.div
            className="mt-4 pt-3 border-t border-gold/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <p className="text-parchment/80 text-sm">
              Click to see the full outcome below
            </p>
          </motion.div>
        )}
      </div>
      
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0">
        <motion.div
          className="w-12 h-12 bg-gradient-to-bl from-gold/20 to-transparent"
          style={{
            clipPath: 'polygon(100% 0%, 0% 0%, 100% 100%)'
          }}
          animate={{
            opacity: isSelected ? 1 : 0.3
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gold to-gold-light"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.4 }}
        />
      )}
    </motion.div>
  )
}

export default ChoiceCard
