import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { apiBase } from '../../API/apiBase';
import { resetState } from '../../Store/miscellaneousStoreSlice';
import { useAppDispatch } from '../../Store/store';
import { resetAuth } from '../../Ver2Designs/Pages/AuthAndOnboard';
import { useLogoutMutation } from '../../Ver2Designs/Pages/AuthAndOnboard/api/auth';
import { LinkContainer } from '../Pages/CreateCard/CreateTwitterPage.styles';
import PrimaryButton from './PrimaryButton';
export const LogoutButton = () => {
  // eslint-disable-next-line no-unused-vars
  const [cookies, _setCookie, removeCookie] = useCookies([
    'token',
    'refreshToken',
  ]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const handleLogOut = async () => {
    try {
      // Call logout API using RTK Query
      await logout().unwrap();

      // Clear localStorage
      localStorage.clear();

      // Clear cookies
      removeCookie('refreshToken');
      removeCookie('token');

      // Clear RTK Query cache to prevent cross-user data contamination
      dispatch(apiBase.util.resetApiState());

      // Clear Redux state
      dispatch(resetState());
      dispatch(resetAuth());

      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
      // Clear everything anyway in case of API failure
      localStorage.clear();
      removeCookie('refreshToken');
      removeCookie('token');
      dispatch(apiBase.util.resetApiState());
      dispatch(resetState());
      dispatch(resetAuth());
      navigate('/');
    }
  };
  return (
    <LinkContainer>
      <PrimaryButton
        text='Log Out'
        inverse={true}
        onclick={handleLogOut}
        colors='#EF5A22'
        border='0px solid #EF5A22'
        width='100px'
        height='50px'
        margin='0px 50px 15px 0px'
      />
    </LinkContainer>
  );
};
