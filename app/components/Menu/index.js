import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as images from '../../assets';
import i18n from '../../locales/i18n';

export default class Menu extends Component {
  sideNavImage() {
    return (
      <div className="app-container__sidenav--image">
        <img src={images['SideMenuImage']} />
      </div>
    );
  }

  linkClicked() {
    this.props.toggleSideNavAction();
    this.props.clearSupport();
  }

  render() {
    let { path } = this.props;
    console.log(this.props.isOpen);
    return (
      <div
        className={
          'app-container__sidenav ' + (this.props.isOpen ? 'open' : '')
        }
      >
        {this.sideNavImage()}
        {this.props.menuData.map(element => (
          <div key={'div' + element.sequence}>
            <span className="app-container__sidenav--heading">
              {element.caption}
            </span>
            <ul className="app-container__sidenav--list" key={element.sequence}>
              {element.menuItems.map(
                menuItem =>
                  menuItem.enabled ? (
                    <li
                      className={
                        menuItem.uri.substr(
                          menuItem.uri.lastIndexOf('/') + 1
                        ) === path
                          ? 'menu_item_selected'
                          : 'menu_item_unselected'
                      }
                      key={'' + element.sequence + menuItem.sequence}
                    >
                      <img
                        src={
                          menuItem.icon && menuItem.icon !== 'none'
                            ? menuItem.uri.substr(
                                menuItem.uri.lastIndexOf('/') + 1
                              ) === path
                              ? images[menuItem.icon + '_red']
                              : images[menuItem.icon]
                            : null
                        }
                        className="menu-icon"
                      />
                      <Link
                        to={menuItem.uri}
                        onClick={() => this.linkClicked()}
                      >
                        {menuItem.caption}
                      </Link>
                    </li>
                  ) : (
                    <li key={'' + element.sequence + menuItem.sequence}>
                      <i className="material-icons">
                        {i18n.t('label.open_folder')}
                      </i>
                      <a>{menuItem.caption}</a>
                    </li>
                  )
              )}
            </ul>
          </div>
        ))}
      </div>
    );
  }
}

Menu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  menuData: PropTypes.array.isRequired,
  path: PropTypes.string,
  toggleSideNavAction: PropTypes.func.isRequired,
  clearSupport: PropTypes.func
};
