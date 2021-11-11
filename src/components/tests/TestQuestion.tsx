import React from 'react';
import styled from 'styled-components';
import { QuestionOption } from '../../store/models';
import { TestAnswer } from '../../views';
import { MultiSelect, TextArea, Select } from '../inputs';

const OptionsContainer = styled.div`
  margin: ${p => p.theme.spacing.xl} 0;
`;

interface Props {
  testAnswer: TestAnswer;
  setAnswer: (answer?: QuestionOption | null) => void;
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
        return (
          <Select
            options={question.options}
            selectedOption={answer}
            onSelect={setAnswer}
          />
        );
      case 'slider':
        return 'TODO: Slider';
      case 'text':
        return (
          <TextArea
            autoFocus
            text={testAnswer.answer?.label ?? ''}
            onChange={(text: string) =>
              setAnswer({ id: -1, label: text ?? '' })
            }
          />
        );
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
