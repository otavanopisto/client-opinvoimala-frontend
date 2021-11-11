import React from 'react';
import styled from 'styled-components';
import { QuestionOption } from '../../store/models';
import { TestAnswer } from '../../views';
import MultiSelect from '../inputs/MultiSelect';

const OptionsContainer = styled.div`
  margin: ${p => p.theme.spacing.xl} 0;
`;

interface Props {
  testAnswer: TestAnswer;
  setAnswer: (answer: QuestionOption) => void;
}

const TestQuestion: React.FC<Props> = ({ testAnswer, setAnswer }) => {
  const { question, answer } = testAnswer;

  const renderOptions = () => {
    if (!question.options.length) return null;

    switch (question.answerType) {
      case 'multiple_choice':
        return (
          <MultiSelect
            options={question.options}
            selectedOption={answer}
            onSelect={setAnswer}
          />
        );
      case 'dropdown':
        return 'TODO: Dropdown';
      case 'slider':
        return 'TODO: Slider';
      case 'text':
        return 'TODO: Text';
      case 'none':
        return null;
      default:
        return null;
    }
  };

  return (
    <div>
      <h2>{question.title}</h2>

      {question.content && (
        <div dangerouslySetInnerHTML={{ __html: question.content }}></div>
      )}

      <OptionsContainer>{renderOptions()}</OptionsContainer>
    </div>
  );
};

export default TestQuestion;
