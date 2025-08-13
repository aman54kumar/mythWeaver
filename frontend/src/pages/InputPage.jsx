import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import TextareaAutosize from 'react-textarea-autosize'
import { Sparkles, Scroll, Globe, Wand2 } from 'lucide-react'
import { generateMythAPI } from '../services/api'

const cultures = [
  { value: 'auto', label: 'Auto-detect' },
  { value: 'greek', label: 'Greek' },
  { value: 'norse', label: 'Norse' },
  { value: 'indian', label: 'Indian' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'egyptian', label: 'Egyptian' },
  { value: 'celtic', label: 'Celtic' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'african', label: 'African' },
  { value: 'native_american', label: 'Native American' },
]

const tones = [
  { value: 'playful', label: 'Playful' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'serious', label: 'Serious' },
]

const sampleScenarios = [
  "I'm launching a sustainable energy startup that uses drones to install solar panels in remote areas.",
  "My grandmother's secret recipe brings people together, but a corporate chain wants to buy it.",
  "I discovered my neighbor has been secretly feeding stray cats for 20 years despite city regulations.",
  "Our community garden is being torn down for a parking lot, but we've grown more than just vegetables here.",
  "I found an old letter in my attic that reveals my great-grandfather was a master craftsman.",
  "My small bookstore is struggling against online retailers, but it's become a sanctuary for lonely people."
]

const InputPage = () => {
  const [scenario, setScenario] = useState('')
  const [culture, setCulture] = useState('auto')
  const [tone, setTone] = useState('balanced')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!scenario.trim()) {
      toast.error('Please describe your scenario')
      return
    }
    
    if (scenario.length < 10) {
      toast.error('Please provide more details about your scenario')
      return
    }

    setIsLoading(true)
    
    try {
      const response = await generateMythAPI({
        scenario: scenario.trim(),
        culture,
        tone
      })
      
      // Store the response for the story page
      sessionStorage.setItem('mythData', JSON.stringify(response))
      sessionStorage.setItem('inputScenario', scenario.trim())
      
      // Create shareable URL with encoded parameters
      const params = new URLSearchParams({
        scenario: scenario.trim(),
        culture,
        tone
      })
      
      // Navigate to story page with parameters
      navigate(`/story?${params.toString()}`)
      
    } catch (error) {
      console.error('Error generating myth:', error)
      toast.error(error.message || 'Failed to generate myth. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSampleScenario = (sample) => {
    setScenario(sample)
  }

  return (
    <div className="min-h-screen starfield-bg">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="flex justify-center mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-16 h-16 text-gold" />
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-gold mb-4 text-shadow-glow">
              Transform Your Story
            </h1>
            <p className="text-xl md:text-2xl text-parchment/80 mb-6 leading-relaxed">
              Into an Ancient Myth
            </p>
            <p className="text-parchment/70 max-w-2xl mx-auto leading-relaxed">
              Share your modern scenario and watch as AI transforms it into a timeless myth, 
              complete with interactive endings and cultural wisdom from ancient traditions.
            </p>
          </motion.div>

          {/* Main Form */}
          <motion.div
            className="card max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Scenario Input */}
              <div>
                <label className="flex items-center text-gold font-semibold mb-3">
                  <Scroll className="w-5 h-5 mr-2" />
                  Describe Your Scenario
                </label>
                <TextareaAutosize
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                  placeholder="Describe your modern situation, challenge, or story. Be as detailed as you like - the more context you provide, the richer your myth will be..."
                  className="input-field"
                  minRows={4}
                  maxRows={8}
                  maxLength={2000}
                />
                <div className="flex justify-between items-center mt-2 text-sm text-parchment/60">
                  <span>{scenario.length}/2000 characters</span>
                  {scenario.length > 1800 && (
                    <span className="text-gold">Approaching limit</span>
                  )}
                </div>
              </div>

              {/* Sample Scenarios */}
              <div>
                <label className="text-gold font-semibold mb-3 block">
                  Need inspiration? Try these scenarios:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sampleScenarios.map((sample, index) => (
                    <motion.button
                      key={index}
                      type="button"
                      onClick={() => handleSampleScenario(sample)}
                      className="text-left p-3 bg-midnight border border-gold/20 rounded-lg
                               hover:border-gold/50 hover:bg-midnight-light transition-all duration-300
                               text-sm text-parchment/80 hover:text-parchment"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {sample}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Culture Selection */}
                <div>
                  <label className="flex items-center text-gold font-semibold mb-3">
                    <Globe className="w-5 h-5 mr-2" />
                    Cultural Tradition
                  </label>
                  <select
                    value={culture}
                    onChange={(e) => setCulture(e.target.value)}
                    className="input-field"
                  >
                    {cultures.map((cult) => (
                      <option key={cult.value} value={cult.value}>
                        {cult.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tone Selection */}
                <div>
                  <label className="flex items-center text-gold font-semibold mb-3">
                    <Wand2 className="w-5 h-5 mr-2" />
                    Story Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="input-field"
                  >
                    {tones.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading || !scenario.trim()}
                className="btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <motion.div
                      className="w-5 h-5 border-2 border-midnight border-t-transparent rounded-full mr-3"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Weaving Your Myth...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Retell My Myth
                  </div>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Loading Animation */}
          {isLoading && (
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="max-w-2xl mx-auto">
                <motion.div
                  className="h-2 bg-gold/20 rounded-full overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-gold to-gold-light"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 8, ease: "easeInOut" }}
                  />
                </motion.div>
                <p className="text-parchment/70 mt-4 text-sm">
                  Consulting ancient wisdom... This may take a moment to craft your perfect myth.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InputPage
