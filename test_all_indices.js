// 测试获取所有主要指数的真实数据
async function testAllIndices() {
  const indices = [
    { id: 'sh', name: '上证指数', code: '000001' },
    { id: 'sz', name: '深证成指', code: '399001' },
    { id: 'cy', name: '创业板指', code: '399006' },
    { id: 'hs300', name: '沪深300', code: '000300' },
    { id: 'sz50', name: '上证50', code: '000016' },
    { id: 'zxb', name: '中小板指', code: '399005' }
  ];

  for (const index of indices) {
    await testIndexData(index);
  }
}

async function testIndexData(index) {
  try {
    console.log(`\n测试${index.name}(${index.code})...`);

    const response = await fetch(`https://push2.eastmoney.com/api/qt/stock/get?ut=fa5fd1943c7b386f172d6893dbfba10b&invt=2&fltt=2&fields=f43,f44,f45,f46,f60,f169,f170,f171,f47,f48,f49,f161,f162,f163,f164,f116&secid=1.${index.code}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (response.ok) {
      const data = await response.json();

      if (data.data && data.data.f43 !== undefined) {
        const currentPrice = data.data.f43;
        const previousClose = data.data.f60;
        const changePercent = data.data.f170;

        console.log(`${index.name}: ${currentPrice} (${changePercent > 0 ? '+' : ''}${changePercent}%)`);
        console.log(`昨日收盘: ${previousClose}`);
      } else {
        console.log(`无法获取${index.name}数据`);
      }
    } else {
      console.log(`API请求失败: ${response.status}`);
    }
  } catch (error) {
    console.error(`获取${index.name}数据时出错:`, error.message);
  }

  // 为了避免请求过快，添加延迟
  await new Promise(resolve => setTimeout(resolve, 500));
}

// 运行测试
testAllIndices();