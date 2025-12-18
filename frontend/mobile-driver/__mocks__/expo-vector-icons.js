const React = require('react');
const { View } = require('react-native');

const Icon = (props) => React.createElement(View, { ...props, testID: `icon-${props.name}` });

module.exports = {
    Ionicons: Icon,
    MaterialIcons: Icon,
    AntDesign: Icon,
    Entypo: Icon,
    FontAwesome: Icon,
};
