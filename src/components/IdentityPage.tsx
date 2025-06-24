import React, { useState } from 'react';
import { Plus, GraduationCap, Briefcase, Shield, Award, CheckCircle, Clock, X, QrCode, ArrowLeft, ExternalLink, Sparkles, Zap } from 'lucide-react';

interface Credential {
  id: string;
  type: 'education' | 'employment' | 'health' | 'certification';
  title: string;
  issuer: string;
  status: 'verified' | 'pending' | 'revoked';
  expiry?: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  claims: { [key: string]: string };
}

const IdentityPage: React.FC = () => {
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const credentials: Credential[] = [
    {
      id: '1',
      type: 'education',
      title: 'University Degree',
      issuer: 'Massachusetts Institute of Technology',
      status: 'verified',
      expiry: '2028-05-15',
      icon: <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: 'from-blue-500 to-blue-600',
      description: 'Bachelor of Science in Computer Science',
      claims: {
        'Full Name': 'John Doe',
        'Course': 'Computer Science',
        'Graduation Date': '2023-05-15',
        'GPA': '3.8/4.0',
        'Honors': 'Magna Cum Laude'
      }
    },
    {
      id: '2',
      type: 'employment',
      title: 'Employment Verification',
      issuer: 'TechCorp Solutions',
      status: 'verified',
      icon: <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: 'from-green-500 to-green-600',
      description: 'Senior Software Engineer',
      claims: {
        'Employee Name': 'John Doe',
        'Position': 'Senior Software Engineer',
        'Start Date': '2023-06-01',
        'Employment Status': 'Active',
        'Department': 'Engineering'
      }
    },
    {
      id: '3',
      type: 'health',
      title: 'COVID-19 Vaccination',
      issuer: 'City Health Department',
      status: 'verified',
      expiry: '2025-03-20',
      icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: 'from-purple-500 to-purple-600',
      description: 'Full COVID-19 Vaccination Certificate',
      claims: {
        'Patient Name': 'John Doe',
        'Vaccine Type': 'Pfizer-BioNTech',
        'Doses': '2 + 1 Booster',
        'Last Dose Date': '2024-03-20',
        'Vaccination Site': 'City Medical Center'
      }
    },
    {
      id: '4',
      type: 'certification',
      title: 'Professional Certification',
      issuer: 'Algorand Foundation',
      status: 'pending',
      icon: <Award className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: 'from-orange-500 to-orange-600',
      description: 'Certified Algorand Developer',
      claims: {
        'Candidate Name': 'John Doe',
        'Certification': 'Algorand Developer Level 2',
        'Application Date': '2024-01-15',
        'Status': 'Under Review'
      }
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 animate-bounce-gentle" />;
      case 'pending':
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 animate-pulse" />;
      case 'revoked':
        return <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 animate-shake" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'pending':
        return 'Pending';
      case 'revoked':
        return 'Revoked';
      default:
        return 'Unknown';
    }
  };

  if (selectedCredential) {
    return (
      <div className="min-h-screen bg-dark-bg pb-20 animate-fade-in-scale">
        {/* Header */}
        <div className="bg-dark-card border-b border-dark-border px-3 sm:px-4 py-3 sm:py-4 flex items-center space-x-3 animate-slide-in-up">
          <button
            onClick={() => {
              setSelectedCredential(null);
              setShowQRCode(false);
            }}
            className="text-dark-text-secondary hover:text-dark-text transition-all duration-300 hover-scale"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <h1 className="text-lg sm:text-xl font-semibold text-dark-text">Credential Details</h1>
        </div>

        <div className="px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 stagger-animation">
          {/* Credential Header */}
          <div className="text-center space-y-3 sm:space-y-4 animate-fade-in-scale relative">
            {/* Floating sparkles */}
            <div className="absolute -top-2 -right-2 animate-sparkle">
              <Sparkles className="w-4 h-4 text-primary-red opacity-60" />
            </div>
            <div className="absolute -top-4 -left-2 animate-sparkle" style={{ animationDelay: '0.5s' }}>
              <Zap className="w-3 h-3 text-blue-400 opacity-40" />
            </div>

            <div className={`inline-flex p-3 sm:p-4 rounded-2xl bg-gradient-to-br ${selectedCredential.color} animate-pulse-glow hover-scale transition-transform duration-300`}>
              {selectedCredential.icon}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-dark-text mb-2 animate-typewriter">
                {selectedCredential.title}
              </h2>
              <p className="text-sm sm:text-base text-dark-text-secondary animate-slide-in-up">
                {selectedCredential.description}
              </p>
            </div>
          </div>

          {/* Issuer Info */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-3 sm:p-4 hover-lift transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-dark-bg rounded-lg flex items-center justify-center flex-shrink-0 animate-float">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary-red" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-dark-text-secondary">Issued by</p>
                <p className="text-sm sm:text-base text-dark-text font-medium truncate">
                  {selectedCredential.issuer}
                </p>
              </div>
              <div className="flex-shrink-0">
                {getStatusIcon(selectedCredential.status)}
              </div>
            </div>
          </div>

          {/* Present Credential Button */}
          {selectedCredential.status === 'verified' && (
            <button
              onClick={() => setShowQRCode(!showQRCode)}
              className="w-full bg-gradient-to-r from-primary-red to-primary-red-dark text-white py-3 sm:py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all duration-300 hover-lift hover-glow btn-ripple animate-pulse-glow"
            >
              <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">
                {showQRCode ? 'Hide QR Code' : 'Present Credential'}
              </span>
            </button>
          )}

          {/* QR Code */}
          {showQRCode && (
            <div className="bg-white p-4 sm:p-6 rounded-xl text-center animate-fade-in-scale hover-lift transition-all duration-300">
              <div className="w-40 h-40 sm:w-48 sm:h-48 bg-gray-200 rounded-lg mx-auto mb-3 sm:mb-4 flex items-center justify-center animate-pulse-glow">
                <QrCode className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 animate-float" />
              </div>
              <p className="text-gray-600 text-xs sm:text-sm">Scan this QR code to verify credential</p>
            </div>
          )}

          {/* Key Claims */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-3 sm:p-4 hover-lift transition-all duration-300">
            <h3 className="text-base sm:text-lg font-semibold text-dark-text mb-3 sm:mb-4 animate-slide-in-left">
              Key Claims
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {Object.entries(selectedCredential.claims).map(([key, value], index) => (
                <div 
                  key={key} 
                  className="flex justify-between items-start py-2 border-b border-dark-border last:border-b-0 gap-3 animate-slide-in-up hover-glow transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="text-xs sm:text-sm text-dark-text-secondary flex-shrink-0">{key}:</span>
                  <span className="text-xs sm:text-sm text-dark-text font-medium text-right break-words">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Expiry */}
          {selectedCredential.expiry && (
            <div className="bg-dark-card border border-dark-border rounded-xl p-3 sm:p-4 hover-lift transition-all duration-300">
              <div className="flex justify-between items-center">
                <span className="text-sm text-dark-text-secondary">Expires:</span>
                <span className="text-sm text-dark-text font-medium animate-blink">
                  {selectedCredential.expiry}
                </span>
              </div>
            </div>
          )}

          {/* View Raw Credential */}
          <button className="w-full text-dark-text-secondary hover:text-dark-text transition-all duration-300 flex items-center justify-center space-x-2 py-2 hover-scale">
            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm">View Raw Credential</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg pb-20 animate-fade-in-scale">
      {/* Header */}
      <div className="bg-dark-card border-b border-dark-border px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between animate-slide-in-up">
        <h1 className="text-lg sm:text-xl font-semibold text-dark-text">My Identity</h1>
        <button className="text-primary-red hover:text-primary-red-light transition-all duration-300 hover-scale animate-bounce-gentle">
          <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      <div className="px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* My DIDs Card */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-3 sm:p-4 hover-lift transition-all duration-300 animate-slide-in-left relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-red/5 via-transparent to-blue-500/5 animate-gradient-shift opacity-50 pointer-events-none"></div>
          
          <h3 className="text-base sm:text-lg font-semibold text-dark-text mb-3 relative z-10">My DIDs</h3>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base text-dark-text font-medium">Primary DID</p>
              <p className="text-xs sm:text-sm text-dark-text-secondary font-mono truncate animate-typewriter">
                did:algo:mainnet:7ZUECA7...
              </p>
            </div>
            <button className="text-primary-red hover:text-primary-red-light transition-all duration-300 text-xs sm:text-sm flex-shrink-0 ml-3 hover-scale">
              Switch
            </button>
          </div>
        </div>

        {/* Verifiable Credentials */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-dark-text mb-3 sm:mb-4 animate-slide-in-left">
            Verifiable Credentials
          </h3>
          <div className="space-y-2 sm:space-y-3 stagger-animation">
            {credentials.map((credential, index) => (
              <button
                key={credential.id}
                onClick={() => setSelectedCredential(credential)}
                onMouseEnter={() => setHoveredCard(credential.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="w-full bg-dark-card border border-dark-border rounded-xl p-3 sm:p-4 transition-all duration-300 text-left hover-lift hover-glow relative overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-red/5 via-transparent to-blue-500/5 animate-gradient-shift opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                
                {/* Floating sparkles on hover */}
                {hoveredCard === credential.id && (
                  <>
                    <div className="absolute top-2 right-2 animate-sparkle">
                      <Sparkles className="w-3 h-3 text-primary-red opacity-60" />
                    </div>
                    <div className="absolute top-4 right-6 animate-sparkle" style={{ animationDelay: '0.3s' }}>
                      <Zap className="w-2 h-2 text-blue-400 opacity-40" />
                    </div>
                  </>
                )}

                <div className="flex items-start space-x-3 sm:space-x-4 relative z-10">
                  <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-br ${credential.color} flex-shrink-0 transition-transform duration-300 ${
                    hoveredCard === credential.id ? 'animate-bounce-gentle' : ''
                  }`}>
                    {credential.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1 gap-2">
                      <h4 className="text-sm sm:text-base text-dark-text font-medium truncate">
                        {credential.title}
                      </h4>
                      <div className="flex-shrink-0">
                        {getStatusIcon(credential.status)}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-dark-text-secondary mb-1 truncate">
                      Issued by {credential.issuer}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 transition-all duration-300 ${
                        credential.status === 'verified' ? 'bg-green-500/20 text-green-400' :
                        credential.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {getStatusText(credential.status)}
                      </span>
                      {credential.expiry && (
                        <span className="text-xs text-dark-text-secondary truncate">
                          Expires: {credential.expiry}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress bar animation on hover */}
                <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary-red to-blue-500 transition-all duration-500 ease-out"
                     style={{ 
                       width: hoveredCard === credential.id ? '100%' : '0%',
                       opacity: hoveredCard === credential.id ? 1 : 0
                     }}>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityPage;