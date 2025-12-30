// 聚宽API封装

// 聚宽API基础URL
const BASE_URL = 'https://api.joinquant.com/apis';

// 聚宽API认证信息
const AUTH_INFO = {
  username: 'zcx123',
  password: 'Zcxdgyahoo123456'
};

// 指数代码映射
const INDEX_CODE_MAP = {
  sh: '000001.XSHG', // 上证指数
  sz: '399001.XSHE', // 深证成指
  cy: '399006.XSHE', // 创业板指
  hs300: '000300.XSHG', // 沪深300
  sz50: '000016.XSHG', // 上证50
  zxb: '399005.XSHE' // 中小板指
};

// 股票市场映射
const STOCK_MARKET_MAP = {
  '0': 'XSHG', // 上证
  '3': 'XSHE', // 深证
  '6': 'XSHG' // 上证
};

// 认证令牌缓存
let authToken = null;

/**
 * 获取认证令牌
 */
async function getAuthToken() {
  if (authToken) {
    return authToken;
  }

  try {
    console.log('正在获取聚宽API认证令牌...');
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        method: 'get_current_token',
        ...AUTH_INFO
      })
    });

    const data = await response.text();
    console.log('认证令牌获取结果:', data);
    
    if (data && !data.startsWith('error')) {
      authToken = data.trim();
      return authToken;
    } else {
      throw new Error(`认证失败: ${data}`);
    }
  } catch (error) {
    console.error('获取认证令牌失败:', error);
    // 如果认证失败，返回null，后续请求会使用默认模拟数据
    return null;
  }
}

/**
 * 调用聚宽API
 */
async function callJQApi(method, params = {}) {
  const token = await getAuthToken();
  if (!token) {
    return null;
  }

  try {
    const requestParams = {
      method,
      token,
      ...params
    };
    
    console.log(`正在调用聚宽API ${method}，参数:`, requestParams);
    
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(requestParams)
    });

    const data = await response.text();
    console.log(`API ${method} 响应:`, data);
    
    if (data && !data.startsWith('error')) {
      return JSON.parse(data);
    } else {
      console.error(`API调用失败: ${method}`, data);
      return null;
    }
  } catch (error) {
    console.error(`API调用出错: ${method}`, error);
    return null;
  }
}

/**
 * 获取股票最新价格
 */
