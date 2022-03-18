import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { api } from '../../services/api';

import { FiChevronRight } from 'react-icons/fi';
import logo from '../../assets/logo.svg';

import { Title, Form, Repos, Error } from './styles';
interface GitHubRepository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export const Dashboard: React.FC = () => {
  const [repos, setRepos] = useState<GitHubRepository[]>(() => {
    const storageRepos = localStorage.getItem('@GithubExplorer:repos');
    if (storageRepos) {
      return JSON.parse(storageRepos);
    }
    // console.log(storageRepos, 'console do storageRepos');
    return [];
  });

  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');

  useEffect(() => {
    const localRepo = localStorage.getItem('@GitCollection:repositories');
    if (localRepo) {
      setRepos(JSON.parse(localRepo));
    }
    // console.log(repos, 'console do useEffect');
  }, []);

  function handleInputchange(event: ChangeEvent<HTMLInputElement>): void {
    setNewRepo(event.target.value);
  }

  async function handleAddRepo(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    if (!newRepo) {
      setInputError('Digite o autor/nome do repositório válido');
      return;
    }
    const response = await api.get<GitHubRepository>(`repos/${newRepo}`);
    const repository = response.data;

    setRepos([...repos, repository]);
    localStorage.setItem(
      '@GitCollection:repositories',
      JSON.stringify([...repos, repository]),
    );
    setNewRepo('');
  }

  return (
    <>
      <img src={logo} alt="GitCollection" />
      <Title>Catálogo de repositórios do GitHub</Title>

      <Form hasError={Boolean(inputError)} onSubmit={handleAddRepo}>
        <input
          placeholder="username/repository_name"
          onChange={handleInputchange}
        />
        <button type="submit">Buscar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repos>
        {repos?.map(repositorys => (
          <a
            href={`/repositories/${repositorys.full_name}`}
            key={repositorys.full_name}
          >
            <img
              src={repositorys.owner.avatar_url}
              alt={repositorys.owner.login}
            />
            <div>
              <strong>{repositorys.full_name}</strong>
              <p>{repositorys.description}</p>
            </div>
            <FiChevronRight size={20} />
          </a>
        ))}
      </Repos>
    </>
  );
};
