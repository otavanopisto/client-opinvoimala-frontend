import React from 'react';
import styled from 'styled-components';
import { QuestionOption } from '../../store/models';
import { TestAnswer } from '../../views';
import { MultiSelect, TextArea, Select, Slider } from '../inputs';

const OptionsContainer = styled.div`
  margin: ${p => p.theme.spacing.xl} 0;
`;

interface Props {
  questionNo?: number;
  testAnswer: TestAnswer;
  setAnswer: (answer?: QuestionOption | null) => void;
}

const TestQuestion: React.FC<Props> = ({
  questionNo,
  testAnswer,
  setAnswer,
}) => {
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
            autoFocus={questionNo === 1}
          />
        );
      case 'dropdown':
        return (
          <Select
            options={question.options}
            selectedOption={answer}
            onSelect={setAnswer}
            autoFocus={questionNo === 1}
          />
        );
      case 'slider':
        return (
          <Slider
            options={question.options}
            selectedOption={answer}
            onSelect={setAnswer}
          />
        );
      case 'text':
        return (
          <TextArea
            text={testAnswer.answer?.label ?? ''}
            onChange={(text: string) =>
              setAnswer({ id: -1, label: text ?? '' })
            }
            autoFocus={questionNo === 1}
          />
        );
      case 'none':
        return null;
      default:
        return null;
    }
  };

  const questionNumber = questionNo !== undefined ? `${questionNo}) ` : '';

  return (
    <div>
      <h2>{`${questionNumber}${question.title}`}</h2>

      {question.content && (
        <div dangerouslySetInnerHTML={{ __html: question.content }}></div>
      )}

      <OptionsContainer>{renderOptions()}</OptionsContainer>
    </div>
  );
};

export default TestQuestion;
