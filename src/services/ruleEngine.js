
// ========== FACTOR DEFINITIONS ==========
const AVAILABLE_FACTORS = {
    // Monetary
    totalSpent: {
        type: 'number',
        min: 0,
        max: 1000000,
        description: 'Total lifetime spending',
        defaultWeight: 0.25
    },
    avgTransactionValue: {
        type: 'number',
        min: 0,
        max: 10000,
        description: 'Average value per transaction',
        defaultWeight: 0.15
    },
    highestTransaction: {
        type: 'number',
        min: 0,
        max: 50000,
        description: 'Highest single transaction amount',
        defaultWeight: 0.10
    },
    recentSpent30Days: {
        type: 'number',
        min: 0,
        max: 50000,
        description: 'Total spending in last 30 days',
        defaultWeight: 0.20
    },
    recurringRevenue: {
        type: 'number',
        min: 0,
        max: 10000,
        description: 'Monthly recurring revenue',
        defaultWeight: 0.15
    },
    
    // Behavioral
    transactionFrequency: {
        type: 'number',
        min: 0,
        max: 100,
        description: 'Number of transactions per month',
        defaultWeight: 0.20
    },
    daysSinceLastActivity: {
        type: 'number',
        min: 0,
        max: 365,
        description: 'Days since last interaction',
        invert: true,
        defaultWeight: 0.10
    },
    sessionDuration: {
        type: 'number',
        min: 0,
        max: 240,
        description: 'Average session duration in minutes',
        defaultWeight: 0.05
    },
    pagesViewedPerVisit: {
        type: 'number',
        min: 0,
        max: 50,
        description: 'Average pages viewed per session',
        defaultWeight: 0.05
    },
    reviewCount: {
        type: 'number',
        min: 0,
        max: 500,
        description: 'Number of product reviews written',
        defaultWeight: 0.05
    },
    referralCount: {
        type: 'number',
        min: 0,
        max: 100,
        description: 'Number of successful referrals',
        defaultWeight: 0.15
    },
    
    // Loyalty
    accountAgeDays: {
        type: 'number',
        min: 0,
        max: 3650,
        description: 'Days since account creation',
        defaultWeight: 0.10
    },
    loyaltyTierDuration: {
        type: 'number',
        min: 0,
        max: 730,
        description: 'Days in current tier',
        defaultWeight: 0.10
    },
    returnRate: {
        type: 'number',
        min: 0,
        max: 100,
        description: 'Percentage of returned items',
        invert: true,
        defaultWeight: 0.08
    },
    supportTickets: {
        type: 'number',
        min: 0,
        max: 50,
        description: 'Number of support tickets',
        invert: true,
        defaultWeight: 0.05
    },
    paymentReliability: {
        type: 'percentage',
        min: 0,
        max: 100,
        description: 'On-time payment percentage',
        defaultWeight: 0.10
    },
    
    // Social & Engagement
    socialShares: {
        type: 'number',
        min: 0,
        max: 1000,
        description: 'Product shares on social media',
        defaultWeight: 0.05
    },
    newsletterClicks: {
        type: 'percentage',
        min: 0,
        max: 100,
        description: 'Email click-through rate',
        defaultWeight: 0.05
    },
    featureUsageCount: {
        type: 'number',
        min: 0,
        max: 20,
        description: 'Number of features used',
        defaultWeight: 0.08
    },
    eventAttendance: {
        type: 'number',
        min: 0,
        max: 50,
        description: 'Number of events/webinars attended',
        defaultWeight: 0.05
    },
    betaParticipation: {
        type: 'boolean',
        description: 'Participates in beta features',
        defaultWeight: 0.03
    },
    
    // Predictive
    churnRiskScore: {
        type: 'number',
        min: 0,
        max: 100,
        description: 'Churn risk score (lower is better)',
        invert: true,
        defaultWeight: 0.12
    },
    lifetimeValueScore: {
        type: 'number',
        min: 0,
        max: 100000,
        description: 'Predicted lifetime value',
        defaultWeight: 0.15
    },
    seasonalBonus: {
        type: 'multiplier',
        min: 0.5,
        max: 2,
        description: 'Seasonal spending multiplier',
        defaultWeight: 0.05
    }
};

// ========== TIER DEFINITIONS ==========
const DEFAULT_TIERS = [
    { 
        name: 'PREMIUM', 
        minScore: 85,
        color: '#FFD700',
        benefits: [
            '2x bonus points on all purchases',
            'Priority 24/7 support',
            'Free expedited shipping',
            'Early access to sales',
            'Exclusive premium events',
            'Personal account manager'
        ]
    },
    { 
        name: 'STANDARD', 
        minScore: 60,
        color: '#C0C0C0',
        benefits: [
            '1.5x bonus points',
            'Priority email support',
            'Free standard shipping',
            'Early sale access (24h)'
        ]
    },
    { 
        name: 'NORMAL', 
        minScore: 30,
        color: '#CD7F32',
        benefits: [
            '1x bonus points',
            'Standard support',
            'Limited time offers'
        ]
    },
    { 
        name: 'BRONZE', 
        minScore: 10,
        color: '#8B4513',
        benefits: [
            '1x bonus points',
            'Basic support',
            'Welcome offers'
        ]
    },
    { 
        name: 'NEW', 
        minScore: 0,
        color: '#808080',
        benefits: [
            'Welcome bonus',
            'Guided onboarding',
            'First purchase discount'
        ]
    }
];

