import React, { useRef } from 'react';
import styled from 'styled-components';
import { QuestionOption } from '../../store/models';
import InnerHtmlDiv from '../InnerHtmlDiv';
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
  const titleRef = useRef<HTMLHeadingElement>(null);
  const questionRef = useRef<number>();

  const { question, answer } = testAnswer;

  const renderOptions = () => {
    if (!question.options.length) return null;

    if (questionRef.current !== questionNo) {
      // Question did change, "reset" focus to heading
      questionRef.current = questionNo;
      titleRef.current?.focus();
    }

    switch (question.answerType) {
      case 'multiple_choice':
        return (
          <MultiSelect<number>
            options={question.options}
            selectedOption={answer}
            onSelect={setAnswer}
          />
        );
      case 'dropdown':
        return (
          <Select<number>
            options={question.options}
            selectedOption={answer}
            onSelect={setAnswer}
            variant="filled"
          />
        );
      case 'slider':
        return (
          <Slider<number>
            id={question.id}
            options={question.options}
            selectedOption={answer}
            onSelect={setAnswer}
          />
        );
      case 'text':
        return (
          <TextArea
            id={question.id}
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

  const questionNumber = questionNo !== undefined ? `${questionNo}) ` : '';
  const title = `${questionNumber}${question.title}`;

  return (
    <div>
      <h2 ref={titleRef} tabIndex={-1} style={{ outline: 0 }}>
        {title}
      </h2>

      {question.content && <InnerHtmlDiv html={question.content} />}

      <OptionsContainer>{renderOptions()}</OptionsContainer>
    </div>
  );
};

export default TestQuestion;
