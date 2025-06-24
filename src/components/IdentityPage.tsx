import React, { useState, useEffect } from 'react';
import { Plus, GraduationCap, Briefcase, Shield, Award, CheckCircle, Clock, X, QrCode, ArrowLeft, ExternalLink, Sparkles, Zap, Upload, Download } from 'lucide-react';
import { useAlgorand, useDID } from '../hooks/useAlgorand';
import { vcService } from '../services/algorand';

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
  hash?: string;
}

const IdentityPage: React.FC = () => {
  const { isConnected, address } = useAlgorand();
  const { userDID, createDID, loading: didLoading } = useDID();
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateDID, setShowCreateDID] = useState(false);
  const [showRequestCredential, setShowRequestCredential] = useState(false);

  // Load user credentials on component mount
  useEffect(() => {
    if (isConnected && address) {
      loadUserCredentials();
    }
  }, [isConnected, address]);

  const loadUserCredentials = async () => {
    setLoading(true);
    try {
      const userCredentials = await vcService.getUserCredentials(address);
      
      // Transform the data to match our interface
      const transformedCredentials: Credential[] = userCredentials.map((cred, index) => ({
        id: cred.id || `cred-${index}`,
        type: cred.type || 'certification',
        title: cred.title || 'Unknown Credential',
        issuer: cred.issuer || 'Unknown Issuer',
        status: cred.status || 'verified',
        expiry: cred.expiry,
        icon: getCredentialIcon(cred.type),
        color: getCredentialColor(cred.type),
        description: cred.description || '',
        claims: cred.claims || {},
        hash: cred.hash
      }));
      
      setCredentials(transformedCredentials);
    } catch (error) {
      console.error('Failed to load credentials:', error);
      // Use mock data as fallback
      setCredentials(getMockCredentials());
    } finally {
      setLoading(false);
    }
  };

  const getCredentialIcon = (type: string) => {
    switch (type) {
      case 'education': return <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'employment': return <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'health': return <Shield className="w-5 h-5 sm:w-6 sm:h-6" />;
      default: return <Award className="w-5 h-5 sm:w-6 sm:h-6" />;
    }
  };

  const getCredentialColor = (type: string) => {
    switch (type) {
      case 'education': return 'from-blue-500 to-blue-600';
      case 'employment': return 'from-green-500 to-green-600';
      case 'health': return 'from-purple-500 to-purple-600';
      default: return 'from-orange-500 to-orange-600';
    }
  };

  const getMockCredentials = (): Credential[] => [
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
    }
  ];

  const handleCreateDID = async () => {
    try {
      setLoading(true);
      const didDocument = JSON.stringify({
        '@context': ['https://www.w3.org/ns/did/v1'],
        id: `did:algo:testnet:${address}`,
        verificationMethod: [{
          id: `did:algo:testnet:${address}#key-1`,
          type: 'Ed25519VerificationKey2020',
          controller: `did:algo:testnet:${address}`,
          publicKeyBase58: address
        }],
        service: [{
          id: `did:algo:testnet:${address}#identity-hub`,
          type: 'IdentityHub',
          serviceEndpoint: 'https://hub.nexdentify.com'
        }]
      });

      await createDID(didDocument);
      setShowCreateDID(false);
    } catch (error) {
      console.error('Failed to create DID:', error);
      alert('Failed to create DID. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCredential = async (credentialType: string, issuer: string) => {
    try {
      setLoading(true);
      
      // In a real implementation, this would:
      // 1. Generate a credential request
      // 2. Send it to the issuer
      // 3. Wait for the issuer to issue the credential
      
      // For demo purposes, we'll simulate this
      const credentialId = `cred-${Date.now()}`;
      const credentialHash = 'sha256-' + Math.random().toString(36).substring(2, 15);
      
      // This would normally be done by the issuer
      await vcService.issueCredential(
        credentialId,
        credentialHash,
        address,
        credentialType,
        'https://schema.org/EducationalCredential',
        Date.now() + (365 * 24 * 60 * 60 * 1000), // 1 year from now
        JSON.stringify({ requestedBy: address, timestamp: Date.now() })
      );
      
      // Reload credentials
      await loadUserCredentials();
      setShowRequestCredential(false);
      
      alert('Credential request sent successfully!');
    } catch (error) {
      console.error('Failed to request credential:', error);
      alert('Failed to request credential. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePresentCredential = async (credential: Credential) => {
    if (!credential.hash) {
      alert('Credential hash not available');
      return;
    }

    try {
      // Verify the credential before presenting
      const isValid = await vcService.verifyCredential(credential.id, credential.hash);
      
      if (isValid) {
        setShowQRCode(true);
        // In a real implementation, this would generate a presentation QR code
        // containing the credential data and proof
      } else {
        alert('Credential verification failed');
      }
    } catch (error) {
      console.error('Failed to verify credential:', error);
      alert('Failed to verify credential');
    }
  };

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
      case 'verified': return 'Verified';
      case 'pending': return 'Pending';
      case 'revoked': return 'Revoked';
      default: return 'Unknown';
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-dark-bg pb-20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Shield className="w-16 h-16 text-primary-red mx-auto animate-pulse-glow" />
          <h2 className="text-xl font-semibold text-dark-text">Connect Your Wallet</h2>
          <p className="text-dark-text-secondary">Please connect your Algorand wallet to manage your identity</p>
        </div>
      </div>
    );
  }

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
              <h2 className="text-xl sm:text-2xl font-bold text-dark-text mb-2">
                {selectedCredential.title}
              </h2>
              <p className="text-sm sm:text-base text-dark-text-secondary">
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
              onClick={() => handlePresentCredential(selectedCredential)}
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
              <div className="mt-3 text-xs text-gray-500 font-mono">
                Credential ID: {selectedCredential.id}
              </div>
            </div>
          )}

          {/* Key Claims */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-3 sm:p-4 hover-lift transition-all duration-300">
            <h3 className="text-base sm:text-lg font-semibold text-dark-text mb-3 sm:mb-4">
              Key Claims
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {Object.entries(selectedCredential.claims).map(([key, value], index) => (
                <div 
                  key={key} 
                  className="flex justify-between items-start py-2 border-b border-dark-border last:border-b-0 gap-3 hover-glow transition-all duration-300"
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

          {/* Blockchain Info */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-3 sm:p-4 hover-lift transition-all duration-300">
            <h3 className="text-base sm:text-lg font-semibold text-dark-text mb-3">Blockchain Verification</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-dark-text-secondary">Network:</span>
                <span className="text-sm text-dark-text font-medium">Algorand Testnet</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-dark-text-secondary">Hash:</span>
                <span className="text-sm text-dark-text font-mono truncate">
                  {selectedCredential.hash || 'sha256-abc123...'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-dark-text-secondary">Status:</span>
                <span className="text-sm text-green-400 font-medium">On-chain Verified</span>
              </div>
            </div>
          </div>

          {/* Expiry */}
          {selectedCredential.expiry && (
            <div className="bg-dark-card border border-dark-border rounded-xl p-3 sm:p-4 hover-lift transition-all duration-300">
              <div className="flex justify-between items-center">
                <span className="text-sm text-dark-text-secondary">Expires:</span>
                <span className="text-sm text-dark-text font-medium">
                  {selectedCredential.expiry}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg pb-20 animate-fade-in-scale">
      {/* Header */}
      <div className="bg-dark-card border-b border-dark-border px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between animate-slide-in-up">
        <h1 className="text-lg sm:text-xl font-semibold text-dark-text">My Identity</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowRequestCredential(true)}
            className="text-blue-500 hover:text-blue-400 transition-all duration-300 hover-scale"
            title="Request Credential"
          >
            <Upload className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button 
            onClick={() => setShowCreateDID(true)}
            className="text-primary-red hover:text-primary-red-light transition-all duration-300 hover-scale animate-bounce-gentle"
          >
            <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      <div className="px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* My DIDs Card */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-3 sm:p-4 hover-lift transition-all duration-300 animate-slide-in-left relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-red/5 via-transparent to-blue-500/5 animate-gradient-shift opacity-50 pointer-events-none"></div>
          
          <h3 className="text-base sm:text-lg font-semibold text-dark-text mb-3 relative z-10">My DIDs</h3>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base text-dark-text font-medium">Primary DID</p>
              <p className="text-xs sm:text-sm text-dark-text-secondary font-mono truncate">
                {userDID || `did:algo:testnet:${address.substring(0, 10)}...`}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {userDID ? (
                <CheckCircle className="w-5 h-5 text-green-500 animate-bounce-gentle" />
              ) : (
                <button
                  onClick={() => setShowCreateDID(true)}
                  className="text-primary-red hover:text-primary-red-light transition-all duration-300 text-xs sm:text-sm hover-scale"
                  disabled={didLoading}
                >
                  {didLoading ? 'Creating...' : 'Create DID'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Wallet Info */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-3 sm:p-4 hover-lift transition-all duration-300">
          <h3 className="text-base sm:text-lg font-semibold text-dark-text mb-3">Wallet Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-dark-text-secondary">Address:</span>
              <span className="text-sm text-dark-text font-mono truncate ml-2">
                {address.substring(0, 10)}...{address.substring(-6)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-dark-text-secondary">Network:</span>
              <span className="text-sm text-dark-text">Algorand Testnet</span>
            </div>
          </div>
        </div>

        {/* Verifiable Credentials */}
        <div>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-dark-text animate-slide-in-left">
              Verifiable Credentials
            </h3>
            {loading && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-red"></div>
            )}
          </div>
          
          {credentials.length === 0 ? (
            <div className="bg-dark-card border border-dark-border rounded-xl p-8 text-center">
              <Award className="w-12 h-12 text-dark-text-secondary mx-auto mb-4 animate-float" />
              <h3 className="text-lg font-semibold text-dark-text mb-2">No Credentials Yet</h3>
              <p className="text-dark-text-secondary mb-4">
                Start building your digital identity by requesting verifiable credentials
              </p>
              <button
                onClick={() => setShowRequestCredential(true)}
                className="bg-gradient-to-r from-primary-red to-primary-red-dark text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Request First Credential
              </button>
            </div>
          ) : (
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
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-red/5 via-transparent to-blue-500/5 animate-gradient-shift opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  
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

                  <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary-red to-blue-500 transition-all duration-500 ease-out"
                       style={{ 
                         width: hoveredCard === credential.id ? '100%' : '0%',
                         opacity: hoveredCard === credential.id ? 1 : 0
                       }}>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create DID Modal */}
      {showCreateDID && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-dark-text mb-4">Create Your DID</h3>
            <p className="text-dark-text-secondary mb-6">
              Create a decentralized identifier (DID) to anchor your identity on the Algorand blockchain.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCreateDID(false)}
                className="flex-1 bg-dark-bg border border-dark-border text-dark-text py-3 rounded-xl font-semibold hover:border-primary-red-light/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDID}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-primary-red to-primary-red-dark text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create DID'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Credential Modal */}
      {showRequestCredential && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-dark-text mb-4">Request Credential</h3>
            <p className="text-dark-text-secondary mb-6">
              Request a verifiable credential from a trusted issuer.
            </p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-dark-text-secondary mb-2">Credential Type</label>
                <select className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text focus:border-primary-red focus:outline-none">
                  <option value="education">Education Credential</option>
                  <option value="employment">Employment Verification</option>
                  <option value="certification">Professional Certification</option>
                  <option value="health">Health Record</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-dark-text-secondary mb-2">Issuer</label>
                <select className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text focus:border-primary-red focus:outline-none">
                  <option value="mit">Massachusetts Institute of Technology</option>
                  <option value="techcorp">TechCorp Solutions</option>
                  <option value="algorand">Algorand Foundation</option>
                  <option value="health-dept">City Health Department</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowRequestCredential(false)}
                className="flex-1 bg-dark-bg border border-dark-border text-dark-text py-3 rounded-xl font-semibold hover:border-primary-red-light/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRequestCredential('education', 'MIT')}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-primary-red to-primary-red-dark text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Requesting...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdentityPage;