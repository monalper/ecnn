import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  FiDroplet, 
  FiType, 
  FiImage, 
  FiGrid, 
  FiCode, 
  FiCopy, 
  FiDownload,
  FiEye,
  FiEyeOff,
  FiRefreshCw,
  FiLayers,
  FiSquare,
  FiCircle,
  FiTriangle,
  FiPlus,
  FiX,
  FiCheck,
  FiSettings,
  FiZap,
  FiBox,
  FiLayout,
  FiSmartphone,
  FiMonitor
} from 'react-icons/fi';

const DesignerPage = () => {
  const [activeTab, setActiveTab] = useState('colors');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [gradientColors, setGradientColors] = useState(['#3B82F6', '#8B5CF6']);
  const [gradientType, setGradientType] = useState('linear');
  const [gradientAngle, setGradientAngle] = useState(90);
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLength, setPasswordLength] = useState(12);
  const [passwordOptions, setPasswordOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copiedText, setCopiedText] = useState('');

  // Color palette state
  const [colorPalette, setColorPalette] = useState([]);
  const [paletteName, setPaletteName] = useState('');

  // Typography state
  const [selectedFont, setSelectedFont] = useState('Inter');
  const [fontWeight, setFontWeight] = useState(400);

  // Shadow state
  const [shadowX, setShadowX] = useState(0);
  const [shadowY, setShadowY] = useState(4);
  const [shadowBlur, setShadowBlur] = useState(6);
  const [shadowSpread, setShadowSpread] = useState(0);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [shadowOpacity, setShadowOpacity] = useState(0.1);

  // Border radius state
  const [borderRadius, setBorderRadius] = useState(8);
  const [outerBorderRadius, setOuterBorderRadius] = useState(40);
  const [innerBorderRadius, setInnerBorderRadius] = useState(20);

  // Spacing state
  const [spacingValue, setSpacingValue] = useState(16);

  // Layout state
  const [containerWidth, setContainerWidth] = useState(1200);
  const [containerPadding, setContainerPadding] = useState(24);
  const [gridColumns, setGridColumns] = useState(12);
  const [gridGap, setGridGap] = useState(16);

  // Responsive state
  const [breakpoint, setBreakpoint] = useState('desktop');
  const [deviceWidth, setDeviceWidth] = useState(1920);

  // Color harmony state
  const [colorHarmony, setColorHarmony] = useState('complementary');
  const [harmonyColors, setHarmonyColors] = useState([]);

  const fonts = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Montserrat', 
    'Source Sans Pro', 'Ubuntu', 'Nunito', 'Playfair Display', 'Merriweather',
    'Work Sans', 'IBM Plex Sans', 'Noto Sans', 'Fira Sans', 'Source Code Pro'
  ];

  const fontWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900];

  const breakpoints = [
    { name: 'Mobile', width: 375, icon: <FiSmartphone /> },
    { name: 'Tablet', width: 768, icon: <FiMonitor /> },
    { name: 'Desktop', width: 1920, icon: <FiMonitor /> }
  ];

  const colorHarmonies = [
    { name: 'Complementary', value: 'complementary' },
    { name: 'Analogous', value: 'analogous' },
    { name: 'Triadic', value: 'triadic' },
    { name: 'Split Complementary', value: 'split-complementary' },
    { name: 'Monochromatic', value: 'monochromatic' }
  ];

  // Generate password
  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    if (passwordOptions.uppercase) chars += uppercase;
    if (passwordOptions.lowercase) chars += lowercase;
    if (passwordOptions.numbers) chars += numbers;
    if (passwordOptions.symbols) chars += symbols;

    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
  };

  // Copy to clipboard
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(''), 2000);
  };

  // Add color to palette
  const addToPalette = () => {
    if (selectedColor && !colorPalette.includes(selectedColor)) {
      setColorPalette([...colorPalette, selectedColor]);
    }
  };

  // Remove color from palette
  const removeFromPalette = (color) => {
    setColorPalette(colorPalette.filter(c => c !== color));
  };

  // Generate gradient CSS
  const getGradientCSS = () => {
    if (gradientType === 'linear') {
      return `linear-gradient(${gradientAngle}deg, ${gradientColors.join(', ')})`;
    } else {
      return `radial-gradient(circle, ${gradientColors.join(', ')})`;
    }
  };

  // Generate shadow CSS
  const getShadowCSS = () => {
    const rgbaColor = hexToRgba(shadowColor, shadowOpacity);
    return `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${rgbaColor}`;
  };

  // Convert hex to rgba
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Convert hex to hsl
  const hexToHsl = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };

  // Convert hsl to hex
  const hslToHex = (h, s, l) => {
    h /= 360;
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 1/6) {
      r = c; g = x; b = 0;
    } else if (1/6 <= h && h < 1/3) {
      r = x; g = c; b = 0;
    } else if (1/3 <= h && h < 1/2) {
      r = 0; g = c; b = x;
    } else if (1/2 <= h && h < 2/3) {
      r = 0; g = x; b = c;
    } else if (2/3 <= h && h < 5/6) {
      r = x; g = 0; b = c;
    } else if (5/6 <= h && h <= 1) {
      r = c; g = 0; b = x;
    }

    const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
    const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
    const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
  };

  // Generate color harmony
  const generateColorHarmony = () => {
    const [h, s, l] = hexToHsl(selectedColor);
    const colors = [];

    switch (colorHarmony) {
      case 'complementary':
        colors.push(hslToHex((h + 180) % 360, s, l));
        break;
      case 'analogous':
        colors.push(hslToHex((h + 30) % 360, s, l));
        colors.push(hslToHex((h - 30 + 360) % 360, s, l));
        break;
      case 'triadic':
        colors.push(hslToHex((h + 120) % 360, s, l));
        colors.push(hslToHex((h + 240) % 360, s, l));
        break;
      case 'split-complementary':
        colors.push(hslToHex((h + 150) % 360, s, l));
        colors.push(hslToHex((h + 210) % 360, s, l));
        break;
      case 'monochromatic':
        colors.push(hslToHex(h, s * 0.8, l));
        colors.push(hslToHex(h, s, l * 0.8));
        colors.push(hslToHex(h, s, l * 1.2));
        break;
    }

    setHarmonyColors(colors);
  };

  // Calculate optimal inner border radius
  const calculateInnerBorderRadius = () => {
    return Math.round(outerBorderRadius * 0.618);
  };

  // Calculate optimal spacing
  const calculateOptimalSpacing = () => {
    const baseSpacing = spacingValue;
    return {
      xs: Math.round(baseSpacing * 0.25),
      sm: Math.round(baseSpacing * 0.5),
      md: baseSpacing,
      lg: Math.round(baseSpacing * 1.5),
      xl: Math.round(baseSpacing * 2),
      xxl: Math.round(baseSpacing * 3)
    };
  };

  // Calculate typography scale
  const calculateTypographyScale = () => {
    const baseSize = fontSize;
    return {
      xs: Math.round(baseSize * 0.75),
      sm: Math.round(baseSize * 0.875),
      base: baseSize,
      lg: Math.round(baseSize * 1.125),
      xl: Math.round(baseSize * 1.25),
      '2xl': Math.round(baseSize * 1.5),
      '3xl': Math.round(baseSize * 1.875),
      '4xl': Math.round(baseSize * 2.25),
      '5xl': Math.round(baseSize * 3)
    };
  };

  // Generate spacing scale
  const generateSpacingScale = () => {
    const scale = [];
    for (let i = 0; i <= 10; i++) {
      scale.push(spacingValue * i);
    }
    return scale;
  };

  // Calculate contrast ratio
  const calculateContrastRatio = (color1, color2) => {
    const getLuminance = (hex) => {
      const rgb = hexToRgba(hex, 1).match(/\d+/g).map(Number);
      const [r, g, b] = rgb.map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return ratio.toFixed(2);
  };

  useEffect(() => {
    generatePassword();
  }, [passwordLength, passwordOptions]);

  useEffect(() => {
    generateColorHarmony();
  }, [selectedColor, colorHarmony]);

  useEffect(() => {
    setInnerBorderRadius(calculateInnerBorderRadius());
  }, [outerBorderRadius]);

  const tabs = [
    { id: 'colors', name: 'Renkler', icon: <FiDroplet /> },
    { id: 'typography', name: 'Tipografi', icon: <FiType /> },
    { id: 'gradients', name: 'Gradientler', icon: <FiDroplet /> },
    { id: 'shadows', name: 'Gölgeler', icon: <FiLayers /> },
    { id: 'spacing', name: 'Boşluklar', icon: <FiGrid /> },
    { id: 'layout', name: 'Layout', icon: <FiLayout /> },
    { id: 'responsive', name: 'Responsive', icon: <FiSmartphone /> },
    { id: 'calculator', name: 'Hesaplayıcı', icon: <FiZap /> },
    { id: 'passwords', name: 'Şifreler', icon: <FiEye /> },
    { id: 'code', name: 'CSS Kodları', icon: <FiCode /> }
  ];

  return (
    <>
      <Helmet>
        <title>Tasarım Araçları - OpenWall</title>
        <meta name="description" content="Tasarımcılar için gelişmiş renk seçici, gradient oluşturucu, tipografi araçları ve otomatik hesaplama özellikleri. Profesyonel tasarım araçları." />
        <meta name="keywords" content="tasarım araçları, renk seçici, gradient oluşturucu, tipografi, CSS araçları, otomatik hesaplama" />
        <link rel="canonical" href="https://openwall.com.tr/designer" />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6">
            <FiZap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Tasarım Araçları
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Tasarımcılar için gelişmiş araçlar. Renk uyumu, otomatik hesaplamalar ve profesyonel CSS kodları.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105'
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
          {/* Colors Tab */}
          {activeTab === 'colors' && (
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FiDroplet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Renk Seçici ve Uyum Analizi
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Renk seçimi, uyum analizi ve otomatik palet oluşturma
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Color Picker */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Renk Seçici
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <input
                          type="color"
                          value={selectedColor}
                          onChange={(e) => setSelectedColor(e.target.value)}
                          className="w-20 h-20 rounded-xl border-2 border-gray-300 dark:border-gray-600 cursor-pointer shadow-lg"
                        />
                        <div className="space-y-2">
                          <p className="font-mono text-sm text-gray-600 dark:text-gray-400">
                            HEX: {selectedColor}
                          </p>
                          <p className="font-mono text-sm text-gray-600 dark:text-gray-400">
                            RGB: {hexToRgba(selectedColor, 1).replace('rgba', 'rgb').replace(', 1)', ')')}
                          </p>
                          <p className="font-mono text-sm text-gray-600 dark:text-gray-400">
                            HSL: {hexToHsl(selectedColor).map(v => Math.round(v)).join(', ')}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={addToPalette}
                        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <FiPlus className="w-4 h-4" />
                        Palete Ekle
                      </button>
                    </div>
                  </div>

                  {/* Color Harmony */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Renk Uyumu
                    </h3>
                    <div className="space-y-4">
                      <select
                        value={colorHarmony}
                        onChange={(e) => setColorHarmony(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        {colorHarmonies.map(harmony => (
                          <option key={harmony.value} value={harmony.value}>{harmony.name}</option>
                        ))}
                      </select>
                      <div className="grid grid-cols-2 gap-2">
                        {harmonyColors.map((color, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded-lg">
                            <div 
                              className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600"
                              style={{ backgroundColor: color }}
                            />
                            <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                              {color}
                            </span>
                            <button
                              onClick={() => copyToClipboard(color, `harmony-${index}`)}
                              className="text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              {copiedText === `harmony-${index}` ? <FiCheck className="w-3 h-3" /> : <FiCopy className="w-3 h-3" />}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Color Palette */}
                <div className="xl:col-span-2">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Renk Paleti
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {colorPalette.map((color, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                          <div 
                            className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-lg"
                            style={{ backgroundColor: color }}
                          />
                          <div className="flex-1">
                            <span className="font-mono text-sm text-gray-600 dark:text-gray-400 block">
                              {color}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                              Contrast: {calculateContrastRatio(color, '#FFFFFF')}:1
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => copyToClipboard(color, `color-${index}`)}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                              {copiedText === `color-${index}` ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => removeFromPalette(color)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {colorPalette.length === 0 && (
                        <div className="col-span-full text-center py-8">
                          <FiBox className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500 dark:text-gray-400">
                            Henüz renk eklenmemiş. Renk seçiciyi kullanarak palete renk ekleyin.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Calculator Tab */}
          {activeTab === 'calculator' && (
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <FiZap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Otomatik Hesaplayıcı
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Tasarım değerlerini otomatik hesaplayın ve öneriler alın
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Border Radius Calculator */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Border Radius Hesaplayıcı
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Dış Border Radius: {outerBorderRadius}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={outerBorderRadius}
                        onChange={(e) => setOuterBorderRadius(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Önerilen İç Border Radius</h4>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {innerBorderRadius}px
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Altın oran (0.618) kullanılarak hesaplandı
                      </p>
                    </div>
                    <div className="flex items-center justify-center h-32 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <div 
                        className="w-20 h-20 bg-blue-500 rounded-lg"
                        style={{ borderRadius: `${outerBorderRadius}px` }}
                      >
                        <div 
                          className="w-12 h-12 bg-white rounded-lg m-2"
                          style={{ borderRadius: `${innerBorderRadius}px` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Spacing Calculator */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Boşluk Ölçeği Hesaplayıcı
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Temel Değer: {spacingValue}px
                      </label>
                      <input
                        type="range"
                        min="4"
                        max="32"
                        step="2"
                        value={spacingValue}
                        onChange={(e) => setSpacingValue(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Önerilen Boşluk Değerleri</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(calculateOptimalSpacing()).map(([size, value]) => (
                          <div key={size} className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase">
                              {size}
                            </span>
                            <span className="font-mono text-sm text-gray-900 dark:text-white">
                              {value}px
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Typography Calculator */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Tipografi Ölçeği Hesaplayıcı
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Temel Font Boyutu: {fontSize}px
                      </label>
                      <input
                        type="range"
                        min="12"
                        max="24"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Önerilen Font Boyutları</h4>
                      <div className="space-y-2">
                        {Object.entries(calculateTypographyScale()).map(([size, value]) => (
                          <div key={size} className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {size}
                            </span>
                            <span 
                              className="font-mono text-sm text-gray-900 dark:text-white"
                              style={{ fontSize: `${value}px` }}
                            >
                              {value}px
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contrast Calculator */}
                <div className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Kontrast Hesaplayıcı
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Arka Plan Rengi
                        </label>
                        <input
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Metin Rengi
                        </label>
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          {calculateContrastRatio(backgroundColor, textColor)}:1
                        </div>
                        <div 
                          className="p-4 rounded-lg mb-3"
                          style={{ backgroundColor, color: textColor }}
                        >
                          Örnek Metin
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {parseFloat(calculateContrastRatio(backgroundColor, textColor)) >= 4.5 
                            ? '✅ WCAG AA uyumlu' 
                            : '❌ WCAG AA uyumlu değil'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Typography Tab */}
          {activeTab === 'typography' && (
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <FiType className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Tipografi Araçları
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Font seçimi, boyutlandırma ve tipografi ölçeklendirme
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Typography Controls */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Font Ayarları
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Font Ailesi
                        </label>
                        <select
                          value={selectedFont}
                          onChange={(e) => setSelectedFont(e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          {fonts.map(font => (
                            <option key={font} value={font}>{font}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Font Boyutu: {fontSize}px
                        </label>
                        <input
                          type="range"
                          min="8"
                          max="72"
                          value={fontSize}
                          onChange={(e) => setFontSize(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Font Kalınlığı
                        </label>
                        <select
                          value={fontWeight}
                          onChange={(e) => setFontWeight(parseInt(e.target.value))}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          {fontWeights.map(weight => (
                            <option key={weight} value={weight}>{weight}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Satır Yüksekliği: {lineHeight}
                        </label>
                        <input
                          type="range"
                          min="0.5"
                          max="3"
                          step="0.1"
                          value={lineHeight}
                          onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Harf Aralığı: {letterSpacing}px
                        </label>
                        <input
                          type="range"
                          min="-2"
                          max="10"
                          step="0.5"
                          value={letterSpacing}
                          onChange={(e) => setLetterSpacing(parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Metin Rengi
                          </label>
                          <input
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Arka Plan Rengi
                          </label>
                          <input
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Typography Preview */}
                <div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Önizleme
                    </h3>
                    <div 
                      className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700"
                      style={{
                        backgroundColor,
                        fontFamily: selectedFont,
                        fontSize: `${fontSize}px`,
                        fontWeight,
                        lineHeight,
                        letterSpacing: `${letterSpacing}px`,
                        color: textColor
                      }}
                    >
                      <h1 style={{ fontSize: `${fontSize * 2}px`, fontWeight, lineHeight, letterSpacing: `${letterSpacing}px` }}>
                        Başlık 1
                      </h1>
                      <h2 style={{ fontSize: `${fontSize * 1.5}px`, fontWeight, lineHeight, letterSpacing: `${letterSpacing}px` }}>
                        Başlık 2
                      </h2>
                      <p>
                        Bu bir örnek paragraftır. Seçtiğiniz tipografi ayarları burada görüntülenir. 
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                        incididunt ut labore et dolore magna aliqua.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gradients Tab */}
          {activeTab === 'gradients' && (
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-600 rounded-xl flex items-center justify-center">
                  <FiDroplet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Gradient Oluşturucu
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Linear ve radial gradient oluşturma araçları
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Gradient Controls */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Gradient Ayarları
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Gradient Tipi
                        </label>
                        <select
                          value={gradientType}
                          onChange={(e) => setGradientType(e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="linear">Linear Gradient</option>
                          <option value="radial">Radial Gradient</option>
                        </select>
                      </div>

                      {gradientType === 'linear' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Açı: {gradientAngle}°
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            value={gradientAngle}
                            onChange={(e) => setGradientAngle(parseInt(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Renkler
                        </label>
                        <div className="space-y-2">
                          {gradientColors.map((color, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <input
                                type="color"
                                value={color}
                                onChange={(e) => {
                                  const newColors = [...gradientColors];
                                  newColors[index] = e.target.value;
                                  setGradientColors(newColors);
                                }}
                                className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
                              />
                              <span className="font-mono text-sm text-gray-600 dark:text-gray-400 flex-1">
                                {color}
                              </span>
                              {gradientColors.length > 2 && (
                                <button
                                  onClick={() => {
                                    const newColors = gradientColors.filter((_, i) => i !== index);
                                    setGradientColors(newColors);
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <FiX className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            onClick={() => setGradientColors([...gradientColors, '#000000'])}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            + Renk Ekle
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gradient Preview */}
                <div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Önizleme ve CSS Kodu
                    </h3>
                    <div 
                      className="w-full h-48 rounded-lg border border-gray-200 dark:border-gray-700 mb-4"
                      style={{ background: getGradientCSS() }}
                    />
                    <div className="relative">
                      <textarea
                        value={`background: ${getGradientCSS()};`}
                        readOnly
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                        rows="3"
                      />
                      <button
                        onClick={() => copyToClipboard(`background: ${getGradientCSS()};`, 'gradient')}
                        className="absolute top-2 right-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        {copiedText === 'gradient' ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shadows Tab */}
          {activeTab === 'shadows' && (
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-700 rounded-xl flex items-center justify-center">
                  <FiLayers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Gölge Oluşturucu
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Box-shadow ve text-shadow oluşturma araçları
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Shadow Controls */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Gölge Ayarları
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          X Offset: {shadowX}px
                        </label>
                        <input
                          type="range"
                          min="-20"
                          max="20"
                          value={shadowX}
                          onChange={(e) => setShadowX(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Y Offset: {shadowY}px
                        </label>
                        <input
                          type="range"
                          min="-20"
                          max="20"
                          value={shadowY}
                          onChange={(e) => setShadowY(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Blur: {shadowBlur}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={shadowBlur}
                          onChange={(e) => setShadowBlur(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Spread: {shadowSpread}px
                        </label>
                        <input
                          type="range"
                          min="-20"
                          max="20"
                          value={shadowSpread}
                          onChange={(e) => setShadowSpread(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Gölge Rengi
                          </label>
                          <input
                            type="color"
                            value={shadowColor}
                            onChange={(e) => setShadowColor(e.target.value)}
                            className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Opaklık: {shadowOpacity}
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={shadowOpacity}
                            onChange={(e) => setShadowOpacity(parseFloat(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shadow Preview */}
                <div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Önizleme ve CSS Kodu
                    </h3>
                    <div className="flex items-center justify-center h-48 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4">
                      <div 
                        className="w-24 h-24 bg-white dark:bg-gray-800 rounded-lg"
                        style={{ boxShadow: getShadowCSS() }}
                      />
                    </div>
                    <div className="relative">
                      <textarea
                        value={`box-shadow: ${getShadowCSS()};`}
                        readOnly
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                        rows="3"
                      />
                      <button
                        onClick={() => copyToClipboard(`box-shadow: ${getShadowCSS()};`, 'shadow')}
                        className="absolute top-2 right-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        {copiedText === 'shadow' ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Spacing Tab */}
          {activeTab === 'spacing' && (
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <FiGrid className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Boşluk Ölçeği Oluşturucu
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Spacing ve border radius ölçeklendirme araçları
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Spacing Controls */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Boşluk Ayarları
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Temel Değer: {spacingValue}px
                        </label>
                        <input
                          type="range"
                          min="4"
                          max="32"
                          step="2"
                          value={spacingValue}
                          onChange={(e) => setSpacingValue(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Border Radius: {borderRadius}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={borderRadius}
                          onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Spacing Scale */}
                <div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Boşluk Ölçeği
                    </h3>
                    <div className="space-y-2">
                      {generateSpacingScale().map((value, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-white dark:bg-gray-700 rounded">
                          <div 
                            className="bg-blue-500 rounded"
                            style={{ 
                              width: `${value}px`, 
                              height: '20px',
                              borderRadius: `${borderRadius}px`
                            }}
                          />
                          <span className="font-mono text-sm text-gray-600 dark:text-gray-400 min-w-[60px]">
                            {value}px
                          </span>
                          <button
                            onClick={() => copyToClipboard(`${value}px`, `spacing-${index}`)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            {copiedText === `spacing-${index}` ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Layout Tab */}
          {activeTab === 'layout' && (
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <FiLayout className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Layout Araçları
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Container, grid ve layout yönetimi araçları
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Layout Controls */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Layout Ayarları
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Container Genişliği: {containerWidth}px
                        </label>
                        <input
                          type="range"
                          min="600"
                          max="2000"
                          value={containerWidth}
                          onChange={(e) => setContainerWidth(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Container Padding: {containerPadding}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={containerPadding}
                          onChange={(e) => setContainerPadding(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Grid Sütun Sayısı: {gridColumns}
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="24"
                          value={gridColumns}
                          onChange={(e) => setGridColumns(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Grid Boşluğu: {gridGap}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={gridGap}
                          onChange={(e) => setGridGap(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Layout Preview */}
                <div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Önizleme
                    </h3>
                    <div 
                      className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700"
                      style={{
                        width: `${containerWidth}px`,
                        padding: `${containerPadding}px`,
                        backgroundColor,
                        color: textColor
                      }}
                    >
                      <div 
                        className="grid" 
                        style={{
                          gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
                          gap: `${gridGap}px`
                        }}
                      >
                        {Array.from({ length: 12 }).map((_, index) => (
                          <div key={index} className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
                            Kolon {index + 1}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Responsive Tab */}
          {activeTab === 'responsive' && (
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <FiSmartphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Responsive Tasarım Araçları
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Farklı cihaz boyutları için tasarım kontrolü
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Responsive Controls */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Cihaz Ayarları
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Cihaz Genişliği: {deviceWidth}px
                        </label>
                        <input
                          type="range"
                          min="300"
                          max="2500"
                          value={deviceWidth}
                          onChange={(e) => setDeviceWidth(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Mevcut Cihaz
                        </label>
                        <select
                          value={breakpoint}
                          onChange={(e) => setBreakpoint(e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          {breakpoints.map(bp => (
                            <option key={bp.name} value={bp.name}>
                              {bp.name} ({bp.width}px)
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Responsive Preview */}
                <div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Önizleme
                    </h3>
                    <div 
                      className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700"
                      style={{
                        width: `${deviceWidth}px`,
                        backgroundColor,
                        color: textColor
                      }}
                    >
                      <h1 className="text-4xl font-bold mb-4">
                        Başlık
                      </h1>
                      <p className="text-lg mb-4">
                        Bu bir örnek paragraftır. Responsive tasarımda farklı cihazlarda görünümünüzü kontrol edebilirsiniz.
                      </p>
                      <p className="text-base">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                        incididunt ut labore et dolore magna aliqua.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Passwords Tab */}
          {activeTab === 'passwords' && (
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <FiEye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Şifre Oluşturucu
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Güçlü ve güvenli şifre oluşturma araçları
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Password Controls */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Şifre Ayarları
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Şifre Uzunluğu: {passwordLength}
                        </label>
                        <input
                          type="range"
                          min="4"
                          max="64"
                          value={passwordLength}
                          onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Karakter Türleri
                        </label>
                        <div className="space-y-2">
                          {Object.entries(passwordOptions).map(([key, value]) => (
                            <label key={key} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => setPasswordOptions({
                                  ...passwordOptions,
                                  [key]: e.target.checked
                                })}
                                className="rounded"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {key === 'uppercase' && 'Büyük Harfler (A-Z)'}
                                {key === 'lowercase' && 'Küçük Harfler (a-z)'}
                                {key === 'numbers' && 'Sayılar (0-9)'}
                                {key === 'symbols' && 'Semboller (!@#$%^&*)'}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={generatePassword}
                        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <FiRefreshCw className="w-4 h-4" />
                        Yeni Şifre Oluştur
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Display */}
                <div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Oluşturulan Şifre
                    </h3>
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={generatedPassword}
                          readOnly
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                        </button>
                      </div>
                      <button
                        onClick={() => copyToClipboard(generatedPassword, 'password')}
                        className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        {copiedText === 'password' ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                        Şifreyi Kopyala
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Code Tab */}
          {activeTab === 'code' && (
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <FiCode className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    CSS Kod Üretici
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Tüm tasarım ayarlarından CSS kodları oluşturma
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Tipografi CSS
                    </h3>
                    <div className="relative">
                      <textarea
                        value={`font-family: ${selectedFont}, sans-serif;
font-size: ${fontSize}px;
font-weight: ${fontWeight};
line-height: ${lineHeight};
letter-spacing: ${letterSpacing}px;
color: ${textColor};`}
                        readOnly
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                        rows="6"
                      />
                      <button
                        onClick={() => copyToClipboard(`font-family: ${selectedFont}, sans-serif;
font-size: ${fontSize}px;
font-weight: ${fontWeight};
line-height: ${lineHeight};
letter-spacing: ${letterSpacing}px;
color: ${textColor};`, 'typography')}
                        className="absolute top-2 right-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        {copiedText === 'typography' ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Gradient CSS
                    </h3>
                    <div className="relative">
                      <textarea
                        value={`background: ${getGradientCSS()};`}
                        readOnly
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                        rows="6"
                      />
                      <button
                        onClick={() => copyToClipboard(`background: ${getGradientCSS()};`, 'gradient-code')}
                        className="absolute top-2 right-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        {copiedText === 'gradient-code' ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Gölge CSS
                    </h3>
                    <div className="relative">
                      <textarea
                        value={`box-shadow: ${getShadowCSS()};`}
                        readOnly
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                        rows="6"
                      />
                      <button
                        onClick={() => copyToClipboard(`box-shadow: ${getShadowCSS()};`, 'shadow-code')}
                        className="absolute top-2 right-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        {copiedText === 'shadow-code' ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Boşluk CSS
                    </h3>
                    <div className="relative">
                      <textarea
                        value={`padding: ${spacingValue}px;
margin: ${spacingValue}px;
border-radius: ${borderRadius}px;`}
                        readOnly
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                        rows="6"
                      />
                      <button
                        onClick={() => copyToClipboard(`padding: ${spacingValue}px;
margin: ${spacingValue}px;
border-radius: ${borderRadius}px;`, 'spacing-code')}
                        className="absolute top-2 right-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        {copiedText === 'spacing-code' ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DesignerPage; 