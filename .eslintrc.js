module.exports = {
  "parser": "babel-eslint",
  "rules": {

    "indent": [2, 2],
    "linebreak-style": [2, "unix"],
    "semi": [2, "always"],
    "react/jsx-uses-react": 1,
    "react/jsx-uses-vars": 1,
    "react/jsx-no-duplicate-props": 2,
    'react/jsx-no-target-blank': 2,

    // Things that should be fixed
    'no-use-before-define': [1, { "functions": false }], // These seem worth fixing (no auto-fix :/ 95 occurances)
    'no-param-reassign': 1,
    'no-shadow': 1,
    'no-mixed-operators': 1,
    'react/no-did-update-set-state': 1,
    'react/no-did-mount-set-state': 1,
    'react/no-string-refs': 1,
    'prefer-rest-params': 1,
    'react/no-array-index-key': 1,
    'no-return-assign': 1,

    // Styling that I like (for good reasons)
    "quotes": [1, 'single', {avoidEscape: true}],
    'prefer-arrow-callback': 0, // I like this rule, but a lot of unit tests depend on `this`, ignore for now
    'arrow-body-style': [1, 'as-needed'],
    'import/prefer-default-export': 1,
    'dot-notation': 1,
    'prefer-template': 1,
    'space-infix-ops': 1,
    'curly': [1, 'multi-line'],
    'one-var-declaration-per-line': 0,
    'one-var': 0,
    'react/jsx-first-prop-new-line': [2, 'multiline'],
    'react/jsx-closing-bracket-location': 1,
    'react/jsx-indent-props': [2, 2],
    'react/jsx-indent': [2, 2],
    'no-spaced-func': 1,
    'func-call-spacing': 0, // Dup
    'comma-dangle': [1, 'always-multiline'],

    // Styling that I like (for arbitrary reasons)
    'max-len': [1, 120, {ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true, ignoreRegExpLiterals: true}],
    'quote-props': [1, 'as-needed'],
    'object-shorthand': 1,
    'space-in-parens': [1, 'never'],
    'padded-blocks': [1, 'never'],
    'comma-spacing': 1,
    'no-multi-spaces': 1,
    'key-spacing': [1, {beforeColon: false, afterColon: true}],
    'object-property-newline': 0,
    'space-before-blocks': [1, 'always'],
    'react/jsx-wrap-multilines': 1,
    'arrow-spacing': 1,
    'spaced-comment': 1,
    'no-else-return': 1,
    'keyword-spacing': 1, //There's a bunch of options for this


    // Things that don't really work for our code base or I don't want to do
    'func-names': 0,
    'import/extensions': [0, 'always'],
    'import/first': 0,
    'import/no-extraneous-dependencies': 0, // Doesn't like our import structure
    'import/no-unresolved': 0, // Doesn't like our import structure
    'react/jsx-filename-extension': 0,
    'consistent-return': 0, // Flow knows what each method can return so we can handle all cases
    'react/require-default-props': 0,
    'no-underscore-dangle': 0,

    // Talk about
    'no-plusplus': 0, // Might be good to talk abourt: https://github.com/airbnb/javascript#variables--unary-increment-decrement
    'no-unused-expressions': 0, // Not quite sure what this does
    'no-continue': 0,
    'no-prototype-builtins': 0,
    'react/sort-comp': 0, // Neat idea, but needs some config
    'react/jsx-boolean-value': 0, // Worth discussing. Hadn't thought of that syntax
    'import/no-named-as-default': 0,
    'react/jsx-no-bind': 0,
    'class-methods-use-this': 0, // Tells you to make everything static that doesn't reference `this`

    // Accessibility
    'jsx-a11y/no-static-element-interactions': 0, // This probably needs to be addressed sometime
    'jsx-a11y/href-no-hash': 0,
    'jsx-a11y/label-has-for': 0,
    'jsx-a11y/img-has-alt': 0,

    // Rules to turn on if devs whine about consistency
    'template-curly-spacing': [0, 'never'],
    "array-bracket-spacing": [0, "never"],
    'object-curly-spacing': [0, 'never'], // airbnb does always
    'react/jsx-space-before-closing': [0, 'always'], // Style, might be nice
    'react/jsx-tag-spacing': 0,
    'react/jsx-curly-spacing': [0, 'never'],
    'react/jsx-equals-spacing': [0, 'never'], // Style, I like it
    'jsx-quotes': [0, 'prefer-double'],
    'space-before-function-paren': [0, 'always'],
    'brace-style': [0, 'stroustrup'], // eslint uses 1tbs
    'arrow-parens': [0, 'as-needed'],
    'eol-last': 0,
    'default-case': 0,
    'block-spacing': 0,
    'no-lonely-if': 0, // Got tired of fixing these
  },
  "extends": "airbnb",

  "env": {
    "es6": true,
    "browser": true,
    "jasmine": true,
    "node": true,
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
      "experimentalObjectRestSpread": true,
    },
  },
  "plugins": [
    "react",
    "flowtype"
  ],
  "globals": {
    "jest": false,
    "T": false,
    "ReactComponent": false,
    "ReactElement": false,
    "React$Element": false,
    "SyntheticEvent": false,
    "SyntheticClipboardEvent": false,
    "SyntheticCompositionEvent": false,
    "SyntheticInputEvent": false,
    "SyntheticUIEvent": false,
    "SyntheticFocusEvent": false,
    "SyntheticKeyboardEvent": false,
    "SyntheticMouseEvent": false,
    "SyntheticDragEvent": false,
    "SyntheticWheelEvent": false,
    "SyntheticTouchEvent": false,
    "moment$Moment": false,
    "ReactWrapper": false,
    "ShallowWrapper": false,
    "Wrapper": false,
    "QUIQ": false,
  }
};
