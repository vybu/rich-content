import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isFunction, isArray } from 'lodash';
import {
  sizeClassName,
  alignmentClassName,
  textWrapClassName,
  normalizeUrl,
} from 'wix-rich-content-common';
import { getInteractionWrapper, DefaultInteractionWrapper } from './utils/getInteractionWrapper';

class PluginViewer extends PureComponent {
  getContainerClassNames = hasLink => {
    const { pluginComponent, componentData, styles, theme, isMobile } = this.props;
    const { size, alignment, textWrap, custom } = pluginComponent.classNameStrategies || {};
    return classNames(
      styles.pluginContainerReadOnly,
      {
        [styles.pluginContainerMobile]: isMobile,
        [styles.anchor]: hasLink,
        [theme.anchor]: hasLink && theme.anchor,
      },
      isFunction(alignment)
        ? alignment(componentData, theme, styles, isMobile)
        : alignmentClassName(componentData, theme, styles, isMobile),
      isFunction(size)
        ? size(componentData, theme, styles, isMobile)
        : sizeClassName(componentData, theme, styles, isMobile),
      isFunction(textWrap)
        ? textWrap(componentData, theme, styles, isMobile)
        : textWrapClassName(componentData, theme, styles, isMobile),
      isFunction(custom) ? custom(componentData, theme, styles, isMobile) : null
    );
  };

  /* eslint-disable complexity */
  render() {
    const {
      type,
      pluginComponent,
      componentData,
      children,
      styles,
      entityIndex,
      theme,
      anchorTarget,
      relValue,
      config,
      helpers,
      t,
      isMobile,
      locale,
      disabled,
      shouldRenderOptimizedImages,
      siteDomain,
      disableRightClick,
    } = this.props;
    const { component: Component, elementType } = pluginComponent;
    const { container } = pluginComponent.classNameStrategies || {};
    const settings = (config && config[type]) || {};
    const componentProps = {
      componentData,
      settings,
      children,
      entityIndex,
      theme,
      helpers,
      anchorTarget,
      relValue,
      t,
      isMobile,
      locale,
      disabled,
      shouldRenderOptimizedImages,
      siteDomain,
      disableRightClick,
    };

    if (Component) {
      if (elementType !== 'inline') {
        const hasLink = componentData.config && componentData.config.link;
        const ContainerElement = !hasLink ? 'div' : 'a';
        const containerClassNames = this.getContainerClassNames(hasLink);
        let containerProps = {};
        if (hasLink) {
          const { url, target, rel } = componentData.config.link;
          containerProps = {
            href: normalizeUrl(url),
            target: target || anchorTarget || '_self',
            rel: rel || relValue || 'noopener',
          };
        }
        if (componentData.config) {
          // TODO: more generic logic?
          if (componentData.config.size === 'inline') {
            containerProps.style = { width: componentData.config.width };
          }
          if (type === 'wix-draft-plugin-html') {
            const { width: currentWidth, height: currentHeight } = componentData.config;
            containerProps.style = { width: currentWidth, height: currentHeight };
          }
        }
        return (
          <div className={styles.atomic}>
            <ContainerElement className={containerClassNames} {...containerProps}>
              {isFunction(container) ? (
                <div className={container(theme)}>
                  <Component {...componentProps} />
                </div>
              ) : (
                <Component {...componentProps} />
              )}
            </ContainerElement>
          </div>
        );
      } else {
        return <Component {...componentProps} />;
      }
    }
    return null;
  }
  /* eslint-enable complexity */
}

PluginViewer.propTypes = {
  type: PropTypes.string.isRequired,
  componentData: PropTypes.object.isRequired,
  pluginComponent: PropTypes.object.isRequired,
  entityIndex: PropTypes.number.isRequired,
  children: PropTypes.node,
  styles: PropTypes.object,
  theme: PropTypes.object.isRequired,
  anchorTarget: PropTypes.string.isRequired,
  relValue: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  isMobile: PropTypes.bool.isRequired,
  helpers: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  shouldRenderOptimizedImages: PropTypes.bool.isRequired,
  siteDomain: PropTypes.string.isRequired,
  disableRightClick: PropTypes.bool.isRequired,
};

PluginViewer.defaultProps = {
  styles: {},
};

//return a list of types with a function that wraps the viewer
const getPluginViewers = (typeMap, pluginProps, styles) => {
  const res = {};
  Object.keys(typeMap).forEach(type => {
    res[type] = (children, entity, { key }) => {
      const pluginComponent = typeMap[type];
      const isInline = pluginComponent.elementType === 'inline';
      const { interactions } = entity;

      const ViewerWrapper = isArray(interactions)
        ? getInteractionWrapper({ interactions, config: pluginProps.config, mergedStyles: styles })
        : DefaultInteractionWrapper;
      return (
        <ViewerWrapper>
          <PluginViewer
            type={type}
            pluginComponent={pluginComponent}
            key={key}
            componentData={entity}
            entityIndex={key}
            {...pluginProps}
            styles={styles}
          >
            {isInline ? children : null}
          </PluginViewer>
        </ViewerWrapper>
      );
    };
  });
  return res;
};

export default getPluginViewers;
