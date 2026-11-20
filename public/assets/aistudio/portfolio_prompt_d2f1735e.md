Build a single-page personal portfolio website for **B. BAVADHARANI**, a Data Analyst and Web Developer, with a "magical library / book reader" theme. It should feel like walking into a cozy night-time library where every section is a book. This theme is personal: reading is her central hobby. Make it creative, polished and immersive, not a generic template.

ABOUT HER (use this as the source of truth for all content)
- Name: B. Bavadharani
- Headline: Data Analyst | Web Developer
- Degree: B.Tech in Artificial Intelligence and Data Science (currently pursuing), with a strong focus on Data Analytics and Web Development
- Summary: Works with structured datasets: cleaning and processing tabular data, performing exploratory analysis, and creating clear visual insights that support data-driven decision-making. Also builds web applications with an HTML, CSS and JavaScript frontend and a Python backend, making data analysis accessible through simple, automated tools.
- Experience: Data Analyst Intern at Mahindra & Mahindra (1 month). Gained practical exposure to data analysis, data handling and analytical workflows, and learned how data is processed and interpreted to support business decisions.
- Projects (both built during the internship):
   1. Automatic Data Analyzer and Report Generator: a web app where the user provides a dataset (such as a CSV), the Python backend cleans and analyzes it, and the frontend shows the findings and a generated report. Features: automated cleaning and preprocessing, automatic statistical summaries and exploratory analysis, chart generation, one-step report generation, responsive UI. Stack: HTML, CSS, JavaScript, Python (backend), Pandas, NumPy, Matplotlib.
   2. Data Cleaning, Filtering and Analysis with Charts: a Python project taking raw data through cleaning (missing values, duplicates, formatting), filtering, aggregation and analysis, then presenting results as clear charts (bar, line, distribution). Stack: Python, Pandas, NumPy, Matplotlib.
- Skills:
   • Programming and Data Analysis: Python, NumPy, Pandas, Matplotlib
   • Data Handling: Microsoft Excel, CSV file handling
   • Web Development: HTML, CSS, JavaScript, Python backend
- Interests: Book reading
- Email: bavadharaniselvi@gmail.com
- Not yet provided (keep as clearly marked, easily editable placeholders): tagline wording, location, college name and years, CGPA, certifications, achievements, languages, soft skills, fun facts, LinkedIn, GitHub, résumé file, photo/illustration, closing quote.

TECH
- Plain HTML + CSS + vanilla JavaScript in one folder (index.html, style.css, script.js), no build step. GSAP + ScrollTrigger from cdnjs is allowed for animation.
- Fully responsive, 60fps, lazy-load media, respect prefers-reduced-motion, keyboard accessible, semantic HTML, alt text on everything.

VISUAL STYLE
- Warm library atmosphere: dark walnut wood, deep navy/aubergine walls, soft amber lamplight glow, floating dust particles in the light beams, subtle paper and wood grain textures, vignette.
- Palette: walnut #3b2416, parchment #f3e6c8, ink #1c1a2e, amber glow #ffb347, plus muted book-spine colors (teal, mustard, plum, sage, rust).
- Fonts (Google Fonts): "Playfair Display" or "Cormorant Garamond" for headings, "Lora" for body, "Caveat" for handwritten notes.

CUSTOM CURSOR: PAPER ROCKET WITH IGNITION
- Hide the default cursor. Replace it with a small folded paper-rocket SVG that follows the mouse with smooth easing (lerp) and rotates to face its direction of movement.
- Behind it, an animated flame/ignition trail (orange to yellow to white core) whose size scales with cursor speed, plus tiny spark and ember particles and a faint paper-dust trail that fades out.
- Hovering links/buttons/books makes the rocket tilt up and the flame flare; clicking makes a small "ignite" burst.
- On touch devices with no cursor, the rocket auto-drifts gently and follows touch position instead.