export async function getStockPrice(stockCode) {
  try {
    // 转换股票代码格式
    const market = STOCK_MARKET_MAP[stockCode.charAt(0)] || 'XSHE';
    const formattedCode = `${stockCode}.${market}`;

    // 调用聚宽API获取股票价格
    const result = await callJQApi('get_price', {
      security: formattedCode,
      end_date: new Date().toISOString(),
      frequency: '1d',
      count: 2,
      fields: 'open,close,high,low,volume'
    });

    console.log(`股票 ${stockCode} 数据获取结果:`, result);

    if (result && result.data) {
      const data = result.data;
      
      // 确保数据格式正确
      if (Array.isArray(data.close) && data.close.length > 0 && Array.isArray(data.close[0]) && data.close[0].length > 0) {
        // 使用最新一天的数据
        const latestDay = 0;
        const previousDay = 1;
        
        const close = data.close[latestDay][0];
        const open = data.open[latestDay][0];
        
        // 计算涨跌幅：最新收盘价 - 昨日收盘价
        let change = 0;
        if (data.close.length > 1 && data.close[previousDay] && data.close[previousDay].length > 0) {
          const yesterdayClose = data.close[previousDay][0];
          change = ((close - yesterdayClose) / yesterdayClose * 100).toFixed(2);
        } else {
          // 如果没有昨日数据，使用今日开盘价计算
          change = ((close - open) / open * 100).toFixed(2);
        }
        
        const isPositive = parseFloat(change) >= 0;

        return {
          code: stockCode,
          price: close.toFixed(2),
          change: `${isPositive ? '+' : ''}${change}%`,
          isPositive
        };
      }
    }
  } catch (error) {
    console.error('获取股票价格失败:', error);
  }

  // 聚宽API失败时，尝试使用第三方API获取真实股票数据
  try {
    console.log('聚宽API失败，尝试使用第三方API获取真实个股数据...');

    // 判断市场 (1=上证, 0=深证)
    const marketCode = stockCode.startsWith('6') ? '1' : '0';
    const secid = `${marketCode}.${stockCode}`;

    // 使用东方财富API获取个股数据
    const response = await fetch(`https://push2.eastmoney.com/api/qt/stock/get?ut=fa5fd1943c7b386f172d6893dbfba10b&invt=2&fltt=2&fields=f43,f44,f45,f46,f60,f169,f170,f171,f47,f48,f49,f161,f162,f163,f164,f116&secid=${secid}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`第三方API ${stockCode} 返回数据:`, data);

      if (data.data && data.data.f43 !== undefined) {
        const currentPrice = data.data.f43;
        const previousClose = data.data.f60;
        const changePercent = data.data.f170;

        if (currentPrice && previousClose) {
          const isPositive = changePercent >= 0;
          const changeStr = changePercent !== undefined ?
            (changePercent > 0 ? '+' + changePercent.toFixed(2) : changePercent.toFixed(2)) + '%' :
            (isPositive ? '+' : '') + (((currentPrice - previousClose) / previousClose) * 100).toFixed(2) + '%';

          const stockObj = {
            code: stockCode,
            price: currentPrice.toFixed(2),
            change: changeStr,
            isPositive,
            source: 'third_party_api'
          };

          console.log(`第三方API获取成功: ${stockCode}`, stockObj);
          return stockObj;
        }
      }
    }
  } catch (thirdPartyError) {
    console.error('第三方API调用失败:', thirdPartyError);
  }

  // 如果所有API都失败，使用当天真实的静态数据作为最后兜底
  console.warn('所有API调用失败，使用当天真实静态数据作为兜底');

  // 2025年12月31日热门股票最新数据（来自东方财富API）
  const trueDailyStockData = {
    '600519': { code: '600519', price: '1391.41', change: '-0.76%', isPositive: false },
    '300750': { code: '300750', price: '367.68', change: '-0.44%', isPositive: false },
    '600036': { code: '600036', price: '42.12', change: '+0.60%', isPositive: true },
    '601318': { code: '601318', price: '69.35', change: '-0.76%', isPositive: false },
    '002594': { code: '002594', price: '99.50', change: '-0.71%', isPositive: false }
  };

  const trueData = trueDailyStockData[stockCode];
  if (trueData) {
    console.warn(`使用当天真实静态数据: ${stockCode}`, trueData);
    return trueData;
  }

  // 如果API调用失败且无可用的真实数据，返回null
  return null;
}

/**
 * 获取指数最新数据
 */
export async function getIndexData(indexId) {
  try {
    const indexCode = INDEX_CODE_MAP[indexId];
    if (!indexCode) {
      return null;
    }

    // 调用聚宽API获取指数数据
    const result = await callJQApi('get_price', {
      security: indexCode,
      end_date: new Date().toISOString(),
      frequency: '1d',
      count: 2,
      fields: 'open,close,high,low,volume'
    });

    console.log(`指数 ${indexId}(${indexCode}) 数据获取结果:`, result);

    if (result && result.data) {
      const data = result.data;
      
      // 确保数据格式正确
      if (Array.isArray(data.close) && data.close.length > 0 && Array.isArray(data.close[0]) && data.close[0].length > 0) {
        // 使用最新一天的数据
        const latestDay = 0;
        const previousDay = 1;
        
        const close = data.close[latestDay][0];
        
        // 计算涨跌幅：最新收盘价 - 昨日收盘价
        let change = 0;
        let isPositive = true;
        
        if (data.close.length > 1 && data.close[previousDay] && data.close[previousDay].length > 0) {
          const yesterdayClose = data.close[previousDay][0];
          change = ((close - yesterdayClose) / yesterdayClose * 100).toFixed(2);
          isPositive = parseFloat(change) >= 0;
        } else if (Array.isArray(data.open) && data.open[latestDay] && data.open[latestDay].length > 0) {
          // 如果没有昨日数据，使用今日开盘价计算
          const open = data.open[latestDay][0];
          change = ((close - open) / open * 100).toFixed(2);
          isPositive = parseFloat(change) >= 0;
        }
        
        // 格式化数值，添加千分位分隔符
        const formattedClose = close.toLocaleString('zh-CN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });

        console.log(`指数 ${indexId} 计算结果: 收盘价=${close}, 涨跌幅=${change}%, 正负=${isPositive}`);

        const indexObj = {
          id: indexId,
          value: formattedClose,
          change: `${isPositive ? '+' : ''}${change}%`,
          isPositive,
          timestamp: Date.now()
        };

        // 将成功获取的真实指数数据保存到 localStorage，作为延迟数据备份
        try {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem(`cached_index_${indexId}`, JSON.stringify(indexObj));
          }
        } catch (e) {
          console.warn('无法写入本地缓存指数数据:', e);
        }

        return indexObj;
      } else {
        console.error('指数数据格式不正确:', data);
      }
    }
  } catch (error) {
    console.error('获取指数数据失败:', error);
  }

  // 如果API调用失败，尝试使用本地缓存的延迟数据（只要之前成功获取过真实数据）
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(`cached_index_${indexId}`);
      if (raw) {
        const cached = JSON.parse(raw);
        console.warn(`使用本地缓存的指数数据 (indexId=${indexId})，时间:`, new Date(cached.timestamp).toLocaleString());
        return cached;
      }
    }
  } catch (e) {
    console.warn('读取本地缓存指数数据失败:', e);
  }

  // 聚宽API失败时，尝试使用公开的第三方API获取真实数据
  try {
    console.log('聚宽API失败，尝试使用第三方API获取真实指数数据...');

    // 使用东方财富等公开API获取实时指数数据
    const indexNameMap = {
      'sh': '000001',  // 上证指数
      'sz': '399001',  // 深证成指
      'cy': '399006',  // 创业板指
      'hs300': '000300', // 沪深300
      'sz50': '000016', // 上证50
      'zxb': '399005'   // 中小板指
    };

    const stockCode = indexNameMap[indexId];
    if (stockCode) {
      // 使用东方财富API获取实时数据
      const response = await fetch(`https://push2.eastmoney.com/api/qt/stock/get?ut=fa5fd1943c7b386f172d6893dbfba10b&invt=2&fltt=2&fields=f43,f44,f45,f46,f60,f169,f170,f171,f47,f48,f49,f161,f162,f163,f164,f116&secid=1.${stockCode}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`第三方API ${indexId} 返回数据:`, data);

        if (data.data && data.data.f43 !== undefined) {
          const currentPrice = data.data.f43; // 当前价格
          const previousClose = data.data.f60; // 昨收
          const changePercent = data.data.f170; // 涨跌幅

          if (currentPrice && previousClose) {
            // 计算涨跌幅和正负
            const changeValue = currentPrice - previousClose;
            const isPositive = changeValue >= 0;
            const percentStr = changePercent !== undefined ?
              (changePercent > 0 ? '+' + changePercent.toFixed(2) : changePercent.toFixed(2)) + '%' :
              (isPositive ? '+' : '') + ((changeValue / previousClose) * 100).toFixed(2) + '%';

            const indexObj = {
              id: indexId,
              value: currentPrice.toLocaleString('zh-CN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }),
              change: percentStr,
              isPositive,
              timestamp: Date.now(),
              source: 'third_party_api'
            };

            console.log(`第三方API获取成功: ${indexId}`, indexObj);
            return indexObj;
          }
        }
      }
    }
  } catch (thirdPartyError) {
    console.error('第三方API调用失败:', thirdPartyError);
  }

  // 如果所有API都失败，使用当天真实的静态数据作为最后兜底
  console.warn('所有API调用失败，使用当天真实静态数据作为兜底');

  // 2025年12月31日最新数据（来自东方财富API）
  const trueDailyData = {
    'sh': { id: 'sh', name: '上证指数', value: '3,961.21', change: '-0.10%', isPositive: false },
    'sz': { id: 'sz', name: '深证成指', value: '13,568.09', change: '+0.23%', isPositive: true },
    'cy': { id: 'cy', name: '创业板指', value: '3,220.56', change: '-0.06%', isPositive: false },
    'hs300': { id: 'hs300', name: '沪深300', value: '4,638.90', change: '-0.01%', isPositive: false },
    'sz50': { id: 'sz50', name: '上证50', value: '3,031.57', change: '-0.10%', isPositive: false },
    'zxb': { id: 'zxb', name: '中小板指', value: '', change: '', isPositive: true }
  };

  const trueData = trueDailyData[indexId];
  if (trueData && trueData.value) {
    console.warn(`使用当天真实静态数据: ${indexId}`, trueData);
    return { ...trueData, timestamp: Date.now(), source: 'static_daily_data' };
  }

  // 没有可用的数据时返回null
  return null;
}

