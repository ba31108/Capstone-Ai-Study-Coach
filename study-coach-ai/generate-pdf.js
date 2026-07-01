/**
 * Study Coach AI – PDF Generator
 * Run: node generate-pdf.js
 * Requires: npm install pdfkit
 * Output: StudyCoachAI_Project_Explanation.pdf
 */

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const OUTPUT = path.join(__dirname, 'StudyCoachAI_Project_Explanation.pdf');
const doc = new PDFDocument({ margin: 55, size: 'A4', bufferPages: true });
doc.pipe(fs.createWriteStream(OUTPUT));

// ─── Color palette ──────────────────────────────────────────────────────────
const C = {
  primary:  '#4f46e5',
  dark:     '#1e293b',
  muted:    '#64748b',
  light:    '#f1f5f9',
  border:   '#e2e8f0',
  white:    '#ffffff',
  green:    '#059669',
  red:      '#dc2626',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const pageW = doc.page.width - doc.options.margin * 2;

function h1(text) {
  doc.moveDown(0.5)
     .font('Helvetica-Bold').fontSize(20).fillColor(C.primary)
     .text(text, { underline: false });
  doc.moveDown(0.3).moveTo(doc.options.margin, doc.y)
     .lineTo(doc.options.margin + pageW, doc.y)
     .strokeColor(C.primary).lineWidth(1.5).stroke();
  doc.moveDown(0.5);
}

function h2(text) {
  doc.moveDown(0.8)
     .font('Helvetica-Bold').fontSize(14).fillColor(C.dark)
     .text(text);
  doc.moveDown(0.2);
}

function h3(text) {
  doc.moveDown(0.5)
     .font('Helvetica-Bold').fontSize(11).fillColor(C.primary)
     .text(text);
  doc.moveDown(0.1);
}

function body(text, opts = {}) {
  doc.font('Helvetica').fontSize(10).fillColor(C.dark)
     .text(text, { lineGap: 3, ...opts });
}

function muted(text) {
  doc.font('Helvetica').fontSize(9).fillColor(C.muted).text(text, { lineGap: 2 });
}

function bullet(text, indent = 0) {
  const x = doc.options.margin + 12 + indent;
  doc.font('Helvetica').fontSize(10).fillColor(C.dark)
     .text(`• ${text}`, x, doc.y, { lineGap: 2, width: pageW - 12 - indent });
}

function code(text) {
  const y = doc.y;
  doc.rect(doc.options.margin, y, pageW, doc.heightOfString(text, { width: pageW - 16, fontSize: 9 }) + 12)
     .fill(C.light);
  doc.font('Courier').fontSize(9).fillColor('#1a1a2e')
     .text(text, doc.options.margin + 8, y + 6, { width: pageW - 16 });
  doc.moveDown(0.4);
}

function tableRow(cols, widths, isHeader = false) {
  const startX = doc.options.margin;
  let x = startX;
  const y = doc.y;
  const rowH = 18;

  if (isHeader) {
    doc.rect(startX, y, pageW, rowH).fill(C.primary);
  } else {
    doc.rect(startX, y, pageW, rowH).fill(C.light);
  }

  cols.forEach((col, i) => {
    const color = isHeader ? C.white : C.dark;
    const font  = isHeader ? 'Helvetica-Bold' : 'Helvetica';
    doc.font(font).fontSize(9).fillColor(color)
       .text(col, x + 4, y + 4, { width: widths[i] - 8, ellipsis: true, lineBreak: false });
    x += widths[i];
  });
  doc.y = y + rowH + 1;
}

function newSection() {
  doc.addPage();
}

function coverPage() {
  // Background
  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0f172a');

  // Top accent bar
  doc.rect(0, 0, doc.page.width, 8).fill(C.primary);

  // Logo circle
  const cx = doc.page.width / 2;
  doc.circle(cx, 180, 45).fill(C.primary);
  doc.font('Helvetica-Bold').fontSize(28).fillColor(C.white)
     .text('AI', cx - 18, 162);

  // Title
  doc.font('Helvetica-Bold').fontSize(28).fillColor(C.white)
     .text('Study Coach AI', { align: 'center' });
  doc.moveDown(0.4);
  doc.font('Helvetica').fontSize(14).fillColor('#94a3b8')
     .text('Shpjegim i Plotë i Projektit', { align: 'center' });
  doc.moveDown(0.4);
  doc.font('Helvetica').fontSize(12).fillColor('#64748b')
     .text('Personalized Learning Assistant – Capstone Project', { align: 'center' });

  doc.moveDown(3);

  // Info box
  const bx = 80, by = doc.y, bw = doc.page.width - 160;
  doc.rect(bx, by, bw, 110).fill('#1e293b');
  doc.font('Helvetica-Bold').fontSize(10).fillColor('#94a3b8');

  const items = [
    ['Platforma:', 'Full-Stack Web Application'],
    ['Frontend:', 'React 18 + Vite 6'],
    ['Backend:', 'Node.js + Express v5'],
    ['Databaza:', 'MongoDB Atlas'],
    ['Deployment:', 'Vercel · Render · MongoDB Atlas'],
    ['Gjuha:', 'Shqip (termat teknikë në Anglisht)'],
  ];

  items.forEach(([k, v], i) => {
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#94a3b8')
       .text(k, bx + 16, by + 14 + i * 16, { continued: true, width: 90 });
    doc.font('Helvetica').fontSize(9).fillColor(C.white)
       .text(v);
  });

  doc.moveDown(2);
  doc.font('Helvetica').fontSize(9).fillColor('#475569')
     .text('Bazuar 100% në kodin real të projektit. Versioni 1.0', { align: 'center' });
}

// ──────────────────────────────────────────────────────────────────────────────
// START DOCUMENT
// ──────────────────────────────────────────────────────────────────────────────

coverPage();

// ─── TOC ────────────────────────────────────────────────────────────────────
newSection();
h1('Tabela e Përmbajtjes');
const sections = [
  '1. Prezantimi i Projektit',
  '2. Rolet Kryesore të Përdoruesve',
  '3. Rrjedha e Plotë e Aplikacionit',
  '4. Teknologjitë e Përdorura',
  '5. Struktura e Skedarëve',
  '6. Shpjegimi i Backend-it',
  '7. Modelet e Databazës (8 modele)',
  '8. Shpjegimi i Frontend-it (19 faqe)',
  '9. Ngarkimi i PDF dhe Analiza Tekstuale',
  '10. Gjenerimi i Quiz-it (2 sisteme)',
  '11. Plani i Studimit (2 sisteme)',
  '12. Zbulimi i Zonave të Dobëta',
  '13. Burimet Mësimore',
  '14. Paneli Admin',
  '15. Deployimi',
  '16. Skripti Demo për Profesorin',
  '17. Udhëzuesi i Testimit',
  '18. Pyetje-Përgjigje (30 pyetje)',
  '19. Plani i Prezantimit PowerPoint',
  '20. Përmirësimet e Ardhshme',
  '21. Rezyme Finale',
];
sections.forEach(s => bullet(s));

// ─── SECTION 1 ───────────────────────────────────────────────────────────────
newSection();
h1('Seksioni 1 – Prezantimi i Projektit');
body(
  'Study Coach AI është një aplikacion web i plotë (full-stack) që ndihmon studentët të organizojnë studimin ' +
  'e tyre në mënyrë sistematike. Studenti mund të krijojë lëndë, të shtojë tema brenda lëndëve, të ngarkojë ' +
  'shënime ligjërate në formatin PDF, dhe sistemi i gjeneron automatikisht quiz dhe plan studimi 100% nga teksti i atij PDF.'
);
doc.moveDown(0.5);

h2('Çfarë problemi zgjidh?');
bullet('Studentët kanë shënime PDF por nuk kanë quiz të personalizuara nga ato materiale');
bullet('Nuk e dinë cilat zona janë të dobëta pas studimit');
bullet('Studimi u bëhet kaotik pa organizim lëndësh dhe temash');
bullet('Planet studimit janë gjenerike, jo nga materiali real');

doc.moveDown(0.5);
h2('Kush e përdor?');
const roleW = [pageW * 0.25, pageW * 0.75];
tableRow(['Roli', 'Përshkrimi'], roleW, true);
tableRow(['Student', 'Krijon lëndë/tema, ngarkon PDF, gjeneron quiz dhe plane studimi, shikon progresin'], roleW);
tableRow(['Admin', 'Menaxhon burimet mësimore, shikon statistikat e të gjithë studentëve'], roleW);

// ─── SECTION 2 ───────────────────────────────────────────────────────────────
newSection();
h1('Seksioni 2 – Rolet Kryesore të Përdoruesve');

h2('Studenti mund të:');
const studentActions = [
  'Regjistrohet dhe hyn me JWT token',
  'Krijon lëndë (p.sh. Biologji, Matematikë)',
  'Krijon tema me status (not_started / in_progress / completed) dhe vështirësi',
  'Ngarkon PDF ligjërate → sistema analizon tekstin automatikisht',
  'Gjeneron quiz 100% nga teksti i PDF (7 pyetje, 4 tipe)',
  'Dorëzon quiz → shikon score, % dhe zonat e dobëta',
  'Gjeneron plan studimi 9-seksionesh nga PDF',
  'Shikon burimet mësimore të botuara nga admini',
  'Shton burime në plan studimi personal',
  'Shikon dashboard me statistika dhe progres global',
];
studentActions.forEach(a => bullet(a));

doc.moveDown(0.5);
h2('Admini mund të:');
const adminActions = [
  'Hyn me kredencialet e adminit (rol i veçantë, i krijuar me seed script)',
  'Shikon statistikat e platformës (studentë, lëndë, tema, quiz, burime)',
  'Shikon listën e të gjithë studentëve me numrin e lëndëve/quiz-eve',
  'Hap profilin e detajuar të çdo studenti (nota mesatare, zonat e dobëta)',
  'Krijon, edito, publikon, arkivon dhe fshin burime mësimore',
];
adminActions.forEach(a => bullet(a));

// ─── SECTION 3 ───────────────────────────────────────────────────────────────
newSection();
h1('Seksioni 3 – Rrjedha e Plotë e Aplikacionit');

h2('Rrjedha e Studentit');
const flow = [
  '1. Hap faqen kryesore → klikon "Get Started"',
  '2. Regjistrohet (emër, email, fjalëkalim, nivel klasor)',
  '3. Backend hash-on fjalëkalimin + kthen JWT token',
  '4. Ridrejtohet te Dashboard (statistikat fillimisht janë 0)',
  '5. Krijon lëndë: p.sh. "Biologji"',
  '6. Krijon temë: "Fotosinteza" nën lëndën "Biologji"',
  '7. Hap detajet e temës (TopicDetail)',
  '8. Ngarkon PDF ligjërate → pdf-parse ekstrakton tekstin',
  '9. lectureAiService analizon: cleanText → extractSentences → extractKeyTerms → extractDefinitions',
  '10. Shfaqet: rezumeja, konceptet kryesore, objektivat mësimore',
  '11. Gjeneron Quiz → 7 pyetje nga teksti PDF',
  '12. Dorëzon quiz → score + zonat e dobëta → statusi i temës ndryshon nëse ≥70%',
  '13. Gjeneron Plan Studimi → 9 seksione nga teksti PDF',
  '14. Vizito /resources → lexo burimet e botuara → "Start Learning"',
  '15. Dashboard shfaq progresin e akumuluar',
];
flow.forEach(s => { doc.font('Helvetica').fontSize(9).fillColor(C.dark).text(s, { lineGap: 3 }); });

doc.moveDown(0.5);
h2('Rrjedha e Adminit');
const adminFlow = [
  '1. Hyn me kredencialet admin → ridrejtohet te /admin/dashboard',
  '2. Shikon statistikat e platformës',
  '3. Krijon burim të ri → e ruan si draft',
  '4. Klikon "Publish" → burimi bëhet i dukshëm për studentët',
  '5. Shikon listën e studentëve dhe profilet e tyre të detajuara',
];
adminFlow.forEach(s => { doc.font('Helvetica').fontSize(9).fillColor(C.dark).text(s, { lineGap: 3 }); });

// ─── SECTION 4 ───────────────────────────────────────────────────────────────
newSection();
h1('Seksioni 4 – Teknologjitë e Përdorura');

h2('Frontend');
const feW = [pageW * 0.3, pageW * 0.7];
tableRow(['Teknologjia', 'Arsyeja e zgjedhjes'], feW, true);
[
  ['React 18', 'Komponente të ripërdorshme, SPA pa ringarkime faqe'],
  ['Vite 6', 'Build shumë i shpejtë, HMR i menjëhershëm'],
  ['React Router v6', 'Navigimi SPA + rrugë të mbrojtura (ProtectedRoute / AdminRoute)'],
  ['Axios', 'Thirrjet HTTP me interceptor automatik JWT'],
  ['Lucide React', 'Ikonat SVG (BookOpen, Shield, Brain, etj.)'],
  ['CSS Custom', '~4300 rreshta CSS pa Bootstrap/Tailwind'],
].forEach(row => tableRow(row, feW));

doc.moveDown(0.5);
h2('Backend');
const beW = [pageW * 0.3, pageW * 0.7];
tableRow(['Teknologjia', 'Arsyeja e zgjedhjes'], beW, true);
[
  ['Node.js', 'JavaScript server-side, ekosistem i gjerë'],
  ['Express v5', 'Framework minimal REST API; async error handling automatik'],
  ['Mongoose 8', 'ODM për MongoDB; skema + validim + relacione'],
  ['jsonwebtoken', 'Gjeneron + verifikon token-e autentikimi'],
  ['bcryptjs', 'Hash fjalëkalimesh (nuk ruhen kurrë si tekst i qartë)'],
  ['multer', 'Ngarkimi PDF si buffer në memorie (jo disk)'],
  ['pdf-parse v1.1.1', 'Ekstrakton tekst nga buffer PDF (v2.x ka API të thyer)'],
  ['cors', 'Lejon frontend Vercel të thërrasë backend Render'],
  ['dotenv', 'Sekretet si environment variables, jo në kod'],
].forEach(row => tableRow(row, beW));

doc.moveDown(0.5);
h2('Deployment');
const depW = [pageW * 0.3, pageW * 0.7];
tableRow(['Shërbimi', 'Çfarë hostohet'], depW, true);
[
  ['Vercel', 'Frontend React/Vite (static build, dist/)'],
  ['Render', 'Backend Node.js/Express (free tier)'],
  ['MongoDB Atlas', 'Databaza cloud M0 (falas)'],
].forEach(row => tableRow(row, depW));

// ─── SECTION 5 ───────────────────────────────────────────────────────────────
newSection();
h1('Seksioni 5 – Struktura e Skedarëve');

h2('Backend (study-coach-ai/backend/)');
const backendFiles = [
  ['server.js', 'Pika hyrëse: ngarkon .env, lidhet me DB, regjistron routes'],
  ['config/db.js', 'Lidhja MongoDB Atlas me MONGO_URI'],
  ['middleware/authMiddleware.js', 'protect() (kërkon JWT) + adminOnly() (kërkon rol admin)'],
  ['middleware/uploadMiddleware.js', 'multer memoryStorage për PDF'],
  ['models/', '8 modele Mongoose: User, Subject, Topic, Lecture, Quiz, QuizResult, StudyPlan, Resource'],
  ['controllers/', '9 kontrollues: auth, subject, topic, lecture, quiz, studyPlan, dashboard, resource, admin'],
  ['routes/', '9 skedarë routes: authRoutes.js, subjectRoutes.js, topicRoutes.js, etj.'],
  ['services/pdfService.js', 'extractTextFromBuffer() me pdf-parse'],
  ['services/lectureAiService.js', 'Analiza tekstuale PDF → quiz + plan studimi'],
  ['services/aiService.js', 'Template quiz + plan (jo PDF, vetëm titulli temës)'],
  ['scripts/seedAdmin.js', 'Krijon llogarinë admin nga .env'],
  ['scripts/seedResources.js', '15 burime mësimore starter'],
];
const fW = [pageW * 0.4, pageW * 0.6];
tableRow(['Skedari', 'Funksioni'], fW, true);
backendFiles.forEach(row => tableRow(row, fW));

doc.moveDown(0.5);
h2('Frontend (study-coach-ai/frontend/src/)');
const frontendFiles = [
  ['App.jsx', 'React Router: të gjitha 19 rrugët e aplikacionit'],
  ['context/AuthContext.jsx', 'Gjendja globale: user, loading, login, logout, register'],
  ['api/axios.js', 'Instanca Axios me baseURL dhe interceptor JWT automatik'],
  ['components/Navbar.jsx', 'Sidebar student (link admin vetëm për admin)'],
  ['components/AdminLayout.jsx', 'Sidebar e errët e adminit'],
  ['components/ProtectedRoute.jsx', 'Bllokojë rrugët pa login'],
  ['components/AdminRoute.jsx', 'Bllokojë rrugët admin nëse nuk je admin'],
  ['pages/ (14 faqe student)', 'Landing, Login, Register, Dashboard, Subjects, Topics, TopicDetail, StudyPlans, Quizzes, QuizResults, SmartLecture, Resources, ResourceDetail, Profile'],
  ['pages/admin/ (5 faqe)', 'AdminDashboard, AdminStudents, AdminStudentDetail, AdminResources, AdminResourceForm'],
];
tableRow(['Skedari', 'Funksioni'], fW, true);
frontendFiles.forEach(row => tableRow(row, fW));

// ─── SECTION 6 ───────────────────────────────────────────────────────────────
newSection();
h1('Seksioni 6 – Shpjegimi i Backend-it');

h2('Starimi i Serverit (server.js)');
const steps = [
  '1. dotenv.config() → ngarkon variablat nga .env',
  '2. connectDB() → lidhet me MongoDB Atlas',
  '3. Krijohet aplikacioni Express',
  '4. CORS konfigurohet me origjina të lejuara (localhost + FRONTEND_URL)',
  '5. express.json() → lejon leximin e trupit JSON',
  '6. Regjistrohen 9 grupe rrugësh API',
  '7. Serveri dëgjon në PORT (default 5000)',
];
steps.forEach(s => { doc.font('Helvetica').fontSize(9).fillColor(C.dark).text(s, { lineGap: 3 }); });

doc.moveDown(0.5);
h2('Variablat e Mjedisit (.env)');
code(
  'PORT=5000\n' +
  'MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/studyCoachAI\n' +
  'JWT_SECRET=your-secret-key\n' +
  'FRONTEND_URL=https://your-app.vercel.app\n' +
  'ADMIN_EMAIL=admin@example.com\n' +
  'ADMIN_PASSWORD=securepassword\n' +
  'ADMIN_NAME=Admin'
);
muted('Ky skedar është në .gitignore – nuk shkon kurrë në GitHub.');

doc.moveDown(0.5);
h2('Middleware: protect() dhe adminOnly()');
body(
  'protect(): Nxjerr token-in Bearer nga headeri Authorization, verifikon me jwt.verify(), gjen user-in ' +
  'nga MongoDB, vendos req.user. Nëse dështon: 401 Unauthorized.'
);
doc.moveDown(0.2);
body(
  'adminOnly(): Kontrollon nëse req.user.role === \'admin\'. Nëse jo: 403 Forbidden. ' +
  'Studentët nuk mund të aksesojnë asnjë endpoint /api/admin/* edhe nëse anashkalojnë frontend-in.'
);

doc.moveDown(0.5);
h2('Autentikimi JWT – Si Funksionon');
code(
  'Register/Login → jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "30d" })\n' +
  'Frontend ruan token në localStorage\n' +
  'Çdo kërkesë: Authorization: Bearer <token>\n' +
  'protect() → jwt.verify(token, JWT_SECRET) → User.findById(id) → req.user'
);

doc.moveDown(0.5);
h2('Tabela e Rrugëve API');
const apiW = [pageW * 0.45, pageW * 0.25, pageW * 0.30];
tableRow(['Endpoint', 'Mbrojtja', 'Qëllimi'], apiW, true);
[
  ['POST /api/auth/register', 'Publike', 'Regjistrim'],
  ['POST /api/auth/login', 'Publike', 'Hyrje'],
  ['GET /api/auth/profile', 'protect', 'Profili aktual'],
  ['GET/POST /api/subjects', 'protect', 'Lëndët e user-it'],
  ['GET/POST /api/topics', 'protect', 'Temat e user-it'],
  ['POST /api/topics/:id/lectures/upload', 'protect', 'Ngarko PDF te tema'],
  ['POST /api/lectures/:id/quiz', 'protect', 'Gjenero quiz nga PDF'],
  ['POST /api/lectures/:id/study-plan', 'protect', 'Gjenero plan nga PDF'],
  ['POST /api/quizzes/generate', 'protect', 'Gjenero quiz template'],
  ['POST /api/quizzes/submit', 'protect', 'Dorëzo quiz'],
  ['GET /api/dashboard/stats', 'protect', 'Statistikat dashboard'],
  ['GET /api/resources', 'protect', 'Burimet published'],
  ['GET /api/admin/stats', 'protect + adminOnly', 'Statistikat admin'],
  ['GET /api/admin/students', 'protect + adminOnly', 'Lista studentësh'],
  ['GET /api/admin/resources', 'protect + adminOnly', 'Të gjitha burimet'],
  ['POST /api/admin/resources', 'protect + adminOnly', 'Krijo burim'],
  ['PUT /api/admin/resources/:id', 'protect + adminOnly', 'Edito burim'],
  ['DELETE /api/admin/resources/:id', 'protect + adminOnly', 'Fshi burim'],
  ['PATCH .../resources/:id/status', 'protect + adminOnly', 'Ndrysho statusin'],
].forEach(row => tableRow(row, apiW));

// ─── SECTION 7 ───────────────────────────────────────────────────────────────
newSection();
h1('Seksioni 7 – Modelet e Databazës (8 Modele)');

const models = [
  {
    name: 'User',
    collection: 'users',
    fields: [
      ['name', 'String', 'Emri i plotë'],
      ['email', 'String (unik)', 'Email-i (lowercase)'],
      ['password', 'String', 'Hash bcrypt i fjalëkalimit'],
      ['role', "String enum", "'student' ose 'admin' (default: 'student')"],
      ['gradeLevel', 'String', 'Niveli klasor'],
    ],
  },
  {
    name: 'Subject',
    collection: 'subjects',
    fields: [
      ['name', 'String', 'Emri i lëndës'],
      ['description', 'String', 'Përshkrimi opsional'],
      ['userId', 'ObjectId → User', 'Pronari'],
    ],
  },
  {
    name: 'Topic',
    collection: 'topics',
    fields: [
      ['title', 'String', 'Titulli i temës'],
      ['status', "String enum", "'not_started' / 'in_progress' / 'completed'"],
      ['difficulty', "String enum", "'easy' / 'medium' / 'hard'"],
      ['subjectId', 'ObjectId → Subject', 'Lënda prindër'],
      ['userId', 'ObjectId → User', 'Pronari'],
    ],
  },
  {
    name: 'Lecture',
    collection: 'lectures',
    fields: [
      ['title', 'String', 'Titulli (nga emri i skedarit)'],
      ['extractedText', 'String', 'Teksti i plotë nga PDF (ruhet për quiz/plan)'],
      ['summary', 'String', 'Rezumeja e gjeneruar'],
      ['keyConcepts', '[String]', 'Lista koncepteve kryesore'],
      ['learningObjectives', '[String]', 'Objektivat mësimore'],
      ['wordCount', 'Number', 'Numri i fjalëve'],
      ['userId / subjectId / topicId', 'ObjectId', 'Relacionet'],
    ],
  },
  {
    name: 'Quiz',
    collection: 'quizzes',
    fields: [
      ['title', 'String', 'Titulli i quiz-it'],
      ['questions[].question', 'String', 'Teksti i pyetjes'],
      ['questions[].options', '[String]', '4 opsionet e përgjigjeve'],
      ['questions[].correctAnswer', 'String', 'Përgjigja e saktë'],
      ['questions[].explanation', 'String', 'Shpjegimi nga PDF'],
      ['questions[].sourceConcept', 'String', 'Termi burimor (për weakAreas)'],
      ['lectureId', 'ObjectId → Lecture', 'Null nëse quiz template'],
    ],
  },
  {
    name: 'QuizResult',
    collection: 'quizresults',
    fields: [
      ['score / totalQuestions / percentage', 'Number', 'Rezultati i quiz-it'],
      ['answers[].isCorrect', 'Boolean', 'Saktësia e çdo përgjigje'],
      ['weakAreas', '[String]', 'Konceptet me përgjigje të gabuara'],
      ['quizId / userId / topicId', 'ObjectId', 'Relacionet'],
    ],
  },
  {
    name: 'StudyPlan',
    collection: 'studyplans',
    fields: [
      ['title', 'String', 'Titulli i planit'],
      ['plan', 'String', 'Teksti i plotë Markdown i planit (9 seksione)'],
      ['recommendations', '[String]', 'Lista rekomandimeve'],
      ['lectureId', 'ObjectId → Lecture', 'Null nëse plan template'],
    ],
  },
  {
    name: 'Resource',
    collection: 'resources',
    fields: [
      ['title / description', 'String', 'Info bazë e burimit'],
      ['category', "String enum", '7 kategori: Mathematics, Biology, English, etj.'],
      ['level', "String enum", '7 nivele: Elementary → Advanced'],
      ['content', 'String', 'Përmbajtja e plotë Markdown'],
      ['keyPoints', '[String]', 'Pikat kryesore'],
      ['status', "String enum", "'draft' / 'published' / 'archived'"],
      ['createdBy', 'ObjectId → User', 'Admini krijues'],
    ],
  },
];

const mW = [pageW * 0.25, pageW * 0.25, pageW * 0.50];
models.forEach((m, idx) => {
  if (idx > 0 && idx % 3 === 0) { newSection(); h1('Seksioni 7 – Modelet (vazhdim)'); }
  h3(`Model: ${m.name} (koleksioni: ${m.collection})`);
  tableRow(['Fusha', 'Tipi', 'Pershkrimi'], mW, true);
  m.fields.forEach(f => tableRow(f, mW));
  doc.moveDown(0.3);
});

// ─── SECTION 8 ───────────────────────────────────────────────────────────────
newSection();
h1('Seksioni 8 – Faqet e Frontend-it (19 Faqe)');

const pages = [
  ['Landing.jsx', 'Faqja kryesore publike me hero, veçori dhe CTA'],
  ['Login.jsx', 'Formular hyrës. Ridrejton: admin→/admin/dashboard, student→/dashboard'],
  ['Register.jsx', 'Formular regjistrimi. Ridrejton gjithmonë te /dashboard'],
  ['Dashboard.jsx', 'Statistikat (8 karta), progres bar, rezultate të fundit, zonat e dobëta'],
  ['Subjects.jsx', 'Lista + CRUD lëndësh'],
  ['Topics.jsx', 'Lista + CRUD temash me filtrim sipas lëndës, badge status/vështirësi'],
  ['TopicDetail.jsx', 'FAQJA KRYESORE: ngarko PDF → shfaq rezume → gjenero quiz → dorëzo → gjenero plan'],
  ['StudyPlans.jsx', 'Lista planesh + gjenerimi i ri me template (bazuar në temë, jo PDF)'],
  ['Quizzes.jsx', 'Lista quiz-eve + gjenerimi i ri me template (5 pyetje gjenerike)'],
  ['QuizResults.jsx', 'Historia e të gjitha rezultateve me score, %, lëndë, datë'],
  ['SmartLecture.jsx', 'Ngarkimi standalone i PDF pa qenë i lidhur me temë specifike'],
  ['Resources.jsx', 'Grid burimesh, filtrim kategori, kërkim tekstual'],
  ['ResourceDetail.jsx', 'Detajet burimit + quiz vetë-kontrollues + shto në plan studimi'],
  ['Profile.jsx', 'Profili i studentit: emri, email, nivel, statistika bazë'],
  ['admin/AdminDashboard.jsx', '9 karta statistikash platforme + 5 studentët e fundit'],
  ['admin/AdminStudents.jsx', 'Tabela të gjithë studentëve me statistikat e tyre'],
  ['admin/AdminStudentDetail.jsx', 'Profili detajuar: nota mesatare, zonat e dobëta, rezultate'],
  ['admin/AdminResources.jsx', 'Tabela burimesh + filter + aksionet: Publish/Archive/Edit/Delete'],
  ['admin/AdminResourceForm.jsx', 'Formular krijoni/edito burim me seksione dinamike'],
];
const pgW = [pageW * 0.35, pageW * 0.65];
tableRow(['Faqja', 'Pershkrimi'], pgW, true);
pages.forEach(row => tableRow(row, pgW));

// ─── SECTION 9 ───────────────────────────────────────────────────────────────
newSection();
h1('Seksioni 9 – Ngarkimi PDF dhe Analiza Tekstuale');

h2('Rruga PDF → Njohuri');
const pdfFlow = [
  '1. Student ngarkon PDF → multer e kap si Buffer në memorie (nuk ruhet në disk)',
  '2. extractTextFromBuffer(buffer) → pdf-parse v1.1.1 lexon bufferin → kthen string teksti',
  '3. Validimi: ≥50 fjalë? Jo → gabim 422 "Not enough text extracted"',
  '4. cleanText(): heq \\r\\n\\f\\t, rreshtat bosh, numrat faqesh',
  '5. extractSentences(): filtron fjalitë 6-60 fjalë, ≥25 karaktere, ≥50% shkronja',
  '6. extractKeyTerms(30): llogarit frekuencën unigramësh + bigramësh (pa stop words)',
  '7. extractDefinitions(): 7 regex patterns: "X is defined as Y", "X refers to Y", "X means Y"',
  '8. scoreQuizWorthiness(sentence): +4 nëse "is defined as", +3 nëse "causes/produces", -4 nëse "see figure"',
  '9. extractSummaryAndConcepts(): zgjedh 4 fjalitë me score më të lartë, ndërton summary, keyConcepts, learningObjectives',
  '10. Lecture.create({ ..., extractedText }) → ruhet në MongoDB',
];
pdfFlow.forEach(s => { doc.font('Helvetica').fontSize(9).fillColor(C.dark).text(s, { lineGap: 3 }); });

doc.moveDown(0.5);
h2('Kusht i Rëndësishëm: PDF me Tekst të Zgjedhshëm');
body(
  'PDF-ja duhet të ketë tekst të zgjedhshëm (selectable text). PDF-të e skanuar si imazhe nuk funksionojnë. ' +
  'Testoni: hapni PDF → provoni të zgjidhni tekst me miun. Nëse mund të kopjoni → PDF është e mirë.'
);

doc.moveDown(0.5);
h2('SHËNIM I RËNDËSISHËM: Nuk është AI e vërtetë');
body(
  'lectureAiService.js nuk përdor OpenAI ose modele gjuhësore. Përdor algoritme analize tekstuale: ' +
  'frekuencë fjalësh (TF-IDF-like), regex pattern-matching për definicione, dhe heuristikë rregullash ' +
  'për vlerësimin e fjalive. Arkitektura është e dizajnuar për të zëvendësuar lehtë me OpenAI API.'
);

// ─── SECTION 10 ──────────────────────────────────────────────────────────────
newSection();
h1('Seksioni 10 – Gjenerimi i Quiz-it (2 Sisteme)');

h2('SISTEMI 1: Quiz Template (aiService.js)');
bullet('5 pyetje gjenerike që interpolojnë titullin e temës dhe emrin e lëndës');
bullet('Nuk ka lidhje me PDF-në – punon pa ligjëratë');
bullet('Thirrja: POST /api/quizzes/generate (nga Quizzes.jsx)');
bullet('Shembull: "Çfarë është Fotosinteza?" – pyetje gjenerike, jo nga teksti real');

doc.moveDown(0.5);
h2('SISTEMI 2: Quiz nga PDF (lectureAiService.js)');
bullet('7 pyetje (max) 100% nga teksti i PDF-së');
bullet('Thirrja: POST /api/lectures/:id/quiz (nga TopicDetail.jsx)');
bullet('Çdo pyetje, opsion, dhe shpjegim vijnë drejtpërdrejt nga teksti PDF');

doc.moveDown(0.3);
h3('4 Tipet e Pyetjeve');
const qtW = [pageW * 0.25, pageW * 0.75];
tableRow(['Tipi', 'Pershkrimi'], qtW, true);
[
  ['Fill-in-blank', '"Chlorophyll is the pigment responsible for capturing ______" → [Sunlight ✓, Glucose, CO2, O2]'],
  ['Definition matching', '"Sipas ligjëratës, çfarë është Photosynthesis?" → definicioni nga regex'],
  ['Statement verification', '"Cila fjali është direkt nga ligjërata?" → 1 reale + 3 me term të ndërruar'],
  ['Concept identification', '"Cili koncept diskutohet në: \'Chlorophyll is responsible for...\'" → [Chlorophyll ✓, ...]'],
].forEach(row => tableRow(row, qtW));

doc.moveDown(0.5);
h2('Si Dorëzohet Quiz dhe Ndikon Statusin');
code(
  'submitQuiz():\n' +
  '  për secilën pyetje: isCorrect = selectedAnswer === correctAnswer\n' +
  '  nëse gabim: weakAreas.push(question.sourceConcept)\n' +
  '  percentage = Math.round((score / total) * 100)\n' +
  '  QuizResult.create({ score, percentage, weakAreas, answers })\n' +
  '  nëse percentage >= 70: Topic.update({ status: "completed" })'
);

// ─── SECTION 11 ──────────────────────────────────────────────────────────────
newSection();
h1('Seksioni 11 – Plani i Studimit (2 Sisteme)');

h2('SISTEMI 1: Plan Template (aiService.js)');
bullet('Bazuar në titullin e temës, lëndën, qëllimin, kohën e disponueshme');
bullet('5 hapa gjenerikë studimi + rekomandime të përgjithshme');
bullet('Thirrja: POST /api/study-plans/generate (nga StudyPlans.jsx)');

doc.moveDown(0.5);
h2('SISTEMI 2: Plan nga PDF (lectureAiService.js)');
bullet('9 seksione të detajuara bazuar 100% në tekstin e PDF-së');
bullet('Thirrja: POST /api/lectures/:id/study-plan (nga TopicDetail.jsx)');

doc.moveDown(0.3);
h3('9 Seksionet e Planit PDF');
const spW = [pageW * 0.35, pageW * 0.65];
tableRow(['Seksioni', 'Çfarë përmban'], spW, true);
[
  ['1. Lecture Overview', '4 fjalitë me scoreQuizWorthiness() më të lartë nga PDF-ja'],
  ['2. Key Concepts', '10 termat me frekuencën më të lartë'],
  ['3. Key Definitions', 'Deri 6 definicione nga regex patterns'],
  ['4. Learning Objectives', 'Gjenerohen nga konceptet: "Shpjego X nga kjo ligjëratë"'],
  ['5. Step-by-Step (8 hapa)', 'Lexim i parë → identifiko → studio def → kuptim → detyra → quiz → rishikim → konsolidim'],
  ['6. Review Checklist', 'Checkbox me konceptet nga PDF'],
  ['7. Self-Check Questions', 'Pyetje nga definicionet e nxjerra'],
  ['8. Weak-Area Recommendations', 'Rekomandime specifike'],
  ['9. Study Schedule', 'Tabela: 5 sesione studimi me kohë dhe fokus'],
].forEach(row => tableRow(row, spW));

// ─── SECTION 12 ──────────────────────────────────────────────────────────────
newSection();
h1('Seksioni 12 – Zbulimi i Zonave të Dobëta');

body(
  'Çdo pyetje e quiz-it ka fushën "sourceConcept" – termin burimor nga PDF. ' +
  'Kur studenti i përgjigjet gabim, ky term shtohet në array "weakAreas" te QuizResult. ' +
  'Dashboard dhe Admin Student Detail lexojnë dhe shfaqin këto zona.'
);

doc.moveDown(0.5);
h2('Shembull Praktik');
code(
  'Ligjëratë: Fotosinteza (PDF)\n' +
  'Pyetja 2 gabim → sourceConcept: "chlorophyll"  → weakAreas\n' +
  'Pyetja 5 gabim → sourceConcept: "Calvin cycle" → weakAreas\n' +
  'Pyetja 7 gabim → sourceConcept: "ATP"          → weakAreas\n\n' +
  'Dashboard shfaq:\n' +
  '  ● chlorophyll\n' +
  '  ● Calvin cycle\n' +
  '  ● ATP'
);

doc.moveDown(0.5);
h2('Ku Shfaqen Zonat e Dobëta');
bullet('Dashboard (/dashboard) – lista nga të gjitha rezultatet');
bullet('Admin Student Detail (/admin/students/:id) – zonat e studentit individual');
bullet('Rezultati Quiz (TopicDetail.jsx) – menjëherë pas dorëzimit me shpjegimin nga PDF');

// ─── SECTION 13 ──────────────────────────────────────────────────────────────
newSection();
h1('Seksioni 13 – Burimet Mësimore');

body(
  'Burimet janë materiale mësimore të kuratura nga admini. Ndryshe nga ligjëratat PDF (personale), ' +
  'burimet janë të disponueshme për të gjithë studentët me status "published".'
);

doc.moveDown(0.3);
h2('Rrjedha e Burimeve');
const resFlow = [
  '1. Admin krijon burim me titull, kategori, nivel, pérmbajtje Markdown, pikë kryesore',
  '2. Ruan si "draft" fillimisht',
  '3. Klikon "Publish" → statusi bëhet "published"',
  '4. GET /api/resources kthen vetëm burimet published (MongoDB filter: { status: "published" })',
  '5. Studenti sheh burimet, klikon "Start Learning" → /resources/:id',
  '6. Lexon përmbajtjen, bën self-check quiz, shton në plan studimi',
];
resFlow.forEach(s => { doc.font('Helvetica').fontSize(9).fillColor(C.dark).text(s, { lineGap: 3 }); });

doc.moveDown(0.3);
h2('7 Kategoritë');
const cats = ['Mathematics', 'Biology', 'English', 'Computer Science', 'Science', 'History', 'Elementary Basics'];
cats.forEach(c => bullet(c));

doc.moveDown(0.3);
h2('15 Burimet Starter (seed:resources)');
body('Skripti "npm run seed:resources" fut 15 burime të botuara menjëherë. Idempotent (mund të ekzekutohet shumë herë pa duplicate).');

// ─── SECTION 14 ──────────────────────────────────────────────────────────────
newSection();
h1('Seksioni 14 – Paneli Admin');

h2('Mbrojtja e Dyfishtë');
body('Frontend: AdminRoute.jsx kontrollon user.role === "admin". Backend: adminOnly middleware kontrollon req.user.role === "admin".');
body('Edhe nëse dikush anashkalon frontend-in (me Postman), backend kthen 403 Forbidden.');

doc.moveDown(0.3);
h2('Rrugët e Paneli Admin');
const admW = [pageW * 0.4, pageW * 0.6];
tableRow(['Rruga', 'Faqja'], admW, true);
[
  ['/admin', 'Ridrejtohet te /admin/dashboard'],
  ['/admin/dashboard', 'AdminDashboard.jsx – statistikat platformës'],
  ['/admin/students', 'AdminStudents.jsx – lista studentësh'],
  ['/admin/students/:id', 'AdminStudentDetail.jsx – profili i detajuar'],
  ['/admin/resources', 'AdminResources.jsx – menaxhimi burimesh'],
  ['/admin/resources/new', 'AdminResourceForm.jsx – krijoni burim të ri'],
  ['/admin/resources/:id/edit', 'AdminResourceForm.jsx – editoni burim'],
].forEach(row => tableRow(row, admW));

doc.moveDown(0.3);
h2('Si Krijohet Llogaria Admin');
code(
  '# Vendos variablat në backend/.env:\n' +
  'ADMIN_EMAIL=admin@example.com\n' +
  'ADMIN_PASSWORD=securepassword\n' +
  'ADMIN_NAME=Administrator\n\n' +
  '# Ekzekuto nga backend/:\n' +
  'npm run seed:admin'
);
body('Regjistrimi normal krijon gjithmonë student (role: "student"). Admini krijohet vetëm me seed:admin.');

// ─── SECTION 15 ──────────────────────────────────────────────────────────────
newSection();
h1('Seksioni 15 – Deployimi');

h2('Arkitektura');
code(
  'Shfletuesi → Vercel (Frontend React) → Render (Backend Express) → MongoDB Atlas\n\n' +
  'VITE_API_URL=https://backend.onrender.com/api  (te Vercel)\n' +
  'FRONTEND_URL=https://app.vercel.app            (te Render)\n' +
  'MONGO_URI=mongodb+srv://...                    (te Render + .env lokal)'
);

h2('Backend → Render');
bullet('Root directory: backend/');
bullet('Build: npm install | Start: npm start (node server.js)');
bullet('Variablat e mjedisit: MONGO_URI, JWT_SECRET, FRONTEND_URL (vendosen te Render dashboard)');
bullet('SHËNIM: Render free tier "fle" pas 15 min pa aktivitet. Kërkesa e parë mund të zgjasë 30-60 sek.');

doc.moveDown(0.3);
h2('Frontend → Vercel');
bullet('Root directory: frontend/');
bullet('Build: npm run build | Output: dist/');
bullet('Variable: VITE_API_URL=https://your-backend.onrender.com/api');

doc.moveDown(0.3);
h2('Siguria e Sekreteve');
bullet('.env është në .gitignore – nuk shkon në GitHub');
bullet('Fjalëkalimet hash me bcrypt – nuk ruhen si tekst i qartë');
bullet('JWT tokens skadojnë pas 30 ditësh');
bullet('Çdo user shikon vetëm të dhënat e veta: Subject.find({ userId: req.user._id })');

// ─── SECTION 16 ──────────────────────────────────────────────────────────────
newSection();
h1('Seksioni 16 – Skripti Demo për Profesorin');

const demoSteps = [
  ['HAPI 1: Landing Page', 'Hapni URL frontend. Tregoni hero section, veçoritë, butonin "Get Started".'],
  ['HAPI 2: Regjistrim', 'Klikoni "Get Started". Vendosni emër, email, fjalëkalim, nivel. "Create Account".'],
  ['HAPI 3: Dashboard', 'Tregoni mesazhin mirëseardhjeje, 8 kartat statistikash (0 fillimisht), progress bar.'],
  ['HAPI 4: Lëndë', 'Shkoni /subjects. "Add Subject". Vendosni "Biologji". Tregoni kartën.'],
  ['HAPI 5: Temë', 'Shkoni /topics. "Add Topic". Zgjidh Biologji, titull "Fotosinteza", Medium. Tregoni badge.'],
  ['HAPI 6: Detajet', 'Klikoni "Open" te tema. Tregoni layout 2-kolona, panelin e ngarkimit PDF.'],
  ['HAPI 7: Ngarko PDF', 'Klikoni "Choose PDF". Prisni 3-5 sek. Tregoni rezumen, konceptet, objektivat.'],
  ['HAPI 8: Quiz', '"Generate Quiz". Tregoni 7 pyetjet. Plotësoni quiz-in. "Submit".'],
  ['HAPI 9: Rezultati', 'Tregoni score %, zonat e dobëta, shpjegimin e çdo pyetjeje me tekstin burimor.'],
  ['HAPI 10: Plan', '"Generate Study Plan". Tregoni planin 9-seksionesh nga PDF.'],
  ['HAPI 11: Burimet', 'Shkoni /resources. Filtroni kategori. "Start Learning". Self-check quiz.'],
  ['HAPI 12: Admin', 'Dilni. Hyni si admin. /admin/dashboard → statistikat. /admin/resources → Publish → Delete.'],
  ['HAPI 13: Finali', 'Hyni sërish si student. Dashboard me statistikat e përditësuara dhe zonat e dobëta.'],
];
const dmW = [pageW * 0.28, pageW * 0.72];
tableRow(['Hapi', 'Çfarë tregoni'], dmW, true);
demoSteps.forEach(row => tableRow(row, dmW));

// ─── SECTION 17 ──────────────────────────────────────────────────────────────
newSection();
h1('Seksioni 17 – Udhëzuesi i Testimit');

h2('Testimi i Autentikimit');
const authW = [pageW * 0.35, pageW * 0.35, pageW * 0.30];
tableRow(['Test', 'Hapat', 'Rezultati i Pritur'], authW, true);
[
  ['Regjistrim i ri', 'Vendos të dhëna të reja → Submit', 'Ridrejton /dashboard'],
  ['Email ekzistues', 'Vendos email të regjistruar', 'Gabim: email ekziston'],
  ['Login admin', 'Email + fjalëkalim admin', 'Ridrejton /admin/dashboard'],
  ['Login gabim', 'Fjalëkalim i gabuar', '"Invalid email or password"'],
  ['Pa login', 'Hap /dashboard drejtpërsëdrejti', 'Ridrejton /login'],
  ['Student → /admin', 'Hap /admin si student', 'Ridrejton /dashboard'],
].forEach(row => tableRow(row, authW));

doc.moveDown(0.5);
h2('Testimi i PDF');
tableRow(['Test', 'Hapat', 'Rezultati i Pritur'], authW, true);
[
  ['PDF me tekst', 'Ngarko PDF me tekst selectable', 'Shfaqen rezume + koncepte'],
  ['PDF imazh', 'Ngarko PDF të skanuar', '"Could not read the PDF"'],
  ['PDF i vogël', 'PDF me <50 fjalë', '"Not enough text extracted"'],
  ['Quiz nga PDF', '"Generate Quiz" pas ngarkimit', '7 pyetje specifike'],
  ['Score ≥70%', 'Merr ≥70%', 'Tema markon "completed"'],
  ['Score <70%', 'Merr <70%', 'Tema markon "in_progress"'],
].forEach(row => tableRow(row, authW));

// ─── SECTION 18 ──────────────────────────────────────────────────────────────
newSection();
h1('Seksioni 18 – Pyetje-Përgjigje (30 Pyetje)');
muted('Zgjedhje e pyetjeve kryesore nga 30 pyetjet e plota në PROJECT_EXPLANATION_DETAILED.md');

const qas = [
  ['Çfarë problemi zgjidh projekti?',
   'Studentët kanë PDF ligjëratash por nuk kanë mënyrë të gjenerojnë quiz/plan nga materiali personal. Study Coach AI e automatizon: ngarkoni PDF → sistemi gjeneron quiz + plan 100% nga ato shënime.'],
  ['A është AI e vërtetë (si ChatGPT)?',
   'Jo. Nuk përdor OpenAI ose modele gjuhësore. Përdor algoritme analize tekstuale: TF-IDF-like frekuencë, regex definicionesh, heuristikë fjalish. Kodi është gati për integrimin OpenAI si hap tjetër.'],
  ['Si gjenerohen pyetjet e quiz-it?',
   '6 hapa: pastron tekstin → nxjerr fjalitë kuptimplote → gjen 30 termat kryesorë → nxjerr definicionet → vlerëson çdo fjali → gjeneron 4 tipe pyetjesh. Çdo gjë vjen nga teksti real i PDF-së.'],
  ['Si identifikon zonat e dobëta?',
   'Çdo pyetje ka sourceConcept (termin burimor). Kur studenti gabon, ky term shtohet në weakAreas. Dashboard i mbledh dhe i shfaq nga të gjitha rezultatet.'],
  ['Si funksionon siguria?',
   'Dy roje: AdminRoute (frontend) bllokojë rrugët nëse role !== admin. adminOnly middleware (backend) kthen 403 nëse req.user.role !== admin. Fjalëkalimet janë bcrypt hash. JWT 30 ditë.'],
  ['Pse MongoDB?',
   'Skema fleksibël (quiz ka pyetje, studyPlan ka Markdown), JSON-native, Atlas falas, relacione të mjaftueshme me ObjectId pa kompleksitetin e SQL.'],
  ['Pse React?',
   'Komponente të ripërdorshme, SPA pa ringarkime, React Router v6 për rrugë të mbrojtura, AuthContext për gjendjen globale të autentikimit.'],
  ['Si punon deployimi?',
   'Frontend (Vercel) dërgon thirrje API te backend (Render) duke përdorur VITE_API_URL. Render lidhet me MongoDB Atlas duke përdorur MONGO_URI. Sekretet janë vetëm te env variables.'],
  ['Çfarë janë variablat e mjedisit?',
   'Vlera konfigurimi jashtë kodit burimor. P.sh. MONGO_URI nuk vendoset në kod – ruhet si env variable te .env (lokalisht) ose te dashboard Render/Vercel (prodhim).'],
  ['Si mund të zgjerohet projekti?',
   'lectureAiService.js zëvendësohet lehtë me thirrje OpenAI API. Mund të shtohet roli "teacher", klasa, OCR për PDF imazhe, aplikacion mobil React Native me të njëjtin backend.'],
];

const qaW = [pageW * 0.35, pageW * 0.65];
qas.forEach(([q, a], i) => {
  if (i > 0 && doc.y > 650) newSection();
  doc.font('Helvetica-Bold').fontSize(10).fillColor(C.primary)
     .text(`P${i + 1}: ${q}`);
  doc.font('Helvetica').fontSize(9).fillColor(C.dark)
     .text(`> ${a}`, { lineGap: 2 });
  doc.moveDown(0.4);
});

muted('Shfletoni PROJECT_EXPLANATION_DETAILED.md, Seksioni 18 për të gjitha 30 pyetjet me përgjigje të detajuara.');

// ─── SECTION 19 ──────────────────────────────────────────────────────────────
newSection();
h1('Seksioni 19 – Plani i Prezantimit (12 Rrëshqitje)');

const slides = [
  ['1. Titulli', 'Study Coach AI – Asistent Personal i të Mësuarit. Emri, universiteti, viti.'],
  ['2. Problemi', 'PDF ligjëratash → quiz dhe plan gjenerik → nuk njohim zonat e dobëta → kaos.'],
  ['3. Zgjidhja', 'Ngarko PDF → quiz 100% nga teksti → plan studimi → zbulim zonash të dobëta.'],
  ['4. Teknologjitë', 'React + Vite (frontend) · Node + Express (backend) · MongoDB Atlas · Vercel + Render.'],
  ['5. Arkitektura', 'Diagram: Browser → Vercel → Render → Atlas. REST API + JWT.'],
  ['6. Veçoritë Kryesore', 'Hierarki Lëndë→Tema→PDF. Quiz 4-tip. Plan 9-seksionesh. Zonat e dobëta. Admin panel.'],
  ['7. PDF → Quiz', 'Diagram algoritmit: cleanText→extractSentences→extractKeyTerms→extractDefinitions→4 tipe pyetjesh.'],
  ['8. Siguria', 'JWT + bcrypt. protect() + adminOnly(). Çdo user shikon vetëm të dhënat e veta.'],
  ['9. Admin Panel', 'Mbrojtje dyfish. Menaxhon burimet (publish/archive). Shikon të gjithë studentët.'],
  ['10. Deployimi', 'Vercel (static) + Render (Node) + Atlas (MongoDB). .env secrets. CORS me FRONTEND_URL.'],
  ['11. Demo Live', 'Register → Lëndë/Temë → Ngarko PDF → Quiz → Rezultat → Plan → Admin Panel.'],
  ['12. Të Ardhmen', 'OCR + OpenAI API + roli mësuesi + grafikë + mobil. Architektura e lejon shkallëzimin.'],
];
const slW = [pageW * 0.25, pageW * 0.75];
tableRow(['Rrëshqitja', 'Çfarë prezantoni'], slW, true);
slides.forEach(row => tableRow(row, slW));

// ─── SECTION 20 ──────────────────────────────────────────────────────────────
newSection();
h1('Seksioni 20 – Përmirësimet e Ardhshme');

h3('Prioritet i Lartë');
bullet('OCR për PDF imazhe – Tesseract.js ose Google Vision API');
bullet('Integrimi OpenAI API – gpt-4o-mini për quiz dhe plane më inteligjente (kodi e lejon pa ndryshim të madh)');
bullet('Grafikë vizuale progres – Chart.js / Recharts, progres me kalimin e kohës');

h3('Prioritet i Mesëm');
bullet('Roli Mësuesi – krijon klasa, cakton tema, shikon progresin e studentëve');
bullet('Ruajtja PDF cloud – AWS S3 / Cloudinary (tani PDF nuk ruhen në disk)');
bullet('Shumëgjuhësi – suport gjuhësh të tjera');

h3('Prioritet i Ulët');
bullet('Aplikacion mobil – React Native me të njëjtin backend');
bullet('Notifikime – Email ose push notification për rishikim');
bullet('Spaced repetition – algoritëm bazuar në teorinë e kujtesës (Ebbinghaus)');
bullet('Kalendar studimi – integrimi Google Calendar');

// ─── SECTION 21 ──────────────────────────────────────────────────────────────
newSection();
h1('Seksioni 21 – Rezyme Finale');

body(
  'Study Coach AI është një platformë e plotë web e mësuarit (full-stack) që mblidh në një vend: ' +
  'organizimin e lëndëve/temave, mësimin inteligjent nga PDF-të, testimin vetjak me quiz 100% personal, ' +
  'planifikimin e studimit, gjurmimin e progresit me zbulimin e zonave të dobëta, burimet mësimore të ' +
  'kuratura dhe kontrollin administrativ me panel të plotë admin.'
);

doc.moveDown(0.5);
h2('Inovacioni Teknik Kryesor');
body(
  'Algoritmet origjinale të analizës tekstuale në lectureAiService.js: nxjerrin termat kryesore me ' +
  'llogaritje frekuence + bigrame, zbulojnë definicionet me 7 regex patterns, vlerësojnë çdo fjali me ' +
  'heuristikë, dhe gjenerojnë 4 tipe pyetjesh nga teksti real. Arkitektura e lejon zëvendësimin me ' +
  'OpenAI API pa ndryshuar pjesën tjetër të sistemit.'
);

doc.moveDown(0.5);
h2('Numrat Kryesorë');
const sumW = [pageW * 0.5, pageW * 0.5];
tableRow(['Metrika', 'Vlera'], sumW, true);
[
  ['Faqe frontend', '19 (14 student + 5 admin)'],
  ['Modele MongoDB', '8 (User, Subject, Topic, Lecture, Quiz, QuizResult, StudyPlan, Resource)'],
  ['API Endpoints', '~30 (publike + protected + admin)'],
  ['Tipe pyetjesh quiz', '4 (fill-blank, definicion, verifikim, identifikim)'],
  ['Seksione plan studimi PDF', '9'],
  ['Burime starter (seed)', '15 burime në 7 kategori'],
  ['Rreshta CSS', '~4300 (custom, pa framework)'],
  ['Deployment', 'Vercel (frontend) · Render (backend) · MongoDB Atlas'],
].forEach(row => tableRow(row, sumW));

doc.moveDown(1);
doc.font('Helvetica-Bold').fontSize(11).fillColor(C.primary).text(
  'Studenti paraqet studimin e tij, sistemi i kthen njohuri.',
  { align: 'center' }
);
doc.moveDown(0.3);
doc.font('Helvetica').fontSize(9).fillColor(C.muted).text(
  'StudyCoachAI_Project_Explanation.pdf · Versioni 1.0 · Bazuar 100% në kodin real',
  { align: 'center' }
);

// ─── PAGE NUMBERS ─────────────────────────────────────────────────────────────
const totalPages = doc.bufferedPageRange().count;
for (let i = 0; i < totalPages; i++) {
  doc.switchToPage(i);
  if (i === 0) continue; // skip cover
  doc.font('Helvetica').fontSize(8).fillColor(C.muted)
     .text(
       `Study Coach AI – Shpjegim Projekti   ·   Faqja ${i} / ${totalPages - 1}`,
       doc.options.margin,
       doc.page.height - 35,
       { width: pageW, align: 'center' }
     );
}

doc.end();
console.log(`✅ PDF u gjenerua: ${OUTPUT}`);