// ========== SCENARIO TEMPLATES ==========
const SCENARIO_TEMPLATES = {
    'big_spender': {
        name: 'Big Spender Focus',
        description: 'Prioritises customers with high transaction values',
        weights: {
            totalSpent: 0.35,
            avgTransactionValue: 0.25,
            highestTransaction: 0.20,
            recentSpent30Days: 0.20
        }
    },
    'loyal_fan': {
        name: 'Loyal Fan Focus',
        description: 'Rewards long‑term, consistent customers',
        weights: {
            accountAgeDays: 0.30,
            transactionFrequency: 0.25,
            loyaltyTierDuration: 0.20,
            referralCount: 0.15,
            reviewCount: 0.10
        }
    },
    'super_user': {
        name: 'Super User Focus',
        description: 'Highlights platform engagement',
        weights: {
            sessionDuration: 0.25,
            featureUsageCount: 0.25,
            pagesViewedPerVisit: 0.20,
            newsletterClicks: 0.15,
            eventAttendance: 0.15
        }
    },
    'balanced': {
        name: 'Balanced Assessment',
        description: 'Equal weight across all factors',
        weights: 'auto_balance'
    },
    'retention': {
        name: 'Retention Priority',
        description: 'Identifies at‑risk valuable customers',
        weights: {
            churnRiskScore: 0.30,
            daysSinceLastActivity: 0.25,
            recentSpent30Days: 0.20,
            supportTickets: 0.15,
            paymentReliability: 0.10
        }
    }
};

// ========== ADVANCED RULE ENGINE CLASS ==========
class AdvancedRuleEngine {
    constructor(config = null) {
        this.config = config || {
            activeScenario: 'balanced',
            customWeights: null,
            tiers: DEFAULT_TIERS,
            enabledFactors: Object.keys(AVAILABLE_FACTORS),
            normalizationMethod: 'min_max'
        };
        this.loadScenario(this.config.activeScenario);
    }

    // Load a predefined scenario or custom weights
    loadScenario(scenarioName, customWeights = null) {
        if (customWeights) {
            this.weights = customWeights;
            this.scenarioName = 'custom';
        } else if (SCENARIO_TEMPLATES[scenarioName]) {
            const template = SCENARIO_TEMPLATES[scenarioName];
            if (template.weights === 'auto_balance') {
                const factorCount = this.config.enabledFactors.length;
                const equalWeight = 1 / factorCount;
                this.weights = {};
                this.config.enabledFactors.forEach(factor => {
                    this.weights[factor] = equalWeight;
                });
            } else {
                this.weights = { ...template.weights };
            }
            this.scenarioName = scenarioName;
        } else {
            throw new Error(`Scenario ${scenarioName} not found`);
        }
        this.normalizeWeights();
    }

    // Ensure weights sum to 1
    normalizeWeights() {
        const total = Object.values(this.weights).reduce((sum, w) => sum + w, 0);
        if (Math.abs(total - 1) > 0.01) {
            Object.keys(this.weights).forEach(key => {
                this.weights[key] = this.weights[key] / total;
            });
        }
    }

    // Calculate score for a single factor (0‑100)
    calculateFactorScore(factorName, value, customerData) {
        const factorConfig = AVAILABLE_FACTORS[factorName];
        if (!factorConfig) return 0;
        
        let normalizedScore = 0;
        const { type, min, max, invert } = factorConfig;
        
        switch(type) {
            case 'number':
                if (this.config.normalizationMethod === 'min_max') {
                    normalizedScore = ((value - min) / (max - min)) * 100;
                    normalizedScore = Math.max(0, Math.min(100, normalizedScore));
                }
                break;
            case 'percentage':
                normalizedScore = value;
                break;
            case 'boolean':
                normalizedScore = value ? 100 : 0;
                break;
            case 'multiplier':
                normalizedScore = ((value - min) / (max - min)) * 100;
                break;
        }
        
        if (invert) {
            normalizedScore = 100 - normalizedScore;
        }
        
        // Apply factor‑specific adjustments
        normalizedScore = this.applyFactorAdjustments(factorName, normalizedScore, customerData);
        return normalizedScore;
    }

    // Optional adjustments for specific factors
    applyFactorAdjustments(factorName, score, customerData) {
        switch(factorName) {
            case 'transactionFrequency':
                if (customerData.transactionVariance && customerData.transactionVariance < 0.2) {
                    score = Math.min(100, score * 1.1);
                }
                break;
            case 'accountAgeDays':
                if (customerData.accountAgeDays > 730) {
                    score = Math.min(100, score * 1.05);
                }
                break;
            case 'recentSpent30Days':
                if (customerData.previous30DaysSpent && 
                    customerData.recentSpent30Days > customerData.previous30DaysSpent * 1.5) {
                    score = Math.min(100, score * 1.15);
                }
                break;
        }
        return score;
    }

