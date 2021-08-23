import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/header';
import commonStyles from '../../../commonStyles';

class Profle extends React.Component {
  
  render() {
    return (
      <>
        <SafeAreaView
          style={commonStyles.content}>
          <Header navigation={this.props.navigation} Title={'My Profile'} isAtRoot={true} />
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
          >
            
            <View style={[commonStyles.column, commonStyles.header]}>
              <Image style={commonStyles.logo} source={require('../../../assets/profilePic.jpg')} />
            </View>
            
            <View style={{minHeight: 10, maxHeight: 10}}></View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Name</Text>
              <Text>Ahmed AlAidarous</Text>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Gender</Text>
              <Text>Male</Text>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Age</Text>
              <Text>21</Text>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Description</Text>
              <Text>Out and about looking for dinosaur bones..!</Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  fieldGroup: {
    marginTop: 5,
    marginBottom: 10
  },
  label: {
    fontWeight: 'bold'
  },
  
});

export default (props) => {
  const navigation = useNavigation();
  return (
    <Profle {...props} navigation={navigation} />
  )
}
