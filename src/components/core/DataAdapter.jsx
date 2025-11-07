// Mock Data Adapter - Exact colors and data from Figma reference
class DataAdapter {
  constructor() {
    this.baseDelay = 200;
  }

  async delay() {
    await new Promise(resolve => setTimeout(resolve, this.baseDelay));
  }

  async getPulseToday() {
    await this.delay();
    return {
      score: 68,
      trend: "up",
      blurb: "Markets steady amid earnings; tech leading with bond yields stable.",
      drivers: {
        macro: "Fed pause likely; core PCE cooling suggests peak policy rate",
        sector: "Technology +1.2%, Energy -0.8%, Healthcare +0.3%",
        volatility: "VIX 13.4 (-2.1%); calm conditions expected through week"
      },
      catalysts: [
        { event: "CPI Data Release", date: "2024-01-12", impact: "high" },
        { event: "MSFT Earnings", date: "2024-01-24", impact: "medium" },
        { event: "Fed Speakers", date: "2024-01-15", impact: "medium" }
      ]
    };
  }

  async getMarketsOverview() {
    await this.delay();
    return [
      { 
        id: "SPX", 
        label: "S&P 500", 
        price: 5172.34, 
        deltaPct: 0.42, 
        spark: [5150, 5162, 5158, 5169, 5172],
        sentiment: 0.65
      },
      { 
        id: "NDX", 
        label: "NASDAQ", 
        price: 18123.9, 
        deltaPct: 0.31, 
        spark: [18080, 18095, 18110, 18118, 18124],
        sentiment: 0.72
      },
      { 
        id: "VIX", 
        label: "VIX", 
        price: 13.45, 
        deltaPct: -2.12, 
        spark: [14.2, 13.8, 13.6, 13.5, 13.45],
        sentiment: 0.45
      },
      { 
        id: "TNX", 
        label: "US 10Y", 
        price: 4.23, 
        deltaPct: 0.05, 
        spark: [4.21, 4.22, 4.22, 4.23, 4.23],
        sentiment: 0.55
      },
      { 
        id: "CL", 
        label: "Crude Oil", 
        price: 72.45, 
        deltaPct: -0.8, 
        spark: [73.2, 72.8, 72.6, 72.5, 72.45],
        sentiment: 0.42
      },
      { 
        id: "BTC", 
        label: "Bitcoin", 
        price: 43250, 
        deltaPct: 1.2, 
        spark: [42800, 43000, 43100, 43200, 43250],
        sentiment: 0.68
      }
    ];
  }

  async getWatchlist() {
    await this.delay();
    return [
      { 
        symbol: "AAPL", 
        name: "Apple Inc.",
        price: 232.12, 
        deltaPct: 1.2, 
        sentiment: 0.66, 
        spark: [228, 230, 229, 231, 232],
        volume: 45200000,
        marketCap: "3.6T"
      },
      { 
        symbol: "NVDA", 
        name: "NVIDIA Corp.",
        price: 118.02, 
        deltaPct: -0.8, 
        sentiment: 0.58, 
        spark: [120, 119, 118.5, 118.2, 118],
        volume: 52100000,
        marketCap: "2.9T"
      },
      { 
        symbol: "MSFT", 
        name: "Microsoft Corp.",
        price: 378.45, 
        deltaPct: 0.5, 
        sentiment: 0.62, 
        spark: [376, 377, 378, 378.2, 378.45],
        volume: 28700000,
        marketCap: "2.8T"
      },
      { 
        symbol: "GOOGL", 
        name: "Alphabet Inc.",
        price: 142.30, 
        deltaPct: 0.3, 
        sentiment: 0.59, 
        spark: [141.5, 142, 141.8, 142.1, 142.3],
        volume: 31200000,
        marketCap: "1.8T"
      },
      { 
        symbol: "AMZN", 
        name: "Amazon.com Inc.",
        price: 155.89, 
        deltaPct: -0.2, 
        sentiment: 0.54, 
        spark: [156.5, 156, 155.8, 155.9, 155.89],
        volume: 38900000,
        marketCap: "1.6T"
      },
      { 
        symbol: "TSLA", 
        name: "Tesla Inc.",
        price: 248.73, 
        deltaPct: 2.1, 
        sentiment: 0.71, 
        spark: [243, 245, 247, 248, 248.73],
        volume: 67800000,
        marketCap: "790B"
      }
    ];
  }

  async getInsightsBrief() {
    await this.delay();
    return {
      macro: "Soft landing narrative intact; services PMI stable at expansion levels",
      sectors: "Semiconductor strength persists; Energy sector lags on crude oil softness",
      events: "CPI data tomorrow; 12 high-impact earnings reports on deck this week",
      modules: {
        earnings: {
          todayCount: 3,
          weekCount: 24,
          surpriseRate: 0.67
        },
        sectors: {
          leaders: ["Technology", "Healthcare", "Consumer Discretionary"],
          laggards: ["Energy", "Materials", "Real Estate"],
          rotation: "Growth over Value momentum continuing"
        },
        volatility: {
          regime: "Calm",
          vix: 13.45,
          outlook: "Stable conditions expected through earnings season"
        }
      }
    };
  }

  // Chart data for mini-chart modals
  async getChartData(symbol, timeframe = '24h') {
    await this.delay();
    
    const generateData = (periods) => {
      const basePrice = Math.random() * 200 + 100;
      return Array.from({ length: periods }, (_, i) => ({
        time: Date.now() - (periods - i) * (timeframe === '24h' ? 3600000 : timeframe === '5d' ? 86400000 : 2592000000),
        price: basePrice + (Math.random() - 0.5) * basePrice * 0.1 * Math.sin(i / 10),
        volume: Math.random() * 1000000 + 500000
      }));
    };

    const periods = timeframe === '24h' ? 24 : timeframe === '5d' ? 5 : 30;
    return generateData(periods);
  }

  async addToWatchlist(symbol) {
    await this.delay();
    return { success: true, message: `${symbol} added to watchlist` };
  }

  async removeFromWatchlist(symbol) {
    await this.delay();
    return { success: true, message: `${symbol} removed from watchlist` };
  }

  async getAlerts() {
    await this.delay();
    return [
      { 
        id: "1", 
        symbol: "AAPL", 
        rule: "pctMove >= 2", 
        active: true, 
        lastTriggered: "2024-01-08T15:45:00Z",
        type: "price"
      },
      { 
        id: "2", 
        symbol: "NVDA", 
        rule: "volume >= 1.5x avg", 
        active: true, 
        lastTriggered: null,
        type: "volume"
      }
    ];
  }

  async createAlert(alertData) {
    await this.delay();
    return { 
      success: true, 
      id: Date.now().toString(),
      ...alertData
    };
  }
}

export const dataAdapter = new DataAdapter();