    // Calculate overall customer score (0‑100)
    calculateCustomerScore(customerData) {
        let totalScore = 0;
        let totalWeight = 0;
        
        for (const [factorName, weight] of Object.entries(this.weights)) {
            if (!this.config.enabledFactors.includes(factorName)) continue;
            const value = customerData[factorName];
            if (value === undefined || value === null) continue;
            
            const factorScore = this.calculateFactorScore(factorName, value, customerData);
            totalScore += factorScore * weight;
            totalWeight += weight;
        }
        
        if (totalWeight === 0) return 0;
        let finalScore = totalScore / totalWeight;
        finalScore = this.applyScenarioModifiers(finalScore, customerData);
        return Math.round(finalScore);
    }

    // Apply scenario‑specific bonuses/penalties
    applyScenarioModifiers(score, customerData) {
        let modified = score;
        switch(this.scenarioName) {
            case 'big_spender':
                if (customerData.highestTransaction > 5000) modified *= 1.1;
                break;
            case 'loyal_fan':
                if (customerData.referralCount > 5) modified *= 1.08;
                break;
            case 'super_user':
                if (customerData.featureUsageCount > 15) modified *= 1.12;
                break;
            case 'retention':
                if (customerData.churnRiskScore > 70) modified *= 0.7;
                break;
        }
        return Math.min(100, modified);
    }

    // Determine tier from score
    getTierFromScore(score) {
        const sortedTiers = [...this.config.tiers].sort((a, b) => b.minScore - a.minScore);
        for (const tier of sortedTiers) {
            if (score >= tier.minScore) {
                return { ...tier, score };
            }
        }
        return { ...sortedTiers[sortedTiers.length - 1], score };
    }

    // Main classification method
    classifyCustomer(customerData) {
        const score = this.calculateCustomerScore(customerData);
        const tier = this.getTierFromScore(score);
        const explanation = this.generateClassificationExplanation(customerData, score, tier);
        
        return {
            customerId: customerData.id,
            score,
            tier: tier.name,
            tierDetails: tier,
            explanation,
            factorsBreakdown: this.getFactorsBreakdown(customerData),
            timestamp: new Date().toISOString()
        };
    }

    // Detailed breakdown of each factor's contribution
    getFactorsBreakdown(customerData) {
        const breakdown = [];
        for (const [factorName, weight] of Object.entries(this.weights)) {
            const value = customerData[factorName];
            if (value === undefined) continue;
            const rawScore = this.calculateFactorScore(factorName, value, customerData);
            const weightedContribution = rawScore * weight;
            breakdown.push({
                factor: factorName,
                value,
                rawScore: Math.round(rawScore),
                weight,
                contribution: Math.round(weightedContribution),
                description: AVAILABLE_FACTORS[factorName]?.description
            });
        }
        return breakdown.sort((a, b) => b.contribution - a.contribution);
    }

    // Human‑readable explanation
    generateClassificationExplanation(customerData, score, tier) {
        const breakdown = this.getFactorsBreakdown(customerData);
        const topFactors = breakdown.slice(0, 3);
        const bottomFactors = breakdown.slice(-3).filter(f => f.contribution < 20);
        
        let explanation = `Customer scored ${score}/100, achieving ${tier.name} tier.\n\n`;
        explanation += `Top contributing factors:\n`;
        topFactors.forEach(f => {
            explanation += `• ${f.description || f.factor}: ${f.value} → ${f.rawScore} points\n`;
        });
        if (bottomFactors.length) {
            explanation += `\nAreas for improvement:\n`;
            bottomFactors.forEach(f => {
                explanation += `• ${f.description || f.factor}: ${f.value} → ${f.rawScore} points\n`;
            });
        }
        return explanation;
    }

    // Admin methods
    updateWeights(newWeights) {
        this.weights = { ...newWeights };
        this.normalizeWeights();
        this.scenarioName = 'custom';
        return { success: true, weights: this.weights };
    }

    updateTiers(newTiers) {
        this.config.tiers = newTiers;
        return { success: true, tiers: this.config.tiers };
    }

    enableFactors(factors) {
        this.config.enabledFactors = [...new Set([...this.config.enabledFactors, ...factors])];
        return { success: true, enabledFactors: this.config.enabledFactors };
    }

    disableFactors(factors) {
        this.config.enabledFactors = this.config.enabledFactors.filter(f => !factors.includes(f));
        return { success: true, enabledFactors: this.config.enabledFactors };
    }

    getConfiguration() {
        return {
            activeScenario: this.scenarioName,
            weights: this.weights,
            tiers: this.config.tiers,
            enabledFactors: this.config.enabledFactors,
            availableFactors: AVAILABLE_FACTORS,
            scenarios: SCENARIO_TEMPLATES
        };
    }
}

module.exports = { AdvancedRuleEngine, AVAILABLE_FACTORS, SCENARIO_TEMPLATES, DEFAULT_TIERS };
