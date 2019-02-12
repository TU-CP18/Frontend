import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icons from '@expo/vector-icons';

const MenuItem = ({ onPress, ...rest }) => {
  if (onPress) {
    return (
      <TouchableOpacity
        style={s.menuTouchable}
        onPress={onPress}
      >
        <Item {...rest} />
      </TouchableOpacity>
    );
  }

  return <Item {...rest} />;
};

const Item = ({
  icon,
  iconStyle,
  label,
  separator = true,
}) => {
  let Icon = null;
  let iconName = null;

  if (icon) {
    Icon = Icons[icon.split('/')[0]];
    iconName = icon.split('/')[1];
  }

  return (
    <View style={[s.item, separator ? s.itemSeparator : {}]}>
      <View style={{ flex: 1 }}>
        {icon && (
          <Icon
            name={iconName}
            style={[s.itemIcon, iconStyle]}
          />
        )}
      </View>
      <Text style={s.itemLabel}>
        {label}
      </Text>
    </View>
  );
}


const s = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  itemSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: '#C2C2C2',
    paddingBottom: 15,
    marginBottom: 15,
  },
  itemIcon: {
    marginRight: 14,
    color: '#ffffff',
    fontSize: 26,
  },
  itemLabel: {
    flex: 7,
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  menuTouchable: {
    alignItems: 'center',
  },
});

export default MenuItem;
