/**
 * ============================================================================
 * B. BAVADHARANI — EDITABLE PORTFOLIO CONFIGURATION
 * ============================================================================
 */

const withBase = (assetPath) =>
  `${import.meta.env.BASE_URL}${assetPath.replace(/^\/+/, '')}`;

export const PORTFOLIO_DATA = {
  profile: {
    name: 'B. Bavadharani',
    shortName: 'Bavadharani',
    logoUrl: withBase('assets/aistudio/Bava_Gold_Book_Emblem_1bd57d5b.png'),
    headline: 'Data Analyst | Web Developer',
    degree: 'B.Tech in Artificial Intelligence and Data Science',
    degreeStatus: 'Currently pursuing',
    // [Placeholder] Replace with your city / region
    location: 'India · Location Placeholder',
    locationIsPlaceholder: true,
    email: 'bavadharaniselvi@gmail.com',
    interests: ['Book reading'],
    // Video reference & pre-extracted directional frames for hero cursor tracking
    portraitVideoUrl: withBase('assets/aistudio/character_lookaround_6s_new_background_cf58a6b0.mp4'),
    portraitFrames: {
      center: withBase('assets/lookaround/center.jpg'),
      up: withBase('assets/lookaround/up.jpg'),
      upLeft: withBase('assets/lookaround/up_left.jpg'),
      left: withBase('assets/lookaround/left.jpg'),
      right: withBase('assets/lookaround/right.jpg'),
      down: withBase('assets/lookaround/down.jpg'),
      smile: withBase('assets/lookaround/smile.jpg'),
    },
    portraitImageUrl: withBase('assets/aistudio/WhatsApp_Image_2026-11-07_at_1.36.11_PM__1__bf522c04.jpeg'),
    portraitAlt: 'Portrait of B. Bavadharani following the cursor at her reading desk',
  },

  hero: {
    kicker: 'Reading Room · Volume I',
    greetingPrefix: "Hi, I'm ",
    greetingName: 'Bavadharani',
    subtitle: 'Data Analyst | Web Developer',
    // [Placeholder] Edit your personal tagline wording here
    tagline:
      'Turning raw tables and unpolished datasets into clear visual stories and simple automated web tools.',
    taglineIsPlaceholder: true,
    handwrittenNote: 'Pick a book to begin ↓',
    ctaLabel: 'Explore the Bookshelf',
  },

  bookshelfMeta: [
    {
      id: 'about',
      spineTitle: 'ABOUT ME',
      subtitle: 'Prologue & Portrait',
      volumeRoman: 'Vol. I',
      spineColor: '#245854',
      spineAccent: '#e2b964',
      coverTextColor: '#f7ead0',
    },
    {
      id: 'skills',
      spineTitle: 'SKILLS',
      subtitle: 'Craft & Instruments',
      volumeRoman: 'Vol. II',
      spineColor: '#583353',
      spineAccent: '#e2b964',
      coverTextColor: '#f7ead0',
    },
    {
      id: 'work',
      spineTitle: 'WORK EXPERIENCE',
      subtitle: 'Chapters & Projects',
      volumeRoman: 'Vol. III',
      spineColor: '#b58020',
      spineAccent: '#fff0c7',
      coverTextColor: '#1f160d',
    },
    {
      id: 'conclusion',
      spineTitle: 'CONCLUSION',
      subtitle: 'Epilogue & Next Chapter',
      volumeRoman: 'Vol. IV',
      spineColor: '#45634d',
      spineAccent: '#e2b964',
      coverTextColor: '#f7ead0',
    },
  ],

  aboutBook: {
    chapterTitle: 'The Reader Behind the Data',
    storyParagraphs: [
      'Currently pursuing a B.Tech in Artificial Intelligence and Data Science, I spend my days at the intersection of structured datasets and clean web interfaces.',
      'I work closely with tabular data—cleaning messy entries, running exploratory analysis, and turning raw numbers into visual insights that support clear, data-driven decisions.',
      'Beyond spreadsheets and notebooks, I build web applications pairing HTML, CSS, and JavaScript frontends with Python backends so data analysis becomes accessible through simple, automated tools.',
      'Away from the screen, you will almost always find me curled up with a book—drawn to quiet libraries, curious stories, and well-crafted ideas.',
    ],
    funFactsTitle: 'Margin Notes & Fun Facts',
    // [Placeholder] Replace these sample fun facts with your own
    funFacts: [
      {
        label: 'Favorite Reading Corner',
        value: 'A quiet desk after sunset with warm lamplight (placeholder)',
        isPlaceholder: true,
      },
      {
        label: 'Currently Reading',
        value: 'Add your current book title here (placeholder)',
        isPlaceholder: true,
      },
      {
        label: 'Data Ritual',
        value: 'Checking missing values and duplicates before drawing a single chart',
        isPlaceholder: false,
      },
      {
        label: 'Next Skill on Shelf',
        value: 'Add a tool or topic you are exploring next (placeholder)',
        isPlaceholder: true,
      },
    ],
    // [Placeholder] Set resumeUrl to '/assets/your-resume.pdf' once uploaded
    resumeLabel: 'Download Résumé (Placeholder)',
    resumeUrl: '',
    resumeIsPlaceholder: true,
  },

  skillsBook: {
    tocTitle: 'Table of Contents',
    tocSubtitle: 'Tools of Analysis & Craft',
    groups: [
      {
        category: 'Programming & Data Analysis',
        items: [
          { name: 'Python', level: 82, note: 'Data workflows, scripting & backend logic' },
          { name: 'Pandas', level: 80, note: 'Cleaning, filtering, aggregation & EDA' },
          { name: 'NumPy', level: 74, note: 'Numerical array transformations' },
          { name: 'Matplotlib', level: 76, note: 'Bar, line & distribution visualizations' },
        ],
      },
      {
        category: 'Data Handling & Formats',
        items: [
          { name: 'Microsoft Excel', level: 78, note: 'Tabular organization & validation' },
          { name: 'CSV File Handling', level: 84, note: 'Structured ingestion & export pipelines' },
        ],
      },
      {
        category: 'Web Development',
        items: [
          { name: 'HTML', level: 82, note: 'Semantic document structure' },
          { name: 'CSS', level: 78, note: 'Responsive layout & visual craft' },
          { name: 'JavaScript', level: 75, note: 'Interactive frontend workflows' },
          { name: 'Python Backend', level: 74, note: 'Automated analysis endpoints' },
        ],
      },
      {
        category: 'Soft Skills',
        items: [
          { name: 'Analytical Problem Solving', level: 80, note: 'Breaking messy datasets into clear, structured insights' },
          { name: 'Clear Insight Storytelling', level: 78, note: 'Translating charts and patterns into readable narratives' },
          { name: 'Collaborative Communication', level: 76, note: 'Partnering smoothly across data and web workflows' },
        ],
      },
    ],
  },

  workBook: {
    chapters: [
      {
        chapterLabel: 'Chapter 1 · Industry Internship',
        title: 'Data Analyst Intern',
        organization: 'Mahindra & Mahindra',
        timeframe: '1 Month Internship',
        type: 'Internship',
        summary:
          'Gained practical industry exposure to data analysis, structured data handling, and end-to-end analytical workflows—learning how raw operational data is processed and interpreted to support real business decisions.',
        highlights: [
          'Cleaned, filtered, and analyzed structured datasets using Python, Pandas, and NumPy.',
          'Produced clear charts and visual summaries with Matplotlib to surface patterns.',
          'Built web-based analytical tooling connecting a Python backend to a clean frontend UI.',
        ],
        stack: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'CSV Handling', 'Web UI'],
        linkLabel: 'Internship Note · Add Certificate Link',
        linkUrl: '',
        isLinkPlaceholder: true,
      },
      {
        chapterLabel: 'Chapter 2 · Internship Project',
        title: 'Automatic Data Analyzer and Report Generator',
        organization: 'Built during Mahindra & Mahindra Internship',
        timeframe: 'Full-Stack Data Tool',
        type: 'Project',
        summary:
          'A web application where a user uploads or provides a dataset (such as a CSV), a Python backend cleans and analyzes the data automatically, and the frontend presents key findings alongside a generated report.',
        highlights: [
          'Automated data cleaning and preprocessing pipeline on uploaded CSV files.',
          'Automatic statistical summaries and exploratory data analysis (EDA).',
          'Dynamic chart generation paired with one-step report generation.',
          'Responsive frontend interface making analysis accessible without writing code.',
        ],
        stack: ['HTML', 'CSS', 'JavaScript', 'Python (Backend)', 'Pandas', 'NumPy', 'Matplotlib'],
      },
      {
        chapterLabel: 'Chapter 3 · Internship Project',
        title: 'Data Cleaning, Filtering and Analysis with Charts',
        organization: 'Built during Mahindra & Mahindra Internship',
        timeframe: 'Python Analytics Project',
        type: 'Project',
        summary:
          'A focused Python analytics workflow taking raw, unpolished datasets through thorough cleaning, filtering, aggregation, and statistical inspection before presenting clear visual charts.',
        highlights: [
          'Handled missing values, duplicate records, and inconsistent column formatting.',
          'Applied multi-condition filtering, grouping, and summary aggregations.',
          'Visualized distributions and trends via bar, line, and distribution charts.',
        ],
        stack: ['Python', 'Pandas', 'NumPy', 'Matplotlib'],
      },
    ],
  },

  conclusionBook: {
    epilogueTitle: 'Epilogue & Academic Timeline',
    education: {
      degree: 'B.Tech in Artificial Intelligence and Data Science',
      status: 'Currently Pursuing',
      institution: 'Mohammed Sathak Engineering College',
      years: '2024-2028',
      cgpa: 'CGPA: 9.45 / 10 (upto 5th sem)',
      isPlaceholder: true,
    },
    certifications: [
      'Certification 1 — Complete Mahindra & Mahindra Private Limited -1 month intern',
      'Certification 2 — Python Programming in cisco',
    ],
    achievements: [
      'Achievement 1 — Participated in Smart India Hackathon',
      'Achievement 2 — Complete Full Stack Webinar in Novitech',
    ],
    languages: ['English (Placeholder)', 'Add additional languages (Placeholder)'],
    hobbies: ['Book reading'],
    // [Placeholder] Customize your closing reflection quote
    closingQuote:
      'Every dataset, like every good book, holds a story waiting for someone patient enough to read between the lines.',
    closingQuoteIsPlaceholder: true,
    ctaText: "To be continued... let's write the next chapter together →",
  },

  contact: {
    sectionTitle: 'Write Me a Letter',
    sectionSubtitle:
      'Have a data problem to untangle, a web tool to build, or a favorite book to recommend? Pen a note on the desk below.',
    /**
     * Web3Forms endpoint & public access key for live email delivery
     * (works on static hosts like GitHub Pages). Leave empty to use preview launch mode.
     */
    formEndpoint: 'https://api.web3forms.com/submit',
    formAccessKey: '2e5bfd5f-c3a7-4a51-8a1a-590b83944046',
    directEmail: 'bavadharaniselvi@gmail.com',
    socials: [
      {
        label: 'GitHub',
        handle: '@Bavadharani-BS',
        url: 'https://github.com/Bavadharani-BS',
        spineColor: '#583353',
        isPlaceholder: false,
      },
    ],
  },

  footer: {
    closingLine: 'The End... or just the beginning',
    subLine: 'Crafted in the reading room of B. Bavadharani',
  },
};

