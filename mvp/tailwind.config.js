/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Avalanche Brand Colors
        "ava-blue": "#3055B3",         // Primary Avalanche blue
        "ava-blue-secondary": "#058AFF", // Secondary blue
        "ava-light-gray": "#F5F5F9",   // Light gray
        "ava-dark-gray": "#161617",    // Dark gray
        "ava-white": "#FFFFFF",        // White
        "ava-black": "#000000",        // Black
        
        // Legacy colors (keep for backward compatibility during transition)
        "cyber-black": "#121212",
        "cyber-dark": "#1E1E1E",
        "cyber-green": "#39FF14",
        "cyber-blue": "#00D1FF",
        "cyber-purple": "#A020F0",
        "cyber-gray": "#D3D3D3",
        "cyber-red": "#FF3131",
        "snow-primary": "#1e40af",
        "snow-secondary": "#3b82f6",
        "snow-accent": "#06b6d4",
        "snow-success": "#10b981",
        "snow-warning": "#f59e0b",
        "snow-danger": "#ef4444",
        "snow-gray": "#6b7280",
        "snow-dark": "#1f2937",
        "snow-light": "#f8fafc",
        "snow-bg": "#ffffff",
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        'aeonik': ['Aeonik', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'], 
        'aeonik-fono': ['AeonikFono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        'mono': ['"Anonymous Pro"', '"Roboto Mono"', "monospace"],
      },
      fontSize: {
        'headline-lg': ['120px', { lineHeight: '100%', letterSpacing: '-3%' }],
        'headline-md': ['85px', { lineHeight: '100%', letterSpacing: '-3%' }],
        'subhead-lg': ['38px', { lineHeight: '100%', letterSpacing: '-3%' }],
        'subhead-md': ['32px', { lineHeight: '100%', letterSpacing: '-3%' }],
        'body': ['16px', { lineHeight: '120%', letterSpacing: '-2%' }],
      },
      animation: {
        "neon-glow": "neon-glow 1.5s ease-in-out infinite alternate",
      },
      keyframes: {
        "neon-glow": {
          "0%": {
            "box-shadow": "0 0 5px #39FF14, 0 0 10px #39FF14, 0 0 15px #39FF14",
          },
          "100%": {
            "box-shadow":
              "0 0 10px #39FF14, 0 0 20px #39FF14, 0 0 30px #39FF14",
          },
        },
      },
    },
  },
  plugins: [],
};
