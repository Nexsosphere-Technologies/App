import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import TopBar from '../components/TopBar';
import TrustSnapshot from '../components/TrustSnapshot';
import QuickActions from '../components/QuickActions';
import RecentActivity from '../components/RecentActivity';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <TopBar />
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <TrustSnapshot score={85} maxScore={100} />
          <QuickActions />
          <RecentActivity />
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
});