// PORTFOLIO DATA - Edit this file to update your portfolio content
// DO NOT edit index.html - it reads from this file automatically

const portfolioData = {
  // PERSONAL INFO
  personal: {
    name: "Aditya Pranav Shah",
    title: "Data Science Graduate Student | Python · SQL · Machine Learning",
    tagline: "Building scalable data pipelines and ML models that turn complex datasets into decisions that matter.",
    photo: "./images/profile-placeholder.svg", // Replace with your real photo (profile.jpg)
    location: "Boston, MA",
    email: "shah.aditya@northeastern.edu",
    // phone: "+1 (857) 234-7211", // Uncomment to display in contact section
    resumeURL: "./resume/Aditya_Shah_DS_Resume.pdf", // Add PDF to resume/ folder
    calendlyURL: "https://calendly.com/shah-aditya/30min",
    githubUsername: "AdityaShah2811"
  },

  // SOCIAL LINKS
  social: {
    github: "https://github.com/AdityaShah2811",
    linkedin: "https://www.linkedin.com/in/justaditya1",
    kaggle: "#", // Add your Kaggle profile if available
    email: "mailto:shah.aditya@northeastern.edu"
  },

  // ABOUT SECTION
  about: {
    bio: [
      "Software engineer turned data scientist, currently pursuing an MS in Information Systems at Northeastern University (GPA 3.8/4.0).",
      "With 2+ years of professional experience at UtopiaTech, I built data pipelines processing 100K+ daily records, developed anomaly detection systems for 10,000+ IoT devices, and reduced incident response times by 40% through data-driven automation.",
      "My background bridges software engineering and data science — I know how to build reliable systems and how to extract insight from them. Proficient in Python, SQL, and MongoDB, and actively deepening expertise in machine learning and cloud technologies.",
      "Seeking co-op and full-time opportunities where I can apply these skills to impactful, data-driven problems."
    ],
    quickFacts: {
      location: "Boston, MA",
      education: "MS in Information Systems (2027)",
      status: "Open to Co-op & Full-time Roles",
      availability: "Immediate"
    }
  },

  // SKILLS WITH PROGRESS LEVELS
  skills: {
    languages: [
      { name: "Python", level: 80 },
      { name: "SQL", level: 70 },
      { name: "JavaScript", level: 60 },
      { name: "Java", level: 50 }
    ],
    dataAnalysis: [
      { name: "Pandas", level: 70 },
      { name: "NumPy", level: 60 },
      { name: "Scikit-learn", level: 50, badge: "learning" },
      { name: "Matplotlib/Seaborn", level: 60 }
    ],
    dataEngineering: [
      { name: "MongoDB", level: 80 },
      { name: "MySQL", level: 70 },
      { name: "Data Pipelines", level: 70 },
      { name: "ETL", level: 60 }
    ],
    tools: [
      { name: "Git", level: 80 },
      { name: "Jupyter Notebook", level: 60 },
      { name: "Tableau", level: 50, badge: "learning" },
      { name: "AWS", level: 40, badge: "learning" }
    ]
  },

  // PROJECTS
  projects: [
    {
      title: "Real-time IoT Data Pipeline & Analytics",
      description: "Built data pipeline processing sensor data from 100+ devices. Created Python dashboard analyzing 50K+ daily records. Improved system efficiency by 22% through automated anomaly detection.",
      image: "./images/projects/iot-pipeline.svg", // Replace with real screenshot (.jpg/.png)
      tech: ["Python", "MongoDB", "Pandas", "Plotly"],
      github: "https://github.com/AdityaShah2811/iot-pipeline",
      demo: null,
      status: "complete"
    },
    {
      title: "Customer Churn Prediction",
      description: "Machine learning model predicting customer churn with 87% accuracy. Analyzed 10K+ customer records using feature engineering and XGBoost classifier.",
      image: "./images/projects/churn-prediction.svg", // Replace with real screenshot (.jpg/.png)
      tech: ["Python", "Scikit-learn", "Pandas", "Seaborn"],
      github: "#",
      demo: null,
      status: "coming-soon"
    },
    {
      title: "Sales Data Analysis & Dashboard",
      description: "Interactive Tableau dashboard analyzing retail sales data. Identified 3 key trends leading to 15% revenue optimization recommendations.",
      image: "./images/projects/sales-dashboard.svg", // Replace with real screenshot (.jpg/.png)
      tech: ["Python", "SQL", "Tableau", "Pandas"],
      github: "#",
      demo: null,
      status: "coming-soon"
    },
    {
      title: "Sentiment Analysis on Reviews",
      description: "NLP model analyzing 50K+ product reviews. Achieved 82% accuracy in sentiment classification using LSTM neural networks.",
      image: "./images/projects/sentiment-analysis.svg", // Replace with real screenshot (.jpg/.png)
      tech: ["Python", "NLTK", "TensorFlow", "Streamlit"],
      github: "#",
      demo: null,
      status: "coming-soon"
    },
    {
      title: "More Projects Coming",
      description: "Currently working on additional data science projects. Check back soon for updates!",
      image: "./images/projects/placeholder.svg",
      tech: ["Python", "ML", "Data Science"],
      github: "#",
      demo: null,
      status: "placeholder"
    }
  ],

  // EXPERIENCE
  experience: [
    {
      title: "Software Engineer - Test Automation & Data Analysis",
      company: "UtopiaTech Pvt Ltd",
      location: "Mumbai, India",
      duration: "May 2023 - Aug 2024",
      points: [
        "Built anomaly detection system on performance data from 10,000+ IoT devices, cutting incident response time by 40%",
        "Automated test workflows across 50+ device types using Python scripting, eliminating 70% of manual testing overhead",
        "Architected end-to-end data collection pipeline ingesting 100K+ daily test records into MongoDB with real-time monitoring dashboards"
      ]
    },
    {
      title: "Software Developer Intern - IoT Data Systems",
      company: "UtopiaTech Pvt Ltd",
      location: "Mumbai, India",
      duration: "Dec 2019 - May 2020",
      points: [
        "Cleaned and validated sensor data streams from 50+ IoT devices, improving upstream data accuracy by 25%",
        "Rewrote critical MongoDB queries with proper indexing strategies, reducing average query latency by 35%",
        "Implemented real-time anomaly detection pipeline in Python, enabling proactive alerts for device malfunctions"
      ]
    }
  ],

  // EDUCATION
  education: [
    {
      degree: "Master of Science in Information Systems",
      institution: "Northeastern University",
      location: "Boston, MA",
      year: "Expected May 2027",
      gpa: "3.8/4.0"
    },
    {
      degree: "Bachelor of Engineering in Computer Engineering",
      institution: "University of Mumbai",
      location: "Mumbai, India",
      year: "May 2023",
      gpa: "3.7/4.0"
    }
  ],

  // CERTIFICATIONS
  certifications: [
    "AWS Certified Cloud Practitioner (In Progress)",
    "Google Data Analytics Professional Certificate",
    "Python for Data Science - IBM",
    "SQL for Data Science - Coursera"
  ],

  // FOOTER
  footer: {
    copyright: "© 2026 Aditya Pranav Shah. All rights reserved."
  }
};