HERO: CHARACTER WITH CURSOR TRACKING
- Show Bavadharani's illustrated character (use my uploaded look-around video/frames: center, up, left/right, down) standing at a reading desk with a glowing lamp, in front of a blurred bookshelf.
- Her head and eyes follow the cursor in real time: map the cursor angle/position to the matching look-direction frame (scrub the video's currentTime or switch between pre-extracted frames, with smooth blending). When the cursor is idle for 3 seconds she returns to center and blinks/smiles.
- Headline: "Hi, I'm Bavadharani" with a typewriter effect, subtitle "Data Analyst | Web Developer", a short tagline about turning raw data into clear stories (editable), and a handwritten note: "Pick a book to begin ↓".
- A bobbing scroll hint shaped like a small bookmark ribbon.

BOOK SHOWCASE SECTION (the main feature)
- A large wooden bookshelf with a warm desk lamp, inspired by a classic illustrated shelf with colorful vertical spines, but reimagined: rich 3D depth, wood texture, lamp light that dynamically brightens nearby spines, and a gentle parallax with the cursor.
- The shelf contains 4 hero books, taller and more detailed than the filler books around them (fill the rest of the shelf with small decorative books, a potted plant, a globe, a candle, and a tiny hourglass):
   1. "ABOUT ME" (teal cover, gold foil title)
   2. "SKILLS" (plum cover)
   3. "WORK EXPERIENCE" (mustard cover)
   4. "CONCLUSION" (sage cover)
- Interaction: on hover, the book slides out from the shelf with a soft shadow, glows, and the paper rocket circles it. On click, the book flies to the center of the screen, rotates in 3D, and opens (cover swings open) into a two-page spread with realistic page-turn animation (CSS 3D transforms), page-flip sound optional and muted by default, and a bookmark ribbon. A "Close book" button and the Esc key return it to the shelf. Arrow keys and swipe turn pages.
- Book contents (all stored in one editable JS data object, pre-filled from the details above):
   • ABOUT: photo/illustration placeholder, a short bio in a storytelling tone built from her summary (a student of AI and Data Science who loves turning messy tables into clear insight, and who reads books in her free time), location placeholder, interests (book reading), a "fun facts" page (placeholders), and a downloadable résumé button (placeholder file).
   • SKILLS: a "table of contents" page plus skill pages with animated ink-fill progress bars or bookmarks, grouped as:
        - Programming and Data Analysis: Python, NumPy, Pandas, Matplotlib
        - Data Handling and Tools: Microsoft Excel, CSV file handling
        - Web Development: HTML, CSS, JavaScript, Python backend
        - Soft skills: editable placeholders
     Use placeholder proficiency levels that she can edit, and add a note in the instructions saying they are not real ratings.
   • WORK EXPERIENCE: each role/project is a "chapter" with the title, company, dates, bullet achievements, tech used and a link placeholder:
        - Chapter 1: Data Analyst Intern, Mahindra & Mahindra (1 month), with the overview and key contributions (cleaning, filtering and analyzing datasets with Python, Pandas and NumPy; visualizing with Matplotlib; building a web-based report tool).
        - Chapter 2: Project "Automatic Data Analyzer and Report Generator" with its features and stack.
        - Chapter 3: Project "Data Cleaning, Filtering and Analysis with Charts" with its features and stack.
   • CONCLUSION (the epilogue): education timeline (B.Tech in Artificial Intelligence and Data Science, currently pursuing; college, years and CGPA as placeholders), certifications, achievements, languages, hobbies (book reading), and a closing quote about books and data, ending with "To be continued... let's write the next chapter together →" which smooth-scrolls to the contact section.

CONTACT ME SECTION: "WRITE ME A LETTER"
- Styled as a parchment letter on a wooden desk with an inkwell, quill, wax seal and lamp.
- Fields: Name, Email, Subject, Message, all handwritten-style with a ruled-paper background and ink-writing focus effects. Validate with friendly inline messages.
- On submit, the letter folds into a paper rocket, ignites, and launches off the top of the screen with a flame trail, then a "Your message has taken off 🚀" toast appears. Wire it up with Formspree/EmailJS placeholders, and add a honeypot spam field.
- Next to it: email (bavadharaniselvi@gmail.com), plus LinkedIn and GitHub as placeholder links, shown as small book-spine style links.
- Footer: "The End... or just the beginning" with a back-to-top rocket button.

EXTRA POLISH
- Loading screen: a book opening with the text "Opening the library...".
- A sticky mini navigation shaped like bookmarks (Home, About, Skills, Work, Conclusion, Contact) with scroll-spy highlighting.
- Smooth scrolling, section reveal animations like turning pages, and a lamp-light toggle (day/night) in the corner.
- A clean, well-commented codebase with no console output, and all of Bavadharani's content stored in one editable object at the top of script.js.

DELIVERABLE
Provide complete working code for index.html, style.css and script.js, plus brief instructions on how to swap in the character video/frames, her real content (including every placeholder listed above) and the contact form endpoint.
