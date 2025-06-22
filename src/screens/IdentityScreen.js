import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import CredentialCard from '../components/CredentialCard';
import CredentialDetail from '../components/CredentialDetail';

const credentials = [
  {
    id: '1',
    type: 'education',
    title: 'University Degree',
    issuer: 'Massachusetts Institute of Technology',
    status: 'verified',
    expiry: '2028-05-15',
    icon: 'graduation-cap',
    color: ['#3b82f6', '#2563eb'],
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
    icon: 'briefcase',
    color: ['#10b981', '#059669'],
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
    icon: 'shield',
    color: ['#8b5cf6', '#7c3aed'],
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
    icon: 'award',
    color: ['#f59e0b', '#d97706'],
    description: 'Certified Algorand Developer',
    claims: {
      'Candidate Name': 'John Doe',
      'Certification': 'Algorand Developer Level 2',
      'Application Date': '2024-01-15',
      'Status': 'Under Review'
    }
  }
];

export default function IdentityScreen() {
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleCredentialPress = (credential) => {
    setSelectedCredential(credential);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedCredential(null);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Identity</Text>
          <TouchableOpacity style={styles.addButton}>
            <Feather name="plus" size={24} color="#ef4444" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* My DIDs Card */}
          <View style={styles.didCard}>
            <Text style={styles.sectionTitle}>My DIDs</Text>
            <View style={styles.didInfo}>
              <View>
                <Text style={styles.didLabel}>Primary DID</Text>
                <Text style={styles.didValue}>did:algo:mainnet:7ZUECA7...</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.switchButton}>Switch</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Verifiable Credentials */}
          <View style={styles.credentialsSection}>
            <Text style={styles.sectionTitle}>Verifiable Credentials</Text>
            {credentials.map((credential) => (
              <CredentialCard
                key={credential.id}
                credential={credential}
                onPress={() => handleCredentialPress(credential)}
              />
            ))}
          </View>
        </ScrollView>

        {/* Credential Detail Modal */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          {selectedCredential && (
            <CredentialDetail
              credential={selectedCredential}
              onClose={closeModal}
            />
          )}
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fafafa',
  },
  addButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  didCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#262626',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fafafa',
    marginBottom: 12,
  },
  didInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  didLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fafafa',
    marginBottom: 4,
  },
  didValue: {
    fontSize: 14,
    color: '#a3a3a3',
    fontFamily: 'monospace',
  },
  switchButton: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
  },
  credentialsSection: {
    marginTop: 24,
    marginBottom: 100,
  },
});