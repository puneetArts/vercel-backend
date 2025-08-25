// import { pipeline } from '@xenova/transformers';

// // load embedding model once
// let extractor;
// export const initModel = async () => {
//   if (!extractor) {
//     extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
//   }
//   return extractor;
// };

// export const recommendClubs = async (studentInterests, clubs) => {
//   const extractor = await initModel();

//   // student interests as a single text
//   const studentVec = await extractor(studentInterests.join(" "), { pooling: 'mean', normalize: true });

//   const results = await Promise.all(
//     clubs.map(async (club) => {
//       const clubVec = await extractor(club.tags.join(" ") + " " + club.description, { pooling: 'mean', normalize: true });
//       const score = studentVec.data.reduce((sum, v, i) => sum + v * clubVec.data[i], 0);
//       return { ...club._doc, score };
//     })
//   );

//   return results.sort((a, b) => b.score - a.score).slice(0, 6);
// };


import { pipeline } from '@xenova/transformers';

// loading embding model
let extractor;
export const initModel = async () => {
  if (!extractor) {
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return extractor;
};

// cosine similarity function

const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (normA * normB);
};

export const recommendClubs = async (studentInterests, clubs) => {
  const extractor = await initModel();

  // student interests 
  const studentVec = await extractor(studentInterests.join(" "), { pooling: 'mean' });

  const results = await Promise.all(
    clubs.map(async (club) => {
      const clubVec = await extractor(
        club.tags.join(" ") + " " + club.description,
        { pooling: 'mean' }
      );

      const score = cosineSimilarity(studentVec.data, clubVec.data);
      return { ...club._doc, score };
    })
  );

  return results.sort((a, b) => b.score - a.score).slice(0, 6);
};
