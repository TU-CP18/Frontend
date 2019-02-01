import React from 'react';
import {
  Dimensions,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import resolveAssetSource from 'resolveAssetSource';

const screenWidth = Dimensions.get('window').width;

const AutoHeightImage = ({
  style,
  width,
  source,
  scaleFactorCallback,
  heightCallback,
  refCallback,
  ...rest
}) => {
  const asset = resolveAssetSource(source);
  let refWidth = width;

  if (typeof width === 'string') {
    if (width[width.length - 1] === '%') {
      refWidth = parseFloat(width.slice(0, width.length - 1)) / 100 * screenWidth;
    }
  }

  const scale = refWidth / asset.width;
  const height = scale * asset.height;

  scaleFactorCallback(scale);
  heightCallback(height);

  return (
    <Image
      source={source}
      style={[style, { width, height }]}
      ref={refCallback}
      {...rest}
    />
  );
};

AutoHeightImage.propTypes = {
  source: PropTypes.any.isRequired,
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  scaleFactorCallback: PropTypes.func,
  heightCallback: PropTypes.func,
};

AutoHeightImage.defaultProps = {
  scaleFactorCallback: () => {},
  heightCallback: () => {},
};

export default AutoHeightImage;
