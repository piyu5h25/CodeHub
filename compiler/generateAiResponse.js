import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenerativeAI(process.env.AI_API_KEY);

const generateAiResponse = async (code, language) => {
  const model = ai.getGenerativeModel({ model: process.env.MODEL_NAME });

  const prompt = `The language of the code is ${language}.

Please perform the following tasks:

1. Evaluate the correctness and efficiency of the following code:
${code}

2. Only review the functional logic within the code block. Do NOT comment on external libraries, imports, boilerplate, or framework setup. Focus strictly on the algorithm, logic, and structure of the code itself.

3. Provide a detailed review highlighting any logical errors, inefficiencies, or bad practices in the code.

4. Accurately specify the **time complexity** and **space complexity** of the code, considering the worst-case scenario.

5. If the code contains errors or inefficiencies, provide the corrected code written in the same language. Ensure the correction is minimal and addresses only the identified issues without unnecessary changes.

6. If code was already correct, then just praise the user for the correct  code .

7. After the corrected code, provide a clear explanation of the corrections made and why they are necessary.

8. Avoid explaining language syntax, standard libraries, or unrelated general concepts unless it is critical to the correction.
`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  
  console.log(response.text());
  return response.text();
};

export default generateAiResponse;
