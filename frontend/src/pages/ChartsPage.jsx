import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut, Pie, Radar, PolarArea } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import {
  FiBarChart,
  FiPieChart,
  FiTrendingUp,
  FiDownload,
  FiSettings,
  FiPlus,
  FiTrash2,
  FiCopy,
  FiCheck,
  FiZap,
  FiImage,
  FiGrid,
  FiType,
  FiUpload,
  FiSave,
  FiRefreshCw,
  FiEye,
  FiEyeOff,
  FiRotateCw,
  FiLayers,
  FiDroplet,
  FiTarget,
  FiTrendingDown,
  FiActivity
} from 'react-icons/fi';

// Chart.js bileşenlerini kaydet
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ChartsPage = () => {
  const chartRef = useRef(null);
  const fileInputRef = useRef(null);
  const [chartType, setChartType] = useState('line');
  const [chartTitle, setChartTitle] = useState('Grafik Başlığı');
  const [showLegend, setShowLegend] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [gradientFill, setGradientFill] = useState(false);
  const [borderRadius, setBorderRadius] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('custom');
  
  const [chartData, setChartData] = useState({
    labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
    datasets: [
      {
        label: 'Veri Seti 1',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
        fill: false,
      },
      {
        label: 'Veri Seti 2',
        data: [8, 15, 7, 12, 9, 11],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
        fill: false,
      },
    ],
  });

  // Grafik şablonları
  const chartTemplates = {
    custom: { name: 'Özel', data: chartData },
    sales: {
      name: 'Satış Raporu',
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
          {
            label: 'Satışlar',
            data: [12000, 19000, 15000, 25000],
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            tension: 0.4,
            fill: true,
          }
        ],
      }
    },
    analytics: {
      name: 'Web Analytics',
      data: {
        labels: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
        datasets: [
          {
            label: 'Ziyaretçi',
            data: [1200, 1900, 3000, 5000, 2000, 3000, 4000],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            tension: 0.1,
            fill: false,
          },
          {
            label: 'Sayfa Görüntüleme',
            data: [800, 1500, 2700, 4200, 1900, 2800, 3500],
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            tension: 0.1,
            fill: false,
          }
        ],
      }
    },
    finance: {
      name: 'Finansal Veriler',
      data: {
        labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
        datasets: [
          {
            label: 'Gelir',
            data: [45000, 52000, 48000, 61000, 55000, 67000],
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.5)',
            tension: 0.3,
            fill: true,
          },
          {
            label: 'Gider',
            data: [32000, 38000, 35000, 42000, 39000, 45000],
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.5)',
            tension: 0.3,
            fill: true,
          }
        ],
      }
    },
    survey: {
      name: 'Anket Sonuçları',
      data: {
        labels: ['Çok Memnun', 'Memnun', 'Orta', 'Memnun Değil', 'Hiç Memnun Değil'],
        datasets: [
          {
            label: 'Müşteri Memnuniyeti',
            data: [35, 25, 20, 15, 5],
            borderColor: 'rgb(153, 102, 255)',
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(251, 191, 36, 0.8)',
              'rgba(249, 115, 22, 0.8)',
              'rgba(239, 68, 68, 0.8)',
            ],
            borderWidth: 2,
          }
        ],
      }
    }
  };

  // Grafik ayarları
  const [chartOptions, setChartOptions] = useState({
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: 2,
    animation: {
      duration: animations ? 1000 : 0,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: {
        position: 'top',
        display: showLegend,
        labels: {
          font: {
            size: 14,
            weight: 'bold',
          },
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'Grafik Başlığı',
        font: {
          size: 18,
          weight: 'bold',
        },
        color: '#333',
        padding: {
          top: 10,
          bottom: 10,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: showGrid ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
          lineWidth: 1,
        },
        ticks: {
          color: '#666',
          font: {
            size: 12,
            weight: '500',
          },
          padding: 8,
        },
        title: {
          display: false,
        },
      },
      x: {
        grid: {
          color: showGrid ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
          lineWidth: 1,
        },
        ticks: {
          color: '#666',
          font: {
            size: 12,
            weight: '500',
          },
          padding: 8,
        },
        title: {
          display: false,
        },
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
        borderWidth: 2,
      },
      line: {
        borderWidth: 2,
        tension: 0.1,
      },
      bar: {
        borderWidth: 1,
        borderRadius: borderRadius,
      },
    },
  });

  // Renk paleti
  const colorPalette = [
    'rgb(75, 192, 192)',
    'rgb(255, 99, 132)',
    'rgb(54, 162, 235)',
    'rgb(255, 205, 86)',
    'rgb(153, 102, 255)',
    'rgb(255, 159, 64)',
    'rgb(199, 199, 199)',
    'rgb(83, 102, 255)',
    'rgb(78, 252, 3)',
    'rgb(252, 3, 244)',
  ];

  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#333333');
  const [gridColor, setGridColor] = useState('rgba(0, 0, 0, 0.1)');
  const [copiedText, setCopiedText] = useState('');

  // Grafik türleri
  const chartTypes = [
    { id: 'line', name: 'Çizgi Grafik', icon: <FiTrendingUp /> },
    { id: 'bar', name: 'Sütun Grafik', icon: <FiBarChart /> },
    { id: 'doughnut', name: 'Halka Grafik', icon: <FiPieChart /> },
    { id: 'pie', name: 'Pasta Grafik', icon: <FiPieChart /> },
    { id: 'radar', name: 'Radar Grafik', icon: <FiTarget /> },
    { id: 'polarArea', name: 'Kutup Alanı', icon: <FiActivity /> },
  ];

  // Şablon uygula
  const applyTemplate = (templateKey) => {
    if (templateKey === 'custom') return;
    
    const template = chartTemplates[templateKey];
    if (template) {
      setChartData(template.data);
      setSelectedTemplate(templateKey);
      setChartTitle(template.name);
    }
  };

  // Veri import
  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setChartData(data);
        } catch (error) {
          alert('Geçersiz JSON dosyası!');
        }
      };
      reader.readAsText(file);
    }
  };

  // Veri export
  const exportData = () => {
    const dataStr = JSON.stringify(chartData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'grafik-verisi.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Rastgele veri oluştur
  const generateRandomData = () => {
    const labels = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'];
    const datasets = [
      {
        label: 'Veri Seti 1',
        data: Array.from({ length: labels.length }, () => Math.floor(Math.random() * 100) + 1),
        borderColor: colorPalette[0],
        backgroundColor: colorPalette[0].replace('rgb', 'rgba').replace(')', ', 0.5)'),
        tension: 0.1,
        fill: gradientFill,
      },
      {
        label: 'Veri Seti 2',
        data: Array.from({ length: labels.length }, () => Math.floor(Math.random() * 100) + 1),
        borderColor: colorPalette[1],
        backgroundColor: colorPalette[1].replace('rgb', 'rgba').replace(')', ', 0.5)'),
        tension: 0.1,
        fill: gradientFill,
      },
    ];
    setChartData({ labels, datasets });
  };

  // Veri seti ekleme
  const addDataset = () => {
    const newDataset = {
      label: `Veri Seti ${chartData.datasets.length + 1}`,
      data: Array.from({ length: chartData.labels.length }, () => Math.floor(Math.random() * 20) + 1),
      borderColor: colorPalette[chartData.datasets.length % colorPalette.length],
      backgroundColor: colorPalette[chartData.datasets.length % colorPalette.length].replace('rgb', 'rgba').replace(')', ', 0.5)'),
      tension: 0.1,
      fill: gradientFill,
    };

    setChartData({
      ...chartData,
      datasets: [...chartData.datasets, newDataset],
    });
  };

  // Veri seti silme
  const removeDataset = (index) => {
    const newDatasets = chartData.datasets.filter((_, i) => i !== index);
    setChartData({
      ...chartData,
      datasets: newDatasets,
    });
  };

  // Veri güncelleme
  const updateData = (datasetIndex, dataIndex, value) => {
    const newDatasets = [...chartData.datasets];
    newDatasets[datasetIndex].data[dataIndex] = parseFloat(value) || 0;
    setChartData({
      ...chartData,
      datasets: newDatasets,
    });
  };

  // Etiket güncelleme
  const updateLabel = (index, value) => {
    const newLabels = [...chartData.labels];
    newLabels[index] = value;
    setChartData({
      ...chartData,
      labels: newLabels,
    });
  };

  // Etiket ekleme
  const addLabel = () => {
    const newLabels = [...chartData.labels, `Etiket ${chartData.labels.length + 1}`];
    const newDatasets = chartData.datasets.map(dataset => ({
      ...dataset,
      data: [...dataset.data, Math.floor(Math.random() * 20) + 1],
    }));
    setChartData({
      labels: newLabels,
      datasets: newDatasets,
    });
  };

  // Etiket silme
  const removeLabel = (index) => {
    const newLabels = chartData.labels.filter((_, i) => i !== index);
    const newDatasets = chartData.datasets.map(dataset => ({
      ...dataset,
      data: dataset.data.filter((_, i) => i !== index),
    }));
    setChartData({
      labels: newLabels,
      datasets: newDatasets,
    });
  };

  // Renk değiştirme
  const updateColor = (datasetIndex, color) => {
    const newDatasets = [...chartData.datasets];
    newDatasets[datasetIndex].borderColor = color;
    newDatasets[datasetIndex].backgroundColor = color.replace('rgb', 'rgba').replace(')', ', 0.5)');
    setChartData({
      ...chartData,
      datasets: newDatasets,
    });
  };

  // Grafik indirme
  const downloadChart = async (format) => {
    try {
      // Chart.js canvas'ını bul
      const chartCanvas = document.querySelector('.chart-container canvas');
      if (!chartCanvas) {
        console.error('Grafik canvas bulunamadı');
        return;
      }

      // Yeni bir canvas oluştur
      const downloadCanvas = document.createElement('canvas');
      const ctx = downloadCanvas.getContext('2d');
      
      // Yüksek çözünürlük için boyutları artır
      const scale = 3;
      downloadCanvas.width = chartCanvas.width * scale;
      downloadCanvas.height = chartCanvas.height * scale;
      
      // Canvas kalitesini artır
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Arka plan rengini ayarla
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, downloadCanvas.width, downloadCanvas.height);
      
      // Grafik canvas'ını yüksek çözünürlükte çiz
      ctx.scale(scale, scale);
      ctx.drawImage(chartCanvas, 0, 0);
      
      // İndirme linki oluştur
      const link = document.createElement('a');
      link.download = `grafik-yuksek-kalite.${format}`;
      
      // Kalite ayarları
      if (format === 'jpeg') {
        link.href = downloadCanvas.toDataURL(`image/jpeg`, 0.95);
      } else {
        link.href = downloadCanvas.toDataURL(`image/png`);
      }
      
      link.click();
    } catch (error) {
      console.error('Grafik indirme hatası:', error);
    }
  };

  // CSS kodu kopyalama
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(''), 2000);
  };

  // Grafik ayarlarını güncelle
  useEffect(() => {
    setChartOptions({
      ...chartOptions,
      animation: {
        duration: animations ? 1000 : 0,
        easing: 'easeInOutQuart',
      },
      plugins: {
        ...chartOptions.plugins,
        legend: {
          ...chartOptions.plugins.legend,
          display: showLegend,
        },
        title: {
          ...chartOptions.plugins.title,
          text: chartTitle,
          color: textColor,
        },
      },
      scales: {
        y: {
          ...chartOptions.scales.y,
          grid: {
            color: showGrid ? gridColor : 'transparent',
          },
          ticks: {
            color: textColor,
          },
        },
        x: {
          ...chartOptions.scales.x,
          grid: {
            color: showGrid ? gridColor : 'transparent',
          },
          ticks: {
            color: textColor,
          },
        },
      },
      elements: {
        ...chartOptions.elements,
        bar: {
          ...chartOptions.elements.bar,
          borderRadius: borderRadius,
        },
      },
    });
  }, [chartTitle, textColor, gridColor, showLegend, showGrid, animations, borderRadius]);

  // Gradient fill değişikliğini uygula
  useEffect(() => {
    const newDatasets = chartData.datasets.map(dataset => ({
      ...dataset,
      fill: gradientFill,
    }));
    setChartData({
      ...chartData,
      datasets: newDatasets,
    });
  }, [gradientFill]);

  // Grafik bileşenini render et
  const renderChart = () => {
    const commonProps = {
      data: chartData,
      options: chartOptions,
    };

    switch (chartType) {
      case 'line':
        return <Line {...commonProps} ref={chartRef} />;
      case 'bar':
        return <Bar {...commonProps} ref={chartRef} />;
      case 'doughnut':
        return <Doughnut {...commonProps} ref={chartRef} />;
      case 'pie':
        return <Pie {...commonProps} ref={chartRef} />;
      case 'radar':
        return <Radar {...commonProps} ref={chartRef} />;
      case 'polarArea':
        return <PolarArea {...commonProps} ref={chartRef} />;
      default:
        return <Line {...commonProps} ref={chartRef} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Grafik Oluşturucu - OpenWall</title>
        <meta name="description" content="Interaktif grafikler oluşturun ve PNG/JPG formatında indirin. Chart.js ile profesyonel grafik araçları." />
        <meta name="keywords" content="grafik oluşturucu, chart.js, veri görselleştirme, grafik indirme" />
        <link rel="canonical" href="https://openwall.com.tr/charts" />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mb-6">
            <FiBarChart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Grafik Oluşturucu
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Interaktif grafikler oluşturun, özelleştirin ve PNG/JPG formatında indirin
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Sol Panel - Temel Kontroller */}
          <div className="xl:col-span-1 space-y-6">
            {/* Grafik Şablonları - En üstte, hızlı başlangıç için */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiLayers className="w-5 h-5" />
                Hızlı Başlangıç
              </h3>
              <div className="space-y-2">
                {Object.entries(chartTemplates).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => applyTemplate(key)}
                    className={`w-full p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedTemplate === key
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Grafik Türü - İkinci sırada, temel seçim */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiSettings className="w-5 h-5" />
                Grafik Türü
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {chartTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setChartType(type.id)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      chartType === type.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {type.icon}
                      <span className="hidden sm:inline">{type.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Veri İşlemleri - Üçüncü sırada, veri yönetimi */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiRefreshCw className="w-5 h-5" />
                Veri Yönetimi
              </h3>
              <div className="space-y-3">
                <button
                  onClick={generateRandomData}
                  className="w-full inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  <FiZap className="w-4 h-4" />
                  Rastgele Veri
                </button>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  <FiUpload className="w-4 h-4" />
                  Veri İçe Aktar
                </button>
                
                <button
                  onClick={exportData}
                  className="w-full inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  <FiDownload className="w-4 h-4" />
                  Veri Dışa Aktar
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </div>

            {/* İndirme Seçenekleri - Dördüncü sırada, sonuç */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiDownload className="w-5 h-5" />
                Grafik İndir
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => downloadChart('png')}
                  className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  <FiImage className="w-4 h-4" />
                  PNG İndir
                </button>
                <button
                  onClick={() => downloadChart('jpeg')}
                  className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  <FiImage className="w-4 h-4" />
                  JPG İndir
                </button>
              </div>
            </div>
          </div>

          {/* Orta Panel - Grafik Önizleme */}
          <div className="xl:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div 
                className="w-full h-[500px] relative chart-container"
                style={{ backgroundColor }}
              >
                {renderChart()}
              </div>
            </div>
          </div>

          {/* Sağ Panel - Detaylı Ayarlar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Grafik Ayarları - En üstte, temel ayarlar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiType className="w-5 h-5" />
                Grafik Ayarları
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Grafik Başlığı
                  </label>
                  <input
                    type="text"
                    value={chartTitle}
                    onChange={(e) => setChartTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                    Izgara Rengi
                  </label>
                  <input
                    type="color"
                    value={gridColor.replace('rgba(0, 0, 0, 0.1)', '#000000')}
                    onChange={(e) => {
                      const color = e.target.value;
                      const rgba = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.1)`;
                      setGridColor(rgba);
                    }}
                    className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Görünüm Ayarları - İkinci sırada, görsel kontroller */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiEye className="w-5 h-5" />
                Görünüm Ayarları
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Legend Göster
                  </label>
                  <button
                    onClick={() => setShowLegend(!showLegend)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      showLegend ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      showLegend ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Izgara Göster
                  </label>
                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      showGrid ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      showGrid ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Animasyonlar
                  </label>
                  <button
                    onClick={() => setAnimations(!animations)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      animations ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      animations ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Gradient Dolgu
                  </label>
                  <button
                    onClick={() => setGradientFill(!gradientFill)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      gradientFill ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      gradientFill ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Border Radius: {borderRadius}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Veri Düzenleme - Üçüncü sırada, veri girişi */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Etiketler
                </h3>
                <button
                  onClick={addLabel}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {chartData.labels.map((label, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={label}
                      onChange={(e) => updateLabel(index, e.target.value)}
                      className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => removeLabel(index)}
                      className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    >
                      <FiTrash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Veri Setleri - En altta, detaylı veri düzenleme */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Veri Setleri
                </h3>
                <button
                  onClick={addDataset}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4 max-h-48 overflow-y-auto">
                {chartData.datasets.map((dataset, datasetIndex) => (
                  <div key={datasetIndex} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <input
                        type="text"
                        value={dataset.label}
                        onChange={(e) => {
                          const newDatasets = [...chartData.datasets];
                          newDatasets[datasetIndex].label = e.target.value;
                          setChartData({ ...chartData, datasets: newDatasets });
                        }}
                        className="flex-1 p-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <div className="flex items-center gap-1">
                        <input
                          type="color"
                          value={dataset.borderColor}
                          onChange={(e) => updateColor(datasetIndex, e.target.value)}
                          className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                        />
                        <button
                          onClick={() => removeDataset(datasetIndex)}
                          className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <FiTrash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {dataset.data.map((value, dataIndex) => (
                        <input
                          key={dataIndex}
                          type="number"
                          value={value}
                          onChange={(e) => updateData(datasetIndex, dataIndex, e.target.value)}
                          className="p-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="0"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChartsPage; 