let pipelineFn;
let extractor;

const initModel = async () => {
  if (!extractor) {
    if (!pipelineFn) {
      const mod = await import('@xenova/transformers');
      pipelineFn = mod.pipeline;
    }
    extractor = await pipelineFn('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return extractor;
};

const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (normA * normB);
};

const recommendClubs = async (studentInterests, clubs) => {
  if (!clubs || clubs.length === 0) return [];

  const model = await initModel();
  const studentVec = await model(studentInterests.join(' '), { pooling: 'mean' });

  const results = await Promise.all(
    clubs.map(async (club) => {
      const tags = Array.isArray(club.tags) ? club.tags.join(' ') : '';
      const desc = club.description || '';
      const clubText = (tags + ' ' + desc).trim() || club.name || 'club';

      const clubVec = await model(clubText, { pooling: 'mean' });
      const score = cosineSimilarity(studentVec.data, clubVec.data);
      const base = club._doc ? club._doc : club;
      return { ...base, score };
    })
  );

  return results.sort((a, b) => b.score - a.score).slice(0, 6);
};

module.exports = { recommendClubs, initModel };
