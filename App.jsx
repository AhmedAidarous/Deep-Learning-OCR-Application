
import React, { Component } from 'react';
import {
  StyleSheet,StatusBar,SafeAreaView,
  Text,Image,TextInput,
  View,Button,ActivityIndicator,ScrollView, Linking
} from 'react-native';


import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';





import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Fav from './src/screens/fav'

import Search from './src/screens/search'
import Profile from './src/screens/profile'
import commonStyles from './commonStyles';
import Icon from 'react-native-vector-icons/Ionicons';

const Drawer = createDrawerNavigator();
const DrawerNav = (props) => {
  return (
    <Drawer.Navigator
    initialRouteName="TabNav"
    drawerContent={props => <DrawerContent {...props} />}
    >
      <Drawer.Screen name='TabNav' component={TabNav} options={{title: 'Home'}} />
      <Drawer.Screen name='Profile' component={Profile} options={{title: 'My Profile'}} />
    </Drawer.Navigator>
  )
}


// To customize the appearance of the drawer, (the part of the app that slides right..) we will
// create the DrawerContent() method, which would do the job for us..

/**
 * The <DrawerContentScrollView {...props}> will hold all the menu items belonging to the drawer navigator,
 * This component allows the user to scroll the menu items even if there are too many..
 * 
 * Linking.openURL() will open a link to a specific website, you simply put in the URL inside of it, and it will
 * Take the user to that website..
 * 
 * <DrawerItemList> Contains the list of all the items in the DrawerContainer..
 * 
 * <<APPEARANCE CHANGE HERE!!!>>
 * 
 * NOTE: When using Linking.openURL() ensure you type the http / https, always!!!
 */
const DrawerContent = (props) => {
  return (
    <>    
        <View style={commonStyles.drawerHeader}>
          
          <Image source={require('./assets/profilePic.jpg')}
          
          style={commonStyles.drawerProfilePhoto} />
          <View style={styles.credentialContainer}>
          <Text style={styles.Profile_Name}>Ahmed AlAidarous</Text>
          <Text style={styles.Profile_Career}>Archeologist</Text>
          
          </View>
       
        </View>


        <DrawerContentScrollView {...props}>
          <DrawerItemList activeBackgroundColor={'transparent'} {...props} />
          <DrawerItem
            label="About"
            onPress={() => Linking.openURL('https://www.linkedin.com/in/ahmed-alaidarous-7332a6149/')}
          
          />
        </DrawerContentScrollView>
       </>)}



// Creating the Tab instance...
const Tab = createBottomTabNavigator();

// This is the JSX Bottom tab creator, this has all the icons and 
/**
 * The screenOptions attribute is what allows us to decorate the tabs below, it assigns the name of the icons
 * Depending on the situation, so if the route (the button's name) is say search, it will 
 * render the search icon ontop of the button, else 
 * 
 * 
 * 
 */
const TabNav = () => {
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({




          tabBarIcon: ({focused, color, size}) => {
            let iconName = 'logo-react';

            if (route.name === 'Search') {
              iconName = 'ios-search';
            } else if (route.name == 'Fav') {
              iconName = focused? 'ios-heart' : 'ios-heart-outline';
            }
            return <Icon name={iconName} size={size} color={color} />;
          }
       
       
       
       
       
        })}



        tabBarOptions={{
          activeTintColor: 'white',
          inactiveTintColor: 'gray',
          activeBackgroundColor: '#884EA0',
          inactiveBackgroundColor: '#C39BD3',
          safeAreaInsets: {bottom: 0},
          style: {height: 70},
          tabStyle: {paddingBottom: 15}
        }}
      > 

        <Tab.Screen name='Search' component={Search} />
        <Tab.Screen name='Fav' component={Fav} />
        
      </Tab.Navigator>

  );
}

class App extends Component{
 
 render()
 {
  // All navigation components should be within the navigtional Container component..
  return (
    <NavigationContainer>
      <StatusBar barStyle="default" backgroundColor="#7D3C98" />
      <DrawerNav />
    </NavigationContainer>
      
    );}}

const styles = StyleSheet.create({
  Profile_Name : {
    fontSize: 24,
    color:'white',
    textAlign:'center',
    fontWeight:'bold'
  },
  Profile_Career : {
    fontSize: 20,
    color:'white',
    textAlign:'center',
    fontWeight:'bold'

  },
  credentialContainer :{
  }

});


export default App;
