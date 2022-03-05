export interface IPersonaje {
  id: number;
  audio: string;
  skill: string;
  skillHtml: string;
  rights: string[];
  audioRights: string;
  imagePhone: string;
  imageTablet: string;
  imageRightsPhone: string;
  imageRightsTablet: string;
  imageQuestionPhone: string;
  imageQuestionTablet: string;
  fontColor: string,
  name: string;
  quiz: {
      question: string;
      answers: {
          correct: boolean;
          description: string;
          value: number;
      }[];
  }[];
}[]