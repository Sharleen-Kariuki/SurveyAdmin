/**
 * Mock Data Generator for Surveys & Questions
 * Powered by @faker-js/faker
 * 
 * Usage:
 *   node scripts/generateData.js
 *   node scripts/generateData.js --count=50
 *   node scripts/generateData.js --count=100 --questions=10
 *   npm run seed
 */

const fs = require('fs');
const path = require('path');
const { faker } = require('@faker-js/faker');

// ─── Parse Command Line Arguments ─────────────────────────────────────────────
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    count: 30,             // Number of surveys to generate
    minQuestions: 7,       // Minimum questions per survey
    maxQuestions: 12,      // Maximum questions per survey
    exactQuestions: null,  // Set if fixed number requested
    seed: null,            // Optional deterministic seed
    outputPath: path.resolve(__dirname, '../data/surveys.json'),
    mockDataPath: path.resolve(__dirname, '../js/mockData.js'),
  };

  for (const arg of args) {
    if (arg.startsWith('--count=')) {
      options.count = Math.max(1, parseInt(arg.split('=')[1], 10) || 30);
    } else if (arg.startsWith('--questions=')) {
      const q = parseInt(arg.split('=')[1], 10);
      if (q > 0) options.exactQuestions = q;
    } else if (arg.startsWith('--seed=')) {
      options.seed = parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--output=')) {
      options.outputPath = path.resolve(process.cwd(), arg.split('=')[1]);
    }
  }

  return options;
}

// ─── Supported Question Types ──────────────────────────────────────────────────
const QUESTION_TYPES = [
  'rating',    // 1-5 Star Rating
  'scale',     // 1-10 Linear Scale
  'radio',     // Single Choice
  'checkbox',  // Multiple Choice
  'select',    // Dropdown Selection
  'range',     // Range Slider
  'boolean',   // Yes / No
  'text',      // Short Text
  'textarea',  // Long Text
  'email',     // Email
  'number',    // Numeric input
  'date',      // Date picker
  'file',      // File Upload
];

