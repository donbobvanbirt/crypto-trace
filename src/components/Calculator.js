import React, { Component, PropTypes } from 'react';
import { View, TouchableHighlight, Text, TextInput } from 'react-native';
// import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import GiftedSpinner from 'react-native-gifted-spinner';

import styles from '../styles';

export default class Calculator extends Component {
  constructor() {
    super();
    this.state = {
      value1: '1',
      value2: null,
      premium: '0',
    };
    this.enterVal1 = this.enterVal1.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { price } = nextProps;
    if (price) {
      const { last } = price;
      const { premium, value1 } = this.state;
      let prem = parseFloat(premium);
      if (!prem) { prem = 0; }
      const rate = parseFloat(last);
      const currentPrice = rate + (rate * (prem / 100));
      const newVal2 = (Math.round(
        (parseFloat(value1) * currentPrice) * this.props.roundFactor2
      ) / this.props.roundFactor2).toString();
      this.setState({
        value2: newVal2,
      });
    }
  }

  enterVal1(val) {
    const { last } = this.props.price;
    const { roundFactor2 } = this.props;
    const { premium } = this.state;
    let prem = parseFloat(premium);
    if (!prem) { prem = 0; }
    const rate = parseFloat(last);
    const price = rate + (rate * (prem / 100));
    let value2 = (Math.round((parseFloat(val) * price) * roundFactor2) / roundFactor2).toString();
    if (value2 === 'NaN') { value2 = '0'; }
    this.setState({
      value1: val,
      value2,
    });
  }

  enterVal2(val) {
    const { last } = this.props.price;
    const { roundFactor1 } = this.props;
    const { premium } = this.state;
    let prem = parseFloat(premium);
    if (!prem) { prem = 0; }
    const rate = parseFloat(last);
    const price = rate + (rate * (prem / 100));
    let value1 = (Math.round((parseFloat(val) / price) * roundFactor1) / roundFactor1).toString();
    if (value1 === 'NaN') { value1 = '0'; }
    this.setState({
      value1,
      value2: val,
    });
  }

  enterPremium(premium) {
    const { value1 } = this.state;
    const { roundFactor2 } = this.props;
    const { last } = this.props.price;
    let prem = parseFloat(premium);
    if (!prem) { prem = 0; }
    const rate = parseFloat(last);
    const price = rate + (rate * (prem / 100));
    let newVal2 = (Math.round(
      (parseFloat(value1) * price) * roundFactor2
    ) / roundFactor2).toString();
    if (newVal2 === 'NaN') { newVal2 = '0'; }
    this.setState({
      premium,
      value2: newVal2,
    });
  }

  render() {
    const { value1, value2, premium } = this.state;
    const { price, fetchPrice, val1Label, val2Label, isLoading } = this.props;

    if (isLoading) {
      return (
        <View style={styles.spinnerContainer}>
          <GiftedSpinner />
        </View>
      );
    }

    const valueOne = value1;
    const valueTwo = value2 === null ? price.last : value2;
    const refreshIcon = (<Icon name="refresh" style={styles.refreshText} size={20} />);

    return (
      <View style={styles.container}>
        <TouchableHighlight style={styles.refresh} onPress={fetchPrice}>
          {refreshIcon}
        </TouchableHighlight>
        <View style={styles.body}>
          <View style={styles.calcInputContainer}>
            <TextInput style={styles.calcInput} value={valueOne} keyboardType="numeric" onChangeText={val => this.enterVal1(val)} />
            <Text style={styles.assetLabel}>{val1Label}</Text>
            <TextInput style={styles.calcInput} value={valueTwo} keyboardType="numeric" onChangeText={val => this.enterVal2(val)} />
            <Text style={styles.assetLabel}>{val2Label}</Text>
            <View style={styles.premiumView}>
              <Text style={styles.premiumSymbols}>+/-</Text>
              <TextInput style={styles.premiumInput} value={premium} keyboardType="numeric" onChangeText={val => this.enterPremium(val)} />
              <Text style={styles.premiumSymbols}>%</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

Calculator.propTypes = {
  price: PropTypes.object,
  fetchPrice: PropTypes.func,
  val1Label: PropTypes.string,
  val2Label: PropTypes.string,
  roundFactor1: PropTypes.number,
  roundFactor2: PropTypes.number,
  isLoading: PropTypes.bool,
};
