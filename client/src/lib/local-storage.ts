// Local storage utilities for saving user data without authentication

export interface LocalSavedCard {
  id: string;
  cardId: string;
  name: string;
  issuer: string;
  annualFee: number;
  baseRewardRate: number;
  savedAt: string;
}

export interface LocalSearchHistory {
  id: string;
  storeName: string;
  storeId: string;
  searchedAt: string;
}

const SAVED_CARDS_KEY = 'cashreap_saved_cards';
const SEARCH_HISTORY_KEY = 'cashreap_search_history';

// Saved Cards Functions
export function getSavedCards(): LocalSavedCard[] {
  try {
    const stored = localStorage.getItem(SAVED_CARDS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading saved cards from localStorage:', error);
    return [];
  }
}

export function saveCard(card: {
  id: string;
  name: string;
  issuer: string;
  annualFee: number;
  baseRewardRate: number;
}): void {
  try {
    const savedCards = getSavedCards();
    console.log('Current saved cards:', savedCards.length);
    
    // Check if card is already saved
    const existingCard = savedCards.find(saved => saved.cardId === card.id);
    if (existingCard) {
      console.log('Card already saved:', card.name);
      return; // Already saved
    }

    const newSavedCard: LocalSavedCard = {
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      cardId: card.id,
      name: card.name,
      issuer: card.issuer,
      annualFee: card.annualFee,
      baseRewardRate: card.baseRewardRate,
      savedAt: new Date().toISOString()
    };

    savedCards.push(newSavedCard);
    localStorage.setItem(SAVED_CARDS_KEY, JSON.stringify(savedCards));
    console.log('Card saved successfully:', card.name, 'Total cards:', savedCards.length);
  } catch (error) {
    console.error('Error saving card to localStorage:', error);
  }
}

export function removeSavedCard(cardId: string): void {
  try {
    const savedCards = getSavedCards();
    const filteredCards = savedCards.filter(card => card.cardId !== cardId);
    localStorage.setItem(SAVED_CARDS_KEY, JSON.stringify(filteredCards));
  } catch (error) {
    console.error('Error removing saved card from localStorage:', error);
  }
}

export function isCardSaved(cardId: string): boolean {
  const savedCards = getSavedCards();
  return savedCards.some(card => card.cardId === cardId);
}

// Search History Functions
export function getSearchHistory(): LocalSearchHistory[] {
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    const history = stored ? JSON.parse(stored) : [];
    // Return most recent first, limit to 20 items
    return history.sort((a: LocalSearchHistory, b: LocalSearchHistory) => 
      new Date(b.searchedAt).getTime() - new Date(a.searchedAt).getTime()
    ).slice(0, 20);
  } catch (error) {
    console.error('Error reading search history from localStorage:', error);
    return [];
  }
}

export function addToSearchHistory(store: { id: string; name: string }): void {
  try {
    const history = getSearchHistory();
    
    // Remove existing entry for this store if it exists
    const filteredHistory = history.filter(item => item.storeId !== store.id);
    
    // Add new entry at the beginning
    const newHistoryItem: LocalSearchHistory = {
      id: `search_${Date.now()}`,
      storeName: store.name,
      storeId: store.id,
      searchedAt: new Date().toISOString()
    };

    filteredHistory.unshift(newHistoryItem);
    
    // Keep only the 20 most recent searches
    const limitedHistory = filteredHistory.slice(0, 20);
    
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('Error adding to search history:', error);
  }
}

export function clearSearchHistory(): void {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing search history:', error);
  }
}

export function clearAllLocalData(): void {
  try {
    localStorage.removeItem(SAVED_CARDS_KEY);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing local data:', error);
  }
}

// Migration functions for when user signs up
export function migrateSavedCardsToAccount(userId: string): LocalSavedCard[] {
  const localCards = getSavedCards();
  // Return the cards for API migration, but keep them locally until confirmed
  return localCards;
}

export function clearLocalDataAfterMigration(): void {
  // Only call this after successful API migration
  clearAllLocalData();
}