// ─── Domain-Specific Templates ────────────────────────────────────────────────
const DOMAIN_TEMPLATES = [
  {
    theme: 'Cloud Infrastructure & DevOps',
    titleGenerator: () => `${faker.company.name()} CloudOps`,
    descGenerator: () => `${faker.company.catchPhrase()} - Cloud Infrastructure & Site Reliability Benchmark`,
    questionPool: [
      {
        type: 'scale',
        text: 'Rate global edge API latency and response time satisfaction (1-10)',
        rangeMin: 1, rangeMax: 10, rangeStep: 1,
      },
      {
        type: 'rating',
        text: 'Overall platform uptime and automated failover reliability',
        rangeMin: 1, rangeMax: 5, rangeStep: 1,
      },
      {
        type: 'select',
        text: 'Primary public cloud provider hosting your primary workload',
        options: ['Amazon Web Services (AWS)', 'Google Cloud Platform (GCP)', 'Microsoft Azure', 'Cloudflare Workers', 'On-Premises Private Cloud'],
      },
      {
        type: 'checkbox',
        text: 'Which container orchestration & CI/CD tools are active in your pipeline?',
        options: ['Kubernetes', 'Docker Swarm', 'GitHub Actions', 'GitLab CI', 'ArgoCD', 'Terraform'],
      },
      {
        type: 'radio',
        text: 'Average production deployment frequency across engineering teams',
        options: ['Multiple times per day', 'Once daily', 'Weekly sprint release', 'Bi-weekly or monthly'],
      },
      {
        type: 'range',
        text: 'Target container memory allocation buffer per microservice (GB)',
        rangeMin: 2, rangeMax: 64, rangeStep: 2,
      },
      {
        type: 'boolean',
        text: 'Is zero-downtime blue/green deployment mandatory for production releases?',
      },
      {
        type: 'number',
        text: 'Average estimated monthly cloud infrastructure expenditure (in thousands USD)',
      },
      {
        type: 'email',
        text: 'Lead Site Reliability Engineer (SRE) contact email for post-incident review',
      },
      {
        type: 'date',
        text: 'Date of most recent architecture disaster-recovery simulation test',
      },
      {
        type: 'text',
        text: 'Primary monitoring and distributed tracing vendor utilized (e.g. Datadog, Prometheus)',
      },
      {
        type: 'textarea',
        text: 'What operational pain points or bottlenecks impact your current release velocity?',
      },
      {
        type: 'file',
        text: 'Upload architecture diagram, Helm chart values, or Terraform topology file',
      },
    ],
  },
  {
    theme: 'SaaS Usability & Product Experience',
    titleGenerator: () => `${faker.commerce.productName()} Usability`,
    descGenerator: () => `${faker.company.buzzPhrase()} - Enterprise User Experience & Onboarding Evaluation`,
    questionPool: [
      {
        type: 'scale',
        text: 'Net Promoter Score: How likely are you to recommend our application to a colleague? (1-10)',
        rangeMin: 1, rangeMax: 10, rangeStep: 1,
      },
      {
        type: 'rating',
        text: 'Intuitive navigation and overall UI design aesthetic satisfaction',
        rangeMin: 1, rangeMax: 5, rangeStep: 1,
      },
      {
        type: 'radio',
        text: 'How frequently do you log into the platform for your core tasks?',
        options: ['Daily power user', 'Several times weekly', 'Once a week', 'A few times a month'],
      },
      {
        type: 'checkbox',
        text: 'Which product features do you utilize most frequently?',
        options: ['Analytics Dashboard', 'Export to PDF/CSV', 'Automated Workflows', 'Team Collaboration', 'API Webhooks', 'Audit Logs'],
      },
      {
        type: 'select',
        text: 'Preferred browser environment for daily application access',
        options: ['Google Chrome', 'Mozilla Firefox', 'Apple Safari', 'Microsoft Edge', 'Desktop Electron App'],
      },
      {
        type: 'range',
        text: 'Self-reported onboarding completion time (minutes)',
        rangeMin: 5, rangeMax: 120, rangeStep: 5,
      },
      {
        type: 'boolean',
        text: 'Did the guided interactive product tour effectively explain key features?',
      },
      {
        type: 'number',
        text: 'Total number of licensed seats currently allocated to your organization',
      },
      {
        type: 'email',
        text: 'Account administrator contact email for feature preview invitations',
      },
      {
        type: 'date',
        text: 'Date your organization commenced using this software',
      },
      {
        type: 'text',
        text: 'What single product feature or integration is most indispensable to you?',
      },
      {
        type: 'textarea',
        text: 'What additional capabilities would make this platform a 10/10 experience for your team?',
      },
      {
        type: 'file',
        text: 'Attach a screenshot illustrating any UI confusion or workflow bug encountered',
      },
    ],
  },
  {
    theme: 'Workplace Culture & Employee Wellness',
    titleGenerator: () => `${faker.company.name()} People Index`,
    descGenerator: () => `Internal Staff Experience, Workplace Culture & Ergonomics Health Audit`,
    questionPool: [
      {
        type: 'rating',
        text: 'Work-life balance and mental wellness support satisfaction',
        rangeMin: 1, rangeMax: 5, rangeStep: 1,
      },
      {
        type: 'scale',
        text: 'How strongly do you agree that leadership fosters transparent, inclusive communication? (1-10)',
        rangeMin: 1, rangeMax: 10, rangeStep: 1,
      },
      {
        type: 'select',
        text: 'Primary operational department / business unit',
        options: ['Engineering', 'Product & Design', 'Marketing & Growth', 'Sales & Accounts', 'People & HR', 'Finance & Legal'],
      },
      {
        type: 'radio',
        text: 'Preferred working arrangement moving forward',
        options: ['100% Remote / Distributed', 'Hybrid (1-2 days office)', 'Hybrid (3-4 days office)', 'Fully In-Office'],
      },
      {
        type: 'checkbox',
        text: 'Which company employee benefits and perks do you value highest?',
        options: ['Comprehensive Health Insurance', 'Generous 401(k) / Pension Match', 'Annual Learning & Conference Stipend', 'Home Office Ergonomic Budget', 'Flexible Unlimited PTO', 'Gym & Wellness Allowance'],
      },
      {
        type: 'range',
        text: 'Preferred number of remote work days per week',
        rangeMin: 0, rangeMax: 5, rangeStep: 1,
      },
      {
        type: 'boolean',
        text: 'Do you feel comfortable discussing workload constraints openly with your direct manager?',
      },
      {
        type: 'number',
        text: 'Total years of tenure with the organization',
      },
      {
        type: 'email',
        text: 'Confidential work email (optional for anonymous follow-up discussions)',
      },
      {
        type: 'date',
        text: 'Date of your last career development and compensation review',
      },
      {
        type: 'text',
        text: 'Immediate team or project squad name',
      },
      {
        type: 'textarea',
        text: 'What concrete workplace policies or tools would improve your daily productivity and morale?',
      },
      {
        type: 'file',
        text: 'Upload home office ergonomic workspace evaluation or equipment receipt',
      },
    ],
  },
  {
    theme: 'Fintech & Digital Banking',
    titleGenerator: () => `${faker.company.name()} WealthPay`,
    descGenerator: () => `Mobile Banking Experience, Biometric Security & Transaction UX Survey`,
    questionPool: [
      {
        type: 'rating',
        text: 'Biometric authentication (Face ID / Fingerprint) speed and convenience rating',
        rangeMin: 1, rangeMax: 5, rangeStep: 1,
      },
      {
        type: 'scale',
        text: 'Confidence in multi-layer account fraud detection and transaction safety (1-10)',
        rangeMin: 1, rangeMax: 10, rangeStep: 1,
      },
      {
        type: 'select',
        text: 'Primary daily currency denomination for checking and transactions',
        options: ['US Dollar (USD)', 'Euro (EUR)', 'British Pound (GBP)', 'Canadian Dollar (CAD)', 'Australian Dollar (AUD)', 'Japanese Yen (JPY)'],
      },
      {
        type: 'checkbox',
        text: 'Select all financial asset categories held in your digital portfolio',
        options: ['Cash / High-Yield Savings', 'Broad Index ETFs', 'Individual Tech Equities', 'Cryptocurrency Assets', 'Municipal Bonds', 'Real Estate REITs'],
      },
      {
        type: 'radio',
        text: 'Primary everyday payment method used at physical retail counters',
        options: ['Apple Pay / Google Wallet via Phone', 'Physical Chip & PIN Debit Card', 'Contactless Tap Card', 'Cash'],
      },
      {
        type: 'range',
        text: 'Instant transaction notification threshold ($ USD)',
        rangeMin: 10, rangeMax: 1000, rangeStep: 25,
      },
      {
        type: 'boolean',
        text: 'Would you activate AI-driven automated recurring bill payment optimization?',
      },
      {
        type: 'number',
        text: 'Approximate number of digital transactions conducted each month',
      },
      {
        type: 'email',
        text: 'Registered banking profile email address for multi-factor verification',
      },
      {
        type: 'date',
        text: 'Date account KYC identity verification was completed',
      },
      {
        type: 'text',
        text: 'Name of the competitor banking app you find most user-friendly',
      },
      {
        type: 'textarea',
        text: 'What investment, budgeting, or international remittance features do you need most?',
      },
      {
        type: 'file',
        text: 'Upload proof of billing address or redacted bank statement document',
      },
    ],
  },
  {
    theme: 'Healthcare & Patient Experience',
    titleGenerator: () => `${faker.company.name()} HealthCare`,
    descGenerator: () => `Patient Outpatient Consultation, Telehealth Clarity & Clinical Care Quality`,
    questionPool: [
      {
        type: 'rating',
        text: 'Medical practitioner consultation clarity, attentiveness, and bedside manner',
        rangeMin: 1, rangeMax: 5, rangeStep: 1,
      },
      {
        type: 'scale',
        text: 'Overall ease of booking appointments and receiving lab results via patient portal (1-10)',
        rangeMin: 1, rangeMax: 10, rangeStep: 1,
      },
      {
        type: 'radio',
        text: 'Preferred consultation format for routine non-emergency medical visits',
        options: ['In-person clinic visit', 'Secure video telehealth session', 'Telephone consultation', 'Asynchronous portal messaging'],
      },
      {
        type: 'select',
        text: 'Primary health insurance carrier or coverage network',
        options: ['BlueCross BlueShield', 'Aetna / CVS Health', 'UnitedHealthcare', 'Kaiser Permanente', 'Cigna', 'Medicare / Medicaid', 'Self-Pay / Uninsured'],
      },
      {
        type: 'checkbox',
        text: 'Select chronic health or wellness areas monitored regularly',
        options: ['Cardiovascular & Blood Pressure', 'Blood Glucose / Diabetes', 'Respiratory & Asthma', 'Seasonal Allergies & Immunology', 'Mental Health & Sleep Disorders', 'Orthopedic / Joint Health'],
      },
      {
        type: 'range',
        text: 'Average in-clinic waiting room duration before doctor consultation (minutes)',
        rangeMin: 5, rangeMax: 90, rangeStep: 5,
      },
      {
        type: 'boolean',
        text: 'Do you authorize automated electronic prescription refills to your preferred local pharmacy?',
      },
      {
        type: 'number',
        text: 'Number of healthcare visits completed in the past 12 months',
      },
      {
        type: 'email',
        text: 'Confidential patient contact email for lab reports and discharge summaries',
      },
      {
        type: 'date',
        text: 'Date of most recent comprehensive preventative health checkup',
      },
      {
        type: 'text',
        text: 'Name of primary referring physician or specialist clinic',
      },
      {
        type: 'textarea',
        text: 'Please describe any delays, billing confusion, or medical instructions that required clarification',
      },
      {
        type: 'file',
        text: 'Upload scanned insurance card copy or medical referral document',
      },
    ],
  },
  {
    theme: 'E-Commerce & Retail Experience',
    titleGenerator: () => `${faker.company.name()} Retail Pulse`,
    descGenerator: () => `Omnichannel Store Experience, Checkout Velocity & Delivery Satisfaction`,
    questionPool: [
      {
        type: 'rating',
        text: 'Overall satisfaction with product catalog variety and in-stock inventory availability',
        rangeMin: 1, rangeMax: 5, rangeStep: 1,
      },
      {
        type: 'scale',
        text: 'Rate the efficiency and delivery speed of your recent package shipment (1-10)',
        rangeMin: 1, rangeMax: 10, rangeStep: 1,
      },
      {
        type: 'radio',
        text: 'How frequently do you place online retail orders across all merchants?',
        options: ['Multiple times per week', 'Weekly', 'Once or twice a month', 'Only during holiday promotions'],
      },
      {
        type: 'checkbox',
        text: 'Which factors most heavily influence your final purchasing decision?',
        options: ['Free Express Shipping', 'Verified Customer Photo Reviews', 'Price Match Guarantee', 'Hassle-Free 30-Day Returns', 'Sustainable Eco-Packaging', 'Loyalty Rewards Points'],
      },
      {
        type: 'select',
        text: 'Preferred retail product category for seasonal shopping',
        options: ['Electronics & Smart Gadgets', 'Apparel & Footwear', 'Home & Kitchen Appliances', 'Beauty & Personal Care', 'Sports & Outdoor Recreation', 'Books & Media'],
      },
      {
        type: 'range',
        text: 'Maximum acceptable standard ground delivery window (days)',
        rangeMin: 1, rangeMax: 14, rangeStep: 1,
      },
      {
        type: 'boolean',
        text: 'Did package tracking updates provide accurate real-time transit milestones?',
      },
      {
        type: 'number',
        text: 'Estimated total number of online orders completed during the past year',
      },
      {
        type: 'email',
        text: 'Customer email address for loyalty points balance and coupon delivery',
      },
      {
        type: 'date',
        text: 'Date of most recent online order or store pickup',
      },
      {
        type: 'text',
        text: 'Order tracking or invoice reference number',
      },
      {
        type: 'textarea',
        text: 'What products or packaging improvements would encourage you to order again?',
      },
      {
        type: 'file',
        text: 'Upload photo of received parcel condition or store receipt',
      },
    ],
  },
  {
    theme: 'Smart Home & Environmental Sustainability',
    titleGenerator: () => `${faker.company.name()} GreenEco`,
    descGenerator: () => `Household Energy Efficiency, Smart Lighting & Municipal Waste Audit`,
    questionPool: [
      {
        type: 'rating',
        text: 'Satisfaction with smart thermostat automated energy conservation savings',
        rangeMin: 1, rangeMax: 5, rangeStep: 1,
      },
      {
        type: 'scale',
        text: 'Rate municipal recycling collection reliability and service accessibility (1-10)',
        rangeMin: 1, rangeMax: 10, rangeStep: 1,
      },
      {
        type: 'select',
        text: 'Primary smart home ecosystem orchestrating your household devices',
        options: ['Apple HomeKit', 'Google Home / Nest', 'Amazon Alexa', 'Home Assistant (Local)', 'Samsung SmartThings', 'None / Standalone'],
      },
      {
        type: 'checkbox',
        text: 'Select all waste categories systematically separated at your residence',
        options: ['Rigid Plastics (PET/HDPE)', 'Glass Bottles & Jars', 'Corrugated Cardboard & Clean Paper', 'E-Waste & Batteries', 'Organic Food Compost', 'Hazardous Chemicals / Paint'],
      },
      {
        type: 'radio',
        text: 'Current household rooftop solar or renewable energy status',
        options: ['Installed & actively generating power', 'Permits approved, awaiting installation', 'Actively exploring quotes', 'Not feasible for this property'],
      },
      {
        type: 'range',
        text: 'Estimated percentage of household solid waste diverted from landfill (%)',
        rangeMin: 0, rangeMax: 100, rangeStep: 5,
      },
      {
        type: 'boolean',
        text: 'Does your local council provide subsidized compost containers or green waste bins?',
      },
      {
        type: 'number',
        text: 'Total number of connected smart home sensors and automated fixtures in home',
      },
      {
        type: 'email',
        text: 'Resident email address for annual municipal green rebate voucher',
      },
      {
        type: 'date',
        text: 'Date smart electrical sub-meter or solar inverter was activated',
      },
      {
        type: 'text',
        text: 'Local municipal district or residential postal code',
      },
      {
        type: 'textarea',
        text: 'What clean energy or recycling programs should our community prioritize this year?',
      },
      {
        type: 'file',
        text: 'Upload photo of neighborhood sorting station or solar generation meter',
      },
    ],
  },
  {
    theme: 'Higher Education & Online Learning',
    titleGenerator: () => `${faker.company.name()} Academy`,
    descGenerator: () => `Academic Course Curriculum, Instructor Pedagogy & Lab Usability Study`,
    questionPool: [
      {
        type: 'rating',
        text: 'Course instructor subject matter expertise and responsiveness to student questions',
        rangeMin: 1, rangeMax: 5, rangeStep: 1,
      },
      {
        type: 'scale',
        text: 'How effectively did coursework assignments prepare you for real-world projects? (1-10)',
        rangeMin: 1, rangeMax: 10, rangeStep: 1,
      },
      {
        type: 'select',
        text: 'Academic field or primary degree concentration',
        options: ['Computer Science & Software', 'Data Analytics & AI', 'Business Administration & Finance', 'Digital Media & UX Design', 'Electrical Engineering', 'Biomedical Sciences'],
      },
      {
        type: 'checkbox',
        text: 'Which instructional learning resources proved most valuable?',
        options: ['Recorded Lecture Video Replays', 'Interactive Hands-on Coding Labs', 'Annotated Slide Decks', 'Peer Discussion Forums', 'Weekly Live Office Hours', 'Real-World Capstone Case Studies'],
      },
      {
        type: 'radio',
        text: 'Preferred course assessment and grading methodology',
        options: ['Practical Portfolio Projects', 'Proctored Timed Quizzes', 'Collaborative Group Case Studies', 'Open-book Research Essays'],
      },
      {
        type: 'range',
        text: 'Average independent study and lab preparation hours per week',
        rangeMin: 2, rangeMax: 40, rangeStep: 2,
      },
      {
        type: 'boolean',
        text: 'Did syllabus milestones clearly communicate grading rubrics and assignment deadlines?',
      },
      {
        type: 'number',
        text: 'Total academic credit units completed toward program graduation',
      },
      {
        type: 'email',
        text: 'Student university email address (.edu / academic domain)',
      },
      {
        type: 'date',
        text: 'Projected degree or certification completion date',
      },
      {
        type: 'text',
        text: 'Course title and course catalog registration code (e.g. CS-402)',
      },
      {
        type: 'textarea',
        text: 'What syllabus topics or hands-on tutorials would enrich the next cohort of students?',
      },
      {
        type: 'file',
        text: 'Upload final course project submission or capstone proposal summary',
      },
    ],
  },
];