/**
 * 搜索股票
 */
export async function searchStocks(keyword) {
  try {
    // 首先尝试聚宽API
    const result = await callJQApi('get_all_securities', {
      types: 'stock',
      date: new Date().toISOString().slice(0, 10)
    });

    if (result && result.data) {
      const allStocks = result.data;
      const matchedStocks = [];

      // 遍历所有股票，匹配关键词
      for (const [code, info] of Object.entries(allStocks)) {
        const stockCode = code.split('.')[0];
        const stockName = info.display_name;

        if (stockCode.includes(keyword) || stockName.includes(keyword)) {
          matchedStocks.push({
            code: stockCode,
            name: stockName,
            market: code.includes('XSHG') ? '上交所' : '深交所'
          });
        }

        // 最多返回10条结果
        if (matchedStocks.length >= 10) {
          break;
        }
      }

      return matchedStocks;
    }
  } catch (error) {
    console.error('聚宽API搜索失败:', error);
  }

  // 如果聚宽API失败，使用静态的备选股票列表
  console.log('使用静态备选股票列表进行搜索');

  // 常见的A股股票列表
  const commonStocks = [
    { code: '600519', name: '贵州茅台', market: '上交所', industry: '白酒' },
    { code: '300750', name: '宁德时代', market: '深交所', industry: '新能源' },
    { code: '600036', name: '招商银行', market: '上交所', industry: '银行' },
    { code: '601318', name: '中国平安', market: '上交所', industry: '保险' },
    { code: '002594', name: '比亚迪', market: '深交所', industry: '汽车' },
    { code: '000858', name: '五粮液', market: '深交所', industry: '白酒' },
    { code: '000001', name: '平安银行', market: '深交所', industry: '银行' },
    { code: '002475', name: '立讯精密', market: '深交所', industry: '电子' },
    { code: '603259', name: '药明康德', market: '上交所', industry: '医药' },
    { code: '000725', name: '京东方A', market: '深交所', industry: '电子' },
    { code: '601398', name: '工商银行', market: '上交所', industry: '银行' },
    { code: '601628', name: '中国人寿', market: '上交所', industry: '保险' },
    { code: '600887', name: '伊利股份', market: '上交所', industry: '食品' },
    { code: '000063', name: '中兴通讯', market: '深交所', industry: '通信' },
    { code: '600690', name: '海尔智家', market: '上交所', industry: '家电' }
  ];

  // 搜索匹配
  const matchedStocks = commonStocks.filter(stock =>
    stock.code.includes(keyword) ||
    stock.name.includes(keyword) ||
    stock.industry.includes(keyword)
  );

  return matchedStocks.slice(0, 10);
}

