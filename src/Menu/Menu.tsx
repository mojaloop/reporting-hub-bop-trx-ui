import React from 'react';
import { Menu } from 'components';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';

interface ExportMenuProps {
  path: string;
}

export default function ExportMenu({ path }: ExportMenuProps) {
  return (
    <>
      <Menu.Item path={`${path}`} label="Find Transfers" />
    </>
  );
}

export function AppMenu() {
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const path = match.url === '/' ? '' : match.url;
  return (
    <Menu path={path} pathname={location.pathname} onChange={history.push}>
      <ExportMenu path={path} />
    </Menu>
  );
}
