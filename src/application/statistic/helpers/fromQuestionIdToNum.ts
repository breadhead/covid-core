export const fromQuestionIdToNum = (questionId: string): number =>
  Number(questionId.replace('Q', ''))