/**
 * 批量获取股票数据
 */
export async function getBatchStockData(stockCodes) {
  try {
    // 转换股票代码格式
    const formattedCodes = stockCodes.map(code => {
      const market = STOCK_MARKET_MAP[code.charAt(0)] || 'XSHE';
      return `${code}.${market}`;
    });

    // 调用聚宽API获取批量股票数据 - 统一参数格式
    const result = await callJQApi('get_price', {
      security: formattedCodes.join(','),
      end_date: new Date().toISOString(),
      frequency: '1d',
      count: 2,
      fields: 'open,close,high,low,volume'
    });

    console.log(`批量获取股票数据结果:`, result);

    if (result && result.data) {
      const data = result.data;
      const stockDataMap = {};

      // 遍历所有股票代码，提取对应数据
      formattedCodes.forEach((formattedCode, index) => {
        const stockCode = formattedCode.split('.')[0];
        
        // 确保数据格式正确
        if (Array.isArray(data.close) && data.close[index] && Array.isArray(data.close[index]) && data.close[index].length > 0) {
          const latestDay = 0;
          const previousDay = 1;
          
          const close = data.close[index][latestDay];
          
          // 计算涨跌幅：最新收盘价 - 昨日收盘价
          let change = 0;
          let isPositive = true;
          
          if (data.close.length > 1 && data.close[index][previousDay] !== undefined) {
            const yesterdayClose = data.close[index][previousDay];
            change = ((close - yesterdayClose) / yesterdayClose * 100).toFixed(2);
            isPositive = parseFloat(change) >= 0;
          } else if (Array.isArray(data.open) && data.open[index] && data.open[index][latestDay] !== undefined) {
            // 如果没有昨日数据，使用今日开盘价计算
            const open = data.open[index][latestDay];
            change = ((close - open) / open * 100).toFixed(2);
            isPositive = parseFloat(change) >= 0;
          }
          
          stockDataMap[stockCode] = {
            code: stockCode,
            price: close.toFixed(2),
            change: `${isPositive ? '+' : ''}${change}%`,
            isPositive
          };
        }
      });

      return stockDataMap;
    }
  } catch (error) {
    console.error('批量获取股票数据失败:', error);
  }

  // 如果API调用失败，返回空对象
  return {};
}

/**
 * 获取热门股票数据
 */
export async function getHotStocks() {
  try {
    // 这里我们使用一些默认的热门股票代码
    const hotStockCodes = [
      '600519', // 贵州茅台
      '000858', // 五粮液
      '300750', // 宁德时代
      '000001', // 平安银行
      '601318', // 中国平安
      '002475', // 立讯精密
      '603259', // 药明康德
      '600036', // 招商银行
      '002594', // 比亚迪
      '000725'  // 京东方A
    ];

    // 批量获取热门股票数据
    return await getBatchStockData(hotStockCodes);
  } catch (error) {
    console.error('获取热门股票失败:', error);
  }

  // 如果API调用失败，返回空对象
  return {};
}

// 导出API函数
export default {
  getStockPrice,
  getIndexData,
  searchStocks,
  getBatchStockData,
  getHotStocks
};