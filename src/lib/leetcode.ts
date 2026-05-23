export interface LeetCodeProblemData {
  leetcodeId: string;
  title: string;
  slug: string;
  content: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  hints: string[];
}

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';

const GET_QUESTION_DETAIL_QUERY = `
  query getQuestionDetail($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      questionId
      title
      titleSlug
      content
      difficulty
      topicTags {
        name
        slug
      }
      hints
    }
  }
`;

export async function fetchLeetCodeProblem(slug: string): Promise<{ data: LeetCodeProblemData | null, error?: string }> {
  try {
    const response = await fetch(LEETCODE_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      body: JSON.stringify({
        query: GET_QUESTION_DETAIL_QUERY,
        variables: { titleSlug: slug }
      })
    });

    if (!response.ok) {
      return { data: null, error: `LeetCode API responded with status ${response.status} - ${response.statusText}` };
    }

    const json = await response.json();
    
    if (json.errors) {
      return { data: null, error: `GraphQL Errors: ${JSON.stringify(json.errors)}` };
    }

    const question = json.data?.question;
    if (!question) {
      return { data: null, error: `Question not found in response. JSON: ${JSON.stringify(json)}` };
    }

    // Transform response
    return { data: {
      leetcodeId: question.questionId,
      title: question.title,
      slug: question.titleSlug,
      content: question.content || '',
      difficulty: question.difficulty as 'Easy' | 'Medium' | 'Hard',
      tags: question.topicTags?.map((t: any) => t.name) || [],
      hints: question.hints || [],
    } };
  } catch (error: any) {
    return { data: null, error: `Network/Fetch Error: ${error.message}` };
  }
}
