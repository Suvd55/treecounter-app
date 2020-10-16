import React from 'react';
import i18n from '../../locales/i18n';
import { Picker } from '@react-native-community/picker';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';

class SelectTemplateComponent extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const locals = this.props.locals;
    const textColor = '#686060';
    return (
      <Picker
        mode="dialog"
        selectedValue={locals.value}
        onValueChange={itemValue => locals.onChange(itemValue)}
        style={{width: '100%'}}
      >
        {this.props.options.map(option => (
          <Picker.Item
            itemStyle={{fontSize: 16}}
            key={option.value}
            label={i18n.t(option.text)}
            color={textColor}
            value={option.value}
          />
        ))}
      </Picker>
    );
  }
}

SelectTemplateComponent.propTypes = {
  locals: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired
};

export function getSelectTemplate(enumOption) {
  return function SelectTemplate(locals) {
    const options = enumOption ? enumOption : locals.options;
    const stylesheet = locals.stylesheet;
    // let formGroupStyle = stylesheet.formGroup.normal;
    // let controlLabelStyle = stylesheet.controlLabel.normal;
    let helpBlockStyle = stylesheet.helpBlock.normal;
    const errorBlockStyle = stylesheet && stylesheet.errorBlock;

    // if (locals.hasError) {
    //   formGroupStyle = stylesheet.formGroup.error;
    //   controlLabelStyle = stylesheet.controlLabel.error;
    //   helpBlockStyle = stylesheet.helpBlock.error;
    // }

    const help = locals.help ? (
      <Text style={helpBlockStyle}>{locals.help}</Text>
    ) : null;
    const error =
      locals.hasError && locals.error ? (
        <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>
          {locals.error}
        </Text>
      ) : null;

    return (
      //formGroupStyle
      <View style={[{ flex: 1 }]}>
        <SelectTemplateComponent locals={locals} options={options} />
        {help}
        {error}
      </View>
    );
  };
}
