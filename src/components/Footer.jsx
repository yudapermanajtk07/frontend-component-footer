import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { ensureConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';

import messages from './Footer.messages';
import LanguageSelector from './LanguageSelector';

ensureConfig([
  'LMS_BASE_URL',
  'LOGO_TRADEMARK_URL',
], 'Footer component');

const EVENT_NAMES = {
  FOOTER_LINK: 'edx.bi.footer.link',
};

const SiteFooter = ({
  supportedLanguages,
  onLanguageSelected,
  logo,
}) => {
  const intl = useIntl();
  const { config } = useContext(AppContext);

  const showLanguageSelector = supportedLanguages.length > 0 && onLanguageSelected;

  const externalLinkClickHandler = (event) => {
    const label = event.currentTarget.getAttribute('href');
    const eventName = EVENT_NAMES.FOOTER_LINK;
    const properties = {
      category: 'outbound_link',
      label,
    };
    sendTrackEvent(eventName, properties);
  };

  return (
    <footer
      role="contentinfo"
      className="footer py-3 px-4 text-center"
    >
      <div className="container-fluid d-flex flex-column align-items-center">
        <p className="footer-copyright mb-1">
          {intl.formatMessage(messages['footer.copyright'], {
            year: new Date().getFullYear(),
            moocUiLink: (
              <a
                href={config.LMS_BASE_URL}
                onClick={externalLinkClickHandler}
                className="footer-link-highlight"
              >
                MOOC UI
              </a>
            ),
            lmsLink: (
              <a
                href={config.LMS_BASE_URL}
                onClick={externalLinkClickHandler}
                className="footer-link-highlight"
              >
                LMS
              </a>
            ),
          })}
        </p>
        <p className="footer-trademark mb-0">
          {intl.formatMessage(messages['footer.trademark'], {
            edxIncLink: (
              <a
                href={config.LMS_BASE_URL}
                onClick={externalLinkClickHandler}
                className="footer-link-highlight"
              >
                edX Inc.
              </a>
            ),
          })}
        </p>
        {showLanguageSelector && (
          <div className="mt-3">
            <LanguageSelector
              options={supportedLanguages}
              onSubmit={onLanguageSelected}
            />
          </div>
        )}
      </div>
    </footer>
  );
};

SiteFooter.propTypes = {
  logo: PropTypes.string,
  onLanguageSelected: PropTypes.func,
  supportedLanguages: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })),
};

SiteFooter.defaultProps = {
  logo: undefined,
  onLanguageSelected: undefined,
  supportedLanguages: [],
};

export default SiteFooter;
export { EVENT_NAMES };
