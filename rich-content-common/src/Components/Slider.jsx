import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { mergeStyles } from '../Utils/mergeStyles';
import styles from '../Styles/slider.scss';

class Slider extends Component {

  static propTypes = {
    value: PropTypes.number.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    theme: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    dataHook: PropTypes.string,
    readOnly: PropTypes.bool,
    ariaProps: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = { value: props.value };
    this.styles = mergeStyles({ styles, theme: props.theme });
  }

  onChange(value) {
    this.setState({ value });
  }

  onKeyUp(event) {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowRight':
      case 'ArrowLeft':
      case 'Home':
      case 'End':
      case 'PageUp':
      case 'PageDown':
        this.props.onChange(event.target.valueAsNumber);
        break;
      default: return;
    }
  }

  render() {
    const { min, max, onChange, dataHook, readOnly, ariaProps } = this.props;
    const { value } = this.state;
    return (
      <input
        aria-valuemin={min} aria-valuemax={max} aria-valuenow={value} {...ariaProps}
        tabIndex={readOnly ? -1 : 0}
        type={'range'} className={this.styles.slider} data-hook={dataHook} onChange={e => this.onChange(e.target.valueAsNumber)}
        value={this.state.value} min={min} max={max} onMouseUp={e => onChange(e.target.valueAsNumber)} onKeyUp={e => this.onKeyUp(e)}
      />);
  }
}

export default Slider;
