import { useRouteMatch } from 'react-router-dom';

export function useBasePath(): string {
  // understand where app is mounted
  // and if it is on root / then it just returns an empty string to avoid breaking paths
  const { path } = useRouteMatch();
  return path === '/' ? '' : path;
}
