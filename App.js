import React from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { Asset } from 'expo-asset';
import { AppLoading } from 'expo';

import TruthApp from './app/index';
// import 'react-native-gesture-handler';


const cacheImages = (images) => {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      isReady: false,
    };
  };

  async _loadAssetsAsync() {
    const imageAssets = cacheImages([
      require('./assets/background.png'),
    ]); 

    await Promise.all([...imageAssets]);
  };

  render() {

    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._loadAssetsAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }
    return (
      <TruthApp />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
});
