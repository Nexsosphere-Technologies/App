import React, { useState, useEffect } from 'react';
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
import { useAlgorand, useStaking, useFarming } from '../hooks/useAlgorand';

const EarnPage: React.FC = () => {
  const { isConnected, nexdenBalance, refreshBalances } = useAlgorand();
  const { pools, userStakes, loading: stakingLoading, stake, unstake, claimRewards } = useStaking();
  const { farms, userFarms, loading: farmingLoading, depositLP, withdrawLP, claimFarmRewards } = useFarming();
  
  const [activeView, setActiveView] = useState<'overview' | 'stake' | 'farm' | 'history'>('overview');
  const [selectedPool, setSelectedPool] = useState<any>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const [transactionLoading, setTransactionLoading] = useState(false);

  // Calculate totals
  const totalStaked = Array.from(userStakes.values()).reduce((sum, stake) => sum + (stake?.stakeAmount || 0), 0);
  const totalEarned = Array.from(userStakes.values()).reduce((sum, stake) => sum + (stake?.pendingRewards || 0), 0);

  const handleStake = async () => {
    if (!selectedPool || !stakeAmount) return;
    
    setTransactionLoading(true);
    try {
      await stake(selectedPool.id, parseFloat(stakeAmount));
      setShowStakeModal(false);
      setStakeAmount('');
      await refreshBalances();
      alert('Staking successful!');
    } catch (error) {
      console.error('Staking failed:', error);
      alert('Staking failed. Please try again.');
    } finally {
      setTransactionLoading(false);
    }
  };

  const handleUnstake = async () => {
    if (!selectedPool) return;
    
    setTransactionLoading(true);
    try {
      await unstake(selectedPool.id);
      setShowUnstakeModal(false);
      setUnstakeAmount('');
      await refreshBalances();
      alert('Unstaking successful!');
    } catch (error) {
      console.error('Unstaking failed:', error);
      alert('Unstaking failed. Please try again.');
    } finally {
      setTransactionLoading(false);
    }
  };

  const handleClaimRewards = async (poolId: number) => {
    setTransactionLoading(true);
    try {
      await claimRewards(poolId);
      await refreshBalances();
      alert('Rewards claimed successfully!');
    } catch (error) {
      console.error('Claim failed:', error);
      alert('Failed to claim rewards. Please try again.');
    } finally {
      setTransactionLoading(false);
    }
  };

  const handleClaimFarmRewards = async (farmId: number) => {
    setTransactionLoading(true);
    try {
      await claimFarmRewards(farmId);
      await refreshBalances();
      alert('Farm rewards claimed successfully!');
    } catch (error) {
      console.error('Farm claim failed:', error);
      alert('Failed to claim farm rewards. Please try again.');
    } finally {
      setTransactionLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-dark-bg pb-20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Coins className="w-16 h-16 text-primary-red mx-auto animate-pulse-glow" />
          <h2 className="text-xl font-semibold text-dark-text">Connect Your Wallet</h2>
          <p className="text-dark-text-secondary">Please connect your Algorand wallet to start earning</p>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-dark-card to-dark-bg border border-dark-border rounded-2xl p-6 animate-fade-in-scale">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-dark-text">NEXDEN Balance</h3>
          <button 
            onClick={refreshBalances}
            className="text-dark-text-secondary hover:text-dark-text transition-colors hover-scale"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-primary-red mb-2 animate-heartbeat">
            {nexdenBalance.toFixed(2)}
          </div>
          <div className="text-dark-text-secondary">NEXDEN</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-dark-card border border-dark-border rounded-xl p-4 text-center hover-lift transition-all duration-300">
          <div className="text-2xl font-bold text-green-500 mb-1 animate-bounce-gentle">
            {totalStaked.toFixed(2)}
          </div>
          <div className="text-sm text-dark-text-secondary">Total Staked</div>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-4 text-center hover-lift transition-all duration-300">
          <div className="text-2xl font-bold text-purple-500 mb-1 animate-bounce-gentle">
            {totalEarned.toFixed(2)}
          </div>
          <div className="text-sm text-dark-text-secondary">Total Earned</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setActiveView('stake')}
          className="bg-gradient-to-r from-primary-red to-primary-red-dark text-white p-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity hover-lift"
        >
          <TrendingUp className="w-5 h-5" />
          <span>Start Staking</span>
        </button>
        <button
          onClick={() => setActiveView('farm')}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity hover-lift"
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
        <div className="space-y-3 stagger-animation">
          {pools.slice(0, 2).map((pool, index) => {
            const userStake = userStakes.get(pool.id);
            return (
              <div key={pool.id} className="bg-dark-card border border-dark-border rounded-xl p-4 hover-lift transition-all duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary-red to-primary-red-dark">
                      <Coins className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-dark-text font-medium">{pool.name}</h4>
                      <p className="text-sm text-dark-text-secondary">APY: {pool.apy}%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-500">
                      {userStake?.pendingRewards?.toFixed(2) || '0.00'}
                    </div>
                    <div className="text-xs text-dark-text-secondary">Pending</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderStaking = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark-text">Staking Pools</h3>
        <div className="text-sm text-dark-text-secondary">
          Balance: {nexdenBalance.toFixed(2)} NEXDEN
        </div>
      </div>

      {stakingLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-red"></div>
        </div>
      ) : (
        <div className="space-y-4 stagger-animation">
          {pools.map((pool, index) => {
            const userStake = userStakes.get(pool.id);
            return (
              <div key={pool.id} className="bg-dark-card border border-dark-border rounded-xl p-6 hover-lift transition-all duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-primary-red to-primary-red-dark animate-pulse-glow">
                      <Coins className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-dark-text">{pool.name}</h4>
                      <p className="text-sm text-dark-text-secondary">
                        {pool.lockPeriod === 0 ? 'Flexible staking' : `${pool.lockPeriod / (24 * 3600)} day lock`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-500 animate-heartbeat">{pool.apy}%</div>
                    <div className="text-xs text-dark-text-secondary">APY</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-dark-text-secondary mb-1">Your Staked</div>
                    <div className="text-lg font-semibold text-dark-text">
                      {userStake?.stakeAmount?.toFixed(2) || '0.00'} NEXDEN
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-dark-text-secondary mb-1">Pending Rewards</div>
                    <div className="text-lg font-semibold text-primary-red animate-pulse">
                      {userStake?.pendingRewards?.toFixed(2) || '0.00'} NEXDEN
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-dark-text-secondary mb-1">Total Staked</div>
                    <div className="text-sm text-dark-text">{pool.totalStaked.toLocaleString()} NEXDEN</div>
                  </div>
                  <div>
                    <div className="text-sm text-dark-text-secondary mb-1">Lock Period</div>
                    <div className="text-sm text-dark-text">
                      {pool.lockPeriod === 0 ? 'Flexible' : `${pool.lockPeriod / (24 * 3600)} days`}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setSelectedPool(pool);
                      setShowStakeModal(true);
                    }}
                    className="flex-1 bg-gradient-to-r from-primary-red to-primary-red-dark text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity hover-lift"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Stake</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPool(pool);
                      setShowUnstakeModal(true);
                    }}
                    disabled={!userStake?.stakeAmount || userStake.stakeAmount === 0}
                    className="flex-1 bg-dark-bg border border-dark-border text-dark-text py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:border-primary-red-light/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                    <span>Unstake</span>
                  </button>
                  <button
                    onClick={() => handleClaimRewards(pool.id)}
                    disabled={!userStake?.pendingRewards || userStake.pendingRewards === 0 || transactionLoading}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Gift className="w-4 h-4" />
                    <span>{transactionLoading ? 'Claiming...' : 'Claim'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
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

      {farmingLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-red"></div>
        </div>
      ) : (
        <div className="space-y-4 stagger-animation">
          {farms.map((farm, index) => {
            const userFarm = userFarms.get(farm.id);
            return (
              <div key={farm.id} className="bg-dark-card border border-dark-border rounded-xl p-6 hover-lift transition-all duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 animate-pulse-glow">
                      <Droplets className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-dark-text">{farm.name}</h4>
                      <p className="text-sm text-dark-text-secondary">Provide liquidity and earn rewards</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-500 animate-heartbeat">{farm.rewardRate}%</div>
                    <div className="text-xs text-dark-text-secondary">APY</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-dark-text-secondary mb-1">Your LP Tokens</div>
                    <div className="text-lg font-semibold text-dark-text">
                      {userFarm?.depositAmount?.toFixed(2) || '0.00'} LP
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-dark-text-secondary mb-1">Pending Rewards</div>
                    <div className="text-lg font-semibold text-primary-red animate-pulse">
                      {userFarm?.pendingRewards?.toFixed(2) || '0.00'} NEXDEN
                    </div>
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
                  <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity hover-lift">
                    <Plus className="w-4 h-4" />
                    <span>Add Liquidity</span>
                  </button>
                  <button
                    disabled={!userFarm?.depositAmount || userFarm.depositAmount === 0}
                    className="flex-1 bg-dark-bg border border-dark-border text-dark-text py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:border-primary-red-light/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                  <button
                    onClick={() => handleClaimFarmRewards(farm.id)}
                    disabled={!userFarm?.pendingRewards || userFarm.pendingRewards === 0 || transactionLoading}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Gift className="w-4 h-4" />
                    <span>{transactionLoading ? 'Claiming...' : 'Claim'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark-text">Transaction History</h3>
        <span className="text-sm text-dark-text-secondary">Recent transactions</span>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-8 text-center">
        <History className="w-12 h-12 text-dark-text-secondary mx-auto mb-4 animate-float" />
        <h3 className="text-lg font-semibold text-dark-text mb-2">No Transactions Yet</h3>
        <p className="text-dark-text-secondary">
          Your staking and farming transactions will appear here
        </p>
      </div>
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
      <div className="bg-dark-card border-b border-dark-border px-4 py-4 animate-slide-in-up">
        <h1 className="text-xl font-semibold text-dark-text">Earn</h1>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-dark-card border-b border-dark-border px-4 py-2">
        <div className="flex space-x-1 overflow-x-auto">
          {navigationItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors hover-scale ${
                activeView === item.id
                  ? 'bg-primary-red text-white animate-pulse-glow'
                  : 'text-dark-text-secondary hover:text-dark-text hover:bg-dark-bg'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
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
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 w-full max-w-md animate-fade-in-scale">
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
                    onClick={() => setStakeAmount(nexdenBalance.toString())}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-red text-sm hover:text-primary-red-light transition-colors"
                  >
                    MAX
                  </button>
                </div>
                <div className="text-xs text-dark-text-secondary mt-1">
                  Balance: {nexdenBalance.toFixed(2)} NEXDEN
                </div>
              </div>

              <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-dark-text-secondary">APY:</span>
                  <span className="text-green-500 font-semibold">{selectedPool.apy}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-text-secondary">Lock Period:</span>
                  <span className="text-dark-text">
                    {selectedPool.lockPeriod === 0 ? 'Flexible' : `${selectedPool.lockPeriod / (24 * 3600)} days`}
                  </span>
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
                  disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || transactionLoading}
                  className="flex-1 bg-gradient-to-r from-primary-red to-primary-red-dark text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {transactionLoading ? 'Staking...' : 'Stake'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unstake Modal */}
      {showUnstakeModal && selectedPool && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 w-full max-w-md animate-fade-in-scale">
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
              <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-dark-text-secondary">Staked Amount:</span>
                  <span className="text-dark-text font-semibold">
                    {userStakes.get(selectedPool.id)?.stakeAmount?.toFixed(2) || '0.00'} NEXDEN
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-dark-text-secondary">Pending Rewards:</span>
                  <span className="text-primary-red font-semibold">
                    {userStakes.get(selectedPool.id)?.pendingRewards?.toFixed(2) || '0.00'} NEXDEN
                  </span>
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
                  disabled={transactionLoading}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {transactionLoading ? 'Unstaking...' : 'Unstake'}
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