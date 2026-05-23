import { fetchLeetCodeProblem } from './src/lib/leetcode';

async function run() {
  const data = await fetchLeetCodeProblem('two-sum');
  console.log(JSON.stringify(data, null, 2));
}

run();
