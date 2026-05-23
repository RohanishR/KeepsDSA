import dbConnect from './src/lib/dbConnect';
import { Problem } from './src/models/Problem';

async function check() {
  await dbConnect();
  const problems = await Problem.find({}).lean();
  console.log("Problems in DB:");
  problems.forEach(p => console.log(`- Title: ${p.title}, Slug: ${p.slug}, ID: ${p._id}, User: ${p.userId}`));
  process.exit(0);
}

check();