// ─── Generate Question for a Given Type ───────────────────────────────────────
function generateQuestion(type, qId, domain) {
  // Check if domain template has an exact pre-crafted question for this type
  const matched = domain.questionPool.find((q) => q.type === type);
  if (matched) {
    const qObj = {
      id: String(qId),
      text: matched.text,
      type: matched.type,
      required: faker.datatype.boolean({ probability: 0.65 }),
    };

    if (matched.options) {
      qObj.options = [...matched.options];
    }
    if (matched.rangeMin !== undefined) {
      qObj.rangeMin = matched.rangeMin;
      qObj.rangeMax = matched.rangeMax;
      qObj.rangeStep = matched.rangeStep;
    }
    return qObj;
  }

  // Fallback dynamic generator using Faker for any type
  const isRequired = faker.datatype.boolean({ probability: 0.6 });
  switch (type) {
    case 'rating':
      return {
        id: String(qId),
        text: `Rate your overall satisfaction with ${faker.company.buzzPhrase()}`,
        type: 'rating',
        rangeMin: 1,
        rangeMax: 5,
        rangeStep: 1,
        required: isRequired,
      };

    case 'scale':
      return {
        id: String(qId),
        text: `On a scale of 1-10, how likely are you to recommend our ${faker.commerce.department().toLowerCase()} service?`,
        type: 'scale',
        rangeMin: 1,
        rangeMax: 10,
        rangeStep: 1,
        required: isRequired,
      };

    case 'range': {
      const min = faker.helpers.arrayElement([0, 1, 5, 10]);
      const max = faker.helpers.arrayElement([50, 60, 100, 200, 500]);
      const step = faker.helpers.arrayElement([1, 2, 5, 10]);
      return {
        id: String(qId),
        text: `Target allocation or weekly usage threshold for ${faker.commerce.productMaterial().toLowerCase()} resources`,
        type: 'range',
        rangeMin: min,
        rangeMax: max,
        rangeStep: step,
        required: isRequired,
      };
    }

    case 'radio':
      return {
        id: String(qId),
        text: `Select your primary ${faker.hacker.noun()} preference`,
        type: 'radio',
        options: ['High Priority', 'Standard Priority', 'Low Priority', 'Deferred'],
        required: isRequired,
      };

    case 'checkbox':
      return {
        id: String(qId),
        text: `Which ${faker.company.buzzNoun()} capabilities do you actively require?`,
        type: 'checkbox',
        options: ['Automated Backups', 'Real-time Alerts', 'Audit Logging', 'API Access', 'Custom Reporting'],
        required: isRequired,
      };

    case 'select':
      return {
        id: String(qId),
        text: `Preferred regional data center for ${faker.hacker.adjective()} operations`,
        type: 'select',
        options: ['US East (N. Virginia)', 'US West (Oregon)', 'Europe (Frankfurt)', 'Asia Pacific (Tokyo)', 'Global Edge Anycast'],
        required: isRequired,
      };

    case 'boolean':
      return {
        id: String(qId),
        text: `Do you require automatic synchronization with external ${faker.hacker.noun()} services?`,
        type: 'boolean',
        required: isRequired,
      };

    case 'text':
      return {
        id: String(qId),
        text: `Specify primary tool or software used for ${faker.hacker.verb()} workflows`,
        type: 'text',
        required: isRequired,
      };

    case 'textarea':
      return {
        id: String(qId),
        text: `Please share any additional feedback, workflow hurdles, or feature requests`,
        type: 'textarea',
        required: isRequired,
      };

    case 'email':
      return {
        id: String(qId),
        text: `Official contact email address for survey follow-up and confirmation`,
        type: 'email',
        required: isRequired,
      };

    case 'number':
      return {
        id: String(qId),
        text: `Total approximate team size utilizing this service`,
        type: 'number',
        required: isRequired,
      };

    case 'date':
      return {
        id: String(qId),
        text: `Date of most recent software deployment or contract renewal`,
        type: 'date',
        required: isRequired,
      };

    case 'file':
      return {
        id: String(qId),
        text: `Upload diagnostic log, configuration file, or verification document`,
        type: 'file',
        required: isRequired,
      };

    default:
      return {
        id: String(qId),
        text: faker.lorem.sentence(),
        type: 'text',
        required: isRequired,
      };
  }
}

