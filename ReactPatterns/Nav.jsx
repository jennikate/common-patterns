import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  Link,
  NavLink,
  useLocation,
  useNavigate
} from 'react-router-dom';
import {
  LANDING_URL,
  LIST_GO_URL,
  LIST_STOP_URL,
  SIGN_IN_URL
} from '../Constants/AppUrlConstants';

const Nav = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const showNav = true;
  // const showNav = useUserIsPermitted(); // todo: build hook to trigger user permitted state based on Auth token
  const navData = useMemo(() => [
    {
      id: 'stopList',
      urlStem: LIST_STOP_URL,
      text: 'Stop list',
      active: false
    },
    {
      id: 'goList',
      urlStem: LIST_GO_URL,
      text: 'Go list',
      active: false
    }
  ], []);
  const [menuState, setMenuState] = useState(false);
  const [navItems, setNavItems] = useState(navData);

  const menuToggle = (e) => {
    e.preventDefault();
    setMenuState(!menuState);
  };

  const setActivePage = useCallback((url) => {
    const tempArr = [...navData];
    const newArr = tempArr.map((item) => {
      const currentUrl = !url ? item.urlStem : url;
      if (currentUrl === item.urlStem) {
        return ({
          ...item,
          active: true
        });
      }
      return ({
        ...item,
        active: false
      });
    });
    document.activeElement.blur();
    setNavItems(newArr);
  }, [navData]);

  const handleSignOut = async () => {
    // API call to sign out
    // on success or error make sure to log out everything in App, clear session etc.
    navigate(SIGN_IN_URL);
  };

  useEffect(() => {
    setActivePage(pathname);
  }, [pathname, setActivePage]);

  return (
    <div>
      {showNav && (
        <nav id="menu" aria-label="menu" className="site-header__navigation">
          <button
            type="button"
            onClick={(e) => menuToggle(e)}
            className={
              menuState === false
                ? 'site-header__menu-button site-header-toggle'
                : 'site-header__menu-button site-header-toggle site-header__menu-button--open'
            }
            aria-controls="navigation"
            aria-label="Show or hide navigation menu"
            aria-expanded={menuState}
          >
            Menu
          </button>

          <ul
            id="navigation"
            className={
              menuState === false
                ? 'site-header__navigation-list'
                : 'site-header__navigation-list site-header__nagivation-list--open'
            }
            aria-label="Top level navigation"
            hidden={menuState}
          >
            {navItems.map((item) => (
              <li
                key={item.id}
                className={item.active ? 'site-header__navigation-item site-header__navigation-item--active' : 'site-header__navigation-item'}
                data-testid={`listitem-${item.id}`} // can I get rid of this
              >
                <Link
                  to={item.urlStem}
                  className="site-header__link"
                  onClick={() => setActivePage(item.urlStem)}
                >
                  {item.text}
                </Link>
              </li>
            ))}
            <li className="site-header__navigation-item float">
              <NavLink to={LANDING_URL} className="site-header__link" onClick={handleSignOut}>Sign out</NavLink>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Nav;
