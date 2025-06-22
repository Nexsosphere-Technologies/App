import React, { useState } from 'react';
import { Plus, GraduationCap, Briefcase, Shield, Award, CheckCircle, Clock, X, QrCode, ArrowLeft, ExternalLink } from 'lucide-react';

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

  const credentials: Credential[] = [
    {
      id: '1',
      type: 'education',
      title: 'University Degree',
      issuer: 'Massachusetts Institute of Technology',
      status: 'verified',
      expiry: '2028-05-15',
      icon: <GraduationCap className="w-6 h-6" />,
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
      icon: <Briefcase className="w-6 h-6" />,
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
      icon: <Shield className="w-6 h-6" />,
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
      icon: <Award className="w-6 h-6" />,
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
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'revoked':
        return <X className="w-5 h-5 text-red-500" />;
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
      <div className="min-h-screen bg-dark-bg pb-20">
        {/* Header */}
        <div className="bg-dark-card border-b border-dark-border px-4 py-4 flex items-center space-x-3">
          <button
            onClick={() => {
              setSelectedCredential(null);
              setShowQRCode(false);
            }}
            className="text-dark-text-secondary hover:text-dark-text transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-dark-text">Credential Details</h1>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Credential Header */}
          <div className="text-center space-y-4">
            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${selectedCredential.color}`}>
              {selectedCredential.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-dark-text mb-2">{selectedCredential.title}</h2>
              <p className="text-dark-text-secondary">{selectedCredential.description}</p>
            </div>
          </div>

          {/* Issuer Info */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-dark-bg rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-red" />
              </div>
              <div>
                <p className="text-sm text-dark-text-secondary">Issued by</p>
                <p className="text-dark-text font-medium">{selectedCredential.issuer}</p>
              </div>
              <div className="ml-auto">
                {getStatusIcon(selectedCredential.status)}
              </div>
            </div>
          </div>

          {/* Present Credential Button */}
          {selectedCredential.status === 'verified' && (
            <button
              onClick={() => setShowQRCode(!showQRCode)}
              className="w-full bg-gradient-to-r from-primary-red to-primary-red-dark text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
            >
              <QrCode className="w-5 h-5" />
              <span>{showQRCode ? 'Hide QR Code' : 'Present Credential'}</span>
            </button>
          )}

          {/* QR Code */}
          {showQRCode && (
            <div className="bg-white p-6 rounded-xl text-center">
              <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <QrCode className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-gray-600 text-sm">Scan this QR code to verify credential</p>
            </div>
          )}

          {/* Key Claims */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-4">
            <h3 className="text-lg font-semibold text-dark-text mb-4">Key Claims</h3>
            <div className="space-y-3">
              {Object.entries(selectedCredential.claims).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-dark-border last:border-b-0">
                  <span className="text-dark-text-secondary">{key}:</span>
                  <span className="text-dark-text font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Expiry */}
          {selectedCredential.expiry && (
            <div className="bg-dark-card border border-dark-border rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-dark-text-secondary">Expires:</span>
                <span className="text-dark-text font-medium">{selectedCredential.expiry}</span>
              </div>
            </div>
          )}

          {/* View Raw Credential */}
          <button className="w-full text-dark-text-secondary hover:text-dark-text transition-colors flex items-center justify-center space-x-2 py-2">
            <ExternalLink className="w-4 h-4" />
            <span className="text-sm">View Raw Credential</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg pb-20">
      {/* Header */}
      <div className="bg-dark-card border-b border-dark-border px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-dark-text">My Identity</h1>
        <button className="text-primary-red hover:text-primary-red-light transition-colors">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* My DIDs Card */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-4">
          <h3 className="text-lg font-semibold text-dark-text mb-3">My DIDs</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text font-medium">Primary DID</p>
              <p className="text-sm text-dark-text-secondary font-mono">did:algo:mainnet:7ZUECA7...</p>
            </div>
            <button className="text-primary-red hover:text-primary-red-light transition-colors text-sm">
              Switch
            </button>
          </div>
        </div>

        {/* Verifiable Credentials */}
        <div>
          <h3 className="text-lg font-semibold text-dark-text mb-4">Verifiable Credentials</h3>
          <div className="space-y-3">
            {credentials.map((credential) => (
              <button
                key={credential.id}
                onClick={() => setSelectedCredential(credential)}
                className="w-full bg-dark-card border border-dark-border rounded-xl p-4 hover:border-primary-red-light/30 transition-colors text-left"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${credential.color} flex-shrink-0`}>
                    {credential.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-dark-text font-medium truncate">{credential.title}</h4>
                      {getStatusIcon(credential.status)}
                    </div>
                    <p className="text-sm text-dark-text-secondary mb-1">
                      Issued by {credential.issuer}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        credential.status === 'verified' ? 'bg-green-500/20 text-green-400' :
                        credential.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {getStatusText(credential.status)}
                      </span>
                      {credential.expiry && (
                        <span className="text-xs text-dark-text-secondary">
                          Expires: {credential.expiry}
                        </span>
                      )}
                    </div>
                  </div>
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