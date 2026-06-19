require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const Match = require('../models/Match');
const Player = require('../models/Player');
const Opening = require('../models/Opening');
const User = require('../models/User');

// ── Config ──────────────────────────────────────────────────────
const JSON_PATH = path.resolve(__dirname, '../../', 'Chess Game Dataset.json');
const BATCH_SIZE = 5000;

// ── Main ────────────────────────────────────────────────────────
async function seedAll(shouldExit = true) {
  if (shouldExit) {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  }

  const matchCount = await Match.countDocuments();
  const playerCount = await Player.countDocuments();
  const openingCount = await Opening.countDocuments();
  const userCount = await User.countDocuments();

  const shouldSeedMatches = matchCount === 0;
  const shouldSeedPlayers = playerCount === 0;
  const shouldSeedOpenings = openingCount === 0;
  const shouldSeedUsers = userCount === 0;

  if (!shouldSeedMatches && !shouldSeedPlayers && !shouldSeedOpenings && !shouldSeedUsers) {
    console.log('All collections already seeded. Skipping.');
    return;
  }

  // 1. Clean existing data
  console.log('Clearing empty collections...');
  if (shouldSeedMatches) await Match.deleteMany({});
  if (shouldSeedPlayers) await Player.deleteMany({});
  if (shouldSeedOpenings) await Opening.deleteMany({});
  console.log('Collections cleared');

  // 2. Sync indexes to ensure unique constraints are active
  console.log('Syncing indexes...');
  await Match.syncIndexes();
  await Player.syncIndexes();
  await Opening.syncIndexes();
  await User.syncIndexes();
  console.log('Indexes synced');

  // 3. Create Default Users if none exist (hashes password via pre-save hook)
  if (shouldSeedUsers) {
    console.log('Seeding default users...');
    await User.create([
      {
        name: 'Grandmaster Admin',
        email: 'admin@chessiq.com',
        password: 'password123',
        role: 'admin',
        emailVerified: true,
      },
      {
        name: 'Chess Analyst',
        email: 'user@chessiq.com',
        password: 'password123',
        role: 'user',
        emailVerified: true,
      },
    ]);
    console.log('Default users seeded');
  } else {
    console.log('Users collection already populated, skipping default users seeding.');
  }

  // 4. Read matches JSON
  console.log('Reading JSON dataset file...');
  if (!fs.existsSync(JSON_PATH)) {
    console.error(`JSON dataset not found at: ${JSON_PATH}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(JSON_PATH, 'utf-8');
  const allMatches = JSON.parse(raw);
  console.log(`Loaded ${allMatches.length} matches from dataset. Deduplicating...`);

  const matches = [];
  const matchIdsSeen = new Set();
  for (const m of allMatches) {
    if (!m.id) continue;
    if (matchIdsSeen.has(m.id)) continue;
    matchIdsSeen.add(m.id);
    matches.push(m);
  }
  console.log(`Deduplicated to ${matches.length} unique matches. Processing stats...`);

  // 5. Aggregate players and openings in-memory
  const playersMap = new Map();
  const openingsMap = new Map();

  for (const m of matches) {
    // Normalize rated status
    m.rated = m.rated ? m.rated.toUpperCase() : 'FALSE';

    const matchDate = m.created_at ? new Date(parseFloat(m.created_at)) : new Date();
    const whiteRating = parseInt(m.white_rating) || 1500;
    const blackRating = parseInt(m.black_rating) || 1500;

    // Process White Player
    if (m.white_id) {
      if (!playersMap.has(m.white_id)) {
        playersMap.set(m.white_id, {
          username: m.white_id,
          ratings: [],
          totalGames: 0,
          wins: 0,
          losses: 0,
          draws: 0,
          openings: new Map(),
          lastSeen: matchDate,
        });
      }
      const p = playersMap.get(m.white_id);
      p.ratings.push({ date: matchDate, rating: whiteRating });
      p.totalGames += 1;
      if (m.winner === 'white') p.wins += 1;
      else if (m.winner === 'black') p.losses += 1;
      else p.draws += 1;
      p.openings.set(m.opening_eco, (p.openings.get(m.opening_eco) || 0) + 1);
      if (matchDate > p.lastSeen) p.lastSeen = matchDate;
    }

    // Process Black Player
    if (m.black_id) {
      if (!playersMap.has(m.black_id)) {
        playersMap.set(m.black_id, {
          username: m.black_id,
          ratings: [],
          totalGames: 0,
          wins: 0,
          losses: 0,
          draws: 0,
          openings: new Map(),
          lastSeen: matchDate,
        });
      }
      const p = playersMap.get(m.black_id);
      p.ratings.push({ date: matchDate, rating: blackRating });
      p.totalGames += 1;
      if (m.winner === 'black') p.wins += 1;
      else if (m.winner === 'white') p.losses += 1;
      else p.draws += 1;
      p.openings.set(m.opening_eco, (p.openings.get(m.opening_eco) || 0) + 1);
      if (matchDate > p.lastSeen) p.lastSeen = matchDate;
    }

    // Process Opening
    if (m.opening_eco) {
      if (!openingsMap.has(m.opening_eco)) {
        openingsMap.set(m.opening_eco, {
          eco: m.opening_eco,
          name: m.opening_name || m.opening || m.opening_eco,
          totalGames: 0,
          whiteWins: 0,
          blackWins: 0,
          draws: 0,
          plySum: 0,
        });
      }
      const o = openingsMap.get(m.opening_eco);
      o.totalGames += 1;
      if (m.winner === 'white') o.whiteWins += 1;
      else if (m.winner === 'black') o.blackWins += 1;
      else o.draws += 1;
      o.plySum += parseInt(m.opening_ply) || 4;
    }
  }

  // 6. Format Players for insertion
  console.log(`Formatting ${playersMap.size} players...`);
  const playersToInsert = [];
  for (const [username, p] of playersMap.entries()) {
    p.ratings.sort((a, b) => a.date - b.date);
    const ratingHistory = p.ratings.map((r) => ({ date: r.date, rating: r.rating }));
    const currentRating = ratingHistory[ratingHistory.length - 1].rating;

    const sortedOpenings = [...p.openings.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map((entry) => entry[0]);

    playersToInsert.push({
      username,
      currentRating,
      ratingHistory,
      totalGames: p.totalGames,
      wins: p.wins,
      losses: p.losses,
      draws: p.draws,
      preferredOpenings: sortedOpenings,
      lastSeen: p.lastSeen,
    });
  }

  // 7. Format Openings for insertion
  console.log(`Formatting ${openingsMap.size} openings...`);
  const openingsToInsert = [];
  for (const [eco, o] of openingsMap.entries()) {
    const total = o.totalGames;
    const whiteWins = o.whiteWins;
    const blackWins = o.blackWins;
    const draws = o.draws;

    const winRate = {
      white: total > 0 ? parseFloat(((whiteWins / total) * 100).toFixed(1)) : 0,
      black: total > 0 ? parseFloat(((blackWins / total) * 100).toFixed(1)) : 0,
      draw: total > 0 ? parseFloat(((draws / total) * 100).toFixed(1)) : 0,
    };

    const avgPly = total > 0 ? Math.round(o.plySum / total) : 4;

    let complexity = 'intermediate';
    if (avgPly < 4) complexity = 'beginner';
    else if (avgPly > 8) complexity = 'advanced';

    let style = 'balanced';
    const lowerName = o.name.toLowerCase();
    if (lowerName.includes('gambit')) {
      style = 'gambit';
    } else if (
      lowerName.includes('attack') ||
      lowerName.includes('modern') ||
      lowerName.includes('sicilian') ||
      lowerName.includes('benoni') ||
      lowerName.includes('alekhine') ||
      lowerName.includes('scandinavian') ||
      lowerName.includes('dutch') ||
      lowerName.includes('gruenfeld')
    ) {
      style = 'aggressive';
    } else if (
      lowerName.includes('defense') ||
      lowerName.includes('defence') ||
      lowerName.includes('caro-kann') ||
      lowerName.includes('french') ||
      lowerName.includes('slav') ||
      lowerName.includes('berlin') ||
      lowerName.includes('petrov') ||
      lowerName.includes('philidor')
    ) {
      style = 'defensive';
    }

    const family = o.name.split(/[:,-]/)[0].trim();

    openingsToInsert.push({
      eco,
      name: o.name,
      family,
      totalGames: total,
      whiteWins,
      blackWins,
      draws,
      winRate,
      avgPly,
      complexity,
      style,
    });
  }

  // 8. Seeding Players in batches
  if (shouldSeedPlayers) {
    console.log('Seeding Players...');
    for (let i = 0; i < playersToInsert.length; i += BATCH_SIZE) {
      const batch = playersToInsert.slice(i, i + BATCH_SIZE);
      await Player.insertMany(batch, { ordered: false });
      console.log(`  Inserted ${i + batch.length}/${playersToInsert.length} players`);
    }
  } else {
    console.log('Players collection already populated, skipping players seeding.');
  }

  // 9. Seeding Openings in batches
  if (shouldSeedOpenings) {
    console.log('Seeding Openings...');
    for (let i = 0; i < openingsToInsert.length; i += BATCH_SIZE) {
      const batch = openingsToInsert.slice(i, i + BATCH_SIZE);
      await Opening.insertMany(batch, { ordered: false });
      console.log(`  Inserted ${i + batch.length}/${openingsToInsert.length} openings`);
    }
  } else {
    console.log('Openings collection already populated, skipping openings seeding.');
  }

  // 10. Seeding Matches in batches
  if (shouldSeedMatches) {
    console.log('Seeding Matches...');
    for (let i = 0; i < matches.length; i += BATCH_SIZE) {
      const batch = matches.slice(i, i + BATCH_SIZE);
      await Match.insertMany(batch, { ordered: false });
      console.log(`  Inserted ${i + batch.length}/${matches.length} matches`);
    }
  } else {
    console.log('Matches collection already populated, skipping matches seeding.');
  }

  console.log('\n=== Database Seeding Complete ===');
  console.log(`  Matches seeded:  ${shouldSeedMatches ? matches.length : 0}`);
  console.log(`  Players seeded:  ${shouldSeedPlayers ? playersToInsert.length : 0}`);
  console.log(`  Openings seeded: ${shouldSeedOpenings ? openingsToInsert.length : 0}`);
  console.log(`  Users seeded:    ${shouldSeedUsers ? 2 : 0}`);

  if (shouldExit) {
    await mongoose.disconnect();
    process.exit(0);
  }
}

if (require.main === module) {
  seedAll(true).catch((err) => {
    console.error('Fatal error during seeding:', err);
    process.exit(1);
  });
}

module.exports = seedAll;
