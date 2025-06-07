import {
  StyleSheet,
  View,
  Animated,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import React, {memo, useRef} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Custom imports
import {TabNav} from '../NavigationKeys';
import {TabRoute} from '../NavigationRoutes';
import {getHeight, moderateScale, screenWidth} from '../../common/constants';
import {colors, styles} from '../../themes';
import strings from '../../i18n/strings';
import CText from '../../components/common/CText';

const Tab = createBottomTabNavigator();

const AnimatedTab = memo(({label, focused, iconName, onPress}) => {
  const scaleAnim = useRef(new Animated.Value(focused ? 1.1 : 1)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.1 : 1,
      useNativeDriver: true,
      friction: 4,
    }).start();
  }, [focused]);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Animated.View
        style={[
          localStyle.tabViewContainer,
          focused && localStyle.activeTab,
          {transform: [{scale: scaleAnim}]},
        ]}>
        <Ionicons
          name={iconName}
          size={moderateScale(24)}
          color={focused ? colors.primary : colors.grayScale5}
          style={{marginBottom: !focused && moderateScale(2)}}
        />
        <CText
          numberOfLines={1}
          style={{marginTop: moderateScale(5)}}
          color={focused ? colors.primary : colors.grayScale5}
          type={'M12'}>
          {label}
        </CText>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
});

export default function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({route, navigation}) => ({
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: localStyle.tabBarStyle,
        tabBarShowLabel: false,
        tabBarBackground: () => <View style={localStyle.absoluteBg} />,
        tabBarIcon: ({focused}) => {
          let iconName = '';
          let label = '';
          if (route.name === TabNav.Home) {
            iconName = focused ? 'home' : 'home-outline';
            label = strings.home;
          } else if (route.name === TabNav.Favorites) {
            iconName = focused ? 'heart' : 'heart-outline';
            label = strings.favorites;
          }
          return (
            <AnimatedTab
              focused={focused}
              label={label}
              iconName={iconName}
              onPress={() => navigation.navigate(route.name)}
            />
          );
        },
      })}
      initialRouteName={TabNav.Home}>
      <Tab.Screen name={TabNav.Home} component={TabRoute.Home} />
      <Tab.Screen name={TabNav.Favorites} component={TabRoute.Favorites} />
    </Tab.Navigator>
  );
}

const localStyle = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    left: moderateScale(20),
    right: moderateScale(20),
    bottom: Platform.OS === 'ios' ? getHeight(30) : getHeight(20),
    height: moderateScale(70),
    borderRadius: moderateScale(40),
    backgroundColor: colors.white,
    borderTopWidth: 0,
    elevation: 12,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    ...styles.mh20,
    ...styles.ph5,
    paddingTop: moderateScale(16),
  },
  absoluteBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.white,
    borderRadius: moderateScale(40),
  },
  tabViewContainer: {
    ...styles.center,
    width: screenWidth / 2.6,
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(30),
    height: moderateScale(50),
  },
  activeTab: {
    backgroundColor: colors.primary + '15',
    borderRadius: moderateScale(30),
    ...styles.pv15,
  },
});
