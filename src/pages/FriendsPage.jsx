import React from 'react'

const FriendsPage = () => {
  const friends = [
    {
      name: '股市老李',
      avatar: 'L',
      bio: '20年投资经验，擅长价值投资',
      followers: '2.3k',
      online: true
    },
    {
      name: '短线高手',
      avatar: 'D',
      bio: '专注短线操作，技术分析专家',
      followers: '1.8k',
      online: false
    },
    {
      name: '量化小王',
      avatar: 'W',
      bio: '量化投资爱好者，分享策略分析',
      followers: '1.2k',
      online: true
    },
    {
      name: '医药研究员',
      avatar: 'M',
      bio: '医药行业专家，基本面分析',
      followers: '0.9k',
      online: false
    }
  ]

  const recommendations = [
    {
      name: '新能源分析师',
      avatar: 'X',
      bio: '新能源行业深度研究者',
      mutualFollowers: 12
    },
    {
      name: '价值投资者',
      avatar: 'V',
      bio: '长期价值投资实践者',
      mutualFollowers: 8
    }
  ]

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">股友</h1>
        <p className="text-gray-600">发现志同道合的投资伙伴</p>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-card p-6 mb-6">
        <div className="flex items-center">
          <span className="fas fa-users text-3xl mr-3"></span>
          <div>
            <h2 className="text-xl font-bold">投资社区</h2>
            <p className="text-purple-100">与高手交流，共同成长</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-card shadow-card p-4 mb-6">
        <h2 className="text-lg font-bold mb-4">我的股友</h2>
        <div className="space-y-4">
          {friends.map((friend, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {friend.avatar}
                  </div>
                  {friend.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-gray-900">{friend.name}</div>
                  <div className="text-sm text-gray-600">{friend.bio}</div>
                  <div className="text-xs text-gray-500">{friend.followers} 粉丝</div>
                </div>
              </div>
              <button className="bg-primary-500 text-white px-3 py-1 rounded text-sm font-semibold">
                私信
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-card shadow-card p-4">
        <h2 className="text-lg font-bold mb-4">推荐关注</h2>
        <div className="space-y-4">
          {recommendations.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {item.avatar}
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-600">{item.bio}</div>
                  <div className="text-xs text-gray-500">
                    {item.mutualFollowers} 个共同关注
                  </div>
                </div>
              </div>
              <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm font-semibold hover:bg-gray-200">
                关注
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FriendsPage