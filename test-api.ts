import { NextRequest } from 'next/server';
import { POST } from './src/app/api/problems/[slug]/solutions/route';

async function test() {
  const req = new NextRequest('http://localhost/api/problems/test/solutions', {
    method: 'POST',
    body: JSON.stringify({
      title: 'test',
      language: 'python',
      approachType: 'Optimal',
      code: 'print',
      isOptimal: false
    })
  });

  const params = Promise.resolve({ slug: 'test' });
  const res = await POST(req, { params });
  console.log(res.status);
  console.log(await res.json());
}
test();
