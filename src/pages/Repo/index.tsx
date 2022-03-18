import React from 'react';
import { useRouteMatch } from 'react-router-dom';

interface RouteParams {
  repository: string;
}

export const Repo: React.FC = () => {
  const { params } = useRouteMatch<RouteParams>();
  return (
    <>
      <h1>Repo: {params.repository}</h1>
    </>
  );
};
