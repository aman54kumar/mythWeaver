import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import InputPage from '../pages/InputPage'
import * as api from '../services/api'

// Mock the API
vi.mock('../services/api', () => ({
  generateMythAPI: vi.fn(),
}))

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const renderInputPage = () => {
  return render(
    <BrowserRouter>
      <InputPage />
    </BrowserRouter>
  )
}

describe('InputPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        setItem: vi.fn(),
        getItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    })
  })

  test('renders main elements', () => {
    renderInputPage()
    
    expect(screen.getByText('Transform Your Story')).toBeInTheDocument()
    expect(screen.getByText('Into an Ancient Myth')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Describe your modern situation/)).toBeInTheDocument()
    expect(screen.getByText('Retell My Myth')).toBeInTheDocument()
  })

  test('displays sample scenarios', () => {
    renderInputPage()
    
    // Check for at least one sample scenario
    expect(screen.getByText(/sustainable energy startup/)).toBeInTheDocument()
    expect(screen.getByText(/grandmother's secret recipe/)).toBeInTheDocument()
  })

  test('allows text input in scenario field', async () => {
    renderInputPage()
    
    const textarea = screen.getByPlaceholderText(/Describe your modern situation/)
    fireEvent.change(textarea, { 
      target: { value: 'I am starting a community garden' } 
    })
    
    expect(textarea.value).toBe('I am starting a community garden')
  })

  test('shows character count', () => {
    renderInputPage()
    
    const textarea = screen.getByPlaceholderText(/Describe your modern situation/)
    fireEvent.change(textarea, { 
      target: { value: 'Test scenario' } 
    })
    
    expect(screen.getByText('13/2000 characters')).toBeInTheDocument()
  })

  test('allows culture selection', () => {
    renderInputPage()
    
    const cultureSelect = screen.getByDisplayValue('Auto-detect')
    fireEvent.change(cultureSelect, { target: { value: 'greek' } })
    
    expect(cultureSelect.value).toBe('greek')
  })

  test('allows tone selection', () => {
    renderInputPage()
    
    const toneSelect = screen.getByDisplayValue('Balanced')
    fireEvent.change(toneSelect, { target: { value: 'serious' } })
    
    expect(toneSelect.value).toBe('serious')
  })

  test('clicking sample scenario fills the textarea', () => {
    renderInputPage()
    
    const textarea = screen.getByPlaceholderText(/Describe your modern situation/)
    const sampleButton = screen.getByText(/sustainable energy startup/)
    
    fireEvent.click(sampleButton)
    
    expect(textarea.value).toContain('sustainable energy startup')
  })

  test('submit button is disabled when scenario is empty', () => {
    renderInputPage()
    
    const submitButton = screen.getByText('Retell My Myth')
    expect(submitButton).toBeDisabled()
  })

  test('submit button is enabled when scenario has content', () => {
    renderInputPage()
    
    const textarea = screen.getByPlaceholderText(/Describe your modern situation/)
    const submitButton = screen.getByText('Retell My Myth')
    
    fireEvent.change(textarea, { 
      target: { value: 'A meaningful scenario with enough content' } 
    })
    
    expect(submitButton).not.toBeDisabled()
  })

  test('successful form submission navigates to story page', async () => {
    const mockResponse = {
      title: 'Test Myth',
      adapted_story: 'Once upon a time...',
      choices: [
        { id: 'c1', label: 'Choice 1', outcome: 'Outcome 1' },
        { id: 'c2', label: 'Choice 2', outcome: 'Outcome 2' },
        { id: 'c3', label: 'Choice 3', outcome: 'Outcome 3' },
      ],
      meta: {
        culture: 'greek',
        source_motif: 'Hero journey',
      },
    }
    
    api.generateMythAPI.mockResolvedValueOnce(mockResponse)
    
    renderInputPage()
    
    const textarea = screen.getByPlaceholderText(/Describe your modern situation/)
    const submitButton = screen.getByText('Retell My Myth')
    
    fireEvent.change(textarea, { 
      target: { value: 'A meaningful scenario for testing' } 
    })
    
    fireEvent.click(submitButton)
    
    // Wait for async operations
    await waitFor(() => {
      expect(api.generateMythAPI).toHaveBeenCalledWith({
        scenario: 'A meaningful scenario for testing',
        culture: 'auto',
        tone: 'balanced',
      })
    })
    
    await waitFor(() => {
      expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
        'mythData',
        JSON.stringify(mockResponse)
      )
    })
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(expect.stringMatching(/^\/story\/\d+$/))
    })
  })

  test('shows loading state during submission', async () => {
    // Mock a delayed API response
    api.generateMythAPI.mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    )
    
    renderInputPage()
    
    const textarea = screen.getByPlaceholderText(/Describe your modern situation/)
    const submitButton = screen.getByText('Retell My Myth')
    
    fireEvent.change(textarea, { 
      target: { value: 'A test scenario' } 
    })
    
    fireEvent.click(submitButton)
    
    // Should show loading state
    expect(screen.getByText('Weaving Your Myth...')).toBeInTheDocument()
    expect(screen.getByText(/Consulting ancient wisdom/)).toBeInTheDocument()
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Weaving Your Myth...')).not.toBeInTheDocument()
    }, { timeout: 200 })
  })

  test('handles API error gracefully', async () => {
    api.generateMythAPI.mockRejectedValueOnce(new Error('API Error'))
    
    renderInputPage()
    
    const textarea = screen.getByPlaceholderText(/Describe your modern situation/)
    const submitButton = screen.getByText('Retell My Myth')
    
    fireEvent.change(textarea, { 
      target: { value: 'A test scenario' } 
    })
    
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(api.generateMythAPI).toHaveBeenCalled()
    })
    
    // Should not navigate on error
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  test('validates minimum scenario length', () => {
    renderInputPage()
    
    const textarea = screen.getByPlaceholderText(/Describe your modern situation/)
    const submitButton = screen.getByText('Retell My Myth')
    
    fireEvent.change(textarea, { target: { value: 'Short' } })
    fireEvent.click(submitButton)
    
    // Should not call API with too short content
    expect(api.generateMythAPI).not.toHaveBeenCalled()
  })

  test('shows approaching limit warning', () => {
    renderInputPage()
    
    const textarea = screen.getByPlaceholderText(/Describe your modern situation/)
    const longText = 'x'.repeat(1850) // Near the 2000 character limit
    
    fireEvent.change(textarea, { target: { value: longText } })
    
    expect(screen.getByText('Approaching limit')).toBeInTheDocument()
  })
})
