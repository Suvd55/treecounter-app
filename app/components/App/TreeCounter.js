// Library imports
import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NotificationContainer } from 'react-notifications';
import PropTypes from 'prop-types';

// Components imports
import SelectPlantProjectContainer from '../../containers/SelectPlantProject';
import GiftTreesContainer from '../../containers/GiftTrees';
import TargetContainer from '../../containers/TargetContainer';
import RegisterTreesContainer from '../../containers/RegisterTrees';
import HeaderContainer from '../../containers/HeaderContainer';
import UserContributionsContainer from '../../containers/UserContributions';
import EditUserContributionContainer from '../../containers/EditUserContribution';
import SignUpContainer from '../../containers/Authentication/SignUpContainer';
import LoginContainer from '../../containers/Authentication/LoginContainer';
import ForgotPasswordContainer from '../../containers/Authentication/ForgotPasswordContainer';
import ResetPasswordContainer from '../../containers/Authentication/ResetPasswordContainer';
import EmailSentContainer from '../../containers/Authentication/EmailSentContainer';
import SignupSuccessPage from '../Authentication/SignupSuccessPage';
import BrowserRouter from '../Common/BrowserRouter';
import SideMenuContainer from '../../containers/Menu/SideMenuContainer';
import FAQContainer from '../../containers/FAQ';
import PledgeContainer from '../../containers/Pledge';
import RedemptionContainer from '../../containers/RedemptionContainer';

import Footer from '../Footer';

// Components which use SVG
import PublicTreecounterContainer from '../../containers/PublicTreeCounterContainer';
import UserHomeContainer from '../../containers/UserHome';
import Trillion from '../TreecounterGraphics/Trillion';

import { loadTpos } from '../../actions/loadTposAction';
import { loadUserProfile } from '../../actions/loadUserProfileAction';
import { NotificationAction } from '../../actions/notificationAction';
import { getAccessToken } from '../../utils/user';
import { currentUserProfileSelector } from '../../selectors';
import { getLocalRoute } from '../../actions/apiRouting';
import SuccessfullyActivatedAccount from '../../containers/Authentication/SuccessfullActivatedContainer';
import DonationTreesContainer from '../../containers/DonateTrees/index';
import ActivateAccountContainer from '../../containers/Authentication/ActivateAccountContainer';

import EditUserProfileContainer from '../../containers/EditUserProfile';
import LeaderboardContainer from '../../containers/Leaderboard';
import ProgressModal from '../../components/Common/ModalDialog/ProgressModal';
import { fetchpledgeEventsAction } from '../../actions/pledgeEventsAction';
import PrivacyContainer from '../../containers/Privacy';
import ImprintContainer from '../../containers/Imprint';
import DownloadAppModal from '../DownloadAppStore';
import AppPaymentContainer from '../../containers/AppPayment';

// Class implementation
class TreeCounter extends Component {
  constructor(props) {
    super(props);
    const { userProfile } = this.props;
    const isLoggedIn = null !== userProfile;
    let IS_IPAD = navigator.userAgent.match(/iPad/i) != null,
      IS_IPHONE =
        !IS_IPAD &&
        (navigator.userAgent.match(/iPhone/i) != null ||
          navigator.userAgent.match(/iPod/i) != null),
      IS_IOS = IS_IPAD || IS_IPHONE,
      IS_ANDROID = !IS_IOS && navigator.userAgent.match(/android/i) != null;
    this.state = {
      loading: true,
      isLoggedIn: isLoggedIn,
      isIOS: IS_IOS,
      isAndroid: IS_ANDROID,
      isCancelled: false
    };
  }

  async componentWillMount() {
    const { userProfile } = this.props;
    const isLoggedIn = null !== userProfile;
    if (isLoggedIn) {
      this.setState({ loading: false, isLoggedIn: true });
    } else {
      let token = await getAccessToken();
      if (token) {
        this.props.loadUserProfile();
        this.props.NotificationAction();
      } else {
        this.setState({ loading: false, isLoggedIn: false });
      }
    }
  }

