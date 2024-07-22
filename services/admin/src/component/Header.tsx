import { Link, NavLink } from 'react-router-dom';
import useMe from '@admin/hook/useMe';
import { HeaderMenu } from './HeaderMenu';

const Header = () => {
  const me = useMe();
  if (!me) return null;

  return (
    <header className="bg-blue fixed left-0 top-0 z-10 flex h-[65px] w-screen justify-center border-b py-4">
      <nav className="container flex">
        <Link className="contents" to={'/'}>
          <img className="mx-5 max-h-[42px]" src="/atlas-path-nav-logo.svg" />
        </Link>
        <section className="flex w-full items-center justify-center gap-8 text-lg">
          <NavLink className="header-menu-item" to={'/home'}>
            Overview
          </NavLink>
          <NavLink className="header-menu-item" to={'/shipments'}>
            Shipments
          </NavLink>
          {me.role === 'ADMIN' && (
            <>
              <NavLink className="header-menu-item" to={'/trackers'}>
                Trackers
              </NavLink>
              <NavLink className="header-menu-item" to={'/alerts'}>
                Alerts
              </NavLink>
            </>
          )}
          <NavLink className="header-menu-item" to={'/users'}>
            Users
          </NavLink>
          {me.role === 'ADMIN' && (
            <NavLink className="header-menu-item" to={'/activities'}>
              Activity
            </NavLink>
          )}
        </section>
        <HeaderMenu />
      </nav>
    </header>
  );
};

export default Header;
