import React from 'react';
import PropTypes from 'prop-types';

import ContributionCardList from './ContributionCardList';
import ContributionsMapLegend from './ContributionsMapLegend';
import Map from '../Common/EsriMap/Map';
import TextHeading from '../Common/Heading/TextHeading';
import CardLayout from '../Common/Card/CardLayout';
import InlineLink from '../Common/InlineLink';
import i18n from '../../locales/i18n.js';

const UserContributions = ({ userContributions }) => {
  let mPins = userContributions.map(element => {
    let color = '';
    if (element.contributionType === i18n.t('label.donated'))
      color = i18n.t('label.green');
    else if (element.treeCount > 1) color = i18n.t('label.blue');
    else color = i18n.t('label.orange');
    return {
      lat: element.geoLatitude,
      long: element.geoLongitude,
      color: color
    };
  });

  return (
    <div className="app-container__content--center sidenav-wrapper">
      <TextHeading>{i18n.t('label.my_trees')}</TextHeading>
      <CardLayout>
        {Object.keys(userContributions).length > 0 ? (
          <div>
            <Map pins={mPins} />
            <ContributionsMapLegend />
            <div className="contribution-container">
              <ContributionCardList contributions={userContributions} />
            </div>
            <div className="contribution-buttons">
              <InlineLink
                caption={i18n.t('label.register_further')}
                uri={'app_registerTrees'}
              />
              <InlineLink
                caption={i18n.t('label.donate_trees')}
                uri={'app_donateTrees'}
              />
            </div>
          </div>
        ) : (
          <div className="sidenav-wrapper">
            <div className="registeration-successfull">
              {i18n.t('label.no_contributions')}
            </div>
          </div>
        )}
      </CardLayout>
    </div>
  );
};

UserContributions.propTypes = {
  userContributions: PropTypes.array.isRequired
};

export default UserContributions;
