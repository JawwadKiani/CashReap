// Credit Card Affiliate Links Configuration
// Replace with your actual affiliate tracking URLs

export interface AffiliateLink {
  cardId: string;
  affiliateUrl: string;
  networkName: string;
  commissionRate: string;
  trackingParams: Record<string, string>;
}

export const AFFILIATE_LINKS: Record<string, AffiliateLink> = {
  // Chase Cards
  "chase-sapphire-reserve": {
    cardId: "chase-sapphire-reserve",
    affiliateUrl: "https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve?CELL=6RRW&int_source=affiliate&int_medium=uproduct",
    networkName: "Chase Affiliate Program",
    commissionRate: "$150-250",
    trackingParams: {
      source: "cashreap",
      medium: "affiliate",
      campaign: "sapphire-reserve"
    }
  },
  "chase-sapphire-preferred": {
    cardId: "chase-sapphire-preferred",
    affiliateUrl: "https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred?CELL=6RRW&int_source=affiliate&int_medium=uproduct",
    networkName: "Chase Affiliate Program",
    commissionRate: "$100-200",
    trackingParams: {
      source: "cashreap",
      medium: "affiliate",
      campaign: "sapphire-preferred"
    }
  },
  "chase-freedom-unlimited": {
    cardId: "chase-freedom-unlimited",
    affiliateUrl: "https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited?CELL=6RRW&int_source=affiliate&int_medium=uproduct",
    networkName: "Chase Affiliate Program",
    commissionRate: "$75-150",
    trackingParams: {
      source: "cashreap",
      medium: "affiliate",
      campaign: "freedom-unlimited"
    }
  },
  "chase-freedom-flex": {
    cardId: "chase-freedom-flex",
    affiliateUrl: "https://creditcards.chase.com/cash-back-credit-cards/freedom/flex?CELL=6RRW&int_source=affiliate&int_medium=uproduct",
    networkName: "Chase Affiliate Program",
    commissionRate: "$75-150",
    trackingParams: {
      source: "cashreap",
      medium: "affiliate",
      campaign: "freedom-flex"
    }
  },
  "chase-ink-business-preferred": {
    cardId: "chase-ink-business-preferred",
    affiliateUrl: "https://creditcards.chase.com/business-credit-cards/ink/business-preferred?CELL=6RRW&int_source=affiliate&int_medium=uproduct",
    networkName: "Chase Affiliate Program",
    commissionRate: "$200-300",
    trackingParams: {
      source: "cashreap",
      medium: "affiliate",
      campaign: "ink-business-preferred"
    }
  },

  // American Express Cards
  "amex-platinum": {
    cardId: "amex-platinum",
    affiliateUrl: "https://www.americanexpress.com/us/credit-cards/card/platinum/?eep=25330&linknav=US-Acq-Shop-Consumer-VAC-Prospect-CardDetail-Platinum-Header",
    networkName: "American Express Affiliate Program",
    commissionRate: "$200-400",
    trackingParams: {
      source: "cashreap",
      medium: "affiliate",
      campaign: "platinum-card"
    }
  },
  "amex-gold": {
    cardId: "amex-gold",
    affiliateUrl: "https://www.americanexpress.com/us/credit-cards/card/gold-card/?eep=25330&linknav=US-Acq-Shop-Consumer-VAC-Prospect-CardDetail-Gold-Header",
    networkName: "American Express Affiliate Program",
    commissionRate: "$150-250",
    trackingParams: {
      source: "cashreap",
      medium: "affiliate",
      campaign: "gold-card"
    }
  },
  "amex-everyday-preferred": {
    cardId: "amex-everyday-preferred",
    affiliateUrl: "https://www.americanexpress.com/us/credit-cards/card/blue-cash-everyday/?eep=25330&linknav=US-Acq-Shop-Consumer-VAC-Prospect-CardDetail-BCE-Header",
    networkName: "American Express Affiliate Program",
    commissionRate: "$100-200",
    trackingParams: {
      source: "cashreap",
      medium: "affiliate",
      campaign: "everyday-preferred"
    }
  },
  "amex-blue-cash-preferred": {
    cardId: "amex-blue-cash-preferred",
    affiliateUrl: "https://www.americanexpress.com/us/credit-cards/card/blue-cash-preferred/?eep=25330&linknav=US-Acq-Shop-Consumer-VAC-Prospect-CardDetail-BCP-Header",
    networkName: "American Express Affiliate Program",
    commissionRate: "$100-200",
    trackingParams: {
      source: "cashreap",
      medium: "affiliate",
      campaign: "blue-cash-preferred"
    }
  },
  "amex-business-platinum": {
    cardId: "amex-business-platinum",
    affiliateUrl: "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-platinum-credit-card/?eep=25330",
    networkName: "American Express Affiliate Program",
    commissionRate: "$250-400",
    trackingParams: {
      source: "cashreap",
      medium: "affiliate",
      campaign: "business-platinum"
    }
  },

  // Capital One Cards
  "capital-one-venture-x": {
    cardId: "capital-one-venture-x",
    affiliateUrl: "https://www.capitalone.com/credit-cards/venture-x/?external_id=WWW_XXXXX_ZZZ_ONL-SE_XXXXX_T_SEM2_GGLSRCH_Cardname_BMM_Venture-X_XXXXX",
    networkName: "Capital One Affiliate Program",
    commissionRate: "$150-250",
    trackingParams: {
      source: "cashreap",
      medium: "affiliate",
      campaign: "venture-x"
    }
  },
  "capital-one-venture": {
    cardId: "capital-one-venture",
    affiliateUrl: "https://www.capitalone.com/credit-cards/venture/?external_id=WWW_XXXXX_ZZZ_ONL-SE_XXXXX_T_SEM2_GGLSRCH_Cardname_BMM_Venture_XXXXX",
    networkName: "Capital One Affiliate Program",
    commissionRate: "$100-200",
    trackingParams: {
      source: "cashreap",
      medium: "affiliate",
      campaign: "venture"
    }
  },
  "capital-one-savor-one": {
    cardId: "capital-one-savor-one",
    affiliateUrl: "https://www.capitalone.com/credit-cards/savorone-dining-rewards/?external_id=WWW_XXXXX_ZZZ_ONL-SE_XXXXX_T_SEM2_GGLSRCH_Cardname_BMM_SavorOne_XXXXX",
    networkName: "Capital One Affiliate Program",
    commissionRate: "$75-150",
    trackingParams: {
      source: "cashreap",
      medium: "affiliate",
      campaign: "savor-one"
    }
  },
  "capital-one-quicksilver": {
    cardId: "capital-one-quicksilver",
    affiliateUrl: "https://www.capitalone.com/credit-cards/quicksilver/?external_id=WWW_XXXXX_ZZZ_ONL-SE_XXXXX_T_SEM2_GGLSRCH_Cardname_BMM_Quicksilver_XXXXX",
    networkName: "Capital One Affiliate Program",
    commissionRate: "$75-150",
    trackingParams: {
      source: "cashreap",
      medium: "affiliate",
      campaign: "quicksilver"
    }
  },
  "capital-one-spark-cash-plus": {
    cardId: "capital-one-spark-cash-plus",
    affiliateUrl: "https://www.capitalone.com/credit-cards/business/spark-cash-plus/?external_id=WWW_XXXXX_ZZZ_ONL-SE_XXXXX_T_SEM2_GGLSRCH_Cardname_BMM_SparkCashPlus_XXXXX",
    networkName: "Capital One Affiliate Program",
    commissionRate: "$200-300",
    trackingParams: {
      source: "cashreap",
      medium: "affiliate",
      campaign: "spark-cash-plus"
    }
  }
};

// Helper function to build tracking URL
export function buildAffiliateUrl(cardId: string, userId?: string): string {
  const affiliate = AFFILIATE_LINKS[cardId];
  if (!affiliate) {
    console.warn(`No affiliate link found for card: ${cardId}`);
    return '#';
  }

  const url = new URL(affiliate.affiliateUrl);
  
  // Add tracking parameters
  Object.entries(affiliate.trackingParams).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  // Add user tracking if available
  if (userId) {
    url.searchParams.set('user_id', userId);
    url.searchParams.set('timestamp', Date.now().toString());
  }

  return url.toString();
}

// Track affiliate click for analytics
export function trackAffiliateClick(cardId: string, userId?: string) {
  // This would integrate with your analytics system
  console.log('Affiliate click tracked:', {
    cardId,
    userId,
    timestamp: new Date().toISOString(),
    source: 'cashreap'
  });
  
  // Example: Send to analytics service
  // analytics.track('affiliate_click', { cardId, userId });
}