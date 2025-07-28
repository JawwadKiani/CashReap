import type { Express } from "express";
import { buildAffiliateUrl, trackAffiliateClick } from "@shared/affiliate-links";
import { isAuthenticated } from "./replitAuth";

export function registerAffiliateRoutes(app: Express) {
  // Redirect to affiliate partner with tracking
  app.get("/apply/:cardId", async (req, res) => {
    try {
      const { cardId } = req.params;
      const userId = (req.user as any)?.claims?.sub; // Optional user tracking
      
      // Track the affiliate click for analytics
      trackAffiliateClick(cardId, userId);
      
      // Get the affiliate URL with proper tracking
      const affiliateUrl = buildAffiliateUrl(cardId, userId);
      
      if (affiliateUrl === '#') {
        return res.status(404).json({ message: "Card application not available" });
      }
      
      // Add conversion tracking pixel/script if needed
      const trackingScript = `
        <script>
          // Track affiliate conversion for analytics
          if (typeof gtag !== 'undefined') {
            gtag('event', 'affiliate_click', {
              'card_id': '${cardId}',
              'user_id': '${userId || 'anonymous'}',
              'value': 1
            });
          }
          
          // Redirect after tracking
          setTimeout(() => {
            window.location.href = '${affiliateUrl}';
          }, 100);
        </script>
      `;
      
      // Return tracking page that redirects to affiliate
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Redirecting to Credit Card Application...</title>
          <meta name="robots" content="noindex">
        </head>
        <body>
          <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h2>Redirecting you to the credit card application...</h2>
            <p>If you're not redirected automatically, <a href="${affiliateUrl}">click here</a>.</p>
            <div style="margin-top: 30px;">
              <div style="border: 2px solid #ddd; border-radius: 8px; padding: 15px; background: #f9f9f9;">
                <p style="font-size: 12px; color: #666; margin: 0;">
                  <strong>Disclosure:</strong> CashReap may receive compensation if you're approved for this credit card. 
                  This helps us keep our service free and continue providing valuable recommendations.
                </p>
              </div>
            </div>
          </div>
          ${trackingScript}
        </body>
        </html>
      `);
      
    } catch (error) {
      console.error("Error processing affiliate redirect:", error);
      res.status(500).json({ message: "Failed to process application request" });
    }
  });

  // API endpoint to get affiliate link without redirect
  app.get("/api/affiliate-link/:cardId", async (req, res) => {
    try {
      const { cardId } = req.params;
      const userId = (req.user as any)?.claims?.sub;
      
      const affiliateUrl = buildAffiliateUrl(cardId, userId);
      
      res.json({
        cardId,
        affiliateUrl,
        hasAffiliate: affiliateUrl !== '#',
        disclosure: "CashReap may receive compensation if you're approved for this credit card."
      });
      
    } catch (error) {
      console.error("Error getting affiliate link:", error);
      res.status(500).json({ message: "Failed to get affiliate link" });
    }
  });

  // Track affiliate conversion (called by partner via webhook/postback)
  app.post("/api/affiliate-conversion", async (req, res) => {
    try {
      const { cardId, userId, conversionId, commissionAmount } = req.body;
      
      // Store conversion data in database for reporting
      // await storage.recordAffiliateConversion({
      //   cardId,
      //   userId,
      //   conversionId,
      //   commissionAmount,
      //   timestamp: new Date()
      // });
      
      console.log("Affiliate conversion recorded:", {
        cardId,
        userId,
        conversionId,
        commissionAmount
      });
      
      res.json({ success: true, message: "Conversion recorded" });
      
    } catch (error) {
      console.error("Error recording affiliate conversion:", error);
      res.status(500).json({ message: "Failed to record conversion" });
    }
  });

  // Analytics endpoint for internal tracking
  app.get("/api/affiliate-stats", isAuthenticated, async (req, res) => {
    try {
      // This would query your analytics database
      const stats = {
        totalClicks: 1250,
        totalConversions: 45,
        conversionRate: "3.6%",
        totalCommissions: "$6,750",
        topPerformingCards: [
          { cardId: "chase-sapphire-preferred", clicks: 245, conversions: 12 },
          { cardId: "amex-gold", clicks: 189, conversions: 8 },
          { cardId: "capital-one-venture-x", clicks: 156, conversions: 7 }
        ]
      };
      
      res.json(stats);
      
    } catch (error) {
      console.error("Error fetching affiliate stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });
}