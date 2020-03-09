import React, { Component } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image
} from 'react-native';
import {
  PanGestureHandler,
  NativeViewGestureHandler,
  State,
  TapGestureHandler
} from 'react-native-gesture-handler';
import FullMapComponent from './FullMapComponent';

const HEADER_HEIGHT = 50;
const windowHeight = Dimensions.get('window').height;
const SNAP_POINTS_FROM_TOP = [50, windowHeight * 0.4, windowHeight * 0.8];

export default class BottomSheet extends Component {
  masterdrawer = React.createRef();
  drawer = React.createRef();
  drawerheader = React.createRef();
  scroll = React.createRef();
  constructor(props) {
    super(props);
    const START = SNAP_POINTS_FROM_TOP[0];
    const END = SNAP_POINTS_FROM_TOP[SNAP_POINTS_FROM_TOP.length - 1];

    this.state = {
      lastSnap: END,
      plantedTrees: true,
      reforestationOpportunites: true,
      currentForest: true,
      desforestion: false
    };

    this._lastScrollYValue = 0;
    this._lastScrollY = new Animated.Value(0);
    this._onRegisterLastScroll = Animated.event(
      [{ nativeEvent: { contentOffset: { y: this._lastScrollY } } }],
      { useNativeDriver: true }
    );
    this._lastScrollY.addListener(({ value }) => {
      this._lastScrollYValue = value;
    });

    this._dragY = new Animated.Value(0);
    this._onGestureEvent = Animated.event(
      [{ nativeEvent: { translationY: this._dragY } }],
      { useNativeDriver: true }
    );

    this._reverseLastScrollY = Animated.multiply(
      new Animated.Value(-1),
      this._lastScrollY
    );

    this._translateYOffset = new Animated.Value(END);
    this._translateY = Animated.add(
      this._translateYOffset,
      Animated.add(this._dragY, this._reverseLastScrollY)
    ).interpolate({
      inputRange: [START, END],
      outputRange: [START, END],
      extrapolate: 'clamp'
    });
  }
  _onHeaderHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.oldState === State.BEGAN) {
      this._lastScrollY.setValue(0);
    }
    this._onHandlerStateChange({ nativeEvent });
  };
  _onHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      let { velocityY, translationY } = nativeEvent;
      translationY -= this._lastScrollYValue;
      const dragToss = 0.05;
      const endOffsetY =
        this.state.lastSnap + translationY + dragToss * velocityY;

      let destSnapPoint = SNAP_POINTS_FROM_TOP[0];
      for (let i = 0; i < SNAP_POINTS_FROM_TOP.length; i++) {
        const snapPoint = SNAP_POINTS_FROM_TOP[i];
        const distFromSnap = Math.abs(snapPoint - endOffsetY);
        if (distFromSnap < Math.abs(destSnapPoint - endOffsetY)) {
          destSnapPoint = snapPoint;
        }
      }
      this.setState({ lastSnap: destSnapPoint });
      this._translateYOffset.extractOffset();
      this._translateYOffset.setValue(translationY);
      this._translateYOffset.flattenOffset();
      this._dragY.setValue(0);
      Animated.spring(this._translateYOffset, {
        velocity: velocityY,
        tension: 68,
        friction: 12,
        toValue: destSnapPoint,
        useNativeDriver: true
      }).start();
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FullMapComponent
          isFullMapComponentModal={this.props.isFullMapComponentModal}
          toggleIsFullMapComp={this.props.toggleIsFullMapComp}
          navigation={this.props.navigation}
          userContributions={this.props.userContributions}
        />
        <TapGestureHandler
          maxDurationMs={100000}
          ref={this.masterdrawer}
          maxDeltaY={this.state.lastSnap - SNAP_POINTS_FROM_TOP[0]}
        >
          <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
            <Animated.View
              style={[
                StyleSheet.absoluteFillObject,
                {
                  transform: [{ translateY: this._translateY }]
                }
              ]}
            >
              <PanGestureHandler
                ref={this.drawerheader}
                simultaneousHandlers={[this.scroll, this.masterdrawer]}
                shouldCancelWhenOutside={false}
                onGestureEvent={this._onGestureEvent}
                onHandlerStateChange={this._onHeaderHandlerStateChange}
              >
                <Animated.View style={styles.header}>
                  <View style={styles.scrollTile} />
                </Animated.View>
              </PanGestureHandler>
              <PanGestureHandler
                ref={this.drawer}
                simultaneousHandlers={[this.scroll, this.masterdrawer]}
                shouldCancelWhenOutside={false}
                onGestureEvent={this._onGestureEvent}
                onHandlerStateChange={this._onHandlerStateChange}
              >
                <Animated.View style={styles.container}>
                  <NativeViewGestureHandler
                    ref={this.scroll}
                    waitFor={this.masterdrawer}
                    simultaneousHandlers={this.drawer}
                  >
                    <Animated.ScrollView
                      style={[
                        styles.scrollView,
                        { marginBottom: SNAP_POINTS_FROM_TOP[0] }
                      ]}
                      bounces={false}
                      onScrollBeginDrag={this._onRegisterLastScroll}
                      scrollEventThrottle={1}
                    >
                      {/* <BottomContent
                                            toggleSwitch={this.toggleSwitch}
                                            plantedTreesSwitchValue={this.state.plantedTrees}
                                            reforestationOppSwitchValue={
                                            this.state.reforestationOpportunites
                                            }
                                            currentForestSwitchValue={this.state.currentForest}
                                            desforestionSwitchValue={this.state.desforestion}
                                        /> */}
                    </Animated.ScrollView>
                  </NativeViewGestureHandler>
                </Animated.View>
              </PanGestureHandler>
            </Animated.View>
          </View>
        </TapGestureHandler>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollTile: {
    width: 100,
    height: 8,
    backgroundColor: 'white',
    borderRadius: 120,
    marginVertical: 5
  },
  scrollView: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: 'lightgray',
    borderWidth: 1
  }
});
