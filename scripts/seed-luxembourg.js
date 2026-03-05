// mongosh script to seed Luxembourg niche into prod MongoDB
// Usage: docker exec eujobs-mongo mongosh --file /tmp/seed-luxembourg.js

db = db.getSiblingDB('test');

const luxembourg = {
  slug: 'luxembourg',
  name: 'Jobs in Luxembourg',
  h1: 'Find Jobs in Luxembourg — EU Institutions, Finance, Legal & Tech',
  tagline: "Luxembourg punches far above its weight. Discover roles at EU institutions, global banks, Big Four firms, and one of Europe's most international workforces.",
  description: "Luxembourg is one of Europe's most remarkable job markets. Despite a population of just 670,000, the Grand Duchy is home to major EU institutions, the world's second-largest investment fund centre (after the US), and a booming tech sector. Over 47% of residents are foreign nationals, and more than 200,000 cross-border workers commute daily from France, Belgium, and Germany — making Luxembourg one of the most international labour markets anywhere.\n\nThe EU institutional presence is substantial. Luxembourg hosts the European Court of Justice (CJEU), the European Investment Bank (EIB), the European Court of Auditors (ECA), Eurostat, the Publications Office of the EU, and parts of the European Commission and Parliament secretariats. These institutions employ thousands of officials, contract agents, and trainees, with salaries adjusted by a Luxembourg correction coefficient that reflects the high cost of living.\n\nLuxembourg's financial sector is its economic powerhouse. The country is Europe's leading centre for investment funds (UCITS), hosts over 120 banks, and is home to major players including the European Investment Fund, Clearstream, and the headquarters of ArcelorMittal — the world's largest steel company. Big Four firms (Deloitte, PwC, EY, KPMG) have large offices here, and fintech is growing rapidly with companies like PayPal, Amazon Payments, and Rakuten choosing Luxembourg as their European base.\n\nSalaries in Luxembourg are among the highest in Europe. The minimum wage exceeds €2,500/month (the EU's highest), financial sector salaries are highly competitive, and EU institution packages include generous benefits. Luxembourg also offers significant tax advantages: favourable personal tax rates, no wealth tax on securities, and special regimes for highly skilled expatriates.\n\nThe working environment is genuinely multilingual. Most professionals operate in English, French, and sometimes German daily. Luxembourgish is the national language but is rarely required in the international workplace. French is essential for daily life — shopping, housing, and administration.\n\nQuality of life is exceptional. Luxembourg City is safe, green, and compact. Public transport has been completely free since 2020. Healthcare and schools are excellent, and the country's central location makes weekend travel to Paris, Brussels, Amsterdam, and the Rhine valley effortless.",
  keywords: ['Luxembourg jobs', 'jobs in Luxembourg', 'EIB careers', 'EU jobs Luxembourg', 'finance jobs Luxembourg', 'Luxembourg careers', 'CJEU jobs', 'European Court of Justice jobs', 'Big Four Luxembourg', 'expat jobs Luxembourg'],
  filters: {
    cities: ['Luxembourg', 'Luxembourg City', 'Kirchberg', 'Esch-sur-Alzette'],
    countries: ['Luxembourg', 'Luxemburg', 'Grand Duchy'],
    companyPatterns: [
      'European Investment Bank', 'EIB',
      'European Court of Justice', 'CJEU', 'Court of Justice',
      'European Court of Auditors', 'ECA',
      'Eurostat',
      'Publications Office',
      'ArcelorMittal',
      'Clearstream',
      'Deloitte', 'PwC', 'EY', 'KPMG',
      'Amazon', 'PayPal',
      'Rakuten',
      'BGL BNP Paribas', 'Société Générale',
      'Deutsche Bank',
      'European Investment Fund', 'EIF',
      'European Stability Mechanism', 'ESM',
      'SES', 'Ferrero',
    ],
  },
  faqs: [
    { question: 'What EU institutions are based in Luxembourg?', answer: 'Luxembourg hosts the European Court of Justice (CJEU), the European Investment Bank (EIB), the European Court of Auditors (ECA), Eurostat, the Publications Office of the EU, and parts of the European Commission and Parliament secretariats. The European Stability Mechanism (ESM) and the European Investment Fund (EIF) are also headquartered there.' },
    { question: 'What are salaries like in Luxembourg?', answer: "Luxembourg has the highest minimum wage in the EU (over €2,500/month). Financial sector professionals earn €60,000–150,000+ depending on seniority. EU institution salaries include a Luxembourg correction coefficient and generous benefits. Tax rates are moderate and special expatriate regimes can reduce the effective rate further." },
    { question: 'What languages do I need to work in Luxembourg?', answer: 'Most international employers operate in English and French. French is essential for daily life — housing, shopping, and administration. German is useful in some sectors (legal, public administration). Luxembourgish is the national language but is almost never required in the international workplace. Trilingual candidates (English/French/German) are highly sought after.' },
    { question: 'Can I commute to Luxembourg from a neighbouring country?', answer: 'Yes — over 200,000 workers commute daily from France (mainly Metz and Thionville), Belgium (Arlon area), and Germany (Trier region). Public transport within Luxembourg is completely free since 2020. Many employers offer flexible or hybrid arrangements, and cross-border tax treaties govern the fiscal implications.' },
    { question: 'How does Luxembourg compare to Brussels for EU careers?', answer: "Brussels is the centre of EU policymaking (Commission, Council, Parliament). Luxembourg hosts the EU's judicial and financial institutions (CJEU, EIB, ECA). Luxembourg offers higher salaries and a quieter lifestyle, while Brussels has a larger and more diverse EU affairs ecosystem. Many EU professionals work in both cities during their careers." },
  ],
  enabled: true,
  colors: { primary: 'blue', accent: 'cyan' },
  createdAt: new Date(),
  updatedAt: new Date(),
};

const result = db.niches.updateOne(
  { slug: 'luxembourg' },
  { $set: luxembourg },
  { upsert: true }
);

print('Luxembourg niche seeded:');
printjson(result);
