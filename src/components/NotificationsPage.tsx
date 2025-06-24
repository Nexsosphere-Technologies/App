import React, { useState } from 'react';
import { 
  Bell, 
  BellOff, 
  CheckCircle, 
  Clock, 
  Shield, 
  Star, 
  Coins, 
  AlertTriangle, 
  Info, 
  Gift, 
  Award, 
  TrendingUp, 
  Settings, 
  Filter,
  MoreVertical,
  Trash2,
  Eye,
  EyeOff,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'credential' | 'reputation' | 'staking' | 'system';
  category: 'new_vc' | 'reputation_update' | 'staking_rewards' | 'system_announcement' | 'attestation' | 'badge_earned';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  metadata?: {
    amount?: string;
    issuer?: string;
    credentialType?: string;
    scoreChange?: number;
    badgeName?: string;
  };
}

interface NotificationSettings {
  newCredentials: boolean;
  reputationUpdates: boolean;
  stakingRewards: boolean;
  systemAnnouncements: boolean;
  attestations: boolean;
  badgesEarned: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

const NotificationsPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'notifications' | 'settings'>('notifications');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    newCredentials: true,
    reputationUpdates: true,
    stakingRewards: true,
    systemAnnouncements: true,
    attestations: true,
    badgesEarned: true,
    emailNotifications: false,
    pushNotifications: true
  });

  const notifications: Notification[] = [
    {
      id: '1',
      type: 'credential',
      category: 'new_vc',
      title: 'New Credential Received',
      message: 'MIT has issued your Computer Science Degree credential',
      timestamp: '2024-01-20T10:30:00Z',
      read: false,
      priority: 'high',
      actionUrl: '/identity',
      metadata: {
        issuer: 'Massachusetts Institute of Technology',
        credentialType: 'University Degree'
      }
    },
    {
      id: '2',
      type: 'reputation',
      category: 'reputation_update',
      title: 'Reputation Score Updated',
      message: 'Your reputation score increased by 5 points',
      timestamp: '2024-01-20T09:15:00Z',
      read: false,
      priority: 'medium',
      actionUrl: '/reputation',
      metadata: {
        scoreChange: 5
      }
    },
    {
      id: '3',
      type: 'staking',
      category: 'staking_rewards',
      title: 'Staking Rewards Available',
      message: 'You have 15.25 NEXDEN rewards ready to claim',
      timestamp: '2024-01-20T08:45:00Z',
      read: true,
      priority: 'medium',
      actionUrl: '/earn',
      metadata: {
        amount: '15.25 NEXDEN'
      }
    },
    {
      id: '4',
      type: 'system',
      category: 'system_announcement',
      title: 'Platform Update Available',
      message: 'NexDentify v2.1 is now available with enhanced security features',
      timestamp: '2024-01-19T16:20:00Z',
      read: true,
      priority: 'low',
      actionUrl: '/settings'
    },
    {
      id: '5',
      type: 'reputation',
      category: 'attestation',
      title: 'New Attestation Received',
      message: 'John Smith has provided a professional endorsement',
      timestamp: '2024-01-19T14:30:00Z',
      read: false,
      priority: 'medium',
      actionUrl: '/reputation',
      metadata: {
        issuer: 'John Smith'
      }
    },
    {
      id: '6',
      type: 'reputation',
      category: 'badge_earned',
      title: 'New Badge Earned!',
      message: 'Congratulations! You earned the "Community Builder" badge',
      timestamp: '2024-01-19T12:15:00Z',
      read: true,
      priority: 'high',
      actionUrl: '/reputation',
      metadata: {
        badgeName: 'Community Builder'
      }
    },
    {
      id: '7',
      type: 'staking',
      category: 'staking_rewards',
      title: 'Rewards Claimed Successfully',
      message: 'You successfully claimed 8.75 NEXDEN from staking rewards',
      timestamp: '2024-01-18T11:20:00Z',
      read: true,
      priority: 'low',
      actionUrl: '/earn',
      metadata: {
        amount: '8.75 NEXDEN'
      }
    },
    {
      id: '8',
      type: 'credential',
      category: 'new_vc',
      title: 'Employment Verification Complete',
      message: 'TechCorp has verified your employment status',
      timestamp: '2024-01-17T15:45:00Z',
      read: true,
      priority: 'medium',
      actionUrl: '/identity',
      metadata: {
        issuer: 'TechCorp Solutions',
        credentialType: 'Employment Verification'
      }
    },
    {
      id: '9',
      type: 'system',
      category: 'system_announcement',
      title: 'Scheduled Maintenance',
      message: 'Platform maintenance scheduled for Jan 25, 2024 at 2:00 AM UTC',
      timestamp: '2024-01-16T10:00:00Z',
      read: true,
      priority: 'urgent',
      actionUrl: '/settings'
    },
    {
      id: '10',
      type: 'reputation',
      category: 'reputation_update',
      title: 'Reputation Milestone Reached',
      message: 'Congratulations! You reached 85 reputation points',
      timestamp: '2024-01-15T13:30:00Z',
      read: true,
      priority: 'high',
      actionUrl: '/reputation',
      metadata: {
        scoreChange: 10
      }
    }
  ];

  const getNotificationIcon = (type: string, category: string) => {
    switch (category) {
      case 'new_vc':
        return <Shield className="w-5 h-5 text-blue-500" />;
      case 'reputation_update':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'attestation':
        return <Star className="w-5 h-5 text-purple-500" />;
      case 'badge_earned':
        return <Award className="w-5 h-5 text-yellow-500" />;
      case 'staking_rewards':
        return <Coins className="w-5 h-5 text-primary-red" />;
      case 'system_announcement':
        return <Info className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-dark-text-secondary" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500';
      case 'high':
        return 'border-l-orange-500';
      case 'medium':
        return 'border-l-blue-500';
      case 'low':
        return 'border-l-gray-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const markAsRead = (notificationId: string) => {
    // In a real app, this would update the backend
    console.log('Marking notification as read:', notificationId);
  };

  const deleteNotification = (notificationId: string) => {
    // In a real app, this would delete from backend
    console.log('Deleting notification:', notificationId);
  };

  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter !== 'all' && notification.type !== selectedFilter) {
      return false;
    }
    if (showUnreadOnly && notification.read) {
      return false;
    }
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderNotificationDetail = () => {
    if (!selectedNotification) return null;

    return (
      <div className="min-h-screen bg-dark-bg pb-20">
        {/* Header */}
        <div className="bg-dark-card border-b border-dark-border px-4 py-4 flex items-center space-x-3">
          <button
            onClick={() => setSelectedNotification(null)}
            className="text-dark-text-secondary hover:text-dark-text transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-dark-text">Notification Details</h1>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Notification Header */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-dark-bg rounded-lg">
                {getNotificationIcon(selectedNotification.type, selectedNotification.category)}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-dark-text mb-2">
                  {selectedNotification.title}
                </h2>
                <p className="text-dark-text-secondary mb-4">
                  {selectedNotification.message}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dark-text-secondary">
                    {formatTimestamp(selectedNotification.timestamp)}
                  </span>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedNotification.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                    selectedNotification.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                    selectedNotification.priority === 'medium' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {selectedNotification.priority} priority
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          {selectedNotification.metadata && (
            <div className="bg-dark-card border border-dark-border rounded-xl p-4">
              <h3 className="text-lg font-semibold text-dark-text mb-3">Details</h3>
              <div className="space-y-2">
                {Object.entries(selectedNotification.metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-2 border-b border-dark-border last:border-b-0">
                    <span className="text-dark-text-secondary capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                    </span>
                    <span className="text-dark-text font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {selectedNotification.actionUrl && (
              <button className="w-full bg-gradient-to-r from-primary-red to-primary-red-dark text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity">
                <span>View Details</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
            
            <div className="flex space-x-3">
              <button
                onClick={() => markAsRead(selectedNotification.id)}
                className="flex-1 bg-dark-bg border border-dark-border text-dark-text py-3 rounded-xl font-semibold hover:border-primary-red-light/30 transition-colors"
              >
                Mark as Read
              </button>
              <button
                onClick={() => deleteNotification(selectedNotification.id)}
                className="flex-1 bg-red-500/10 border border-red-500/30 text-red-400 py-3 rounded-xl font-semibold hover:bg-red-500/20 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderNotifications = () => (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              showUnreadOnly
                ? 'bg-primary-red text-white'
                : 'bg-dark-card border border-dark-border text-dark-text hover:border-primary-red-light/30'
            }`}
          >
            {showUnreadOnly ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>{showUnreadOnly ? 'Show All' : 'Unread Only'}</span>
          </button>
          
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-dark-text text-sm focus:border-primary-red focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="credential">Credentials</option>
            <option value="reputation">Reputation</option>
            <option value="staking">Staking</option>
            <option value="system">System</option>
          </select>
        </div>
        
        <span className="text-sm text-dark-text-secondary">
          {unreadCount} unread
        </span>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-dark-card border border-dark-border rounded-xl p-8 text-center">
          <Bell className="w-12 h-12 text-dark-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-dark-text mb-2">No notifications</h3>
          <p className="text-dark-text-secondary">
            {showUnreadOnly ? 'No unread notifications' : 'You\'re all caught up!'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => setSelectedNotification(notification)}
              className={`bg-dark-card border border-dark-border rounded-xl p-4 cursor-pointer hover:border-primary-red-light/30 transition-colors border-l-4 ${getPriorityColor(notification.priority)} ${
                !notification.read ? 'bg-dark-card/80' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-dark-bg rounded-lg flex-shrink-0">
                  {getNotificationIcon(notification.type, notification.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className={`font-medium truncate ${
                      !notification.read ? 'text-dark-text' : 'text-dark-text-secondary'
                    }`}>
                      {notification.title}
                    </h4>
                    <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary-red rounded-full"></div>
                      )}
                      <span className="text-xs text-dark-text-secondary">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-dark-text-secondary line-clamp-2">
                    {notification.message}
                  </p>
                  {notification.metadata && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {notification.metadata.amount && (
                        <span className="bg-primary-red/20 text-primary-red px-2 py-1 rounded text-xs">
                          {notification.metadata.amount}
                        </span>
                      )}
                      {notification.metadata.scoreChange && (
                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                          +{notification.metadata.scoreChange} points
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-dark-text mb-2">Notification Preferences</h3>
        <p className="text-sm text-dark-text-secondary mb-4">
          Choose which notifications you want to receive
        </p>
      </div>

      {/* Notification Categories */}
      <div className="space-y-4">
        <div className="bg-dark-card border border-dark-border rounded-xl p-4">
          <h4 className="text-dark-text font-medium mb-3">Credential Notifications</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-dark-text font-medium">New Credentials</p>
                  <p className="text-sm text-dark-text-secondary">When you receive new verifiable credentials</p>
                </div>
              </div>
              <button
                onClick={() => setNotificationSettings(prev => ({ ...prev, newCredentials: !prev.newCredentials }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationSettings.newCredentials ? 'bg-primary-red' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationSettings.newCredentials ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-4">
          <h4 className="text-dark-text font-medium mb-3">Reputation Notifications</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-dark-text font-medium">Score Updates</p>
                  <p className="text-sm text-dark-text-secondary">When your reputation score changes</p>
                </div>
              </div>
              <button
                onClick={() => setNotificationSettings(prev => ({ ...prev, reputationUpdates: !prev.reputationUpdates }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationSettings.reputationUpdates ? 'bg-primary-red' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationSettings.reputationUpdates ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-dark-text font-medium">New Attestations</p>
                  <p className="text-sm text-dark-text-secondary">When others attest to your credentials</p>
                </div>
              </div>
              <button
                onClick={() => setNotificationSettings(prev => ({ ...prev, attestations: !prev.attestations }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationSettings.attestations ? 'bg-primary-red' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationSettings.attestations ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Award className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-dark-text font-medium">Badges Earned</p>
                  <p className="text-sm text-dark-text-secondary">When you earn new reputation badges</p>
                </div>
              </div>
              <button
                onClick={() => setNotificationSettings(prev => ({ ...prev, badgesEarned: !prev.badgesEarned }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationSettings.badgesEarned ? 'bg-primary-red' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationSettings.badgesEarned ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-4">
          <h4 className="text-dark-text font-medium mb-3">Staking Notifications</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Coins className="w-5 h-5 text-primary-red" />
                <div>
                  <p className="text-dark-text font-medium">Staking Rewards</p>
                  <p className="text-sm text-dark-text-secondary">When rewards are available to claim</p>
                </div>
              </div>
              <button
                onClick={() => setNotificationSettings(prev => ({ ...prev, stakingRewards: !prev.stakingRewards }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationSettings.stakingRewards ? 'bg-primary-red' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationSettings.stakingRewards ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-4">
          <h4 className="text-dark-text font-medium mb-3">System Notifications</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Info className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-dark-text font-medium">System Announcements</p>
                  <p className="text-sm text-dark-text-secondary">Important platform updates and maintenance</p>
                </div>
              </div>
              <button
                onClick={() => setNotificationSettings(prev => ({ ...prev, systemAnnouncements: !prev.systemAnnouncements }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationSettings.systemAnnouncements ? 'bg-primary-red' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationSettings.systemAnnouncements ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Methods */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-4">
        <h4 className="text-dark-text font-medium mb-3">Delivery Methods</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-dark-text font-medium">Push Notifications</p>
                <p className="text-sm text-dark-text-secondary">Receive notifications in your browser</p>
              </div>
            </div>
            <button
              onClick={() => setNotificationSettings(prev => ({ ...prev, pushNotifications: !prev.pushNotifications }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationSettings.pushNotifications ? 'bg-primary-red' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationSettings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Info className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-dark-text font-medium">Email Notifications</p>
                <p className="text-sm text-dark-text-secondary">Receive notifications via email</p>
              </div>
            </div>
            <button
              onClick={() => setNotificationSettings(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationSettings.emailNotifications ? 'bg-primary-red' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationSettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (selectedNotification) {
    return renderNotificationDetail();
  }

  const navigationItems = [
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-dark-bg pb-20">
      {/* Header */}
      <div className="bg-dark-card border-b border-dark-border px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-dark-text">Notifications</h1>
        {unreadCount > 0 && (
          <div className="bg-primary-red text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {unreadCount}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-dark-card border-b border-dark-border px-4 py-2">
        <div className="flex space-x-1">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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
        {activeView === 'notifications' && renderNotifications()}
        {activeView === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default NotificationsPage;