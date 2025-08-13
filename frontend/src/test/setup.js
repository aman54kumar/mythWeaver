import '@testing-library/jest-dom'

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
    header: ({ children, ...props }) => <header {...props}>{children}</header>,
    footer: ({ children, ...props }) => <footer {...props}>{children}</footer>,
  },
  AnimatePresence: ({ children }) => children,
}))

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
  },
  Toaster: () => null,
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Sparkles: () => <div data-testid="sparkles-icon" />,
  Scroll: () => <div data-testid="scroll-icon" />,
  Globe: () => <div data-testid="globe-icon" />,
  Wand2: () => <div data-testid="wand-icon" />,
  ArrowLeft: () => <div data-testid="arrow-left-icon" />,
  Share: () => <div data-testid="share-icon" />,
  Download: () => <div data-testid="download-icon" />,
  BookOpen: () => <div data-testid="book-icon" />,
  ChevronRight: () => <div data-testid="chevron-right-icon" />,
  Heart: () => <div data-testid="heart-icon" />,
  Mail: () => <div data-testid="mail-icon" />,
  Shield: () => <div data-testid="shield-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  Cookie: () => <div data-testid="cookie-icon" />,
  Database: () => <div data-testid="database-icon" />,
  FileText: () => <div data-testid="file-text-icon" />,
  AlertTriangle: () => <div data-testid="alert-triangle-icon" />,
  Users: () => <div data-testid="users-icon" />,
  Gavel: () => <div data-testid="gavel-icon" />,
  Scale: () => <div data-testid="scale-icon" />,
  X: () => <div data-testid="x-icon" />,
  Twitter: () => <div data-testid="twitter-icon" />,
  Copy: () => <div data-testid="copy-icon" />,
  Facebook: () => <div data-testid="facebook-icon" />,
  RefreshCw: () => <div data-testid="refresh-icon" />,
}))

// Mock TextareaAutosize
jest.mock('react-textarea-autosize', () => {
  return function TextareaAutosize(props) {
    return <textarea {...props} />
  }
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null
  }
  disconnect() {
    return null
  }
  unobserve() {
    return null
  }
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null
  }
  disconnect() {
    return null
  }
  unobserve() {
    return null
  }
}
