// PORTFOLIO DATA - Edit this file to update your portfolio content
// DO NOT edit index.html - it reads from this file automatically

const portfolioData = {
  // PERSONAL INFO
  personal: {
    name: "Aditya Pranav Shah",
    title: "Data Science Graduate Student | Aspiring Data Scientist",
    tagline: "Transforming data into actionable insights through Python, SQL, and Machine Learning",
    photo: "https://via.placeholder.com/150", // Replace with actual photo URL
    location: "Boston, MA",
    email: "shah.aditya@northeastern.edu",
    phone: "+1 (857) 234-7211",
    resumeURL: "./Aditya_Shah_DS_Resume.pdf",
    calendlyURL: "https://calendly.com/PLACEHOLDER/15min", // Update with your Calendly link
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
    bio: "Graduate student at Northeastern University pursuing MS in Information Systems with focus on Data Science. Background in software engineering with 2+ years experience analyzing IoT device data and building data pipelines. Passionate about using data to solve real-world problems and drive business decisions. Currently seeking Data Analyst/Data Science co-op opportunities starting January 2026.",
    quickFacts: {
      location: "Boston, MA",
      education: "MS in Information Systems (2027)",
      status: "Seeking Co-op (Jan 2026)",
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
      image: "https://via.placeholder.com/300x200/2563eb/ffffff?text=IoT+Pipeline",
      tech: ["Python", "MongoDB", "Pandas", "Plotly"],
      github: "https://github.com/AdityaShah2811/iot-pipeline",
      demo: null,
      status: "complete"
    },
    {
      title: "Customer Churn Prediction",
      description: "Machine learning model predicting customer churn with 87% accuracy. Analyzed 10K+ customer records using feature engineering and XGBoost classifier.",
      image: "https://via.placeholder.com/300x200/10b981/ffffff?text=ML+Model",
      tech: ["Python", "Scikit-learn", "Pandas", "Seaborn"],
      github: "#",
      demo: null,
      status: "coming-soon"
    },
    {
      title: "Sales Data Analysis & Dashboard",
      description: "Interactive Tableau dashboard analyzing retail sales data. Identified 3 key trends leading to 15% revenue optimization recommendations.",
      image: "https://via.placeholder.com/300x200/f59e0b/ffffff?text=Dashboard",
      tech: ["Python", "SQL", "Tableau", "Pandas"],
      github: "#",
      demo: null,
      status: "coming-soon"
    },
    {
      title: "Sentiment Analysis on Reviews",
      description: "NLP model analyzing 50K+ product reviews. Achieved 82% accuracy in sentiment classification using LSTM neural networks.",
      image: "https://via.placeholder.com/300x200/8b5cf6/ffffff?text=NLP+Model",
      tech: ["Python", "NLTK", "TensorFlow", "Streamlit"],
      github: "#",
      demo: null,
      status: "coming-soon"
    },
    {
      title: "More Projects Coming",
      description: "Currently working on additional data science projects. Check back soon for updates!",
      image: "https://via.placeholder.com/300x200/64748b/ffffff?text=Coming+Soon",
      tech: ["Python", "ML", "Data Science"],
      github: "#",
      demo: null,
      status: "placeholder"
    },
    {
      title: "More Projects Coming",
      description: "Currently working on additional data science projects. Check back soon for updates!",
      image: "https://via.placeholder.com/300x200/64748b/ffffff?text=Coming+Soon",
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
        "Analyzed device performance data from 10,000+ IoT users, reducing incident response time by 40%",
        "Optimized testing workflows across 50+ device types, reducing manual testing time by 70%",
        "Designed automated data collection pipeline processing 100K+ test records daily"
      ]
    },
    {
      title: "Software Developer Intern - IoT Data Systems",
      company: "UtopiaTech Pvt Ltd",
      location: "Mumbai, India",
      duration: "Dec 2019 - May 2020",
      points: [
        "Analyzed sensor data from 50+ IoT devices, improving data accuracy by 25%",
        "Optimized MongoDB queries, improving database performance by 35%",
        "Developed Python data processing scripts enabling real-time anomaly detection"
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
    copyright: "© 2025 Aditya Pranav Shah. All rights reserved."
  }
};
