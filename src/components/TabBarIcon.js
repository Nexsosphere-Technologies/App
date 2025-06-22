import React from 'react';
import { Feather } from '@expo/vector-icons';

export default function TabBarIcon({ name, color, size }) {
  return <Feather name={name} size={size} color={color} />;
}