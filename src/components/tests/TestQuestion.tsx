import React from 'react';
import { Question } from '../../store/models';

interface Props {
  question: Question;
}

const TestQuestion: React.FC<Props> = ({ question }) => {
  return (
    <div>
      <h2>{question.title}</h2>

      {question.content && (
        <div dangerouslySetInnerHTML={{ __html: question.content }}></div>
      )}
    </div>
  );
};

export default TestQuestion;
