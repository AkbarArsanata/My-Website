export const projectsData = [
  {
    id: 1,
    title: "AI Financial Predictor",
    description: "Machine learning model predicting stock trends with 94% accuracy using LSTM networks.",
    longDescription: "This project involved collecting and processing large datasets of historical stock prices and financial news. I implemented an LSTM neural network with attention mechanisms to identify patterns in price movements. The system achieved a backtested accuracy of 94% in predicting 30-day price movements.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    projectUrl: "https://chat.deepseek.com/a/chat/s/f7afb089-0915-4e0b-af13-44ae4b69b822",
    codeUrl: "#",
    tags: ["AI", "Python", "TensorFlow"],
    category: "machine-learning",
    date: "2023-11-15",
    stars: 142,
    forks: 38,
    featured: true,
    stats: {
      accuracy: "94%",
      latency: "200ms",
      dataset: "5TB"
    }
  },
  {
    id: 2,
    title: "Data Visualization Dashboard",
    description: "Interactive dashboard built with React and D3.js for complex data visualization.",
    longDescription: "Created a responsive dashboard that processes real-time data streams and presents them through interactive visualizations. Implemented custom D3.js charts with smooth transitions and tooltips. The system handles over 10,000 data points per second with optimized rendering performance.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    projectUrl: "#",
    codeUrl: "#",
    tags: ["React", "D3.js", "JavaScript"],
    category: "web-dev",
    date: "2023-08-22",
    stars: 89,
    forks: 24,
    featured: false,
    stats: {
      performance: "60FPS",
      dataPoints: "10K/sec",
      components: "45+"
    }
  },
  {
    id: 3,
    title: "Customer Segmentation Model",
    description: "Unsupervised learning model for customer segmentation using clustering algorithms.",
    longDescription: "Developed a customer segmentation system using K-means and hierarchical clustering algorithms. Processed over 1 million customer records to identify 7 distinct segments. The model improved marketing campaign targeting by 37% compared to previous methods.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    projectUrl: "#",
    codeUrl: "#",
    tags: ["Machine Learning", "Scikit-learn", "Pandas"],
    category: "data-science",
    date: "2023-05-10",
    stars: 76,
    forks: 19,
    featured: true,
    stats: {
      segments: "7",
      records: "1M+",
      improvement: "37%"
    }
  }
];