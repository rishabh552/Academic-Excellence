export interface CaseStudy {
    id: string;
    title: string;
    category: string;
    challenge: string;
    solution: string;
    approach: string[];
    results: { metric: string; value: string }[];
    techStack: string[];
    timeline: string;
    clientQuote?: { text: string; author: string; role: string };
}

export const caseStudies: CaseStudy[] = [
    {
        id: "ecommerce-platform",
        title: "E-Commerce Platform",
        category: "Full Stack Web",
        challenge: "A rapidly growing retail client was struggling with their legacy e-commerce system that couldn't handle peak traffic during sales events. They needed a modern solution capable of processing 10,000+ daily transactions with real-time inventory synchronization across 5 warehouse locations.",
        solution: "We architected and delivered a comprehensive MERN stack e-commerce platform built on microservices architecture. The system features real-time WebSocket connections for instant inventory updates, Stripe integration for secure payments, and a Redis-powered caching layer that reduced database load by 80%.",
        approach: [
            "Conducted thorough discovery sessions to map existing workflows and pain points",
            "Designed microservices architecture with separate services for orders, inventory, users, and payments",
            "Implemented real-time inventory sync using WebSockets and Redis pub/sub",
            "Built responsive React frontend with optimistic UI updates for instant feedback",
            "Integrated Stripe payment gateway with 3D Secure authentication",
            "Created comprehensive admin dashboard with sales analytics and reporting",
            "Set up CI/CD pipeline with automated testing and Docker containerization",
            "Deployed on AWS with auto-scaling groups and CloudFront CDN"
        ],
        results: [
            { metric: "Transaction Capacity", value: "15K+/day" },
            { metric: "Page Load Time", value: "< 1.5s" },
            { metric: "Uptime", value: "99.9%" },
            { metric: "Conversion Rate", value: "+28%" },
            { metric: "Cart Abandonment", value: "-45%" },
            { metric: "Revenue Growth", value: "+40%" }
        ],
        techStack: ["React", "Node.js", "MongoDB", "AWS", "Docker", "Redis"],
        timeline: "3 months",
        clientQuote: {
            text: "The platform exceeded our expectations. Not only did sales increase by 40% within the first quarter, but our customer support tickets dropped by 60% because the system just works flawlessly.",
            author: "Sarah Chen",
            role: "CEO, RetailHub"
        }
    },
    {
        id: "disease-prediction",
        title: "Disease Prediction",
        category: "Machine Learning",
        challenge: "A major healthcare provider was losing patients to late-stage diagnoses of preventable conditions. Their existing screening process was manual, inconsistent, and missed 40% of at-risk patients.",
        solution: "We developed a sophisticated ensemble machine learning model combining Random Forest, XGBoost, and Neural Networks that analyzes over 150 patient attributes to predict disease risk with 98.2% accuracy.",
        approach: [
            "Partnered with medical experts to identify key predictive factors and validate model outputs",
            "Collected and preprocessed 500K+ anonymized patient records with rigorous data cleaning",
            "Engineered 80+ features from raw medical data including temporal patterns and risk indicators",
            "Trained and validated ensemble model using 5-fold cross-validation with stratified sampling",
            "Implemented SHAP for model interpretability",
            "Built secure, HIPAA-compliant data pipeline with encryption at rest and in transit",
            "Created intuitive prediction dashboard with patient risk scoring and trend visualization",
            "Developed automated alert system for high-risk patients requiring immediate attention"
        ],
        results: [
            { metric: "Prediction Accuracy", value: "98.2%" },
            { metric: "Early Detection Rate", value: "+65%" },
            { metric: "False Positive Rate", value: "< 2%" },
            { metric: "Processing Time", value: "< 100ms" },
            { metric: "Patients Screened", value: "50K+/month" },
            { metric: "Lives Impacted", value: "2,000+" }
        ],
        techStack: ["Python", "TensorFlow", "PostgreSQL", "Docker", "AWS"],
        timeline: "4 months",
        clientQuote: {
            text: "This system has revolutionized our preventive care program. We're catching conditions months earlier, and the interpretable predictions help our doctors have more informed conversations with patients.",
            author: "Dr. Michael Roberts",
            role: "Chief Medical Officer, HealthFirst Network"
        }
    },
    {
        id: "fitness-tracker",
        title: "Fitness Tracker Pro",
        category: "Mobile Application",
        challenge: "A fitness startup had a vision for an app that would work seamlessly for outdoor enthusiasts—hikers, trail runners, and gym-goers who often exercise in areas with poor cellular connectivity.",
        solution: "We built a React Native application with a sophisticated offline-first architecture using local SQLite storage with intelligent background sync. The app features custom Lottie animations for workout tracking and seamless integration with Apple Health, Google Fit, and Strava.",
        approach: [
            "Designed offline-first data architecture with SQLite and async storage",
            "Implemented intelligent background sync with conflict resolution for multi-device users",
            "Built custom workout animation system using Lottie for smooth 60fps animations",
            "Created heart rate zone training with real-time BLE device integration",
            "Integrated with Apple Health, Google Fit, and Strava APIs for comprehensive data sync",
            "Developed social features including workout sharing, challenges, and leaderboards",
            "Implemented push notifications for workout reminders and achievement celebrations",
            "Optimized battery consumption to less than 5% per hour during active tracking"
        ],
        results: [
            { metric: "App Store Rating", value: "4.8 ★" },
            { metric: "Daily Active Users", value: "50K+" },
            { metric: "Offline Reliability", value: "100%" },
            { metric: "User Retention", value: "78%" },
            { metric: "Workouts Logged", value: "2M+" },
            { metric: "Battery Usage", value: "< 5%/hr" }
        ],
        techStack: ["React Native", "TypeScript", "Firebase", "Node.js"],
        timeline: "2.5 months",
        clientQuote: {
            text: "Our users are obsessed with the app! The offline reliability is a game-changer for trail runners, and we've seen workout completion rates increase by 40% since launch.",
            author: "Jake Morrison",
            role: "Founder & CEO, FitTrack Labs"
        }
    },
    {
        id: "sentiment-analyzer",
        title: "Sentiment Analyzer",
        category: "NLP",
        challenge: "A global marketing agency managing Fortune 500 brand accounts was flying blind during PR crises. Their existing social listening tools had 4-6 hour delays and couldn't distinguish between sarcasm and genuine sentiment.",
        solution: "We developed a streaming NLP pipeline powered by fine-tuned BERT transformers that processes 10,000+ social media posts per minute with 94% accuracy. The system features custom sarcasm detection and intelligent alerting.",
        approach: [
            "Fine-tuned multilingual BERT model on 2M+ labeled social media posts including sarcasm",
            "Built Apache Kafka streaming pipeline for real-time data ingestion from Twitter, Reddit, and news",
            "Implemented custom sarcasm detection layer using contrastive learning techniques",
            "Created emotion classification system detecting 8 distinct emotions beyond sentiment",
            "Developed intelligent alerting with threat scoring based on velocity, reach, and influencer involvement",
            "Built interactive analytics dashboard with real-time charts and trend visualization",
            "Added influencer identification and network analysis for crisis source tracking",
            "Implemented automated report generation with actionable insights"
        ],
        results: [
            { metric: "Processing Speed", value: "10K/min" },
            { metric: "Accuracy", value: "94%" },
            { metric: "Languages", value: "12" },
            { metric: "Alert Latency", value: "< 30s" },
            { metric: "Crises Prevented", value: "15+" },
            { metric: "Response Time", value: "-85%" }
        ],
        techStack: ["Python", "TensorFlow", "AWS", "Redis", "Docker"],
        timeline: "3 months",
        clientQuote: {
            text: "We can now respond to trending topics within minutes instead of hours. Last month, we caught a potential PR disaster for a client before it went viral.",
            author: "Emma Davis",
            role: "Head of Digital Strategy, MediaPulse Agency"
        }
    },
    {
        id: "crypto-dashboard",
        title: "Crypto Dashboard",
        category: "FinTech",
        challenge: "A FinTech startup targeting professional crypto traders found that existing dashboards were either too basic for power users or required expensive enterprise licenses. Traders needed real-time portfolio tracking with sub-100ms latency.",
        solution: "We built a high-performance trading dashboard using Next.js with WebSocket connections to 5 major exchanges. The platform features custom TradingView charting, ML-powered price prediction alerts, and comprehensive tax reporting.",
        approach: [
            "Integrated with Binance, Coinbase, Kraken, FTX, and Huobi APIs with unified data models",
            "Built custom WebSocket aggregation layer for sub-50ms price updates across all exchanges",
            "Implemented TradingView charting with custom indicators and drawing tools",
            "Developed LSTM-based ML model for price trend prediction with 72% accuracy on 1-hour windows",
            "Created portfolio analytics engine with tax lot tracking and cost basis calculations",
            "Built automated alert system for arbitrage opportunities and significant price movements",
            "Designed mobile-responsive interface with dark mode and customizable layouts",
            "Implemented secure API key vault with hardware security module integration"
        ],
        results: [
            { metric: "Data Latency", value: "< 50ms" },
            { metric: "Exchanges", value: "5" },
            { metric: "Active Traders", value: "12K+" },
            { metric: "Prediction Accuracy", value: "72%" },
            { metric: "Daily Volume Tracked", value: "$50M+" },
            { metric: "Uptime", value: "99.99%" }
        ],
        techStack: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "AWS"],
        timeline: "4 months",
        clientQuote: {
            text: "Finally, a dashboard that keeps up with the crypto markets. The arbitrage alerts alone have generated 15% additional returns for our most active users.",
            author: "Alex Thompson",
            role: "Co-founder, CryptoTrader Pro"
        }
    }
];
