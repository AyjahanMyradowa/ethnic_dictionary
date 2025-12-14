
import React, { useState } from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/commonStyles';
import SearchBar from '../components/SearchBar';
import DictionaryEntry from '../components/DictionaryEntry';
import BottomNavigation from '../components/BottomNavigation';
import Icon from '../components/Icon';
import { searchDictionary, DictionaryEntry as DictionaryEntryType } from '../data/dictionary';

export default function MainScreen() {
  const [searchResults, setSearchResults] = useState<DictionaryEntryType[]>([]);
  const [activeTab, setActiveTab] = useState('home');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (query: string) => {
    try {
      console.log('Searching for:', query);
      const results = searchDictionary(query);
      setSearchResults(results);
      setHasSearched(true);
      if (query.trim()) {
        setActiveTab('search');
      }
    } catch (error) {
      console.error('Error during search:', error);
      setSearchResults([]);
    }
  };

  const handleTabPress = (tab: string) => {
    try {
      console.log('Tab pressed:', tab);
      setActiveTab(tab);
    } catch (error) {
      console.error('Error handling tab press:', error);
    }
  };

  const renderHomeContent = () => (
    <View style={styles.homeContent}>
      <View style={styles.logoContainer}>
        <Icon name="book" size={80} color={colors.primary} />
      </View>
      <Text style={commonStyles.title}>Etniki sözlük</Text>
      <Text style={styles.subtitle}>Türkmen diliniň köne sözleriniň sözlügi</Text>
      
      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeText}>
          Bu sözlük türkmen diliniň köne we däp bolmadyk sözleriniň manysyny tapmaga kömek edýär.
        </Text>
        <Text style={styles.instructionText}>
          Gözleýän sözüňizi ýokardaky gözleg meýdanyna ýazyň.
        </Text>
      </View>
    </View>
  );

  const renderSearchContent = () => (
    <View style={styles.searchContent}>
      {!hasSearched ? (
        <View style={styles.emptyState}>
          <Icon name="search" size={60} color={colors.textLight} />
          <Text style={styles.emptyStateText}>Söz gözläň</Text>
          <Text style={styles.emptyStateSubtext}>
            Türkmen diliniň köne sözlerini tapmak üçin ýokarda gözleg ediň
          </Text>
        </View>
      ) : searchResults.length > 0 ? (
        <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.resultsTitle}>
            {searchResults.length} netije tapyldy
          </Text>
          {searchResults.map((entry, index) => (
            <DictionaryEntry key={`${entry.word}-${index}`} entry={entry} />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Icon name="sad" size={60} color={colors.textLight} />
          <Text style={styles.emptyStateText}>Netije tapylmady</Text>
          <Text style={styles.emptyStateSubtext}>
            Başga söz bilen synanyşyň
          </Text>
        </View>
      )}
    </View>
  );

  const renderFavoritesContent = () => (
    <View style={styles.emptyState}>
      <Icon name="heart-outline" size={60} color={colors.textLight} />
      <Text style={styles.emptyStateText}>Halanlar</Text>
      <Text style={styles.emptyStateSubtext}>
        Halan sözleriňiz bu ýerde görkeziler
      </Text>
    </View>
  );

  const renderAboutContent = () => (
    <View style={styles.aboutContent}>
      <Icon name="information-circle" size={60} color={colors.primary} />
      <Text style={commonStyles.subtitle}>Etniki sözlük hakda</Text>
      <View style={styles.aboutCard}>
        <Text style={styles.aboutText}>
          Bu programma türkmen diliniň köne we häzirki wagtda az ulanylýan sözleriniň manysyny öwrenmäge kömek edýär.
        </Text>
        <Text style={styles.aboutText}>
          Sözlükde türkmen diliniň baý taryhyndan gelen köne sözler we olaryň häzirki zaman manylary bar.
        </Text>
        <Text style={styles.aboutText}>
          Programma türkmen dilini öwrenmek we onuň baý taryhyny bilmek isleýänler üçin döredildi.
        </Text>
      </View>
    </View>
  );

  const renderContent = () => {
    try {
      switch (activeTab) {
        case 'search':
          return renderSearchContent();
        case 'favorites':
          return renderFavoritesContent();
        case 'about':
          return renderAboutContent();
        default:
          return renderHomeContent();
      }
    } catch (error) {
      console.error('Error rendering content:', error);
      return (
        <View style={styles.emptyState}>
          <Icon name="warning" size={60} color={colors.textLight} />
          <Text style={styles.emptyStateText}>Ýalňyşlyk ýüze çykdy</Text>
          <Text style={styles.emptyStateSubtext}>
            Sahypany täzeden açmaga synanyşyň
          </Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.header}>
        <SearchBar onSearch={handleSearch} />
      </View>
      
      <View style={styles.content}>
        {renderContent()}
      </View>

      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  homeContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: colors.accent,
    borderRadius: 50,
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  welcomeCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 4,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  instructionText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
    textAlign: 'center',
  },
  searchContent: {
    flex: 1,
    paddingTop: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  aboutContent: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  aboutCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    marginTop: 20,
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 4,
  },
  aboutText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 16,
    textAlign: 'justify',
  },
});
