import React, { Component } from 'react';
import t from 'tcomb-form-native';
import PropTypes from 'prop-types';
import { Text, View, ImageBackground, ScrollView } from 'react-native';

import { signupFormSchema } from '../../../server/parsedSchemas/signup';
import i18n from '../../../locales/i18n.js';
import PrimaryButton from '../../Common/Button/PrimaryButton';
import styles from '../../../styles/login.native';
import SignupTypes from './SignupType';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

let Form = t.form.Form;

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Profiletype: 'individual'
    };
    this.changeProfile = this.changeProfile.bind(this);
  }

  onLoginClicked = () => {
    this.props.updateRoute('app_login');
  };

  changeProfile(type) {
    this.setState({
      Profiletype: type
    });
  }

  render() {
    let { Profiletype } = this.state;
    return (
      <KeyboardAwareScrollView>
        <ImageBackground style={[styles.container, styles.parentContainer]}>
          <SignupTypes changeProfile={this.changeProfile} />
          <View style={styles.inputContainer}>
            <Form
              ref={'signupForm'}
              type={signupFormSchema[Profiletype]}
              options={this.props.schemaOptions[Profiletype]}
              value={this.props.formValue}
            />
            <PrimaryButton
              onClick={() => {
                this.props.onSignUpClicked(Profiletype);
              }}
            >
              {i18n.t('label.signUp')}
            </PrimaryButton>
            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>
                {i18n.t('label.already_have_account')}
              </Text>
              <Text
                onPress={this.onLoginClicked}
                style={styles.bottomTextHighlight}
              >
                {i18n.t('label.login')}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </KeyboardAwareScrollView>
    );
  }
}

SignUp.propTypes = {
  updateRoute: PropTypes.func,
  onSignUpClicked: PropTypes.func,
  onError: PropTypes.func,
  formValue: PropTypes.any,
  schemaOptions: PropTypes.any
};