/**
 * Generates and downloads a clean placeholder résumé document
 * when `resumeUrl` is still empty. Replace `resumeUrl` with a real PDF path when ready.
 */
export function downloadPlaceholderResume() {
  const { profile, aboutBook, workBook, conclusionBook, skillsBook } = PORTFOLIO_DATA;

  if (aboutBook.resumeUrl) {
    const link = document.createElement('a');
    link.href = /^https?:\/\//i.test(aboutBook.resumeUrl)
      ? aboutBook.resumeUrl
      : withBase(aboutBook.resumeUrl);
    link.download = 'B_Bavadharani_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    return;
  }

  const content = [
    `${profile.name}`,
    `${profile.headline}`,
    `Email: ${profile.email} | Location: ${profile.location}`,
    ``,
    `EDUCATION`,
    `${conclusionBook.education.degree} (${conclusionBook.education.status})`,
    `${conclusionBook.education.institution} | ${conclusionBook.education.years} | ${conclusionBook.education.cgpa}`,
    ``,
    `EXPERIENCE`,
    ...workBook.chapters.map(
      (ch) => `- ${ch.title} — ${ch.organization} (${ch.timeframe})\n  ${ch.summary}`
    ),
    ``,
    `SKILLS`,
    ...skillsBook.groups.map(
      (g) => `- ${g.category}: ${g.items.map((i) => i.name).join(', ')}`
    ),
    ``,
    `INTERESTS`,
    `${profile.interests.join(', ')}`,
    ``,
    `[Placeholder Resume File — Replace resumeUrl in portfolioData.js with your official PDF]`,
  ].join('\n');

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'B_Bavadharani_Resume_Placeholder.txt';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