  componentDidMount() {
    this.props.loadTpos();
    this.props.fetchpledgeEventsAction();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userProfile !== this.props.userProfile) {
      let isLoggedIn = null !== nextProps.userProfile;
      this.setState({ loading: false, isLoggedIn: isLoggedIn });
    }
  }

  continueOnSite() {
    this.setState({
      isCancelled: true
    });
  }

  render() {
    let isLoggedIn = this.state.isLoggedIn;
    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route
        {...rest}
        render={props =>
          isLoggedIn ? (
            <Component {...props} />
          ) : (
            <Redirect to={getLocalRoute('app_login')} />
          )
        }
      />
    );

    const PublicRoute = ({ component: Component, ...rest }) => (
      <Route
        {...rest}
        render={props =>
          !isLoggedIn ? (
            <Component {...props} />
          ) : (
            <Redirect to={getLocalRoute('app_userHome')} />
          )
        }
      />
    );

    return !this.state.loading ? (
      <div className="app">
        <BrowserRouter history={history}>
          <div className="app-container">
            <ProgressModal isOpen={this.props.progressModel} />
            {window.location.pathname.indexOf('donation-payment') > -1 ||
            window.location.pathname.indexOf('account-activate') > -1 ? null : (
              <DownloadAppModal
                isOpen={this.state.isIOS && !this.state.isCancelled}
                continueOnSite={this.continueOnSite.bind(this)}
              />
            )}
            <HeaderContainer />
            <Route component={SideMenuContainer} />
            <div className="app-container__content">
              <Route exact path="/" component={Trillion} />
              <Route
                exact
                path={
                  getLocalRoute('app_homepage') !== '/'
                    ? getLocalRoute('app_homepage')
                    : 'null'
                }
                component={Trillion}
              />
              <PublicRoute
                path={getLocalRoute('app_signup')}
                component={SignUpContainer}
              />
              <PublicRoute
                path={getLocalRoute('app_accountActivate') + '/:token'}
                component={SuccessfullyActivatedAccount}
              />
              <PublicRoute
                path={getLocalRoute('app_accountActivation')}
                component={ActivateAccountContainer}
              />
              {/*<Route exact path={getLocalRoute("app_donateTrees")} render={() => (isLoggedIn ? null : <Redirect to={getLocalRoute("app_login")}/>)}/>*/}
              <PrivateRoute
                path={getLocalRoute('app_signupSuccess')}
                component={SignupSuccessPage}
              />
              <PrivateRoute
                path={getLocalRoute('app_userHome')}
                component={UserHomeContainer}
              />
              <PublicRoute
                path={getLocalRoute('app_login')}
                component={LoginContainer}
              />
              <PublicRoute
                path={getLocalRoute('app_forgotPassword')}
                component={ForgotPasswordContainer}
              />
              <PublicRoute
                path={getLocalRoute('app_resetPassword') + '/:token'}
                component={ResetPasswordContainer}
              />
              <PublicRoute
                path={getLocalRoute('app_passwordSent')}
                component={EmailSentContainer}
              />
              <Route
                path={getLocalRoute('app_payment') + '/:donationContribution'}
                component={AppPaymentContainer}
              />
              <Route
                path={getLocalRoute('app_explore')}
                component={LeaderboardContainer}
              />
              <Route
                exact
                path={getLocalRoute('app_leaderboard') + '/:section'}
                component={LeaderboardContainer}
              />
              <Route
                exact
                path={
                  getLocalRoute('app_leaderboard') +
                  '/:section' +
                  '/:subSection'
                }
                component={LeaderboardContainer}
              />
              <PrivateRoute
                path={getLocalRoute('app_target')}
                component={TargetContainer}
              />
              <PrivateRoute
                path={getLocalRoute('app_registerTrees')}
                component={RegisterTreesContainer}
              />
              <PrivateRoute
                path={getLocalRoute('app_editTrees') + '/:selectedTreeId'}
                component={EditUserContributionContainer}
              />
              <PrivateRoute
                path={getLocalRoute('app_myTrees')}
                component={UserContributionsContainer}
              />
              <PrivateRoute
                path={getLocalRoute('app_editProfile')}
                component={EditUserProfileContainer}
              />
              <Route path={getLocalRoute('app_faq')} component={FAQContainer} />
              <Route
                path={getLocalRoute('app_privacy')}
                component={PrivacyContainer}
              />
              <Route
                path={getLocalRoute('app_imprint')}
                component={ImprintContainer}
              />
              {/*<Route path="/payment/project/:projectId" component={PaymentDonation}/>*/}
              <Route
                path={getLocalRoute('app_giftTrees')}
                component={GiftTreesContainer}
              />
              <Route
                path={getLocalRoute('app_selectProject')}
                component={SelectPlantProjectContainer}
              />
              <Route
                path={getLocalRoute('app_donateTrees')}
                component={DonationTreesContainer}
              />
              <Route
                path={getLocalRoute('app_claim') + '/:type' + '/:code'}
                component={RedemptionContainer}
              />
              <Route
                path={getLocalRoute('app_redeem') + '/:type?' + '/:code?'}
                component={RedemptionContainer}
              />
              <Route
                path={getLocalRoute('app_pledge') + '/:eventSlug'}
                component={PledgeContainer}
              />
              <Route
                path={getLocalRoute('app_treecounter') + '/:treecounterId'}
                component={PublicTreecounterContainer}
              />
            </div>
            <Footer />
          </div>
        </BrowserRouter>
        <NotificationContainer />
      </div>
    ) : null;
  }
}

const mapStateToProps = state => ({
  userProfile: currentUserProfileSelector(state),
  progressModel: state.modelDialogState.progressModel
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      loadUserProfile,
      NotificationAction,
      loadTpos,
      fetchpledgeEventsAction
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(TreeCounter);

TreeCounter.propTypes = {
  userProfile: PropTypes.object,
  loadUserProfile: PropTypes.func,
  NotificationAction: PropTypes.func,
  loadTpos: PropTypes.func,
  dispatch: PropTypes.func,
  progressModel: PropTypes.bool,
  fetchpledgeEventsAction: PropTypes.func
};
