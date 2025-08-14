// src/screens/WelcomeHelpScreen.tsx

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  FlatList,
  Dimensions,
} from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next'; // <-- importamos useTranslation
import { lightColors, darkColors, WelcomeHelpColors } from '../../assets/themes/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const SPACING = 20;
const SIDE_PADDING = (width - CARD_WIDTH) / 2;

export default function WelcomeHelpScreen() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation(); // <-- obtenemos la función t()
  const { dark } = useTheme();
  const colors: WelcomeHelpColors = dark
    ? darkColors.welcomeHelp
    : lightColors.welcomeHelp;

  const slideAnim = useRef(new Animated.Value(300)).current;
  const [activeIndex, setActiveIndex] = useState(0);

  // Recuperamos el arreglo de features completo desde el JSON:
  const features = t('welcomeHelp.features', { returnObjects: true }) as {
    title: string;
    description: string;
    details: string[];
  }[];

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  const goToHome = async () => {
    try {
      await AsyncStorage.setItem('hasSeenWelcome', 'true');
      navigation.replace('Home');
    } catch (error) {
      console.error('Error guardando hasSeenWelcome:', error);
    }
  };

  const onScrollEnd = (e: any) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / (CARD_WIDTH + SPACING));
    setActiveIndex(newIndex);
  };

  const renderItem = ({ item }: { item: typeof features[0] }) => (
    <View style={[styles.featureCard, { backgroundColor: colors.cardBg, shadowColor: colors.cardShadowColor }]}>
      <Text style={[styles.featureTitle, { color: colors.featureTitleText }]}>{item.title}</Text>
      <Text style={[styles.featureDesc, { color: colors.featureDescText }]}>{item.description}</Text>
      {item.details.map((line, idx) => (
        <View key={idx} style={styles.bulletRow}>
          <Text style={[styles.bullet, { color: colors.bulletColor }]}>•</Text>
          <Text style={[styles.bulletText, { color: colors.bulletText }]}>{line}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.containerBg }]}>
      <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
        {/* Título traducido */}
        <Text style={[styles.title, { color: colors.titleText }]}>{t('welcomeHelp.title')}</Text>
        {/* Subtítulo traducido */}
        <Text style={[styles.subtitle, { color: colors.subtitleText }]}>{t('welcomeHelp.subtitle')}</Text>

        <FlatList
          data={features}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, idx) => String(idx)}
          renderItem={renderItem}
          snapToInterval={CARD_WIDTH + SPACING}
          decelerationRate="fast"
          snapToAlignment="start"
          contentContainerStyle={{ paddingHorizontal: SIDE_PADDING }}
          onScroll={onScrollEnd}
          scrollEventThrottle={16}
        />

        <View style={styles.pagination}>
          {features.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                idx === activeIndex
                  ? { backgroundColor: colors.dotActive }
                  : { backgroundColor: colors.dotInactive },
              ]}
            />
          ))}
        </View>

        {/* Botón traducido */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.buttonBg }]}
          onPress={goToHome}
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>
            {t('welcomeHelp.button')}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor dinámico en código
    paddingVertical: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    // color dinámico en código
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    // color dinámico en código
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  featureCard: {
    width: CARD_WIDTH,
    // backgroundColor y shadowColor dinámicos en código
    borderRadius: 20,
    padding: 30,
    marginHorizontal: SPACING / 2,
    marginVertical: SPACING,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  featureTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    // color dinámico en código
  },
  featureDesc: {
    fontSize: 16,
    // color dinámico en código
    marginBottom: 12,
    lineHeight: 22,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bullet: {
    fontSize: 16,
    // color dinámico en código
    marginRight: 6,
  },
  bulletText: {
    fontSize: 15,
    // color dinámico en código
    lineHeight: 22,
    flexShrink: 1,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    // backgroundColor dinámico en código
  },
  button: {
    marginTop: 30,
    // backgroundColor dinámico en código
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 25,
    alignSelf: 'center',
  },
  buttonText: {
    // color dinámico en código
    fontSize: 18,
    fontWeight: 'bold',
  },
});