// ─── Generate Questions for Survey ────────────────────────────────────────────
function generateQuestionsForSurvey(surveyId, domain, count) {
  // Always include key rich types (rating, scale, radio, checkbox, boolean, text, email, range)
  const typesToUse = faker.helpers.shuffle([...QUESTION_TYPES]).slice(0, count);

  // Guarantee that every survey has at least a rating or scale, choice, and input
  if (!typesToUse.includes('rating') && !typesToUse.includes('scale')) {
    typesToUse[0] = 'rating';
  }
  if (!typesToUse.includes('radio') && !typesToUse.includes('checkbox') && !typesToUse.includes('select')) {
    typesToUse[1] = 'radio';
  }

  const questions = [];
  typesToUse.forEach((type, idx) => {
    const qId = `${surveyId}0${idx + 1}`;
    questions.push(generateQuestion(type, qId, domain));
  });

  return questions;
}

// ─── Generate Complete Survey Set ─────────────────────────────────────────────
function generateSurveys(options) {
  if (options.seed !== null) {
    faker.seed(options.seed);
  }

  const surveys = [];
  const statusDistribution = ['Active', 'Active', 'Active', 'Inactive', 'Pending'];

  function formatFullDate(d) {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  for (let i = 1; i <= options.count; i++) {
    const domain = DOMAIN_TEMPLATES[(i - 1) % DOMAIN_TEMPLATES.length];
    const createdDate = faker.date.between({ from: '2023-01-01', to: '2025-12-31' });
    const updatedDate = faker.date.between({ from: createdDate, to: '2026-10-01' });

    const questionCount = options.exactQuestions 
      ? options.exactQuestions 
      : faker.number.int({ min: options.minQuestions, max: options.maxQuestions });

    const survey = {
      id: String(i),
      title: i <= DOMAIN_TEMPLATES.length 
        ? domain.titleGenerator() 
        : `${faker.company.name()} ${faker.commerce.department()}`,
      description: i <= DOMAIN_TEMPLATES.length
        ? domain.descGenerator()
        : `${faker.company.catchPhrase()} - ${domain.theme} Assessment`,
      responses: faker.number.int({ min: 18, max: 4850 }),
      status: faker.helpers.arrayElement(statusDistribution),
      createdAt: formatFullDate(createdDate),
      updatedAt: formatFullDate(updatedDate),
      previewColumns: faker.helpers.arrayElement([1, 2, 2, 3]), // 2 is common
      questions: generateQuestionsForSurvey(i, domain, questionCount),
    };

    surveys.push(survey);
  }

  return surveys;
}

// ─── Main Execution ───────────────────────────────────────────────────────────
function main() {
  const options = parseArgs();
  console.log(`\n======================================================`);
  console.log(`🚀 Faker.js Survey & Question Generator`);
  console.log(`======================================================`);
  console.log(`Generating ${options.count} surveys (target questions: ${options.exactQuestions || `${options.minQuestions}-${options.maxQuestions}`})...`);

  const surveys = generateSurveys(options);

  // Count total questions & type distribution
  let totalQuestions = 0;
  const typeCounts = {};
  surveys.forEach((s) => {
    totalQuestions += s.questions.length;
    s.questions.forEach((q) => {
      typeCounts[q.type] = (typeCounts[q.type] || 0) + 1;
    });
  });

  // Ensure data directory exists
  const dataDir = path.dirname(options.outputPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // 1. Write JSON file
  fs.writeFileSync(options.outputPath, JSON.stringify(surveys, null, 2), 'utf-8');
  console.log(`\n✅ Saved JSON dataset to: ${options.outputPath}`);

  // 2. Write JavaScript ES Module file for direct browser import
  const jsContent = `/**
 * Pre-generated realistic Survey & Question records
 * Generated via @faker-js/faker (${new Date().toISOString()})
 * Total Surveys: ${surveys.length}
 * Total Questions: ${totalQuestions}
 */

export const mockSurveys = ${JSON.stringify(surveys, null, 2)};

export default mockSurveys;
`;

  fs.writeFileSync(options.mockDataPath, jsContent, 'utf-8');
  console.log(`✅ Saved ES Module dataset to: ${options.mockDataPath}`);

  // Print Summary Table
  console.log(`\n📊 Generation Summary:`);
  console.log(`------------------------------------------------------`);
  console.log(`Total Surveys Generated  : ${surveys.length}`);
  console.log(`Total Questions Generated: ${totalQuestions}`);
  console.log(`Average Questions/Survey : ${(totalQuestions / surveys.length).toFixed(1)}`);
  console.log(`\nQuestion Type Breakdown:`);
  Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
    const percent = ((count / totalQuestions) * 100).toFixed(1);
    console.log(`  • ${type.padEnd(12)} : ${count.toString().padStart(4)} (${percent}%)`);
  });
  console.log(`======================================================\n`);
}

main();
