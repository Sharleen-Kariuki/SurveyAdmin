/**
 * Pre-generated realistic Survey & Question records
 * Generated via @faker-js/faker (2026-10-15T09:43:31.066Z)
 * Total Surveys: 50
 * Total Questions: 493
 */

export const mockSurveys = [
  {
    "id": "1",
    "title": "Hoppe - Wyman CloudOps",
    "description": "Fundamental mobile open architecture - Cloud Infrastructure & Site Reliability Benchmark",
    "responses": 2169,
    "status": "Inactive",
    "createdAt": "09/01/2025",
    "updatedAt": "14/07/2026",
    "previewColumns": 2,
    "questions": [
      {
        "id": "101",
        "text": "Which container orchestration & CI/CD tools are active in your pipeline?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Kubernetes",
          "Docker Swarm",
          "GitHub Actions",
          "GitLab CI",
          "ArgoCD",
          "Terraform"
        ]
      },
      {
        "id": "102",
        "text": "Primary monitoring and distributed tracing vendor utilized (e.g. Datadog, Prometheus)",
        "type": "text",
        "required": false
      },
      {
        "id": "103",
        "text": "Upload architecture diagram, Helm chart values, or Terraform topology file",
        "type": "file",
        "required": true
      },
      {
        "id": "104",
        "text": "Overall platform uptime and automated failover reliability",
        "type": "rating",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "105",
        "text": "Date of most recent architecture disaster-recovery simulation test",
        "type": "date",
        "required": true
      },
      {
        "id": "106",
        "text": "Average estimated monthly cloud infrastructure expenditure (in thousands USD)",
        "type": "number",
        "required": false
      },
      {
        "id": "107",
        "text": "Lead Site Reliability Engineer (SRE) contact email for post-incident review",
        "type": "email",
        "required": true
      },
      {
        "id": "108",
        "text": "Primary public cloud provider hosting your primary workload",
        "type": "select",
        "required": true,
        "options": [
          "Amazon Web Services (AWS)",
          "Google Cloud Platform (GCP)",
          "Microsoft Azure",
          "Cloudflare Workers",
          "On-Premises Private Cloud"
        ]
      },
      {
        "id": "109",
        "text": "Target container memory allocation buffer per microservice (GB)",
        "type": "range",
        "required": false,
        "rangeMin": 2,
        "rangeMax": 64,
        "rangeStep": 2
      }
    ]
  },
  {
    "id": "2",
    "title": "Luxurious Metal Soap Usability",
    "description": "iterate intuitive web services - Enterprise User Experience & Onboarding Evaluation",
    "responses": 3564,
    "status": "Active",
    "createdAt": "20/07/2023",
    "updatedAt": "02/10/2024",
    "previewColumns": 2,
    "questions": [
      {
        "id": "201",
        "text": "Did the guided interactive product tour effectively explain key features?",
        "type": "boolean",
        "required": true
      },
      {
        "id": "202",
        "text": "Account administrator contact email for feature preview invitations",
        "type": "email",
        "required": true
      },
      {
        "id": "203",
        "text": "Total number of licensed seats currently allocated to your organization",
        "type": "number",
        "required": false
      },
      {
        "id": "204",
        "text": "Self-reported onboarding completion time (minutes)",
        "type": "range",
        "required": true,
        "rangeMin": 5,
        "rangeMax": 120,
        "rangeStep": 5
      },
      {
        "id": "205",
        "text": "Which product features do you utilize most frequently?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Analytics Dashboard",
          "Export to PDF/CSV",
          "Automated Workflows",
          "Team Collaboration",
          "API Webhooks",
          "Audit Logs"
        ]
      },
      {
        "id": "206",
        "text": "Date your organization commenced using this software",
        "type": "date",
        "required": true
      },
      {
        "id": "207",
        "text": "Net Promoter Score: How likely are you to recommend our application to a colleague? (1-10)",
        "type": "scale",
        "required": false,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "208",
        "text": "How frequently do you log into the platform for your core tasks?",
        "type": "radio",
        "required": true,
        "options": [
          "Daily power user",
          "Several times weekly",
          "Once a week",
          "A few times a month"
        ]
      },
      {
        "id": "209",
        "text": "What additional capabilities would make this platform a 10/10 experience for your team?",
        "type": "textarea",
        "required": true
      }
    ]
  },
  {
    "id": "3",
    "title": "Klein, Walker and Hills People Index",
    "description": "Internal Staff Experience, Workplace Culture & Ergonomics Health Audit",
    "responses": 2190,
    "status": "Active",
    "createdAt": "19/02/2025",
    "updatedAt": "13/03/2025",
    "previewColumns": 2,
    "questions": [
      {
        "id": "301",
        "text": "Which company employee benefits and perks do you value highest?",
        "type": "checkbox",
        "required": false,
        "options": [
          "Comprehensive Health Insurance",
          "Generous 401(k) / Pension Match",
          "Annual Learning & Conference Stipend",
          "Home Office Ergonomic Budget",
          "Flexible Unlimited PTO",
          "Gym & Wellness Allowance"
        ]
      },
      {
        "id": "302",
        "text": "Primary operational department / business unit",
        "type": "select",
        "required": true,
        "options": [
          "Engineering",
          "Product & Design",
          "Marketing & Growth",
          "Sales & Accounts",
          "People & HR",
          "Finance & Legal"
        ]
      },
      {
        "id": "303",
        "text": "How strongly do you agree that leadership fosters transparent, inclusive communication? (1-10)",
        "type": "scale",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "304",
        "text": "Confidential work email (optional for anonymous follow-up discussions)",
        "type": "email",
        "required": false
      },
      {
        "id": "305",
        "text": "Work-life balance and mental wellness support satisfaction",
        "type": "rating",
        "required": false,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "306",
        "text": "Preferred working arrangement moving forward",
        "type": "radio",
        "required": true,
        "options": [
          "100% Remote / Distributed",
          "Hybrid (1-2 days office)",
          "Hybrid (3-4 days office)",
          "Fully In-Office"
        ]
      },
      {
        "id": "307",
        "text": "Upload home office ergonomic workspace evaluation or equipment receipt",
        "type": "file",
        "required": true
      }
    ]
  },
  {
    "id": "4",
    "title": "Kub Group WealthPay",
    "description": "Mobile Banking Experience, Biometric Security & Transaction UX Survey",
    "responses": 4315,
    "status": "Active",
    "createdAt": "05/07/2023",
    "updatedAt": "29/12/2023",
    "previewColumns": 1,
    "questions": [
      {
        "id": "401",
        "text": "Name of the competitor banking app you find most user-friendly",
        "type": "text",
        "required": true
      },
      {
        "id": "402",
        "text": "Biometric authentication (Face ID / Fingerprint) speed and convenience rating",
        "type": "rating",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "403",
        "text": "Would you activate AI-driven automated recurring bill payment optimization?",
        "type": "boolean",
        "required": true
      },
      {
        "id": "404",
        "text": "Primary daily currency denomination for checking and transactions",
        "type": "select",
        "required": true,
        "options": [
          "US Dollar (USD)",
          "Euro (EUR)",
          "British Pound (GBP)",
          "Canadian Dollar (CAD)",
          "Australian Dollar (AUD)",
          "Japanese Yen (JPY)"
        ]
      },
      {
        "id": "405",
        "text": "What investment, budgeting, or international remittance features do you need most?",
        "type": "textarea",
        "required": false
      },
      {
        "id": "406",
        "text": "Select all financial asset categories held in your digital portfolio",
        "type": "checkbox",
        "required": false,
        "options": [
          "Cash / High-Yield Savings",
          "Broad Index ETFs",
          "Individual Tech Equities",
          "Cryptocurrency Assets",
          "Municipal Bonds",
          "Real Estate REITs"
        ]
      },
      {
        "id": "407",
        "text": "Date account KYC identity verification was completed",
        "type": "date",
        "required": false
      },
      {
        "id": "408",
        "text": "Instant transaction notification threshold ($ USD)",
        "type": "range",
        "required": true,
        "rangeMin": 10,
        "rangeMax": 1000,
        "rangeStep": 25
      },
      {
        "id": "409",
        "text": "Registered banking profile email address for multi-factor verification",
        "type": "email",
        "required": true
      },
      {
        "id": "4010",
        "text": "Approximate number of digital transactions conducted each month",
        "type": "number",
        "required": false
      },
      {
        "id": "4011",
        "text": "Primary everyday payment method used at physical retail counters",
        "type": "radio",
        "required": true,
        "options": [
          "Apple Pay / Google Wallet via Phone",
          "Physical Chip & PIN Debit Card",
          "Contactless Tap Card",
          "Cash"
        ]
      },
      {
        "id": "4012",
        "text": "Upload proof of billing address or redacted bank statement document",
        "type": "file",
        "required": true
      }
    ]
  },
  {
    "id": "5",
    "title": "Johnson Inc HealthCare",
    "description": "Patient Outpatient Consultation, Telehealth Clarity & Clinical Care Quality",
    "responses": 2755,
    "status": "Active",
    "createdAt": "04/06/2024",
    "updatedAt": "25/04/2025",
    "previewColumns": 2,
    "questions": [
      {
        "id": "501",
        "text": "Upload scanned insurance card copy or medical referral document",
        "type": "file",
        "required": true
      },
      {
        "id": "502",
        "text": "Please describe any delays, billing confusion, or medical instructions that required clarification",
        "type": "textarea",
        "required": true
      },
      {
        "id": "503",
        "text": "Number of healthcare visits completed in the past 12 months",
        "type": "number",
        "required": true
      },
      {
        "id": "504",
        "text": "Overall ease of booking appointments and receiving lab results via patient portal (1-10)",
        "type": "scale",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "505",
        "text": "Average in-clinic waiting room duration before doctor consultation (minutes)",
        "type": "range",
        "required": true,
        "rangeMin": 5,
        "rangeMax": 90,
        "rangeStep": 5
      },
      {
        "id": "506",
        "text": "Date of most recent comprehensive preventative health checkup",
        "type": "date",
        "required": true
      },
      {
        "id": "507",
        "text": "Select chronic health or wellness areas monitored regularly",
        "type": "checkbox",
        "required": false,
        "options": [
          "Cardiovascular & Blood Pressure",
          "Blood Glucose / Diabetes",
          "Respiratory & Asthma",
          "Seasonal Allergies & Immunology",
          "Mental Health & Sleep Disorders",
          "Orthopedic / Joint Health"
        ]
      },
      {
        "id": "508",
        "text": "Preferred consultation format for routine non-emergency medical visits",
        "type": "radio",
        "required": true,
        "options": [
          "In-person clinic visit",
          "Secure video telehealth session",
          "Telephone consultation",
          "Asynchronous portal messaging"
        ]
      },
      {
        "id": "509",
        "text": "Do you authorize automated electronic prescription refills to your preferred local pharmacy?",
        "type": "boolean",
        "required": true
      },
      {
        "id": "5010",
        "text": "Name of primary referring physician or specialist clinic",
        "type": "text",
        "required": true
      },
      {
        "id": "5011",
        "text": "Confidential patient contact email for lab reports and discharge summaries",
        "type": "email",
        "required": false
      },
      {
        "id": "5012",
        "text": "Primary health insurance carrier or coverage network",
        "type": "select",
        "required": false,
        "options": [
          "BlueCross BlueShield",
          "Aetna / CVS Health",
          "UnitedHealthcare",
          "Kaiser Permanente",
          "Cigna",
          "Medicare / Medicaid",
          "Self-Pay / Uninsured"
        ]
      }
    ]
  },
  {
    "id": "6",
    "title": "Kemmer and Sons Retail Pulse",
    "description": "Omnichannel Store Experience, Checkout Velocity & Delivery Satisfaction",
    "responses": 3594,
    "status": "Active",
    "createdAt": "10/11/2025",
    "updatedAt": "17/09/2026",
    "previewColumns": 2,
    "questions": [
      {
        "id": "601",
        "text": "Which factors most heavily influence your final purchasing decision?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Free Express Shipping",
          "Verified Customer Photo Reviews",
          "Price Match Guarantee",
          "Hassle-Free 30-Day Returns",
          "Sustainable Eco-Packaging",
          "Loyalty Rewards Points"
        ]
      },
      {
        "id": "602",
        "text": "Maximum acceptable standard ground delivery window (days)",
        "type": "range",
        "required": false,
        "rangeMin": 1,
        "rangeMax": 14,
        "rangeStep": 1
      },
      {
        "id": "603",
        "text": "Estimated total number of online orders completed during the past year",
        "type": "number",
        "required": false
      },
      {
        "id": "604",
        "text": "Rate the efficiency and delivery speed of your recent package shipment (1-10)",
        "type": "scale",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "605",
        "text": "What products or packaging improvements would encourage you to order again?",
        "type": "textarea",
        "required": false
      },
      {
        "id": "606",
        "text": "Overall satisfaction with product catalog variety and in-stock inventory availability",
        "type": "rating",
        "required": false,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "607",
        "text": "How frequently do you place online retail orders across all merchants?",
        "type": "radio",
        "required": false,
        "options": [
          "Multiple times per week",
          "Weekly",
          "Once or twice a month",
          "Only during holiday promotions"
        ]
      },
      {
        "id": "608",
        "text": "Order tracking or invoice reference number",
        "type": "text",
        "required": true
      },
      {
        "id": "609",
        "text": "Did package tracking updates provide accurate real-time transit milestones?",
        "type": "boolean",
        "required": true
      },
      {
        "id": "6010",
        "text": "Date of most recent online order or store pickup",
        "type": "date",
        "required": false
      },
      {
        "id": "6011",
        "text": "Upload photo of received parcel condition or store receipt",
        "type": "file",
        "required": true
      }
    ]
  },
  {
    "id": "7",
    "title": "Harber LLC GreenEco",
    "description": "Household Energy Efficiency, Smart Lighting & Municipal Waste Audit",
    "responses": 658,
    "status": "Active",
    "createdAt": "23/11/2023",
    "updatedAt": "13/12/2023",
    "previewColumns": 2,
    "questions": [
      {
        "id": "701",
        "text": "Current household rooftop solar or renewable energy status",
        "type": "radio",
        "required": true,
        "options": [
          "Installed & actively generating power",
          "Permits approved, awaiting installation",
          "Actively exploring quotes",
          "Not feasible for this property"
        ]
      },
      {
        "id": "702",
        "text": "Total number of connected smart home sensors and automated fixtures in home",
        "type": "number",
        "required": true
      },
      {
        "id": "703",
        "text": "Select all waste categories systematically separated at your residence",
        "type": "checkbox",
        "required": true,
        "options": [
          "Rigid Plastics (PET/HDPE)",
          "Glass Bottles & Jars",
          "Corrugated Cardboard & Clean Paper",
          "E-Waste & Batteries",
          "Organic Food Compost",
          "Hazardous Chemicals / Paint"
        ]
      },
      {
        "id": "704",
        "text": "Estimated percentage of household solid waste diverted from landfill (%)",
        "type": "range",
        "required": true,
        "rangeMin": 0,
        "rangeMax": 100,
        "rangeStep": 5
      },
      {
        "id": "705",
        "text": "Upload photo of neighborhood sorting station or solar generation meter",
        "type": "file",
        "required": false
      },
      {
        "id": "706",
        "text": "Date smart electrical sub-meter or solar inverter was activated",
        "type": "date",
        "required": true
      },
      {
        "id": "707",
        "text": "Rate municipal recycling collection reliability and service accessibility (1-10)",
        "type": "scale",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "708",
        "text": "Does your local council provide subsidized compost containers or green waste bins?",
        "type": "boolean",
        "required": true
      },
      {
        "id": "709",
        "text": "Primary smart home ecosystem orchestrating your household devices",
        "type": "select",
        "required": true,
        "options": [
          "Apple HomeKit",
          "Google Home / Nest",
          "Amazon Alexa",
          "Home Assistant (Local)",
          "Samsung SmartThings",
          "None / Standalone"
        ]
      },
      {
        "id": "7010",
        "text": "Satisfaction with smart thermostat automated energy conservation savings",
        "type": "rating",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "7011",
        "text": "Local municipal district or residential postal code",
        "type": "text",
        "required": true
      },
      {
        "id": "7012",
        "text": "What clean energy or recycling programs should our community prioritize this year?",
        "type": "textarea",
        "required": true
      }
    ]
  },
  {
    "id": "8",
    "title": "Steuber, Turner and Hayes Academy",
    "description": "Academic Course Curriculum, Instructor Pedagogy & Lab Usability Study",
    "responses": 1906,
    "status": "Active",
    "createdAt": "25/07/2024",
    "updatedAt": "26/11/2025",
    "previewColumns": 2,
    "questions": [
      {
        "id": "801",
        "text": "Upload final course project submission or capstone proposal summary",
        "type": "file",
        "required": true
      },
      {
        "id": "802",
        "text": "Academic field or primary degree concentration",
        "type": "select",
        "required": false,
        "options": [
          "Computer Science & Software",
          "Data Analytics & AI",
          "Business Administration & Finance",
          "Digital Media & UX Design",
          "Electrical Engineering",
          "Biomedical Sciences"
        ]
      },
      {
        "id": "803",
        "text": "Student university email address (.edu / academic domain)",
        "type": "email",
        "required": true
      },
      {
        "id": "804",
        "text": "Average independent study and lab preparation hours per week",
        "type": "range",
        "required": false,
        "rangeMin": 2,
        "rangeMax": 40,
        "rangeStep": 2
      },
      {
        "id": "805",
        "text": "Preferred course assessment and grading methodology",
        "type": "radio",
        "required": true,
        "options": [
          "Practical Portfolio Projects",
          "Proctored Timed Quizzes",
          "Collaborative Group Case Studies",
          "Open-book Research Essays"
        ]
      },
      {
        "id": "806",
        "text": "Total academic credit units completed toward program graduation",
        "type": "number",
        "required": false
      },
      {
        "id": "807",
        "text": "Which instructional learning resources proved most valuable?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Recorded Lecture Video Replays",
          "Interactive Hands-on Coding Labs",
          "Annotated Slide Decks",
          "Peer Discussion Forums",
          "Weekly Live Office Hours",
          "Real-World Capstone Case Studies"
        ]
      },
      {
        "id": "808",
        "text": "Course instructor subject matter expertise and responsiveness to student questions",
        "type": "rating",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      }
    ]
  },
  {
    "id": "9",
    "title": "Schaefer Inc Electronics",
    "description": "Optimized well-modulated adapter - Cloud Infrastructure & DevOps Assessment",
    "responses": 4013,
    "status": "Inactive",
    "createdAt": "12/11/2025",
    "updatedAt": "23/02/2026",
    "previewColumns": 2,
    "questions": [
      {
        "id": "901",
        "text": "Which container orchestration & CI/CD tools are active in your pipeline?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Kubernetes",
          "Docker Swarm",
          "GitHub Actions",
          "GitLab CI",
          "ArgoCD",
          "Terraform"
        ]
      },
      {
        "id": "902",
        "text": "Average production deployment frequency across engineering teams",
        "type": "radio",
        "required": false,
        "options": [
          "Multiple times per day",
          "Once daily",
          "Weekly sprint release",
          "Bi-weekly or monthly"
        ]
      },
      {
        "id": "903",
        "text": "Overall platform uptime and automated failover reliability",
        "type": "rating",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "904",
        "text": "Lead Site Reliability Engineer (SRE) contact email for post-incident review",
        "type": "email",
        "required": false
      },
      {
        "id": "905",
        "text": "Primary public cloud provider hosting your primary workload",
        "type": "select",
        "required": false,
        "options": [
          "Amazon Web Services (AWS)",
          "Google Cloud Platform (GCP)",
          "Microsoft Azure",
          "Cloudflare Workers",
          "On-Premises Private Cloud"
        ]
      },
      {
        "id": "906",
        "text": "Target container memory allocation buffer per microservice (GB)",
        "type": "range",
        "required": false,
        "rangeMin": 2,
        "rangeMax": 64,
        "rangeStep": 2
      },
      {
        "id": "907",
        "text": "What operational pain points or bottlenecks impact your current release velocity?",
        "type": "textarea",
        "required": false
      }
    ]
  },
  {
    "id": "10",
    "title": "Bosco - Wilkinson Music",
    "description": "Fully-configurable holistic workforce - SaaS Usability & Product Experience Assessment",
    "responses": 44,
    "status": "Active",
    "createdAt": "23/10/2023",
    "updatedAt": "01/11/2023",
    "previewColumns": 2,
    "questions": [
      {
        "id": "1001",
        "text": "Intuitive navigation and overall UI design aesthetic satisfaction",
        "type": "rating",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "1002",
        "text": "What additional capabilities would make this platform a 10/10 experience for your team?",
        "type": "textarea",
        "required": false
      },
      {
        "id": "1003",
        "text": "How frequently do you log into the platform for your core tasks?",
        "type": "radio",
        "required": true,
        "options": [
          "Daily power user",
          "Several times weekly",
          "Once a week",
          "A few times a month"
        ]
      },
      {
        "id": "1004",
        "text": "Self-reported onboarding completion time (minutes)",
        "type": "range",
        "required": true,
        "rangeMin": 5,
        "rangeMax": 120,
        "rangeStep": 5
      },
      {
        "id": "1005",
        "text": "Which product features do you utilize most frequently?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Analytics Dashboard",
          "Export to PDF/CSV",
          "Automated Workflows",
          "Team Collaboration",
          "API Webhooks",
          "Audit Logs"
        ]
      },
      {
        "id": "1006",
        "text": "Net Promoter Score: How likely are you to recommend our application to a colleague? (1-10)",
        "type": "scale",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "1007",
        "text": "Date your organization commenced using this software",
        "type": "date",
        "required": false
      },
      {
        "id": "1008",
        "text": "Did the guided interactive product tour effectively explain key features?",
        "type": "boolean",
        "required": true
      },
      {
        "id": "1009",
        "text": "Attach a screenshot illustrating any UI confusion or workflow bug encountered",
        "type": "file",
        "required": false
      },
      {
        "id": "10010",
        "text": "Account administrator contact email for feature preview invitations",
        "type": "email",
        "required": true
      },
      {
        "id": "10011",
        "text": "Total number of licensed seats currently allocated to your organization",
        "type": "number",
        "required": false
      }
    ]
  },
  {
    "id": "11",
    "title": "Deckow Inc Toys",
    "description": "Monitored executive algorithm - Workplace Culture & Employee Wellness Assessment",
    "responses": 4524,
    "status": "Pending",
    "createdAt": "01/12/2025",
    "updatedAt": "25/04/2026",
    "previewColumns": 3,
    "questions": [
      {
        "id": "1101",
        "text": "Primary operational department / business unit",
        "type": "select",
        "required": false,
        "options": [
          "Engineering",
          "Product & Design",
          "Marketing & Growth",
          "Sales & Accounts",
          "People & HR",
          "Finance & Legal"
        ]
      },
      {
        "id": "1102",
        "text": "Upload home office ergonomic workspace evaluation or equipment receipt",
        "type": "file",
        "required": true
      },
      {
        "id": "1103",
        "text": "Immediate team or project squad name",
        "type": "text",
        "required": false
      },
      {
        "id": "1104",
        "text": "Preferred number of remote work days per week",
        "type": "range",
        "required": true,
        "rangeMin": 0,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "1105",
        "text": "Preferred working arrangement moving forward",
        "type": "radio",
        "required": true,
        "options": [
          "100% Remote / Distributed",
          "Hybrid (1-2 days office)",
          "Hybrid (3-4 days office)",
          "Fully In-Office"
        ]
      },
      {
        "id": "1106",
        "text": "How strongly do you agree that leadership fosters transparent, inclusive communication? (1-10)",
        "type": "scale",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "1107",
        "text": "Work-life balance and mental wellness support satisfaction",
        "type": "rating",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "1108",
        "text": "Confidential work email (optional for anonymous follow-up discussions)",
        "type": "email",
        "required": true
      },
      {
        "id": "1109",
        "text": "Total years of tenure with the organization",
        "type": "number",
        "required": false
      },
      {
        "id": "11010",
        "text": "Date of your last career development and compensation review",
        "type": "date",
        "required": true
      },
      {
        "id": "11011",
        "text": "Do you feel comfortable discussing workload constraints openly with your direct manager?",
        "type": "boolean",
        "required": true
      }
    ]
  },
  {
    "id": "12",
    "title": "Abshire Group Music",
    "description": "Profit-focused systemic frame - Fintech & Digital Banking Assessment",
    "responses": 584,
    "status": "Inactive",
    "createdAt": "10/11/2025",
    "updatedAt": "17/01/2026",
    "previewColumns": 3,
    "questions": [
      {
        "id": "1201",
        "text": "Primary everyday payment method used at physical retail counters",
        "type": "radio",
        "required": true,
        "options": [
          "Apple Pay / Google Wallet via Phone",
          "Physical Chip & PIN Debit Card",
          "Contactless Tap Card",
          "Cash"
        ]
      },
      {
        "id": "1202",
        "text": "Confidence in multi-layer account fraud detection and transaction safety (1-10)",
        "type": "scale",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "1203",
        "text": "Date account KYC identity verification was completed",
        "type": "date",
        "required": false
      },
      {
        "id": "1204",
        "text": "Registered banking profile email address for multi-factor verification",
        "type": "email",
        "required": true
      },
      {
        "id": "1205",
        "text": "What investment, budgeting, or international remittance features do you need most?",
        "type": "textarea",
        "required": false
      },
      {
        "id": "1206",
        "text": "Biometric authentication (Face ID / Fingerprint) speed and convenience rating",
        "type": "rating",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "1207",
        "text": "Upload proof of billing address or redacted bank statement document",
        "type": "file",
        "required": true
      },
      {
        "id": "1208",
        "text": "Would you activate AI-driven automated recurring bill payment optimization?",
        "type": "boolean",
        "required": true
      },
      {
        "id": "1209",
        "text": "Instant transaction notification threshold ($ USD)",
        "type": "range",
        "required": true,
        "rangeMin": 10,
        "rangeMax": 1000,
        "rangeStep": 25
      },
      {
        "id": "12010",
        "text": "Primary daily currency denomination for checking and transactions",
        "type": "select",
        "required": true,
        "options": [
          "US Dollar (USD)",
          "Euro (EUR)",
          "British Pound (GBP)",
          "Canadian Dollar (CAD)",
          "Australian Dollar (AUD)",
          "Japanese Yen (JPY)"
        ]
      }
    ]
  },
  {
    "id": "13",
    "title": "Nicolas - Hintz Kids",
    "description": "Synchronised data-driven core - Healthcare & Patient Experience Assessment",
    "responses": 1809,
    "status": "Active",
    "createdAt": "27/07/2023",
    "updatedAt": "03/07/2024",
    "previewColumns": 2,
    "questions": [
      {
        "id": "1301",
        "text": "Average in-clinic waiting room duration before doctor consultation (minutes)",
        "type": "range",
        "required": false,
        "rangeMin": 5,
        "rangeMax": 90,
        "rangeStep": 5
      },
      {
        "id": "1302",
        "text": "Number of healthcare visits completed in the past 12 months",
        "type": "number",
        "required": true
      },
      {
        "id": "1303",
        "text": "Select chronic health or wellness areas monitored regularly",
        "type": "checkbox",
        "required": false,
        "options": [
          "Cardiovascular & Blood Pressure",
          "Blood Glucose / Diabetes",
          "Respiratory & Asthma",
          "Seasonal Allergies & Immunology",
          "Mental Health & Sleep Disorders",
          "Orthopedic / Joint Health"
        ]
      },
      {
        "id": "1304",
        "text": "Primary health insurance carrier or coverage network",
        "type": "select",
        "required": false,
        "options": [
          "BlueCross BlueShield",
          "Aetna / CVS Health",
          "UnitedHealthcare",
          "Kaiser Permanente",
          "Cigna",
          "Medicare / Medicaid",
          "Self-Pay / Uninsured"
        ]
      },
      {
        "id": "1305",
        "text": "Date of most recent comprehensive preventative health checkup",
        "type": "date",
        "required": true
      },
      {
        "id": "1306",
        "text": "Name of primary referring physician or specialist clinic",
        "type": "text",
        "required": true
      },
      {
        "id": "1307",
        "text": "Medical practitioner consultation clarity, attentiveness, and bedside manner",
        "type": "rating",
        "required": false,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "1308",
        "text": "Preferred consultation format for routine non-emergency medical visits",
        "type": "radio",
        "required": true,
        "options": [
          "In-person clinic visit",
          "Secure video telehealth session",
          "Telephone consultation",
          "Asynchronous portal messaging"
        ]
      },
      {
        "id": "1309",
        "text": "Upload scanned insurance card copy or medical referral document",
        "type": "file",
        "required": true
      },
      {
        "id": "13010",
        "text": "Confidential patient contact email for lab reports and discharge summaries",
        "type": "email",
        "required": false
      },
      {
        "id": "13011",
        "text": "Do you authorize automated electronic prescription refills to your preferred local pharmacy?",
        "type": "boolean",
        "required": true
      }
    ]
  },
  {
    "id": "14",
    "title": "Donnelly and Sons Books",
    "description": "User-centric secondary portal - E-Commerce & Retail Experience Assessment",
    "responses": 1603,
    "status": "Active",
    "createdAt": "17/06/2024",
    "updatedAt": "23/02/2025",
    "previewColumns": 2,
    "questions": [
      {
        "id": "1401",
        "text": "Date of most recent online order or store pickup",
        "type": "date",
        "required": true
      },
      {
        "id": "1402",
        "text": "Preferred retail product category for seasonal shopping",
        "type": "select",
        "required": true,
        "options": [
          "Electronics & Smart Gadgets",
          "Apparel & Footwear",
          "Home & Kitchen Appliances",
          "Beauty & Personal Care",
          "Sports & Outdoor Recreation",
          "Books & Media"
        ]
      },
      {
        "id": "1403",
        "text": "Customer email address for loyalty points balance and coupon delivery",
        "type": "email",
        "required": true
      },
      {
        "id": "1404",
        "text": "Order tracking or invoice reference number",
        "type": "text",
        "required": true
      },
      {
        "id": "1405",
        "text": "Which factors most heavily influence your final purchasing decision?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Free Express Shipping",
          "Verified Customer Photo Reviews",
          "Price Match Guarantee",
          "Hassle-Free 30-Day Returns",
          "Sustainable Eco-Packaging",
          "Loyalty Rewards Points"
        ]
      },
      {
        "id": "1406",
        "text": "How frequently do you place online retail orders across all merchants?",
        "type": "radio",
        "required": true,
        "options": [
          "Multiple times per week",
          "Weekly",
          "Once or twice a month",
          "Only during holiday promotions"
        ]
      },
      {
        "id": "1407",
        "text": "Estimated total number of online orders completed during the past year",
        "type": "number",
        "required": false
      },
      {
        "id": "1408",
        "text": "Upload photo of received parcel condition or store receipt",
        "type": "file",
        "required": true
      },
      {
        "id": "1409",
        "text": "What products or packaging improvements would encourage you to order again?",
        "type": "textarea",
        "required": true
      },
      {
        "id": "14010",
        "text": "Rate the efficiency and delivery speed of your recent package shipment (1-10)",
        "type": "scale",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      }
    ]
  },
  {
    "id": "15",
    "title": "Huel LLC Jewelry",
    "description": "Ergonomic scalable service-desk - Smart Home & Environmental Sustainability Assessment",
    "responses": 1188,
    "status": "Active",
    "createdAt": "19/09/2024",
    "updatedAt": "26/05/2025",
    "previewColumns": 2,
    "questions": [
      {
        "id": "1501",
        "text": "Does your local council provide subsidized compost containers or green waste bins?",
        "type": "boolean",
        "required": true
      },
      {
        "id": "1502",
        "text": "Local municipal district or residential postal code",
        "type": "text",
        "required": false
      },
      {
        "id": "1503",
        "text": "Upload photo of neighborhood sorting station or solar generation meter",
        "type": "file",
        "required": true
      },
      {
        "id": "1504",
        "text": "Current household rooftop solar or renewable energy status",
        "type": "radio",
        "required": true,
        "options": [
          "Installed & actively generating power",
          "Permits approved, awaiting installation",
          "Actively exploring quotes",
          "Not feasible for this property"
        ]
      },
      {
        "id": "1505",
        "text": "What clean energy or recycling programs should our community prioritize this year?",
        "type": "textarea",
        "required": true
      },
      {
        "id": "1506",
        "text": "Rate municipal recycling collection reliability and service accessibility (1-10)",
        "type": "scale",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "1507",
        "text": "Resident email address for annual municipal green rebate voucher",
        "type": "email",
        "required": true
      },
      {
        "id": "1508",
        "text": "Satisfaction with smart thermostat automated energy conservation savings",
        "type": "rating",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "1509",
        "text": "Primary smart home ecosystem orchestrating your household devices",
        "type": "select",
        "required": true,
        "options": [
          "Apple HomeKit",
          "Google Home / Nest",
          "Amazon Alexa",
          "Home Assistant (Local)",
          "Samsung SmartThings",
          "None / Standalone"
        ]
      },
      {
        "id": "15010",
        "text": "Estimated percentage of household solid waste diverted from landfill (%)",
        "type": "range",
        "required": false,
        "rangeMin": 0,
        "rangeMax": 100,
        "rangeStep": 5
      }
    ]
  },
  {
    "id": "16",
    "title": "Buckridge - Prosacco Baby",
    "description": "Open-source regional archive - Higher Education & Online Learning Assessment",
    "responses": 2429,
    "status": "Active",
    "createdAt": "10/08/2023",
    "updatedAt": "23/05/2025",
    "previewColumns": 2,
    "questions": [
      {
        "id": "1601",
        "text": "Which instructional learning resources proved most valuable?",
        "type": "checkbox",
        "required": false,
        "options": [
          "Recorded Lecture Video Replays",
          "Interactive Hands-on Coding Labs",
          "Annotated Slide Decks",
          "Peer Discussion Forums",
          "Weekly Live Office Hours",
          "Real-World Capstone Case Studies"
        ]
      },
      {
        "id": "1602",
        "text": "Course instructor subject matter expertise and responsiveness to student questions",
        "type": "rating",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "1603",
        "text": "What syllabus topics or hands-on tutorials would enrich the next cohort of students?",
        "type": "textarea",
        "required": true
      },
      {
        "id": "1604",
        "text": "Course title and course catalog registration code (e.g. CS-402)",
        "type": "text",
        "required": true
      },
      {
        "id": "1605",
        "text": "Did syllabus milestones clearly communicate grading rubrics and assignment deadlines?",
        "type": "boolean",
        "required": true
      },
      {
        "id": "1606",
        "text": "Upload final course project submission or capstone proposal summary",
        "type": "file",
        "required": true
      },
      {
        "id": "1607",
        "text": "Preferred course assessment and grading methodology",
        "type": "radio",
        "required": true,
        "options": [
          "Practical Portfolio Projects",
          "Proctored Timed Quizzes",
          "Collaborative Group Case Studies",
          "Open-book Research Essays"
        ]
      },
      {
        "id": "1608",
        "text": "Student university email address (.edu / academic domain)",
        "type": "email",
        "required": true
      },
      {
        "id": "1609",
        "text": "How effectively did coursework assignments prepare you for real-world projects? (1-10)",
        "type": "scale",
        "required": false,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "16010",
        "text": "Average independent study and lab preparation hours per week",
        "type": "range",
        "required": false,
        "rangeMin": 2,
        "rangeMax": 40,
        "rangeStep": 2
      },
      {
        "id": "16011",
        "text": "Total academic credit units completed toward program graduation",
        "type": "number",
        "required": false
      }
    ]
  },
  {
    "id": "17",
    "title": "Schulist - Kuhic Movies",
    "description": "Diverse leading edge algorithm - Cloud Infrastructure & DevOps Assessment",
    "responses": 2762,
    "status": "Active",
    "createdAt": "22/07/2024",
    "updatedAt": "26/01/2025",
    "previewColumns": 3,
    "questions": [
      {
        "id": "1701",
        "text": "What operational pain points or bottlenecks impact your current release velocity?",
        "type": "textarea",
        "required": true
      },
      {
        "id": "1702",
        "text": "Average production deployment frequency across engineering teams",
        "type": "radio",
        "required": true,
        "options": [
          "Multiple times per day",
          "Once daily",
          "Weekly sprint release",
          "Bi-weekly or monthly"
        ]
      },
      {
        "id": "1703",
        "text": "Target container memory allocation buffer per microservice (GB)",
        "type": "range",
        "required": true,
        "rangeMin": 2,
        "rangeMax": 64,
        "rangeStep": 2
      },
      {
        "id": "1704",
        "text": "Date of most recent architecture disaster-recovery simulation test",
        "type": "date",
        "required": false
      },
      {
        "id": "1705",
        "text": "Average estimated monthly cloud infrastructure expenditure (in thousands USD)",
        "type": "number",
        "required": true
      },
      {
        "id": "1706",
        "text": "Overall platform uptime and automated failover reliability",
        "type": "rating",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "1707",
        "text": "Rate global edge API latency and response time satisfaction (1-10)",
        "type": "scale",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      }
    ]
  },
  {
    "id": "18",
    "title": "Larkin Group Games",
    "description": "Ergonomic 24 hour website - SaaS Usability & Product Experience Assessment",
    "responses": 2514,
    "status": "Active",
    "createdAt": "28/07/2025",
    "updatedAt": "22/01/2026",
    "previewColumns": 2,
    "questions": [
      {
        "id": "1801",
        "text": "What single product feature or integration is most indispensable to you?",
        "type": "text",
        "required": true
      },
      {
        "id": "1802",
        "text": "Preferred browser environment for daily application access",
        "type": "select",
        "required": true,
        "options": [
          "Google Chrome",
          "Mozilla Firefox",
          "Apple Safari",
          "Microsoft Edge",
          "Desktop Electron App"
        ]
      },
      {
        "id": "1803",
        "text": "How frequently do you log into the platform for your core tasks?",
        "type": "radio",
        "required": true,
        "options": [
          "Daily power user",
          "Several times weekly",
          "Once a week",
          "A few times a month"
        ]
      },
      {
        "id": "1804",
        "text": "Attach a screenshot illustrating any UI confusion or workflow bug encountered",
        "type": "file",
        "required": false
      },
      {
        "id": "1805",
        "text": "Which product features do you utilize most frequently?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Analytics Dashboard",
          "Export to PDF/CSV",
          "Automated Workflows",
          "Team Collaboration",
          "API Webhooks",
          "Audit Logs"
        ]
      },
      {
        "id": "1806",
        "text": "Date your organization commenced using this software",
        "type": "date",
        "required": false
      },
      {
        "id": "1807",
        "text": "Account administrator contact email for feature preview invitations",
        "type": "email",
        "required": false
      },
      {
        "id": "1808",
        "text": "Self-reported onboarding completion time (minutes)",
        "type": "range",
        "required": true,
        "rangeMin": 5,
        "rangeMax": 120,
        "rangeStep": 5
      },
      {
        "id": "1809",
        "text": "Net Promoter Score: How likely are you to recommend our application to a colleague? (1-10)",
        "type": "scale",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "18010",
        "text": "Did the guided interactive product tour effectively explain key features?",
        "type": "boolean",
        "required": true
      }
    ]
  },
  {
    "id": "19",
    "title": "Heathcote, Schowalter and Williamson Grocery",
    "description": "Adaptive tertiary application - Workplace Culture & Employee Wellness Assessment",
    "responses": 3633,
    "status": "Active",
    "createdAt": "08/11/2023",
    "updatedAt": "24/08/2026",
    "previewColumns": 2,
    "questions": [
      {
        "id": "1901",
        "text": "Primary operational department / business unit",
        "type": "select",
        "required": false,
        "options": [
          "Engineering",
          "Product & Design",
          "Marketing & Growth",
          "Sales & Accounts",
          "People & HR",
          "Finance & Legal"
        ]
      },
      {
        "id": "1902",
        "text": "Date of your last career development and compensation review",
        "type": "date",
        "required": false
      },
      {
        "id": "1903",
        "text": "Confidential work email (optional for anonymous follow-up discussions)",
        "type": "email",
        "required": true
      },
      {
        "id": "1904",
        "text": "Total years of tenure with the organization",
        "type": "number",
        "required": false
      },
      {
        "id": "1905",
        "text": "Which company employee benefits and perks do you value highest?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Comprehensive Health Insurance",
          "Generous 401(k) / Pension Match",
          "Annual Learning & Conference Stipend",
          "Home Office Ergonomic Budget",
          "Flexible Unlimited PTO",
          "Gym & Wellness Allowance"
        ]
      },
      {
        "id": "1906",
        "text": "Preferred working arrangement moving forward",
        "type": "radio",
        "required": false,
        "options": [
          "100% Remote / Distributed",
          "Hybrid (1-2 days office)",
          "Hybrid (3-4 days office)",
          "Fully In-Office"
        ]
      },
      {
        "id": "1907",
        "text": "Do you feel comfortable discussing workload constraints openly with your direct manager?",
        "type": "boolean",
        "required": true
      },
      {
        "id": "1908",
        "text": "Upload home office ergonomic workspace evaluation or equipment receipt",
        "type": "file",
        "required": true
      },
      {
        "id": "1909",
        "text": "Preferred number of remote work days per week",
        "type": "range",
        "required": true,
        "rangeMin": 0,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "19010",
        "text": "How strongly do you agree that leadership fosters transparent, inclusive communication? (1-10)",
        "type": "scale",
        "required": false,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "19011",
        "text": "What concrete workplace policies or tools would improve your daily productivity and morale?",
        "type": "textarea",
        "required": true
      },
      {
        "id": "19012",
        "text": "Immediate team or project squad name",
        "type": "text",
        "required": true
      }
    ]
  },
  {
    "id": "20",
    "title": "Blanda Inc Clothing",
    "description": "Triple-buffered eco-centric process improvement - Fintech & Digital Banking Assessment",
    "responses": 2079,
    "status": "Inactive",
    "createdAt": "13/07/2023",
    "updatedAt": "11/09/2026",
    "previewColumns": 1,
    "questions": [
      {
        "id": "2001",
        "text": "Confidence in multi-layer account fraud detection and transaction safety (1-10)",
        "type": "scale",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "2002",
        "text": "Upload proof of billing address or redacted bank statement document",
        "type": "file",
        "required": true
      },
      {
        "id": "2003",
        "text": "Instant transaction notification threshold ($ USD)",
        "type": "range",
        "required": true,
        "rangeMin": 10,
        "rangeMax": 1000,
        "rangeStep": 25
      },
      {
        "id": "2004",
        "text": "What investment, budgeting, or international remittance features do you need most?",
        "type": "textarea",
        "required": false
      },
      {
        "id": "2005",
        "text": "Registered banking profile email address for multi-factor verification",
        "type": "email",
        "required": true
      },
      {
        "id": "2006",
        "text": "Name of the competitor banking app you find most user-friendly",
        "type": "text",
        "required": false
      },
      {
        "id": "2007",
        "text": "Approximate number of digital transactions conducted each month",
        "type": "number",
        "required": true
      },
      {
        "id": "2008",
        "text": "Date account KYC identity verification was completed",
        "type": "date",
        "required": true
      },
      {
        "id": "2009",
        "text": "Biometric authentication (Face ID / Fingerprint) speed and convenience rating",
        "type": "rating",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "20010",
        "text": "Would you activate AI-driven automated recurring bill payment optimization?",
        "type": "boolean",
        "required": true
      },
      {
        "id": "20011",
        "text": "Select all financial asset categories held in your digital portfolio",
        "type": "checkbox",
        "required": true,
        "options": [
          "Cash / High-Yield Savings",
          "Broad Index ETFs",
          "Individual Tech Equities",
          "Cryptocurrency Assets",
          "Municipal Bonds",
          "Real Estate REITs"
        ]
      }
    ]
  },
  {
    "id": "21",
    "title": "Labadie - Casper Grocery",
    "description": "Streamlined global synergy - Healthcare & Patient Experience Assessment",
    "responses": 1201,
    "status": "Inactive",
    "createdAt": "28/08/2025",
    "updatedAt": "04/02/2026",
    "previewColumns": 2,
    "questions": [
      {
        "id": "2101",
        "text": "Average in-clinic waiting room duration before doctor consultation (minutes)",
        "type": "range",
        "required": true,
        "rangeMin": 5,
        "rangeMax": 90,
        "rangeStep": 5
      },
      {
        "id": "2102",
        "text": "Please describe any delays, billing confusion, or medical instructions that required clarification",
        "type": "textarea",
        "required": false
      },
      {
        "id": "2103",
        "text": "Name of primary referring physician or specialist clinic",
        "type": "text",
        "required": true
      },
      {
        "id": "2104",
        "text": "Number of healthcare visits completed in the past 12 months",
        "type": "number",
        "required": true
      },
      {
        "id": "2105",
        "text": "Overall ease of booking appointments and receiving lab results via patient portal (1-10)",
        "type": "scale",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "2106",
        "text": "Medical practitioner consultation clarity, attentiveness, and bedside manner",
        "type": "rating",
        "required": false,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "2107",
        "text": "Date of most recent comprehensive preventative health checkup",
        "type": "date",
        "required": true
      },
      {
        "id": "2108",
        "text": "Do you authorize automated electronic prescription refills to your preferred local pharmacy?",
        "type": "boolean",
        "required": true
      },
      {
        "id": "2109",
        "text": "Confidential patient contact email for lab reports and discharge summaries",
        "type": "email",
        "required": true
      },
      {
        "id": "21010",
        "text": "Primary health insurance carrier or coverage network",
        "type": "select",
        "required": false,
        "options": [
          "BlueCross BlueShield",
          "Aetna / CVS Health",
          "UnitedHealthcare",
          "Kaiser Permanente",
          "Cigna",
          "Medicare / Medicaid",
          "Self-Pay / Uninsured"
        ]
      },
      {
        "id": "21011",
        "text": "Upload scanned insurance card copy or medical referral document",
        "type": "file",
        "required": true
      },
      {
        "id": "21012",
        "text": "Select chronic health or wellness areas monitored regularly",
        "type": "checkbox",
        "required": true,
        "options": [
          "Cardiovascular & Blood Pressure",
          "Blood Glucose / Diabetes",
          "Respiratory & Asthma",
          "Seasonal Allergies & Immunology",
          "Mental Health & Sleep Disorders",
          "Orthopedic / Joint Health"
        ]
      }
    ]
  },
  {
    "id": "22",
    "title": "Block and Sons Tools",
    "description": "Virtual asynchronous hardware - E-Commerce & Retail Experience Assessment",
    "responses": 4154,
    "status": "Active",
    "createdAt": "02/05/2025",
    "updatedAt": "22/12/2025",
    "previewColumns": 2,
    "questions": [
      {
        "id": "2201",
        "text": "Overall satisfaction with product catalog variety and in-stock inventory availability",
        "type": "rating",
        "required": false,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "2202",
        "text": "How frequently do you place online retail orders across all merchants?",
        "type": "radio",
        "required": true,
        "options": [
          "Multiple times per week",
          "Weekly",
          "Once or twice a month",
          "Only during holiday promotions"
        ]
      },
      {
        "id": "2203",
        "text": "Date of most recent online order or store pickup",
        "type": "date",
        "required": true
      },
      {
        "id": "2204",
        "text": "Customer email address for loyalty points balance and coupon delivery",
        "type": "email",
        "required": true
      },
      {
        "id": "2205",
        "text": "Upload photo of received parcel condition or store receipt",
        "type": "file",
        "required": true
      },
      {
        "id": "2206",
        "text": "Did package tracking updates provide accurate real-time transit milestones?",
        "type": "boolean",
        "required": true
      },
      {
        "id": "2207",
        "text": "Order tracking or invoice reference number",
        "type": "text",
        "required": true
      },
      {
        "id": "2208",
        "text": "Rate the efficiency and delivery speed of your recent package shipment (1-10)",
        "type": "scale",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "2209",
        "text": "What products or packaging improvements would encourage you to order again?",
        "type": "textarea",
        "required": true
      },
      {
        "id": "22010",
        "text": "Maximum acceptable standard ground delivery window (days)",
        "type": "range",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 14,
        "rangeStep": 1
      }
    ]
  },
  {
    "id": "23",
    "title": "Davis, Tremblay and Stoltenberg Beauty",
    "description": "Profound immersive internet solution - Smart Home & Environmental Sustainability Assessment",
    "responses": 4502,
    "status": "Pending",
    "createdAt": "05/03/2025",
    "updatedAt": "29/07/2026",
    "previewColumns": 2,
    "questions": [
      {
        "id": "2301",
        "text": "Select all waste categories systematically separated at your residence",
        "type": "checkbox",
        "required": true,
        "options": [
          "Rigid Plastics (PET/HDPE)",
          "Glass Bottles & Jars",
          "Corrugated Cardboard & Clean Paper",
          "E-Waste & Batteries",
          "Organic Food Compost",
          "Hazardous Chemicals / Paint"
        ]
      },
      {
        "id": "2302",
        "text": "Date smart electrical sub-meter or solar inverter was activated",
        "type": "date",
        "required": true
      },
      {
        "id": "2303",
        "text": "Total number of connected smart home sensors and automated fixtures in home",
        "type": "number",
        "required": true
      },
      {
        "id": "2304",
        "text": "Upload photo of neighborhood sorting station or solar generation meter",
        "type": "file",
        "required": true
      },
      {
        "id": "2305",
        "text": "Resident email address for annual municipal green rebate voucher",
        "type": "email",
        "required": false
      },
      {
        "id": "2306",
        "text": "Local municipal district or residential postal code",
        "type": "text",
        "required": true
      },
      {
        "id": "2307",
        "text": "What clean energy or recycling programs should our community prioritize this year?",
        "type": "textarea",
        "required": false
      },
      {
        "id": "2308",
        "text": "Rate municipal recycling collection reliability and service accessibility (1-10)",
        "type": "scale",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "2309",
        "text": "Does your local council provide subsidized compost containers or green waste bins?",
        "type": "boolean",
        "required": true
      },
      {
        "id": "23010",
        "text": "Estimated percentage of household solid waste diverted from landfill (%)",
        "type": "range",
        "required": true,
        "rangeMin": 0,
        "rangeMax": 100,
        "rangeStep": 5
      }
    ]
  },
  {
    "id": "24",
    "title": "Graham - Powlowski Automotive",
    "description": "Focused tertiary hub - Higher Education & Online Learning Assessment",
    "responses": 2423,
    "status": "Active",
    "createdAt": "24/06/2023",
    "updatedAt": "19/12/2023",
    "previewColumns": 2,
    "questions": [
      {
        "id": "2401",
        "text": "Student university email address (.edu / academic domain)",
        "type": "email",
        "required": true
      },
      {
        "id": "2402",
        "text": "Upload final course project submission or capstone proposal summary",
        "type": "file",
        "required": true
      },
      {
        "id": "2403",
        "text": "Course title and course catalog registration code (e.g. CS-402)",
        "type": "text",
        "required": true
      },
      {
        "id": "2404",
        "text": "Academic field or primary degree concentration",
        "type": "select",
        "required": true,
        "options": [
          "Computer Science & Software",
          "Data Analytics & AI",
          "Business Administration & Finance",
          "Digital Media & UX Design",
          "Electrical Engineering",
          "Biomedical Sciences"
        ]
      },
      {
        "id": "2405",
        "text": "Which instructional learning resources proved most valuable?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Recorded Lecture Video Replays",
          "Interactive Hands-on Coding Labs",
          "Annotated Slide Decks",
          "Peer Discussion Forums",
          "Weekly Live Office Hours",
          "Real-World Capstone Case Studies"
        ]
      },
      {
        "id": "2406",
        "text": "How effectively did coursework assignments prepare you for real-world projects? (1-10)",
        "type": "scale",
        "required": false,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "2407",
        "text": "Preferred course assessment and grading methodology",
        "type": "radio",
        "required": false,
        "options": [
          "Practical Portfolio Projects",
          "Proctored Timed Quizzes",
          "Collaborative Group Case Studies",
          "Open-book Research Essays"
        ]
      },
      {
        "id": "2408",
        "text": "Total academic credit units completed toward program graduation",
        "type": "number",
        "required": true
      }
    ]
  },
  {
    "id": "25",
    "title": "Luettgen Inc Baby",
    "description": "Face to face optimal infrastructure - Cloud Infrastructure & DevOps Assessment",
    "responses": 380,
    "status": "Inactive",
    "createdAt": "06/06/2023",
    "updatedAt": "13/01/2025",
    "previewColumns": 2,
    "questions": [
      {
        "id": "2501",
        "text": "Primary public cloud provider hosting your primary workload",
        "type": "select",
        "required": true,
        "options": [
          "Amazon Web Services (AWS)",
          "Google Cloud Platform (GCP)",
          "Microsoft Azure",
          "Cloudflare Workers",
          "On-Premises Private Cloud"
        ]
      },
      {
        "id": "2502",
        "text": "Date of most recent architecture disaster-recovery simulation test",
        "type": "date",
        "required": false
      },
      {
        "id": "2503",
        "text": "Rate global edge API latency and response time satisfaction (1-10)",
        "type": "scale",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "2504",
        "text": "Average production deployment frequency across engineering teams",
        "type": "radio",
        "required": false,
        "options": [
          "Multiple times per day",
          "Once daily",
          "Weekly sprint release",
          "Bi-weekly or monthly"
        ]
      },
      {
        "id": "2505",
        "text": "Lead Site Reliability Engineer (SRE) contact email for post-incident review",
        "type": "email",
        "required": true
      },
      {
        "id": "2506",
        "text": "Primary monitoring and distributed tracing vendor utilized (e.g. Datadog, Prometheus)",
        "type": "text",
        "required": true
      },
      {
        "id": "2507",
        "text": "Is zero-downtime blue/green deployment mandatory for production releases?",
        "type": "boolean",
        "required": true
      },
      {
        "id": "2508",
        "text": "Upload architecture diagram, Helm chart values, or Terraform topology file",
        "type": "file",
        "required": false
      },
      {
        "id": "2509",
        "text": "Overall platform uptime and automated failover reliability",
        "type": "rating",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "25010",
        "text": "Average estimated monthly cloud infrastructure expenditure (in thousands USD)",
        "type": "number",
        "required": true
      },
      {
        "id": "25011",
        "text": "Target container memory allocation buffer per microservice (GB)",
        "type": "range",
        "required": false,
        "rangeMin": 2,
        "rangeMax": 64,
        "rangeStep": 2
      }
    ]
  },
  {
    "id": "26",
    "title": "Turner - Glover Grocery",
    "description": "Reduced cohesive microservice - SaaS Usability & Product Experience Assessment",
    "responses": 2163,
    "status": "Pending",
    "createdAt": "19/12/2023",
    "updatedAt": "29/01/2025",
    "previewColumns": 3,
    "questions": [
      {
        "id": "2601",
        "text": "Attach a screenshot illustrating any UI confusion or workflow bug encountered",
        "type": "file",
        "required": false
      },
      {
        "id": "2602",
        "text": "Date your organization commenced using this software",
        "type": "date",
        "required": true
      },
      {
        "id": "2603",
        "text": "Net Promoter Score: How likely are you to recommend our application to a colleague? (1-10)",
        "type": "scale",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "2604",
        "text": "Preferred browser environment for daily application access",
        "type": "select",
        "required": true,
        "options": [
          "Google Chrome",
          "Mozilla Firefox",
          "Apple Safari",
          "Microsoft Edge",
          "Desktop Electron App"
        ]
      },
      {
        "id": "2605",
        "text": "Total number of licensed seats currently allocated to your organization",
        "type": "number",
        "required": true
      },
      {
        "id": "2606",
        "text": "Which product features do you utilize most frequently?",
        "type": "checkbox",
        "required": false,
        "options": [
          "Analytics Dashboard",
          "Export to PDF/CSV",
          "Automated Workflows",
          "Team Collaboration",
          "API Webhooks",
          "Audit Logs"
        ]
      },
      {
        "id": "2607",
        "text": "What additional capabilities would make this platform a 10/10 experience for your team?",
        "type": "textarea",
        "required": false
      }
    ]
  },
  {
    "id": "27",
    "title": "Morar - Dietrich Industrial",
    "description": "Realigned asynchronous protocol - Workplace Culture & Employee Wellness Assessment",
    "responses": 1253,
    "status": "Inactive",
    "createdAt": "23/08/2024",
    "updatedAt": "12/11/2025",
    "previewColumns": 1,
    "questions": [
      {
        "id": "2701",
        "text": "What concrete workplace policies or tools would improve your daily productivity and morale?",
        "type": "textarea",
        "required": true
      },
      {
        "id": "2702",
        "text": "Upload home office ergonomic workspace evaluation or equipment receipt",
        "type": "file",
        "required": false
      },
      {
        "id": "2703",
        "text": "Immediate team or project squad name",
        "type": "text",
        "required": true
      },
      {
        "id": "2704",
        "text": "Preferred number of remote work days per week",
        "type": "range",
        "required": true,
        "rangeMin": 0,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "2705",
        "text": "Total years of tenure with the organization",
        "type": "number",
        "required": false
      },
      {
        "id": "2706",
        "text": "Confidential work email (optional for anonymous follow-up discussions)",
        "type": "email",
        "required": false
      },
      {
        "id": "2707",
        "text": "Primary operational department / business unit",
        "type": "select",
        "required": false,
        "options": [
          "Engineering",
          "Product & Design",
          "Marketing & Growth",
          "Sales & Accounts",
          "People & HR",
          "Finance & Legal"
        ]
      },
      {
        "id": "2708",
        "text": "Work-life balance and mental wellness support satisfaction",
        "type": "rating",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "2709",
        "text": "How strongly do you agree that leadership fosters transparent, inclusive communication? (1-10)",
        "type": "scale",
        "required": false,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      }
    ]
  },
  {
    "id": "28",
    "title": "McClure - Wunsch Kids",
    "description": "Innovative modular capacity - Fintech & Digital Banking Assessment",
    "responses": 1816,
    "status": "Inactive",
    "createdAt": "10/10/2024",
    "updatedAt": "06/02/2025",
    "previewColumns": 2,
    "questions": [
      {
        "id": "2801",
        "text": "Date account KYC identity verification was completed",
        "type": "date",
        "required": true
      },
      {
        "id": "2802",
        "text": "Instant transaction notification threshold ($ USD)",
        "type": "range",
        "required": true,
        "rangeMin": 10,
        "rangeMax": 1000,
        "rangeStep": 25
      },
      {
        "id": "2803",
        "text": "What investment, budgeting, or international remittance features do you need most?",
        "type": "textarea",
        "required": true
      },
      {
        "id": "2804",
        "text": "Upload proof of billing address or redacted bank statement document",
        "type": "file",
        "required": true
      },
      {
        "id": "2805",
        "text": "Primary everyday payment method used at physical retail counters",
        "type": "radio",
        "required": true,
        "options": [
          "Apple Pay / Google Wallet via Phone",
          "Physical Chip & PIN Debit Card",
          "Contactless Tap Card",
          "Cash"
        ]
      },
      {
        "id": "2806",
        "text": "Would you activate AI-driven automated recurring bill payment optimization?",
        "type": "boolean",
        "required": true
      },
      {
        "id": "2807",
        "text": "Confidence in multi-layer account fraud detection and transaction safety (1-10)",
        "type": "scale",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      }
    ]
  },
  {
    "id": "29",
    "title": "Hessel, Prosacco and Huels Electronics",
    "description": "Reduced mobile adapter - Healthcare & Patient Experience Assessment",
    "responses": 697,
    "status": "Active",
    "createdAt": "21/07/2024",
    "updatedAt": "18/06/2026",
    "previewColumns": 3,
    "questions": [
      {
        "id": "2901",
        "text": "Overall ease of booking appointments and receiving lab results via patient portal (1-10)",
        "type": "scale",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "2902",
        "text": "Preferred consultation format for routine non-emergency medical visits",
        "type": "radio",
        "required": true,
        "options": [
          "In-person clinic visit",
          "Secure video telehealth session",
          "Telephone consultation",
          "Asynchronous portal messaging"
        ]
      },
      {
        "id": "2903",
        "text": "Do you authorize automated electronic prescription refills to your preferred local pharmacy?",
        "type": "boolean",
        "required": true
      },
      {
        "id": "2904",
        "text": "Date of most recent comprehensive preventative health checkup",
        "type": "date",
        "required": true
      },
      {
        "id": "2905",
        "text": "Please describe any delays, billing confusion, or medical instructions that required clarification",
        "type": "textarea",
        "required": true
      },
      {
        "id": "2906",
        "text": "Confidential patient contact email for lab reports and discharge summaries",
        "type": "email",
        "required": false
      },
      {
        "id": "2907",
        "text": "Medical practitioner consultation clarity, attentiveness, and bedside manner",
        "type": "rating",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "2908",
        "text": "Number of healthcare visits completed in the past 12 months",
        "type": "number",
        "required": true
      },
      {
        "id": "2909",
        "text": "Select chronic health or wellness areas monitored regularly",
        "type": "checkbox",
        "required": true,
        "options": [
          "Cardiovascular & Blood Pressure",
          "Blood Glucose / Diabetes",
          "Respiratory & Asthma",
          "Seasonal Allergies & Immunology",
          "Mental Health & Sleep Disorders",
          "Orthopedic / Joint Health"
        ]
      }
    ]
  },
  {
    "id": "30",
    "title": "Gerhold and Sons Clothing",
    "description": "Open-architected asynchronous throughput - E-Commerce & Retail Experience Assessment",
    "responses": 388,
    "status": "Active",
    "createdAt": "19/09/2024",
    "updatedAt": "16/06/2025",
    "previewColumns": 1,
    "questions": [
      {
        "id": "3001",
        "text": "How frequently do you place online retail orders across all merchants?",
        "type": "radio",
        "required": false,
        "options": [
          "Multiple times per week",
          "Weekly",
          "Once or twice a month",
          "Only during holiday promotions"
        ]
      },
      {
        "id": "3002",
        "text": "Rate the efficiency and delivery speed of your recent package shipment (1-10)",
        "type": "scale",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "3003",
        "text": "Date of most recent online order or store pickup",
        "type": "date",
        "required": false
      },
      {
        "id": "3004",
        "text": "Overall satisfaction with product catalog variety and in-stock inventory availability",
        "type": "rating",
        "required": false,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "3005",
        "text": "What products or packaging improvements would encourage you to order again?",
        "type": "textarea",
        "required": true
      },
      {
        "id": "3006",
        "text": "Preferred retail product category for seasonal shopping",
        "type": "select",
        "required": true,
        "options": [
          "Electronics & Smart Gadgets",
          "Apparel & Footwear",
          "Home & Kitchen Appliances",
          "Beauty & Personal Care",
          "Sports & Outdoor Recreation",
          "Books & Media"
        ]
      },
      {
        "id": "3007",
        "text": "Maximum acceptable standard ground delivery window (days)",
        "type": "range",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 14,
        "rangeStep": 1
      },
      {
        "id": "3008",
        "text": "Order tracking or invoice reference number",
        "type": "text",
        "required": true
      },
      {
        "id": "3009",
        "text": "Estimated total number of online orders completed during the past year",
        "type": "number",
        "required": true
      },
      {
        "id": "30010",
        "text": "Which factors most heavily influence your final purchasing decision?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Free Express Shipping",
          "Verified Customer Photo Reviews",
          "Price Match Guarantee",
          "Hassle-Free 30-Day Returns",
          "Sustainable Eco-Packaging",
          "Loyalty Rewards Points"
        ]
      }
    ]
  },
  {
    "id": "31",
    "title": "Heathcote - Wiza Home",
    "description": "Synchronised cloud-native ability - Smart Home & Environmental Sustainability Assessment",
    "responses": 2214,
    "status": "Pending",
    "createdAt": "03/07/2023",
    "updatedAt": "25/04/2024",
    "previewColumns": 2,
    "questions": [
      {
        "id": "3101",
        "text": "Estimated percentage of household solid waste diverted from landfill (%)",
        "type": "range",
        "required": true,
        "rangeMin": 0,
        "rangeMax": 100,
        "rangeStep": 5
      },
      {
        "id": "3102",
        "text": "Local municipal district or residential postal code",
        "type": "text",
        "required": true
      },
      {
        "id": "3103",
        "text": "Date smart electrical sub-meter or solar inverter was activated",
        "type": "date",
        "required": false
      },
      {
        "id": "3104",
        "text": "Current household rooftop solar or renewable energy status",
        "type": "radio",
        "required": true,
        "options": [
          "Installed & actively generating power",
          "Permits approved, awaiting installation",
          "Actively exploring quotes",
          "Not feasible for this property"
        ]
      },
      {
        "id": "3105",
        "text": "Total number of connected smart home sensors and automated fixtures in home",
        "type": "number",
        "required": true
      },
      {
        "id": "3106",
        "text": "Resident email address for annual municipal green rebate voucher",
        "type": "email",
        "required": true
      },
      {
        "id": "3107",
        "text": "What clean energy or recycling programs should our community prioritize this year?",
        "type": "textarea",
        "required": true
      },
      {
        "id": "3108",
        "text": "Satisfaction with smart thermostat automated energy conservation savings",
        "type": "rating",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "3109",
        "text": "Rate municipal recycling collection reliability and service accessibility (1-10)",
        "type": "scale",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "31010",
        "text": "Does your local council provide subsidized compost containers or green waste bins?",
        "type": "boolean",
        "required": false
      },
      {
        "id": "31011",
        "text": "Upload photo of neighborhood sorting station or solar generation meter",
        "type": "file",
        "required": false
      }
    ]
  },
  {
    "id": "32",
    "title": "Corwin and Sons Electronics",
    "description": "Phased static budgetary management - Higher Education & Online Learning Assessment",
    "responses": 3410,
    "status": "Active",
    "createdAt": "25/07/2024",
    "updatedAt": "10/04/2026",
    "previewColumns": 1,
    "questions": [
      {
        "id": "3201",
        "text": "Which instructional learning resources proved most valuable?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Recorded Lecture Video Replays",
          "Interactive Hands-on Coding Labs",
          "Annotated Slide Decks",
          "Peer Discussion Forums",
          "Weekly Live Office Hours",
          "Real-World Capstone Case Studies"
        ]
      },
      {
        "id": "3202",
        "text": "Did syllabus milestones clearly communicate grading rubrics and assignment deadlines?",
        "type": "boolean",
        "required": true
      },
      {
        "id": "3203",
        "text": "Student university email address (.edu / academic domain)",
        "type": "email",
        "required": true
      },
      {
        "id": "3204",
        "text": "What syllabus topics or hands-on tutorials would enrich the next cohort of students?",
        "type": "textarea",
        "required": true
      },
      {
        "id": "3205",
        "text": "Average independent study and lab preparation hours per week",
        "type": "range",
        "required": false,
        "rangeMin": 2,
        "rangeMax": 40,
        "rangeStep": 2
      },
      {
        "id": "3206",
        "text": "Preferred course assessment and grading methodology",
        "type": "radio",
        "required": false,
        "options": [
          "Practical Portfolio Projects",
          "Proctored Timed Quizzes",
          "Collaborative Group Case Studies",
          "Open-book Research Essays"
        ]
      },
      {
        "id": "3207",
        "text": "How effectively did coursework assignments prepare you for real-world projects? (1-10)",
        "type": "scale",
        "required": false,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "3208",
        "text": "Upload final course project submission or capstone proposal summary",
        "type": "file",
        "required": false
      },
      {
        "id": "3209",
        "text": "Course instructor subject matter expertise and responsiveness to student questions",
        "type": "rating",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "32010",
        "text": "Projected degree or certification completion date",
        "type": "date",
        "required": false
      },
      {
        "id": "32011",
        "text": "Academic field or primary degree concentration",
        "type": "select",
        "required": true,
        "options": [
          "Computer Science & Software",
          "Data Analytics & AI",
          "Business Administration & Finance",
          "Digital Media & UX Design",
          "Electrical Engineering",
          "Biomedical Sciences"
        ]
      },
      {
        "id": "32012",
        "text": "Course title and course catalog registration code (e.g. CS-402)",
        "type": "text",
        "required": true
      }
    ]
  },
  {
    "id": "33",
    "title": "Considine, Beatty and Hickle Music",
    "description": "Optimized attitude-oriented contingency - Cloud Infrastructure & DevOps Assessment",
    "responses": 4008,
    "status": "Inactive",
    "createdAt": "02/01/2024",
    "updatedAt": "29/01/2024",
    "previewColumns": 3,
    "questions": [
      {
        "id": "3301",
        "text": "Primary public cloud provider hosting your primary workload",
        "type": "select",
        "required": true,
        "options": [
          "Amazon Web Services (AWS)",
          "Google Cloud Platform (GCP)",
          "Microsoft Azure",
          "Cloudflare Workers",
          "On-Premises Private Cloud"
        ]
      },
      {
        "id": "3302",
        "text": "Lead Site Reliability Engineer (SRE) contact email for post-incident review",
        "type": "email",
        "required": false
      },
      {
        "id": "3303",
        "text": "What operational pain points or bottlenecks impact your current release velocity?",
        "type": "textarea",
        "required": true
      },
      {
        "id": "3304",
        "text": "Overall platform uptime and automated failover reliability",
        "type": "rating",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "3305",
        "text": "Is zero-downtime blue/green deployment mandatory for production releases?",
        "type": "boolean",
        "required": true
      },
      {
        "id": "3306",
        "text": "Which container orchestration & CI/CD tools are active in your pipeline?",
        "type": "checkbox",
        "required": false,
        "options": [
          "Kubernetes",
          "Docker Swarm",
          "GitHub Actions",
          "GitLab CI",
          "ArgoCD",
          "Terraform"
        ]
      },
      {
        "id": "3307",
        "text": "Primary monitoring and distributed tracing vendor utilized (e.g. Datadog, Prometheus)",
        "type": "text",
        "required": true
      },
      {
        "id": "3308",
        "text": "Date of most recent architecture disaster-recovery simulation test",
        "type": "date",
        "required": true
      },
      {
        "id": "3309",
        "text": "Average production deployment frequency across engineering teams",
        "type": "radio",
        "required": false,
        "options": [
          "Multiple times per day",
          "Once daily",
          "Weekly sprint release",
          "Bi-weekly or monthly"
        ]
      },
      {
        "id": "33010",
        "text": "Upload architecture diagram, Helm chart values, or Terraform topology file",
        "type": "file",
        "required": false
      },
      {
        "id": "33011",
        "text": "Target container memory allocation buffer per microservice (GB)",
        "type": "range",
        "required": true,
        "rangeMin": 2,
        "rangeMax": 64,
        "rangeStep": 2
      }
    ]
  },
  {
    "id": "34",
    "title": "Thiel, Runolfsdottir and Okuneva Electronics",
    "description": "Immersive static software - SaaS Usability & Product Experience Assessment",
    "responses": 3142,
    "status": "Pending",
    "createdAt": "31/01/2024",
    "updatedAt": "10/12/2024",
    "previewColumns": 2,
    "questions": [
      {
        "id": "3401",
        "text": "Intuitive navigation and overall UI design aesthetic satisfaction",
        "type": "rating",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "3402",
        "text": "What additional capabilities would make this platform a 10/10 experience for your team?",
        "type": "textarea",
        "required": true
      },
      {
        "id": "3403",
        "text": "Self-reported onboarding completion time (minutes)",
        "type": "range",
        "required": false,
        "rangeMin": 5,
        "rangeMax": 120,
        "rangeStep": 5
      },
      {
        "id": "3404",
        "text": "Total number of licensed seats currently allocated to your organization",
        "type": "number",
        "required": false
      },
      {
        "id": "3405",
        "text": "Date your organization commenced using this software",
        "type": "date",
        "required": true
      },
      {
        "id": "3406",
        "text": "Preferred browser environment for daily application access",
        "type": "select",
        "required": false,
        "options": [
          "Google Chrome",
          "Mozilla Firefox",
          "Apple Safari",
          "Microsoft Edge",
          "Desktop Electron App"
        ]
      },
      {
        "id": "3407",
        "text": "Account administrator contact email for feature preview invitations",
        "type": "email",
        "required": true
      },
      {
        "id": "3408",
        "text": "What single product feature or integration is most indispensable to you?",
        "type": "text",
        "required": false
      }
    ]
  },
  {
    "id": "35",
    "title": "Quigley Group Music",
    "description": "Managed motivating workforce - Workplace Culture & Employee Wellness Assessment",
    "responses": 678,
    "status": "Active",
    "createdAt": "04/09/2023",
    "updatedAt": "23/09/2026",
    "previewColumns": 1,
    "questions": [
      {
        "id": "3501",
        "text": "Preferred working arrangement moving forward",
        "type": "radio",
        "required": true,
        "options": [
          "100% Remote / Distributed",
          "Hybrid (1-2 days office)",
          "Hybrid (3-4 days office)",
          "Fully In-Office"
        ]
      },
      {
        "id": "3502",
        "text": "Date of your last career development and compensation review",
        "type": "date",
        "required": false
      },
      {
        "id": "3503",
        "text": "How strongly do you agree that leadership fosters transparent, inclusive communication? (1-10)",
        "type": "scale",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "3504",
        "text": "Preferred number of remote work days per week",
        "type": "range",
        "required": true,
        "rangeMin": 0,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "3505",
        "text": "Work-life balance and mental wellness support satisfaction",
        "type": "rating",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "3506",
        "text": "Do you feel comfortable discussing workload constraints openly with your direct manager?",
        "type": "boolean",
        "required": false
      },
      {
        "id": "3507",
        "text": "What concrete workplace policies or tools would improve your daily productivity and morale?",
        "type": "textarea",
        "required": false
      },
      {
        "id": "3508",
        "text": "Total years of tenure with the organization",
        "type": "number",
        "required": true
      },
      {
        "id": "3509",
        "text": "Upload home office ergonomic workspace evaluation or equipment receipt",
        "type": "file",
        "required": true
      },
      {
        "id": "35010",
        "text": "Which company employee benefits and perks do you value highest?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Comprehensive Health Insurance",
          "Generous 401(k) / Pension Match",
          "Annual Learning & Conference Stipend",
          "Home Office Ergonomic Budget",
          "Flexible Unlimited PTO",
          "Gym & Wellness Allowance"
        ]
      },
      {
        "id": "35011",
        "text": "Confidential work email (optional for anonymous follow-up discussions)",
        "type": "email",
        "required": false
      }
    ]
  },
  {
    "id": "36",
    "title": "Baumbach, Wolff and Altenwerth Games",
    "description": "Extended discrete customer loyalty - Fintech & Digital Banking Assessment",
    "responses": 197,
    "status": "Pending",
    "createdAt": "19/07/2025",
    "updatedAt": "06/07/2026",
    "previewColumns": 2,
    "questions": [
      {
        "id": "3601",
        "text": "Primary daily currency denomination for checking and transactions",
        "type": "select",
        "required": true,
        "options": [
          "US Dollar (USD)",
          "Euro (EUR)",
          "British Pound (GBP)",
          "Canadian Dollar (CAD)",
          "Australian Dollar (AUD)",
          "Japanese Yen (JPY)"
        ]
      },
      {
        "id": "3602",
        "text": "Instant transaction notification threshold ($ USD)",
        "type": "range",
        "required": false,
        "rangeMin": 10,
        "rangeMax": 1000,
        "rangeStep": 25
      },
      {
        "id": "3603",
        "text": "Select all financial asset categories held in your digital portfolio",
        "type": "checkbox",
        "required": true,
        "options": [
          "Cash / High-Yield Savings",
          "Broad Index ETFs",
          "Individual Tech Equities",
          "Cryptocurrency Assets",
          "Municipal Bonds",
          "Real Estate REITs"
        ]
      },
      {
        "id": "3604",
        "text": "Confidence in multi-layer account fraud detection and transaction safety (1-10)",
        "type": "scale",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "3605",
        "text": "Date account KYC identity verification was completed",
        "type": "date",
        "required": false
      },
      {
        "id": "3606",
        "text": "Would you activate AI-driven automated recurring bill payment optimization?",
        "type": "boolean",
        "required": true
      },
      {
        "id": "3607",
        "text": "Primary everyday payment method used at physical retail counters",
        "type": "radio",
        "required": true,
        "options": [
          "Apple Pay / Google Wallet via Phone",
          "Physical Chip & PIN Debit Card",
          "Contactless Tap Card",
          "Cash"
        ]
      },
      {
        "id": "3608",
        "text": "What investment, budgeting, or international remittance features do you need most?",
        "type": "textarea",
        "required": true
      },
      {
        "id": "3609",
        "text": "Biometric authentication (Face ID / Fingerprint) speed and convenience rating",
        "type": "rating",
        "required": false,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "36010",
        "text": "Name of the competitor banking app you find most user-friendly",
        "type": "text",
        "required": true
      },
      {
        "id": "36011",
        "text": "Registered banking profile email address for multi-factor verification",
        "type": "email",
        "required": true
      },
      {
        "id": "36012",
        "text": "Approximate number of digital transactions conducted each month",
        "type": "number",
        "required": false
      }
    ]
  },
  {
    "id": "37",
    "title": "Pacocha Group Clothing",
    "description": "Devolved explicit hardware - Healthcare & Patient Experience Assessment",
    "responses": 2488,
    "status": "Active",
    "createdAt": "08/04/2025",
    "updatedAt": "30/08/2025",
    "previewColumns": 1,
    "questions": [
      {
        "id": "3701",
        "text": "Primary health insurance carrier or coverage network",
        "type": "select",
        "required": false,
        "options": [
          "BlueCross BlueShield",
          "Aetna / CVS Health",
          "UnitedHealthcare",
          "Kaiser Permanente",
          "Cigna",
          "Medicare / Medicaid",
          "Self-Pay / Uninsured"
        ]
      },
      {
        "id": "3702",
        "text": "Do you authorize automated electronic prescription refills to your preferred local pharmacy?",
        "type": "boolean",
        "required": true
      },
      {
        "id": "3703",
        "text": "Name of primary referring physician or specialist clinic",
        "type": "text",
        "required": false
      },
      {
        "id": "3704",
        "text": "Overall ease of booking appointments and receiving lab results via patient portal (1-10)",
        "type": "scale",
        "required": false,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "3705",
        "text": "Preferred consultation format for routine non-emergency medical visits",
        "type": "radio",
        "required": true,
        "options": [
          "In-person clinic visit",
          "Secure video telehealth session",
          "Telephone consultation",
          "Asynchronous portal messaging"
        ]
      },
      {
        "id": "3706",
        "text": "Date of most recent comprehensive preventative health checkup",
        "type": "date",
        "required": true
      },
      {
        "id": "3707",
        "text": "Confidential patient contact email for lab reports and discharge summaries",
        "type": "email",
        "required": true
      },
      {
        "id": "3708",
        "text": "Please describe any delays, billing confusion, or medical instructions that required clarification",
        "type": "textarea",
        "required": false
      }
    ]
  },
  {
    "id": "38",
    "title": "Goldner - Rippin Outdoors",
    "description": "Phased 24/7 analyzer - E-Commerce & Retail Experience Assessment",
    "responses": 4036,
    "status": "Active",
    "createdAt": "11/12/2025",
    "updatedAt": "21/12/2025",
    "previewColumns": 2,
    "questions": [
      {
        "id": "3801",
        "text": "Overall satisfaction with product catalog variety and in-stock inventory availability",
        "type": "rating",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "3802",
        "text": "Rate the efficiency and delivery speed of your recent package shipment (1-10)",
        "type": "scale",
        "required": false,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "3803",
        "text": "Order tracking or invoice reference number",
        "type": "text",
        "required": false
      },
      {
        "id": "3804",
        "text": "Did package tracking updates provide accurate real-time transit milestones?",
        "type": "boolean",
        "required": true
      },
      {
        "id": "3805",
        "text": "Maximum acceptable standard ground delivery window (days)",
        "type": "range",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 14,
        "rangeStep": 1
      },
      {
        "id": "3806",
        "text": "Date of most recent online order or store pickup",
        "type": "date",
        "required": false
      },
      {
        "id": "3807",
        "text": "Customer email address for loyalty points balance and coupon delivery",
        "type": "email",
        "required": false
      },
      {
        "id": "3808",
        "text": "What products or packaging improvements would encourage you to order again?",
        "type": "textarea",
        "required": true
      },
      {
        "id": "3809",
        "text": "Which factors most heavily influence your final purchasing decision?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Free Express Shipping",
          "Verified Customer Photo Reviews",
          "Price Match Guarantee",
          "Hassle-Free 30-Day Returns",
          "Sustainable Eco-Packaging",
          "Loyalty Rewards Points"
        ]
      },
      {
        "id": "38010",
        "text": "Preferred retail product category for seasonal shopping",
        "type": "select",
        "required": false,
        "options": [
          "Electronics & Smart Gadgets",
          "Apparel & Footwear",
          "Home & Kitchen Appliances",
          "Beauty & Personal Care",
          "Sports & Outdoor Recreation",
          "Books & Media"
        ]
      }
    ]
  },
  {
    "id": "39",
    "title": "Olson Inc Games",
    "description": "Phased optimizing approach - Smart Home & Environmental Sustainability Assessment",
    "responses": 2665,
    "status": "Active",
    "createdAt": "27/12/2024",
    "updatedAt": "19/10/2025",
    "previewColumns": 3,
    "questions": [
      {
        "id": "3901",
        "text": "Current household rooftop solar or renewable energy status",
        "type": "radio",
        "required": true,
        "options": [
          "Installed & actively generating power",
          "Permits approved, awaiting installation",
          "Actively exploring quotes",
          "Not feasible for this property"
        ]
      },
      {
        "id": "3902",
        "text": "What clean energy or recycling programs should our community prioritize this year?",
        "type": "textarea",
        "required": true
      },
      {
        "id": "3903",
        "text": "Does your local council provide subsidized compost containers or green waste bins?",
        "type": "boolean",
        "required": false
      },
      {
        "id": "3904",
        "text": "Primary smart home ecosystem orchestrating your household devices",
        "type": "select",
        "required": false,
        "options": [
          "Apple HomeKit",
          "Google Home / Nest",
          "Amazon Alexa",
          "Home Assistant (Local)",
          "Samsung SmartThings",
          "None / Standalone"
        ]
      },
      {
        "id": "3905",
        "text": "Resident email address for annual municipal green rebate voucher",
        "type": "email",
        "required": true
      },
      {
        "id": "3906",
        "text": "Estimated percentage of household solid waste diverted from landfill (%)",
        "type": "range",
        "required": false,
        "rangeMin": 0,
        "rangeMax": 100,
        "rangeStep": 5
      },
      {
        "id": "3907",
        "text": "Satisfaction with smart thermostat automated energy conservation savings",
        "type": "rating",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "3908",
        "text": "Select all waste categories systematically separated at your residence",
        "type": "checkbox",
        "required": true,
        "options": [
          "Rigid Plastics (PET/HDPE)",
          "Glass Bottles & Jars",
          "Corrugated Cardboard & Clean Paper",
          "E-Waste & Batteries",
          "Organic Food Compost",
          "Hazardous Chemicals / Paint"
        ]
      },
      {
        "id": "3909",
        "text": "Local municipal district or residential postal code",
        "type": "text",
        "required": true
      },
      {
        "id": "39010",
        "text": "Total number of connected smart home sensors and automated fixtures in home",
        "type": "number",
        "required": true
      }
    ]
  },
  {
    "id": "40",
    "title": "Gusikowski, Hand and Tromp Garden",
    "description": "Fundamental optimizing archive - Higher Education & Online Learning Assessment",
    "responses": 1613,
    "status": "Pending",
    "createdAt": "27/07/2023",
    "updatedAt": "24/08/2023",
    "previewColumns": 1,
    "questions": [
      {
        "id": "4001",
        "text": "Course title and course catalog registration code (e.g. CS-402)",
        "type": "text",
        "required": false
      },
      {
        "id": "4002",
        "text": "Upload final course project submission or capstone proposal summary",
        "type": "file",
        "required": true
      },
      {
        "id": "4003",
        "text": "Which instructional learning resources proved most valuable?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Recorded Lecture Video Replays",
          "Interactive Hands-on Coding Labs",
          "Annotated Slide Decks",
          "Peer Discussion Forums",
          "Weekly Live Office Hours",
          "Real-World Capstone Case Studies"
        ]
      },
      {
        "id": "4004",
        "text": "Average independent study and lab preparation hours per week",
        "type": "range",
        "required": true,
        "rangeMin": 2,
        "rangeMax": 40,
        "rangeStep": 2
      },
      {
        "id": "4005",
        "text": "Projected degree or certification completion date",
        "type": "date",
        "required": true
      },
      {
        "id": "4006",
        "text": "Preferred course assessment and grading methodology",
        "type": "radio",
        "required": false,
        "options": [
          "Practical Portfolio Projects",
          "Proctored Timed Quizzes",
          "Collaborative Group Case Studies",
          "Open-book Research Essays"
        ]
      },
      {
        "id": "4007",
        "text": "Student university email address (.edu / academic domain)",
        "type": "email",
        "required": true
      },
      {
        "id": "4008",
        "text": "Total academic credit units completed toward program graduation",
        "type": "number",
        "required": true
      },
      {
        "id": "4009",
        "text": "Academic field or primary degree concentration",
        "type": "select",
        "required": false,
        "options": [
          "Computer Science & Software",
          "Data Analytics & AI",
          "Business Administration & Finance",
          "Digital Media & UX Design",
          "Electrical Engineering",
          "Biomedical Sciences"
        ]
      },
      {
        "id": "40010",
        "text": "How effectively did coursework assignments prepare you for real-world projects? (1-10)",
        "type": "scale",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "40011",
        "text": "What syllabus topics or hands-on tutorials would enrich the next cohort of students?",
        "type": "textarea",
        "required": true
      }
    ]
  },
  {
    "id": "41",
    "title": "Altenwerth - Hilpert Baby",
    "description": "Integrated intangible encryption - Cloud Infrastructure & DevOps Assessment",
    "responses": 4514,
    "status": "Active",
    "createdAt": "15/03/2023",
    "updatedAt": "15/12/2025",
    "previewColumns": 2,
    "questions": [
      {
        "id": "4101",
        "text": "Average estimated monthly cloud infrastructure expenditure (in thousands USD)",
        "type": "number",
        "required": false
      },
      {
        "id": "4102",
        "text": "Date of most recent architecture disaster-recovery simulation test",
        "type": "date",
        "required": false
      },
      {
        "id": "4103",
        "text": "Overall platform uptime and automated failover reliability",
        "type": "rating",
        "required": false,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "4104",
        "text": "Upload architecture diagram, Helm chart values, or Terraform topology file",
        "type": "file",
        "required": true
      },
      {
        "id": "4105",
        "text": "Is zero-downtime blue/green deployment mandatory for production releases?",
        "type": "boolean",
        "required": true
      },
      {
        "id": "4106",
        "text": "What operational pain points or bottlenecks impact your current release velocity?",
        "type": "textarea",
        "required": true
      },
      {
        "id": "4107",
        "text": "Target container memory allocation buffer per microservice (GB)",
        "type": "range",
        "required": true,
        "rangeMin": 2,
        "rangeMax": 64,
        "rangeStep": 2
      },
      {
        "id": "4108",
        "text": "Primary monitoring and distributed tracing vendor utilized (e.g. Datadog, Prometheus)",
        "type": "text",
        "required": true
      },
      {
        "id": "4109",
        "text": "Average production deployment frequency across engineering teams",
        "type": "radio",
        "required": false,
        "options": [
          "Multiple times per day",
          "Once daily",
          "Weekly sprint release",
          "Bi-weekly or monthly"
        ]
      }
    ]
  },
  {
    "id": "42",
    "title": "Ryan, Mitchell and Pouros Music",
    "description": "Robust cohesive adapter - SaaS Usability & Product Experience Assessment",
    "responses": 312,
    "status": "Inactive",
    "createdAt": "23/06/2023",
    "updatedAt": "13/08/2024",
    "previewColumns": 2,
    "questions": [
      {
        "id": "4201",
        "text": "What single product feature or integration is most indispensable to you?",
        "type": "text",
        "required": false
      },
      {
        "id": "4202",
        "text": "What additional capabilities would make this platform a 10/10 experience for your team?",
        "type": "textarea",
        "required": false
      },
      {
        "id": "4203",
        "text": "How frequently do you log into the platform for your core tasks?",
        "type": "radio",
        "required": false,
        "options": [
          "Daily power user",
          "Several times weekly",
          "Once a week",
          "A few times a month"
        ]
      },
      {
        "id": "4204",
        "text": "Self-reported onboarding completion time (minutes)",
        "type": "range",
        "required": true,
        "rangeMin": 5,
        "rangeMax": 120,
        "rangeStep": 5
      },
      {
        "id": "4205",
        "text": "Which product features do you utilize most frequently?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Analytics Dashboard",
          "Export to PDF/CSV",
          "Automated Workflows",
          "Team Collaboration",
          "API Webhooks",
          "Audit Logs"
        ]
      },
      {
        "id": "4206",
        "text": "Intuitive navigation and overall UI design aesthetic satisfaction",
        "type": "rating",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "4207",
        "text": "Total number of licensed seats currently allocated to your organization",
        "type": "number",
        "required": true
      }
    ]
  },
  {
    "id": "43",
    "title": "Bednar, Quitzon and Greenholt Computers",
    "description": "Extended data-driven synergy - Workplace Culture & Employee Wellness Assessment",
    "responses": 3865,
    "status": "Active",
    "createdAt": "06/05/2024",
    "updatedAt": "12/02/2025",
    "previewColumns": 2,
    "questions": [
      {
        "id": "4301",
        "text": "Preferred working arrangement moving forward",
        "type": "radio",
        "required": false,
        "options": [
          "100% Remote / Distributed",
          "Hybrid (1-2 days office)",
          "Hybrid (3-4 days office)",
          "Fully In-Office"
        ]
      },
      {
        "id": "4302",
        "text": "Preferred number of remote work days per week",
        "type": "range",
        "required": true,
        "rangeMin": 0,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "4303",
        "text": "Date of your last career development and compensation review",
        "type": "date",
        "required": false
      },
      {
        "id": "4304",
        "text": "Do you feel comfortable discussing workload constraints openly with your direct manager?",
        "type": "boolean",
        "required": true
      },
      {
        "id": "4305",
        "text": "What concrete workplace policies or tools would improve your daily productivity and morale?",
        "type": "textarea",
        "required": true
      },
      {
        "id": "4306",
        "text": "How strongly do you agree that leadership fosters transparent, inclusive communication? (1-10)",
        "type": "scale",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "4307",
        "text": "Confidential work email (optional for anonymous follow-up discussions)",
        "type": "email",
        "required": false
      },
      {
        "id": "4308",
        "text": "Total years of tenure with the organization",
        "type": "number",
        "required": false
      }
    ]
  },
  {
    "id": "44",
    "title": "Treutel, Adams and Ryan Electronics",
    "description": "Decentralized bifurcated analyzer - Fintech & Digital Banking Assessment",
    "responses": 2613,
    "status": "Inactive",
    "createdAt": "20/02/2024",
    "updatedAt": "25/11/2025",
    "previewColumns": 1,
    "questions": [
      {
        "id": "4401",
        "text": "Name of the competitor banking app you find most user-friendly",
        "type": "text",
        "required": true
      },
      {
        "id": "4402",
        "text": "Date account KYC identity verification was completed",
        "type": "date",
        "required": true
      },
      {
        "id": "4403",
        "text": "Instant transaction notification threshold ($ USD)",
        "type": "range",
        "required": true,
        "rangeMin": 10,
        "rangeMax": 1000,
        "rangeStep": 25
      },
      {
        "id": "4404",
        "text": "Upload proof of billing address or redacted bank statement document",
        "type": "file",
        "required": false
      },
      {
        "id": "4405",
        "text": "Primary daily currency denomination for checking and transactions",
        "type": "select",
        "required": false,
        "options": [
          "US Dollar (USD)",
          "Euro (EUR)",
          "British Pound (GBP)",
          "Canadian Dollar (CAD)",
          "Australian Dollar (AUD)",
          "Japanese Yen (JPY)"
        ]
      },
      {
        "id": "4406",
        "text": "Select all financial asset categories held in your digital portfolio",
        "type": "checkbox",
        "required": false,
        "options": [
          "Cash / High-Yield Savings",
          "Broad Index ETFs",
          "Individual Tech Equities",
          "Cryptocurrency Assets",
          "Municipal Bonds",
          "Real Estate REITs"
        ]
      },
      {
        "id": "4407",
        "text": "What investment, budgeting, or international remittance features do you need most?",
        "type": "textarea",
        "required": true
      },
      {
        "id": "4408",
        "text": "Approximate number of digital transactions conducted each month",
        "type": "number",
        "required": true
      },
      {
        "id": "4409",
        "text": "Confidence in multi-layer account fraud detection and transaction safety (1-10)",
        "type": "scale",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      }
    ]
  },
  {
    "id": "45",
    "title": "Renner LLC Grocery",
    "description": "Expanded motivating encryption - Healthcare & Patient Experience Assessment",
    "responses": 4275,
    "status": "Active",
    "createdAt": "20/04/2025",
    "updatedAt": "18/05/2026",
    "previewColumns": 2,
    "questions": [
      {
        "id": "4501",
        "text": "Date of most recent comprehensive preventative health checkup",
        "type": "date",
        "required": true
      },
      {
        "id": "4502",
        "text": "Confidential patient contact email for lab reports and discharge summaries",
        "type": "email",
        "required": true
      },
      {
        "id": "4503",
        "text": "Medical practitioner consultation clarity, attentiveness, and bedside manner",
        "type": "rating",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "4504",
        "text": "Name of primary referring physician or specialist clinic",
        "type": "text",
        "required": false
      },
      {
        "id": "4505",
        "text": "Do you authorize automated electronic prescription refills to your preferred local pharmacy?",
        "type": "boolean",
        "required": true
      },
      {
        "id": "4506",
        "text": "Average in-clinic waiting room duration before doctor consultation (minutes)",
        "type": "range",
        "required": true,
        "rangeMin": 5,
        "rangeMax": 90,
        "rangeStep": 5
      },
      {
        "id": "4507",
        "text": "Number of healthcare visits completed in the past 12 months",
        "type": "number",
        "required": true
      },
      {
        "id": "4508",
        "text": "Preferred consultation format for routine non-emergency medical visits",
        "type": "radio",
        "required": false,
        "options": [
          "In-person clinic visit",
          "Secure video telehealth session",
          "Telephone consultation",
          "Asynchronous portal messaging"
        ]
      }
    ]
  },
  {
    "id": "46",
    "title": "Mohr, Runolfsson and Baumbach Kids",
    "description": "Sharable impactful monitoring - E-Commerce & Retail Experience Assessment",
    "responses": 1517,
    "status": "Inactive",
    "createdAt": "20/08/2025",
    "updatedAt": "23/03/2026",
    "previewColumns": 3,
    "questions": [
      {
        "id": "4601",
        "text": "How frequently do you place online retail orders across all merchants?",
        "type": "radio",
        "required": true,
        "options": [
          "Multiple times per week",
          "Weekly",
          "Once or twice a month",
          "Only during holiday promotions"
        ]
      },
      {
        "id": "4602",
        "text": "Preferred retail product category for seasonal shopping",
        "type": "select",
        "required": true,
        "options": [
          "Electronics & Smart Gadgets",
          "Apparel & Footwear",
          "Home & Kitchen Appliances",
          "Beauty & Personal Care",
          "Sports & Outdoor Recreation",
          "Books & Media"
        ]
      },
      {
        "id": "4603",
        "text": "Order tracking or invoice reference number",
        "type": "text",
        "required": true
      },
      {
        "id": "4604",
        "text": "Did package tracking updates provide accurate real-time transit milestones?",
        "type": "boolean",
        "required": true
      },
      {
        "id": "4605",
        "text": "Customer email address for loyalty points balance and coupon delivery",
        "type": "email",
        "required": true
      },
      {
        "id": "4606",
        "text": "Maximum acceptable standard ground delivery window (days)",
        "type": "range",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 14,
        "rangeStep": 1
      },
      {
        "id": "4607",
        "text": "What products or packaging improvements would encourage you to order again?",
        "type": "textarea",
        "required": false
      },
      {
        "id": "4608",
        "text": "Upload photo of received parcel condition or store receipt",
        "type": "file",
        "required": true
      },
      {
        "id": "4609",
        "text": "Overall satisfaction with product catalog variety and in-stock inventory availability",
        "type": "rating",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "46010",
        "text": "Which factors most heavily influence your final purchasing decision?",
        "type": "checkbox",
        "required": false,
        "options": [
          "Free Express Shipping",
          "Verified Customer Photo Reviews",
          "Price Match Guarantee",
          "Hassle-Free 30-Day Returns",
          "Sustainable Eco-Packaging",
          "Loyalty Rewards Points"
        ]
      },
      {
        "id": "46011",
        "text": "Rate the efficiency and delivery speed of your recent package shipment (1-10)",
        "type": "scale",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      }
    ]
  },
  {
    "id": "47",
    "title": "Padberg, Rodriguez and Gottlieb Toys",
    "description": "Managed real-time structure - Smart Home & Environmental Sustainability Assessment",
    "responses": 2260,
    "status": "Inactive",
    "createdAt": "30/05/2023",
    "updatedAt": "07/06/2024",
    "previewColumns": 1,
    "questions": [
      {
        "id": "4701",
        "text": "Date smart electrical sub-meter or solar inverter was activated",
        "type": "date",
        "required": true
      },
      {
        "id": "4702",
        "text": "Rate municipal recycling collection reliability and service accessibility (1-10)",
        "type": "scale",
        "required": false,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "4703",
        "text": "Select all waste categories systematically separated at your residence",
        "type": "checkbox",
        "required": false,
        "options": [
          "Rigid Plastics (PET/HDPE)",
          "Glass Bottles & Jars",
          "Corrugated Cardboard & Clean Paper",
          "E-Waste & Batteries",
          "Organic Food Compost",
          "Hazardous Chemicals / Paint"
        ]
      },
      {
        "id": "4704",
        "text": "Current household rooftop solar or renewable energy status",
        "type": "radio",
        "required": true,
        "options": [
          "Installed & actively generating power",
          "Permits approved, awaiting installation",
          "Actively exploring quotes",
          "Not feasible for this property"
        ]
      },
      {
        "id": "4705",
        "text": "Resident email address for annual municipal green rebate voucher",
        "type": "email",
        "required": true
      },
      {
        "id": "4706",
        "text": "Does your local council provide subsidized compost containers or green waste bins?",
        "type": "boolean",
        "required": true
      },
      {
        "id": "4707",
        "text": "Upload photo of neighborhood sorting station or solar generation meter",
        "type": "file",
        "required": false
      },
      {
        "id": "4708",
        "text": "Satisfaction with smart thermostat automated energy conservation savings",
        "type": "rating",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "4709",
        "text": "Primary smart home ecosystem orchestrating your household devices",
        "type": "select",
        "required": false,
        "options": [
          "Apple HomeKit",
          "Google Home / Nest",
          "Amazon Alexa",
          "Home Assistant (Local)",
          "Samsung SmartThings",
          "None / Standalone"
        ]
      },
      {
        "id": "47010",
        "text": "What clean energy or recycling programs should our community prioritize this year?",
        "type": "textarea",
        "required": false
      },
      {
        "id": "47011",
        "text": "Estimated percentage of household solid waste diverted from landfill (%)",
        "type": "range",
        "required": true,
        "rangeMin": 0,
        "rangeMax": 100,
        "rangeStep": 5
      },
      {
        "id": "47012",
        "text": "Local municipal district or residential postal code",
        "type": "text",
        "required": true
      }
    ]
  },
  {
    "id": "48",
    "title": "Hirthe Inc Toys",
    "description": "Customer-focused radical contingency - Higher Education & Online Learning Assessment",
    "responses": 69,
    "status": "Active",
    "createdAt": "21/03/2025",
    "updatedAt": "28/08/2025",
    "previewColumns": 2,
    "questions": [
      {
        "id": "4801",
        "text": "Upload final course project submission or capstone proposal summary",
        "type": "file",
        "required": true
      },
      {
        "id": "4802",
        "text": "Preferred course assessment and grading methodology",
        "type": "radio",
        "required": true,
        "options": [
          "Practical Portfolio Projects",
          "Proctored Timed Quizzes",
          "Collaborative Group Case Studies",
          "Open-book Research Essays"
        ]
      },
      {
        "id": "4803",
        "text": "Academic field or primary degree concentration",
        "type": "select",
        "required": false,
        "options": [
          "Computer Science & Software",
          "Data Analytics & AI",
          "Business Administration & Finance",
          "Digital Media & UX Design",
          "Electrical Engineering",
          "Biomedical Sciences"
        ]
      },
      {
        "id": "4804",
        "text": "What syllabus topics or hands-on tutorials would enrich the next cohort of students?",
        "type": "textarea",
        "required": true
      },
      {
        "id": "4805",
        "text": "Did syllabus milestones clearly communicate grading rubrics and assignment deadlines?",
        "type": "boolean",
        "required": true
      },
      {
        "id": "4806",
        "text": "How effectively did coursework assignments prepare you for real-world projects? (1-10)",
        "type": "scale",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "4807",
        "text": "Average independent study and lab preparation hours per week",
        "type": "range",
        "required": false,
        "rangeMin": 2,
        "rangeMax": 40,
        "rangeStep": 2
      },
      {
        "id": "4808",
        "text": "Course instructor subject matter expertise and responsiveness to student questions",
        "type": "rating",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "4809",
        "text": "Student university email address (.edu / academic domain)",
        "type": "email",
        "required": true
      },
      {
        "id": "48010",
        "text": "Total academic credit units completed toward program graduation",
        "type": "number",
        "required": false
      },
      {
        "id": "48011",
        "text": "Which instructional learning resources proved most valuable?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Recorded Lecture Video Replays",
          "Interactive Hands-on Coding Labs",
          "Annotated Slide Decks",
          "Peer Discussion Forums",
          "Weekly Live Office Hours",
          "Real-World Capstone Case Studies"
        ]
      }
    ]
  },
  {
    "id": "49",
    "title": "Tremblay - Goldner Home",
    "description": "Streamlined mobile architecture - Cloud Infrastructure & DevOps Assessment",
    "responses": 991,
    "status": "Inactive",
    "createdAt": "26/01/2023",
    "updatedAt": "10/01/2024",
    "previewColumns": 2,
    "questions": [
      {
        "id": "4901",
        "text": "Rate global edge API latency and response time satisfaction (1-10)",
        "type": "scale",
        "required": false,
        "rangeMin": 1,
        "rangeMax": 10,
        "rangeStep": 1
      },
      {
        "id": "4902",
        "text": "Average production deployment frequency across engineering teams",
        "type": "radio",
        "required": true,
        "options": [
          "Multiple times per day",
          "Once daily",
          "Weekly sprint release",
          "Bi-weekly or monthly"
        ]
      },
      {
        "id": "4903",
        "text": "Date of most recent architecture disaster-recovery simulation test",
        "type": "date",
        "required": true
      },
      {
        "id": "4904",
        "text": "Is zero-downtime blue/green deployment mandatory for production releases?",
        "type": "boolean",
        "required": true
      },
      {
        "id": "4905",
        "text": "Which container orchestration & CI/CD tools are active in your pipeline?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Kubernetes",
          "Docker Swarm",
          "GitHub Actions",
          "GitLab CI",
          "ArgoCD",
          "Terraform"
        ]
      },
      {
        "id": "4906",
        "text": "Upload architecture diagram, Helm chart values, or Terraform topology file",
        "type": "file",
        "required": true
      },
      {
        "id": "4907",
        "text": "Overall platform uptime and automated failover reliability",
        "type": "rating",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "4908",
        "text": "What operational pain points or bottlenecks impact your current release velocity?",
        "type": "textarea",
        "required": true
      },
      {
        "id": "4909",
        "text": "Primary monitoring and distributed tracing vendor utilized (e.g. Datadog, Prometheus)",
        "type": "text",
        "required": true
      },
      {
        "id": "49010",
        "text": "Primary public cloud provider hosting your primary workload",
        "type": "select",
        "required": true,
        "options": [
          "Amazon Web Services (AWS)",
          "Google Cloud Platform (GCP)",
          "Microsoft Azure",
          "Cloudflare Workers",
          "On-Premises Private Cloud"
        ]
      },
      {
        "id": "49011",
        "text": "Lead Site Reliability Engineer (SRE) contact email for post-incident review",
        "type": "email",
        "required": true
      }
    ]
  },
  {
    "id": "50",
    "title": "Breitenberg Group Automotive",
    "description": "Organized optimal support - SaaS Usability & Product Experience Assessment",
    "responses": 2132,
    "status": "Active",
    "createdAt": "26/08/2023",
    "updatedAt": "26/08/2026",
    "previewColumns": 3,
    "questions": [
      {
        "id": "5001",
        "text": "What single product feature or integration is most indispensable to you?",
        "type": "text",
        "required": false
      },
      {
        "id": "5002",
        "text": "Did the guided interactive product tour effectively explain key features?",
        "type": "boolean",
        "required": true
      },
      {
        "id": "5003",
        "text": "Preferred browser environment for daily application access",
        "type": "select",
        "required": false,
        "options": [
          "Google Chrome",
          "Mozilla Firefox",
          "Apple Safari",
          "Microsoft Edge",
          "Desktop Electron App"
        ]
      },
      {
        "id": "5004",
        "text": "Date your organization commenced using this software",
        "type": "date",
        "required": false
      },
      {
        "id": "5005",
        "text": "What additional capabilities would make this platform a 10/10 experience for your team?",
        "type": "textarea",
        "required": true
      },
      {
        "id": "5006",
        "text": "Attach a screenshot illustrating any UI confusion or workflow bug encountered",
        "type": "file",
        "required": true
      },
      {
        "id": "5007",
        "text": "Intuitive navigation and overall UI design aesthetic satisfaction",
        "type": "rating",
        "required": true,
        "rangeMin": 1,
        "rangeMax": 5,
        "rangeStep": 1
      },
      {
        "id": "5008",
        "text": "How frequently do you log into the platform for your core tasks?",
        "type": "radio",
        "required": false,
        "options": [
          "Daily power user",
          "Several times weekly",
          "Once a week",
          "A few times a month"
        ]
      },
      {
        "id": "5009",
        "text": "Total number of licensed seats currently allocated to your organization",
        "type": "number",
        "required": true
      }
    ]
  }
];

export default mockSurveys;
