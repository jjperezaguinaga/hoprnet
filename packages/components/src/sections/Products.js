import React from 'react'
import classNames from 'classnames'
import { SectionTilesProps } from '../utils/SectionProps'
import SectionHeader from './partials/SectionHeader'
import Image from '../elements/Image'

const propTypes = {
  ...SectionTilesProps.types,
}

const defaultProps = {
  ...SectionTilesProps.defaults,
}

const isCompany = process.env.REACT_APP_IS_COMPANY === 'TRUE'

class Products extends React.Component {
  render() {
    const {
      className,
      topOuterDivider,
      bottomOuterDivider,
      topDivider,
      bottomDivider,
      hasBgColor,
      invertColor,
      pushLeft,
      ...props
    } = this.props

    const outerClasses = classNames(
      'products section center-content',
      topOuterDivider && 'has-top-divider',
      bottomOuterDivider && 'has-bottom-divider',
      hasBgColor && 'has-bg-color',
      invertColor && 'invert-color',
      className
    )

    const innerClasses = classNames(
      'products-inner section-inner',
      topDivider && 'has-top-divider',
      bottomDivider && 'has-bottom-divider'
    )

    const tilesClasses = classNames('tiles-wrap', pushLeft && 'push-left')

    const sectionHeader = {
      title: isCompany ? 'Platform' : 'Use Cases',
      paragraph: isCompany ? (
        <>
          <p>
            The HOPR protocol enables data exchange without leaking metadata to third parties.
            <br />
            It is the first product that HOPR Services AG is building.
            <br />
            It is our mission to build privacy-first products and services on top of the HOPR protocol.
            <br />
            Get in touch if you are interested in working with us.
          </p>
        </>
      ) : (
        <>
          <p>
            HOPR keeps any exchange of data private.
            <br />
            The{' '}
            <a href="/we_are#how">
              <span className="text-color-high">HOPR protocol</span>
            </a>{' '}
            is a layer-0 privacy foundation for anyone to{' '}
            <a
              href="https://www.coindesk.com/dont-hodl-buidl-blockchain-tech-will-add-value-2018"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-color-high">buidl</span>
            </a>{' '}
            on.
          </p>
          <p>
            Standard end-to-end encryption does not provide sufficient privacy.
            <br />
            It leaks important metadata, such as who is exchanging data, when, and how often. Securing network-level
            privacy with HOPR unlocks a range of opportunities such as:
          </p>
        </>
      ),
    }

    return (
      <section {...props} className={outerClasses}>
        <div className="container">
          <div className={innerClasses}>
            <SectionHeader data={sectionHeader} className="center-content reveal-from-bottom" />
            <div className={tilesClasses}>
              <div className="tiles-item reveal-from-bottom" data-reveal-container=".tiles-wrap">
                <div className="tiles-item-inner">
                  <div className="features-tiles-item-header">
                    <div className="features-tiles-item-image mb-16">
                      <Image
                        src={require('../assets/images/icons/cloud-data-transfer@140x140.png')}
                        alt="File Lock Icon"
                        width={56}
                        height={56}
                      />
                    </div>
                  </div>
                  <div className="features-tiles-item-content">
                    <h4 className="mt-0 mb-24">Connect devices and clouds</h4>
                    {!isCompany && (
                      <ol>
                        <li>
                          exchange health data between{' '}
                          <a href="https://www.sedimentum.com/" target="_blank" rel="noopener noreferrer">
                            <span className="text-color-high underline">hospitals and off-site computing centers</span>
                          </a>
                          , compliant with data privacy regulations (GDPR, HIPAA, CCPA)
                        </li>
                        <li>connect IoT devices to the cloud without revealing the device’s owner or location</li>
                        <li>
                          securely process data via{' '}
                          <a
                            href="https://www.media.mit.edu/projects/distributed-learning-and-collaborative-learning-1/overview/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span className="text-color-high underline">split learning</span>
                          </a>{' '}
                          for distributed machine learning
                        </li>
                      </ol>
                    )}
                  </div>
                </div>
              </div>

              <div
                className="tiles-item reveal-from-bottom"
                data-reveal-container=".tiles-wrap"
                data-reveal-delay="100"
              >
                <div className="tiles-item-inner">
                  <div className="features-tiles-item-header">
                    <div className="features-tiles-item-image mb-16">
                      <Image
                        src={require('../assets/images/icons/iris-scan-lock@140x140.png')}
                        alt="Sharing Icon"
                        width={56}
                        height={56}
                      />
                    </div>
                  </div>
                  <div className="features-tiles-item-content">
                    <h4 className="mt-0 mb-24">Make crypto assets private</h4>
                    {!isCompany && (
                      <ol>
                        <li>
                          complement{' '}
                          <a href="https://tornado.cash/" target="_blank" rel="noopener noreferrer">
                            <span className="text-color-high underline">on-chain privacy</span>
                          </a>{' '}
                          with HOPR's network-level privacy for truly confidential transactions
                        </li>
                        <li>
                          create trustless and privacy-first{' '}
                          <a href="http://biconomy.io/" target="_blank" rel="noopener noreferrer">
                            <span className="text-color-high underline">layer-2 scaling solutions</span>
                          </a>
                        </li>
                        <li>
                          facilitate the exchange of{' '}
                          <a href="https://openvasp.org/" target="_blank" rel="noopener noreferrer">
                            <span className="text-color-high underline">confidential financial data</span>
                          </a>{' '}
                          between regulated institutions
                        </li>
                      </ol>
                    )}
                  </div>
                </div>
              </div>

              <div
                className="tiles-item reveal-from-bottom"
                data-reveal-container=".tiles-wrap"
                data-reveal-delay="100"
              >
                <div className="tiles-item-inner">
                  <div className="features-tiles-item-header">
                    <div className="features-tiles-item-image mb-16">
                      <Image
                        src={require('../assets/images/icons/hierarchy-8@140x140.png')}
                        alt="Sharing Icon"
                        width={56}
                        height={56}
                      />
                    </div>
                  </div>
                  <div className="features-tiles-item-content">
                    <h4 className="mt-0 mb-24">Digitalization without privacy concerns</h4>
                    {!isCompany && (
                      <ol>
                        <li>securely access private documents</li>
                        <li>
                          <a href="https://matrix.org/" target="_blank" rel="noopener noreferrer">
                            <span className="text-color-high underline">chat in private</span>
                          </a>
                          , so not even the provider knows who you’re talking to
                        </li>
                        <li>
                          <a href="https://www.sherpany.com/en/" target="_blank" rel="noopener noreferrer">
                            <span className="text-color-high underline">manage your organization</span>
                          </a>{' '}
                          securely from anywhere, including your home office
                        </li>
                      </ol>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

Products.propTypes = propTypes
Products.defaultProps = defaultProps

export default Products
