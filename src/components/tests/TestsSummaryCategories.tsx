import React from 'react';
import { TestsSummaryCategory } from '../../store/models';
import Stars from '../Stars';

interface Props {
  categories?: TestsSummaryCategory[] | null;
}

const TestsSummaryCategories: React.FC<Props> = ({ categories }) => {
  return <div>TODO: Categories</div>;
};

export default TestsSummaryCategories;
