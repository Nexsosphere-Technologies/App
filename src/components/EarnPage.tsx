import React, { useState } from 'react';
import { 
  Coins, 
  TrendingUp, 
  Plus, 
  Minus, 
  Gift, 
  History, 
  ArrowUpRight, 
  ArrowDownLeft,
  Droplets,
  Lock,
  Unlock,
  Calendar,
  DollarSign,
  Percent,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface StakingPool {
  id: string;
  name: string;
  type: 'single' | 'lp';
  apy: number;
  totalStaked: string;
  userStaked: string;
  pendingRewards: string;
  lockPeriod?: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface Transaction {
  id: string;
  type: 'stake' | 'unstake' | 'claim' | 'add_liquidity' | 'remove_liquidity';
  amount: string;
  token: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  txHash: string;
  pool?: string;
}

const EarnPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'overview' | 'stake' | 'farm' | 'history'>('overview');
  const [selectedPool, setSelectedPool] = useState<StakingPool | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);

  // Mock data
  const nexdenBalance = '1,250.75';
  const totalEarned = '45.32';
  const totalStaked = '800.00';

  const stakingPools: StakingPool[] = [
    {
      id: '1',
      name: 'NEXDEN Single Stake',
      type: 'single',
      apy: 12.5,
      totalStaked: '2,450,000 NEXDEN',
      userStaked: '500.00',
      pendingRewards: '15.25',
      lockPeriod: 'Flexible',
      icon: <Coins className="w-6 h-6" />,
      color: 'from-primary-red to-primary-red-dark',
      description: 'Stake NEXDEN tokens to earn rewards and participate in governance'
    },
    {
      id: '2',
      name: 'NEXDEN-ALGO LP Pool',
      type: 'lp',
      apy: 18.7,
      totalStaked: '1,200,000 LP',
      userStaked: '300.00',
      pendingRewards: '22.15',
      lockPeriod: 'Flexible',
      icon: <Droplets className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      description: 'Provide liquidity to NEXDEN-ALGO pair and earn trading fees + rewards'
    },
    {
      id: '3',
      name: 'NEXDEN Locked Stake',
      type: 'single',
      apy: 25.0,
      totalStaked: '850,000 NEXDEN',
      userStaked: '0.00',
      pendingRewards: '0.00',
      lockPeriod: '90 days',
      icon: <Lock className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      description: 'Lock NEXDEN for 90 days to earn higher rewards'
    }
  ];

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'stake',
      amount: '100.00',
      token: 'NEXDEN',
      timestamp: '2024-01-20T10:30:00Z',
      status: 'completed',
      txHash: '0x1a2b3c4d...',
      pool: 'NEXDEN Single Stake'
    },
    {
      id: '2',
      type: 'claim',
      amount: '5.75',
      token: 'NEXDEN',
      timestamp: '2024-01-19T14:20:00Z',
      status: 'completed',
      txHash: '0x2b3c4d5e...',
      pool: 'NEXDEN Single Stake'
    },
    {
      id: '3',
      type: 'add_liquidity',
      amount: '200.00',
      token: 'LP',
      timestamp: '2024-01-18T09:15:00Z',
      status: 'completed',
      txHash: '0x3c4d5e6f...',
      pool: 'NEXDEN-ALGO LP Pool'
    },
    {
      id: '4',
      type: 'unstake',
      amount: '50.00',
      token: 'NEXDEN',
      timestamp: '2024-01-17T16:45:00Z',
      status: 'completed',
      txHash: '0x4d5e6f7g...',
      pool: 'NEXDEN Single Stake'
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'stake': return <ArrowUpRight className="w-4 h-4 text-green-500" />;
      case 'unstake': return <ArrowDownLeft className="w-4 h-4 text-red-500" />;
      case 'claim': return <Gift className="w-4 h-4 text-purple-500" />;
      case 'add_liquidity': return <Plus className="w-4 h-4 text-blue-500" />;
      case 'remove_liquidity': return <Minus className="w-4 h-4 text-orange-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleStake = () => {
    // Handle staking logic
    setShowStakeModal(false);
    setStakeAmount('');
  };

  const handleUnstake = () => {
    // Handle unstaking logic
    setShowUnstakeModal(false);
    setUnstakeAmount('');
  };

  const handleClaimRewards = (poolId: string) => {
    // Handle claim rewards logic
    console.log('Claiming rewards for pool:', poolId);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-dark-card to-dark-bg border border-dark-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-dark-text">NEXDEN Balance</h3>
          <button className="text-dark-text-secondary hover:text-dark-text transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-primary-red mb-2">{nexdenBalance}</div>
          <div className="text-dark-text-secondary">NEXDEN</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-dark-card border border-dark-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-500 mb-1">{totalStaked}</div>
          <div className="text-sm text-dark-text-secondary">Total Staked</div>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-500 mb-1">{totalEarned}</div>
          <div className="text-sm text-dark-text-secondary">Total Earned</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setActiveView('stake')}
          className="bg-gradient-to-r from-primary-red to-primary-red-dark text-white p-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
        >
          <TrendingUp className="w-5 h-5" />
          <span>Start Staking</span>
        </button>
        <button
          onClick={() => setActiveView('farm')}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
        >
          <Droplets className="w-5 h-5" />
          <span>Farm LP</span>
        </button>
      </div>

      {/* Top Pools Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-dark-text">Top Earning Pools</h3>
          <button
            onClick={() => setActiveView('stake')}
            className="text-primary-red hover:text-primary-red-light transition-colors text-sm"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {stakingPools.slice(0, 2).map((pool) => (
            <div key={pool.id} className="bg-dark-card border border-dark-border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${pool.color}`}>
                    {pool.icon}
                  </div>
                  <div>
                    <h4 className="text-dark-text font-medium">{pool.name}</h4>
                    <p className="text-sm text-dark-text-secondary">APY: {pool.apy}%</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-500">{pool.pendingRewards}</div>
                  <div className="text-xs text-dark-text-secondary">Pending</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStaking = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark-text">Staking Pools</h3>
        <div className="text-sm text-dark-text-secondary">
          Balance: {nexdenBalance} NEXDEN
        </div>
      </div>

      {stakingPools.map((pool) => (
        <div key={pool.id} className="bg-dark-card border border-dark-border rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${pool.color}`}>
                {pool.icon}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-dark-text">{pool.name}</h4>
                <p className="text-sm text-dark-text-secondary">{pool.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-500">{pool.apy}%</div>
              <div className="text-xs text-dark-text-secondary">APY</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-dark-text-secondary mb-1">Your Staked</div>
              <div className="text-lg font-semibold text-dark-text">{pool.userStaked} NEXDEN</div>
            </div>
            <div>
              <div className="text-sm text-dark-text-secondary mb-1">Pending Rewards</div>
              <div className="text-lg font-semibold text-primary-red">{pool.pendingRewards} NEXDEN</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-dark-text-secondary mb-1">Total Staked</div>
              <div className="text-sm text-dark-text">{pool.totalStaked}</div>
            </div>
            <div>
              <div className="text-sm text-dark-text-secondary mb-1">Lock Period</div>
              <div className="text-sm text-dark-text">{pool.lockPeriod}</div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => {
                setSelectedPool(pool);
                setShowStakeModal(true);
              }}
              className="flex-1 bg-gradient-to-r from-primary-red to-primary-red-dark text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              <span>Stake</span>
            </button>
            <button
              onClick={() => {
                setSelectedPool(pool);
                setShowUnstakeModal(true);
              }}
              disabled={parseFloat(pool.userStaked) === 0}
              className="flex-1 bg-dark-bg border border-dark-border text-dark-text py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:border-primary-red-light/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4" />
              <span>Unstake</span>
            </button>
            <button
              onClick={() => handleClaimRewards(pool.id)}
              disabled={parseFloat(pool.pendingRewards) === 0}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Gift className="w-4 h-4" />
              <span>Claim</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFarming = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark-text">Liquidity Farming</h3>
        <div className="text-sm text-dark-text-secondary">
          Earn trading fees + rewards
        </div>
      </div>

      {stakingPools.filter(pool => pool.type === 'lp').map((pool) => (
        <div key={pool.id} className="bg-dark-card border border-dark-border rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${pool.color}`}>
                {pool.icon}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-dark-text">{pool.name}</h4>
                <p className="text-sm text-dark-text-secondary">{pool.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-500">{pool.apy}%</div>
              <div className="text-xs text-dark-text-secondary">APY</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-dark-text-secondary mb-1">Your LP Tokens</div>
              <div className="text-lg font-semibold text-dark-text">{pool.userStaked} LP</div>
            </div>
            <div>
              <div className="text-sm text-dark-text-secondary mb-1">Pending Rewards</div>
              <div className="text-lg font-semibold text-primary-red">{pool.pendingRewards} NEXDEN</div>
            </div>
          </div>

          <div className="bg-dark-bg border border-dark-border rounded-lg p-4 mb-4">
            <h5 className="text-dark-text font-medium mb-2">Pool Composition</h5>
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark-text-secondary">NEXDEN:</span>
              <span className="text-dark-text">50%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark-text-secondary">ALGO:</span>
              <span className="text-dark-text">50%</span>
            </div>
          </div>

          <div className="flex space-x-3">
            <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" />
              <span>Add Liquidity</span>
            </button>
            <button
              disabled={parseFloat(pool.userStaked) === 0}
              className="flex-1 bg-dark-bg border border-dark-border text-dark-text py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:border-primary-red-light/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4" />
              <span>Remove</span>
            </button>
            <button
              onClick={() => handleClaimRewards(pool.id)}
              disabled={parseFloat(pool.pendingRewards) === 0}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Gift className="w-4 h-4" />
              <span>Claim</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark-text">Transaction History</h3>
        <span className="text-sm text-dark-text-secondary">{transactions.length} transactions</span>
      </div>

      {transactions.map((tx) => (
        <div key={tx.id} className="bg-dark-card border border-dark-border rounded-xl p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-dark-bg rounded-lg">
                {getTransactionIcon(tx.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-dark-text font-medium capitalize">
                    {tx.type.replace('_', ' ')}
                  </h4>
                  {getStatusIcon(tx.status)}
                </div>
                <p className="text-sm text-dark-text-secondary mb-1">
                  {tx.amount} {tx.token}
                  {tx.pool && ` • ${tx.pool}`}
                </p>
                <p className="text-xs text-dark-text-secondary">
                  {formatDate(tx.timestamp)}
                </p>
              </div>
            </div>
            <button className="text-dark-text-secondary hover:text-dark-text transition-colors">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'stake', label: 'Staking', icon: <Coins className="w-5 h-5" /> },
    { id: 'farm', label: 'Farming', icon: <Droplets className="w-5 h-5" /> },
    { id: 'history', label: 'History', icon: <History className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-dark-bg pb-20">
      {/* Header */}
      <div className="bg-dark-card border-b border-dark-border px-4 py-4">
        <h1 className="text-xl font-semibold text-dark-text">Earn</h1>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-dark-card border-b border-dark-border px-4 py-2">
        <div className="flex space-x-1 overflow-x-auto">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeView === item.id
                  ? 'bg-primary-red text-white'
                  : 'text-dark-text-secondary hover:text-dark-text hover:bg-dark-bg'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {activeView === 'overview' && renderOverview()}
        {activeView === 'stake' && renderStaking()}
        {activeView === 'farm' && renderFarming()}
        {activeView === 'history' && renderHistory()}
      </div>

      {/* Stake Modal */}
      {showStakeModal && selectedPool && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-dark-text">Stake {selectedPool.name}</h3>
              <button
                onClick={() => setShowStakeModal(false)}
                className="text-dark-text-secondary hover:text-dark-text transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-dark-text-secondary mb-2">Amount to Stake</label>
                <div className="relative">
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text focus:border-primary-red focus:outline-none"
                  />
                  <button
                    onClick={() => setStakeAmount(nexdenBalance.replace(',', ''))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-red text-sm hover:text-primary-red-light transition-colors"
                  >
                    MAX
                  </button>
                </div>
                <div className="text-xs text-dark-text-secondary mt-1">
                  Balance: {nexdenBalance} NEXDEN
                </div>
              </div>

              <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-dark-text-secondary">APY:</span>
                  <span className="text-green-500 font-semibold">{selectedPool.apy}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-text-secondary">Lock Period:</span>
                  <span className="text-dark-text">{selectedPool.lockPeriod}</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowStakeModal(false)}
                  className="flex-1 bg-dark-bg border border-dark-border text-dark-text py-3 rounded-xl font-semibold hover:border-primary-red-light/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStake}
                  disabled={!stakeAmount || parseFloat(stakeAmount) <= 0}
                  className="flex-1 bg-gradient-to-r from-primary-red to-primary-red-dark text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Stake
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unstake Modal */}
      {showUnstakeModal && selectedPool && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-dark-text">Unstake {selectedPool.name}</h3>
              <button
                onClick={() => setShowUnstakeModal(false)}
                className="text-dark-text-secondary hover:text-dark-text transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-dark-text-secondary mb-2">Amount to Unstake</label>
                <div className="relative">
                  <input
                    type="number"
                    value={unstakeAmount}
                    onChange={(e) => setUnstakeAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text focus:border-primary-red focus:outline-none"
                  />
                  <button
                    onClick={() => setUnstakeAmount(selectedPool.userStaked)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-red text-sm hover:text-primary-red-light transition-colors"
                  >
                    MAX
                  </button>
                </div>
                <div className="text-xs text-dark-text-secondary mt-1">
                  Staked: {selectedPool.userStaked} NEXDEN
                </div>
              </div>

              <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-dark-text-secondary">Pending Rewards:</span>
                  <span className="text-primary-red font-semibold">{selectedPool.pendingRewards} NEXDEN</span>
                </div>
                <div className="text-xs text-dark-text-secondary">
                  Rewards will be automatically claimed when unstaking
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowUnstakeModal(false)}
                  className="flex-1 bg-dark-bg border border-dark-border text-dark-text py-3 rounded-xl font-semibold hover:border-primary-red-light/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUnstake}
                  disabled={!unstakeAmount || parseFloat(unstakeAmount) <= 0}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Unstake
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarnPage;