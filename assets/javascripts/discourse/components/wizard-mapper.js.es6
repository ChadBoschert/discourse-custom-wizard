import { getOwner } from 'discourse-common/lib/get-owner';
import { newInput, selectionTypes } from '../lib/wizard-mapper';
import { default as discourseComputed, observes, on } from 'discourse-common/utils/decorators';
import { gt } from "@ember/object/computed";
import Component from "@ember/component";
import { A } from "@ember/array";

export default Component.extend({
  classNames: 'wizard-mapper',
  hasInput: gt('inputs.length', 0),
  
  @discourseComputed('options.singular', 'hasInput')
  canAdd(singular, hasInput) {
    return !singular || !hasInput;
  },
  
  @discourseComputed('options.@each.inputType')
  inputOptions(options) {
    let result = {
      inputTypes: options.inputTypes || 'conditional,assignment',
      inputConnector: options.inputConnector || 'or',
      pairConnector: options.pairConnector || null,
      outputConnector: options.outputConnector || null,
      context: options.context || null
    }
        
    let inputTypes = ['key', 'value', 'output'];
    inputTypes.forEach(type => {
      result[`${type}Placeholder`] = options[`${type}Placeholder`] || null;
      result[`${type}DefaultSelection`] = options[`${type}DefaultSelection`] || null;
    });
    
    selectionTypes.forEach(type => {
      if (options[`${type}Selection`] !== undefined) {
        result[`${type}Selection`] = options[`${type}Selection`]
      } else {
        result[`${type}Selection`] = type === 'text' ? true : false;
      }
    });
                    
    return result;
  },

  actions: {
    add() {
      if (!this.get('inputs')) {
        this.set('inputs', A());
      }

      this.get('inputs').pushObject(
        newInput(this.inputOptions, this.inputs.length)
      );
    },

    remove(input) {
      const inputs = this.inputs;
      inputs.removeObject(input);
            
      if (inputs.length) {
        inputs[0].set('connector', null);
      }
    }
  }
});
