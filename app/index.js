import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    Dimensions,
    TextInput,
    Button,
    Alert,
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

import Svg, { Image, Circle, ClipPath } from 'react-native-svg';

import Animated, { Easing, Extrapolate } from 'react-native-reanimated';
import { TapGestureHandler, State } from 'react-native-gesture-handler';


const { width, height } = Dimensions.get('window');
const { 
    Value,
    event,
    block,
    cond,
    eq,
    set,
    Clock,
    startClock,
    stopClock,
    debug,
    timing,
    clockRunning,
    interpolate
} = Animated;

function runTiming(clock, value, dest) {
    const state = {
      finished: new Value(0),
      position: new Value(0),
      time: new Value(0),
      frameTime: new Value(0)
    };
  
    const config = {
      duration: 1000,
      toValue: new Value(0),
      easing: Easing.inOut(Easing.ease)
    };
  
    return block([
      cond(clockRunning(clock), 0, [
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, value),
        set(state.frameTime, 0),
        set(config.toValue, dest),
        startClock(clock)
      ]),
      timing(clock, state, config),
      cond(state.finished, debug('stop clock', stopClock(clock))),
      state.position
    ]);
}

const screenRatio = 2;
const roundFix = 50;

class TruthApp extends Component {

    constructor() {
        super();

        this.buttonOpacity = new Value(1);
        this.onStateChange = Animated.event([
            {
                nativeEvent: ({ state }) => block([
                    cond(
                        eq(state, State.END),
                        set(this.buttonOpacity, runTiming(new Clock(), 1, 0))
                    )
                ])
            }
        ]);

        this.buttonY = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [100, 0],
            extrapolate: Extrapolate.CLAMP,
        });

        this.bgY = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [-height/screenRatio - roundFix, 0],
            extrapolate: Extrapolate.CLAMP,
        });

        this.textInputZindex = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [1, -1],
            extrapolate: Extrapolate.CLAMP,
        });

        this.textInputY = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [0, 100],
            extrapolate: Extrapolate.CLAMP,
        });

        this.textInputOpacity = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [1, 0],
            extrapolate: Extrapolate.CLAMP,
        });
    }

    render() {
        return (
            <View style={ styles.container }>
                <Animated.View style={{ ...StyleSheet.absoluteFill, transform: [{ translateY: this.bgY }], flex: 1, alignItems: 'flex-start', }}>
                    <Svg height={height+roundFix} width={width}>
                        <ClipPath id={"clip"}>
                            <Circle r={height+roundFix} cx={width/2} />
                        </ClipPath>
                        <Image 
                            href={require('../assets/background.png')}
                            width={width}
                            height={height+roundFix}
                            preserveAspectRatio={'xMidYmid slice'}
                            clipPath={"#clip"}
                        />
                    </Svg>
                </Animated.View>

                <Text style={ styles.mainText }>Truth or Dare</Text>
                <View style={{ height: height/ screenRatio / 2 }}>
                    <TapGestureHandler onHandlerStateChange={this.onStateChange}>
                            <Animated.View style={{ ...styles.button, opacity: this.buttonOpacity, transform: [{
                                translateY: this.buttonY,
                            }] }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>SIGN IN</Text>
                            </Animated.View>
                    </TapGestureHandler>
                    <Animated.View
                        style={{
                            height: height/screenRatio,
                            ...StyleSheet.absoluteFill,
                            top: null,
                            justifyContent: 'center',
                            zIndex: this.textInputZindex,
                            opacity: this.textInputOpacity,
                            transform: [{ translateY: this.textInputY }]
                        }}>
                            <TextInput
                                placeholder={"Первый игрок"}
                                style={styles.textInput}
                                placeholderTextColor={"black"}
                            />
                            <TextInput
                                placeholder={"Второй игрок"}
                                style={styles.textInput}
                                placeholderTextColor={"black"}
                            />
                            <Animated.View
                                style={ styles.startButton }
                            >
                                <Text
                                    style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}
                                    onPress={() => Alert.alert('Simple Button pressed')}
                                >
                                    Начать
                                </Text>
                            </Animated.View>
                            
                    </Animated.View>
                </View>
            </View>
        );
    }
};

export default TruthApp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    button: {
        backgroundColor: 'white',
        height: 70,
        marginHorizontal: 20,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInput: {
        height: 80,
        borderRadius: 25, 
        borderWidth: 0.5,
        marginHorizontal: 20,
        paddingLeft: 10,
        marginVertical: 5,
        borderColor: 'rgba(0, 0, 0, 0.2)',
    },
    startButton: {
        backgroundColor: '#e52b50',
        height: 70,
        marginHorizontal: 20,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 2, height: 2 },
        shadowColor: 'black',
        shadowOpacity: 0.2,
    },
    mainText: {
        textAlign: 'center',
        fontSize: 40,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 400,
    }
});