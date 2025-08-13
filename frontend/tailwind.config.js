/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mythic color palette
        midnight: '#0b1020',
        gold: '#c59b45',
        parchment: '#f6edd9',
        crimson: '#8b2a2a',
        'midnight-light': '#1a2332',
        'gold-light': '#d4ae5a',
        'parchment-dark': '#e8dcc1',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'typewriter': 'typewriter 0.05s steps(1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        typewriter: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(197, 155, 69, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(197, 155, 69, 0.8)' },
        },
      },
      backgroundImage: {
        'starfield': "radial-gradient(2px 2px at 20px 30px, #eee, transparent), radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent), radial-gradient(1px 1px at 90px 40px, #fff, transparent), radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.9), transparent), radial-gradient(2px 2px at 160px 30px, #ddd, transparent)",
        'parchment-texture': "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJwYXJjaG1lbnQiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjAuNSIgZmlsbD0icmdiYSgyMzksIDIzMCwgMjEwLCAwLjMpIi8+CjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjAuMyIgZmlsbD0icmdiYSgyMzksIDIzMCwgMjEwLCAwLjIpIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjAuNCIgZmlsbD0icmdiYSgyMzksIDIzMCwgMjEwLCAwLjI1KSIvPgo8L3BhdHRlcm4+CjwvZGVmcz4KPHI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0idXJsKCNwYXJjaG1lbnQpIi8+PC9nPgo8L3N2Zz4=')",
      },
    },
  },
  plugins: [],
}
