import OpenAI from 'openai';

export function replaceWith(str: string | any, replaceWith: string): any {
  return str
    .trim()
    .toUpperCase()
    .replace(/[-\s]+/g, replaceWith);
}

export const extractData = (response: string) => {
  const nameMatch = response.match(/Name:\s*(.*)/);
  const emailMatch = response.match(/Email:\s*(.*)/);
  const phoneMatch = response.match(/Phone Number:\s*(.*)/);
  const experienceMatch = response.match(/Years of Experience:\s*(.*)/);
  const skillsMatch = response.match(/Skills Set:\s*\[(.*)\]/);
  const profileMatch = response.match(/Profile:\s*(.*)/);
  const summaryMatch = response.match(/Summary:\s*(.*)/);

  return {
    name: nameMatch ? nameMatch[1].trim() : null,
    email: emailMatch ? emailMatch[1].trim() : null,
    phoneNo: phoneMatch ? phoneMatch[1].trim() : null,
    yearsOfExperience: experienceMatch ? experienceMatch[1].trim() : null,
    skills: skillsMatch ? skillsMatch[1].split(',').map(skill => skill.trim()) : null,
    profile: profileMatch ? profileMatch[1].trim() : null,
    summary: summaryMatch ? summaryMatch[1].trim() : null,
  };
};

/**
 * Function is tailored to extract specific details from a candidate's resume text
 * @param text
 */
export async function infoExtractor(text: string) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const context = `Resume text: ${text}`;
  const question = `
    From above candidate's resume text, extract the only following details:
    Name: (Find the candidate's full name. If not available, specify "not available.")
    Email: (Locate the candidate's email address. If not available, specify "not available.")
    Phone Number: (Identify the candidate's phone number. If not found, specify "not
      available.")
    Years of Experience: (If not explicitly mentioned, calculate the years of 
      experience by analyzing the time durations at each company or position listed. Sum up the 
      total durations to estimate the years of experience. If not determinable, write "not
      available.")
    Skills Set: Extract the skills which are purely technical and represent them as: 
    [skill1, skill2,... <other skills from resume>]. If no skills are provided, state "not 
    available."
    Profile: (Identify the candidate's job profile or designation. If not mentioned, 
    specify "not available.")
    Summary: provide a brief summary of the candidate's profile without using more 
      than one newline to segregate sections.
    `;
  const prompt = `
        Based on the below given candidate information, only answer asked question:
        ${context}
        Question: ${question}  
    `;
  // integrate chatgpt api (gpt-3.5-turbo)
  try {
    const result = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful HR recruiter.' },
        { role: 'user', content: prompt },
      ],
      model: 'gpt-3.5-turbo',
    });

    const gptResponse = result.choices[0].message.content;

    const extractedInfo = extractData(gptResponse);

    return extractedInfo;
  } catch (error) {
    console.log(`Error in extracting info: ${error.message}`);
    throw new Error(`Error in extracting info: ${error.message}`);
  }
}

export function extractStats(response: string) {
  const matchPercentagePattern = /\$match:\s*(\d+)%/;
  const matchPercentage = response.match(matchPercentagePattern);

  const responseTextPattern = /\[Response\](.*?)## status/gs;
  const responseTextMatch = response.match(responseTextPattern);

  let responseText = '';
  if (responseTextMatch && responseTextMatch[1]) {
    responseText = responseTextMatch[1].trim();
  }

  const candidateInfoPattern = /<p>(.*?)<\/p>/;
  const candidateInfoMatch = response.match(candidateInfoPattern);

  let candidateInfo = '';
  if (candidateInfoMatch && candidateInfoMatch[1]) {
    candidateInfo = candidateInfoMatch[1].trim();
  }

  const extractedInfo = {
    matchPercentage: matchPercentage ? matchPercentage[1] : null,
    responseText: responseText,
    candidateInfo: candidateInfo,
  };

  return extractedInfo;
}

export async function evaluateCandidateProfile(candidate: any, jobDescription: string) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    // const question = `What percentage of the job requirements does the candidate meet
    //     for the following job description? answer in 3 lines only and be effcient while answering:
    //     ${jobDescription}.

    //     `;

    const question = `What percentage of the job requirements does the candidate meet for the following job description? 
Answer in 3 lines only and be efficient while answering. 
Provide the answer in the following format:

[Response]
## status
$match: [percentage]%
${jobDescription}`;

    // Then add stats section with heading ## Stats
    // percentage: (locate the percentage of job requirements the candidate meets)

    // ## Description
    // 3 lines of description about the candidate's profile based on the job description.
    const prompt = `
          Read below candidate information about the candidate:
            ${JSON.stringify(candidate)}
            Question: ${question} 
        `;

    const response = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful HR recruiter.' },
        { role: 'user', content: prompt },
      ],
      model: 'gpt-3.5-turbo',
    });

    const gptResponse = response.choices[0].message.content;

    const extractedInfo = extractStats(gptResponse);

    return extractedInfo;
  } catch (error) {
    console.log(`Error in evaluating candidate profile: ${error.message}`);
    throw new Error(`Error in evaluating candidate profile: ${error.message}`);
  }
}

export function hexStringToBuffer(str: string): Buffer {
  if (!str) return;
  return Buffer.from(str.substring(2), 'hex');
}

export function bufferToHexString(buffer: Buffer): string {
  if (!buffer) return;
  return `0x${buffer.toString('hex')}`;
}

export const stringifyWithBigInt = (obj: any): any => {
  const jsonString = JSON.stringify(obj, (_, value) => {
    if (typeof value === 'bigint') {
      return value.toString(); // Convert BigInt to string
    }
    return value; // Return other values unchanged
  });

  return JSON.parse(jsonString); // Parse the stringified JSON
};
