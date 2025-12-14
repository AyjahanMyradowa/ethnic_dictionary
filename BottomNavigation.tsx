
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';

interface BottomNavigationProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

export default function BottomNavigation({ activeTab, onTabPress }: BottomNavigationProps) {
  const tabs = [
    { id: 'home', label: 'Baş sahypa', icon: 'home' as const },
    { id: 'search', label: 'Gözleg', icon: 'search' as const },
    { id: 'favorites', label: 'Halanlar', icon: 'heart' as const },
    { id: 'about', label: 'Hakda', icon: 'information-circle' as const },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.activeTab]}
          onPress={() => onTabPress(tab.id)}
        >
          <Icon
            name={tab.icon}
            size={24}
            color={activeTab === tab.id ? colors.primary : colors.textLight}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === tab.id && styles.activeTabLabel
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundAlt,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: colors.accent,
    boxShadow: `0px -2px 10px ${colors.shadow}`,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  activeTab: {
    backgroundColor: colors.accent,
    borderRadius: 12,
  },
  tabLabel: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 4,
    textAlign: 'center',
  },
  activeTabLabel: {
    color: colors.text,
    fontWeight: '600',
  },
});
