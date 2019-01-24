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
  ...rest
}) => {
  const asset = resolveAssetSource(source);
  let refWidth = width;

  if (typeof width === 'string') {
    if (width[width.length - 1] === '%') {
      refWidth = parseFloat(width.slice(0, width.length - 1)) / 100 * screenWidth;
    }
  }

  const height = refWidth / asset.width * asset.height;

  return (
    <Image
      source={source}
      style={[style, { width, height }]}
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
};

export default AutoHeightImage;
