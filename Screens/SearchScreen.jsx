import React, { Component } from 'react';
import {
  StyleSheet,StatusBar,SafeAreaView,
  Text,Image,TextInput,
  View,Button,ActivityIndicator,ScrollView,TouchableOpacity
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import API from '../../lib/api'
import Helper from '../../lib/helper';
import Definition from '../../components/Definition';
import commonStyles from '../../../commonStyles';
import Header from '../../components/header'
import Icon from 'react-native-vector-icons/Ionicons';
import Camera, { Constants } from "../../components/camera";
import WordSelector from "../../components/wordSelector";




// This component will display the user's favourited words that he/she selected..
class SearchScreen extends Component{

    
    constructor(props){
        super(props);
        // The states AKA global variables...
        this.state = {
          userWord: '', 
          errorMsg: '', 
          loading: false, 
          definition: null, 
          showCamera: false, 
          showWordList: false, 
          recogonizedText: null};}
    

          
      onUserWordChange(Text) {
        this.setState({userWord: Text});
      }
    

      async onSearch() {
        // This will check if the user had keyed in the word to search by checking on userWord's variable
        // string length. 
        if (this.state.userWord.length <= 0){
          this.setState({errorMsg: 'Please specify the word to look up'})
          return;
        }
    
        // However if the user inputted something, then continue..
        try{
          this.setState({loading: true});
          // This will call the API function called getlemmas, and calls the await() function to simply wait for a response
          // from the API and if its a successfull operation, it will assign the result to the leemas variable.
          let lemmas = await API.getLemmas(this.state.userWord);
          console.log('Lemmas: ', lemmas);
          if(lemmas.success){
            // This will get the headword from the JSON result, from Oxford's API..
            let headWord = Helper.carefullyGetValue(lemmas, 
            ['payload', 
            'results', 
            '0', 
            'lexicalEntries', 
            '0', 
            'inflectionOf', 
            '0', 'id'], '');
            
    
            // If the headword is present, we will proceed to call the get definition function..
            if (headWord.length > 0){
              let wordDefinition = await API.getDefinition(headWord);
    
              // And finally if the returned word definition is valid, we will set the wordDefinition returned as the value for the definition state..
              if (wordDefinition.success){
                this.setState({errorMsg: '', loading: false, definition: wordDefinition.payload});
                console.log('Word Definition: ', wordDefinition.payload);
              }
    
              else {
                this.setState({errorMsg: 'Unable to get result from Oxford: ' + wordDefinition.message, loading: false, definition: null});
              }
            }
            else {
              this.setState({errorMsg: 'Invalid word. Please specify a valid word.', loading: false, definition: null});
            }
          }
          else {
            this.setState({errorMsg: 'Unable to get result from Oxford: ' + lemmas.message, loading: false, definition: null});
          }
        // Finally, if there is an error we've encountered, then it will be handled by the following catch block..
        }catch (error) {
          console.log('Error: ', error);
          this.setState({loading: false, errorMsg: error.message, definition: null});
        }
      }


      // this method will handle the camera component on the capture event. 



      onOCRCapture(data, recogonizedText,algorithm) {
        // Will perform different tasks depending on the algorithm selected..
        if (algorithm === "OCR"){
          this.setState({showCamera: false, showWordList: 
          Helper.isNotNullAndUndefined(recogonizedText), 
          recogonizedText: recogonizedText});}



          
        else{
          // This is variable that will pretty much display the SOM predicted letter on the screen..
          const recognizedLetters = "R"
          this.setState({showCamera: false,
                          // were making showWordList be a boolean value because if its true, it means we have something to display...
                         showWordList: Helper.isNotNullAndUndefined(recognizedLetters),
                         recogonizedText: recognizedLetters});}}






    // This will handle the word selected by the user, via the WordSelector Component where once the user
    // clicks on the word defined, it will perform a word search on that word selected and wait 500ms, so that the request
    // from the API Dictionary can be fulfilled...
    
    
    
    onWordSelected(word) {
      console.log("Word has been selected..")
    this.setState({showWordList: false, userWord: word});
    if(word.length > 0) {
      setTimeout(() => {
        this.onSearch();
      }, 500);}}
      


    render() {
    
      return (
        <>
         <StatusBar barStyle="dark-content" backgroundColor="#7D3C98"/>
            <SafeAreaView>
          <Header navigation={this.props.navigation} Title={'My Dictionary'} isAtRoot={true} />
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
          style={commonStyles.scrollView}>
    
          <View style={[commonStyles.column, commonStyles.header]}>
          <Image style={commonStyles.logo} source={require('../../../assets/Brother_Eye_Logo.png')} />
          <Text style={commonStyles.sectionTitle}>Brother Eye</Text>
          </View>
    
    
    <View style={StyleSheet.searhBox}>
        <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, paddingLeft: 4, paddingRight: 4}}
        placeholder={'Key in the word to search'}
        value={this.state.userWord}
        onChangeText={text => this.onUserWordChange(text)}
    
        />


        <TouchableOpacity style={styles.searchCamera} onPress={() => {
          this.setState({showCamera: true});
        }}>
          <Icon name="ios-camera" size={35} color="#7D3C98"/>
          </TouchableOpacity> 




        </View>
  
    
    
    
        <View style={{minHeight: 10, maxHeight: 10}}></View>
    
    
        <Button
          title= "Search"
          color='purple'
          onPress={() => this.onSearch()} />

      
    
      {
        this.state.errorMsg.length > 0 && 
        <Text style={commonStyles.errMsg}>{this.state.errorMsg}</Text>}
    
         {/* Display word definition as custom component */}
         
         <View>
         <Text>
         <Definition def={this.state.definition} />
         </Text>
         </View>
         
        </ScrollView>
        </SafeAreaView>
        {

          // Display the camera to capture text


          this.state.showCamera &&
          <Camera
            cameraType={Constants.Type.back}
            flashMode={Constants.FlashMode.off}
            autoFocus={Constants.AutoFocus.on}
            whiteBalance={Constants.WhiteBalance.auto}
            ratio={'4:3'}
            quality={0.5}
            imageWidth={800}
            enabledOCR={true}
            onCapture={(
            data, 
            recogonizedText,
            algorithm) => this.onOCRCapture(data, recogonizedText,algorithm)} 
            onClose={_ => {
              this.setState({showCamera: false});
            }}
          />


        }


        {/**This component will be triggered once the camera has been closed.... */}
        {


          // Display the words that have been captured by the camera depending on the algorithm used..
          this.state.showWordList &&
          <WordSelector wordBlock={this.state.recogonizedText} onWordSelected={(word) => this.onWordSelected(word)} />
        
        
        
        }

      
      {
        this.state.loading &&
        <ActivityIndicator style={commonStyles.loading} size="large" color={'#7D3C98'} />
    
      }
        
    
    </>
      );
    
    
    
    }
}



export default (props) => {
  const navigation = useNavigation();
  return (
    <SearchScreen {...props} navigation={navigation} />
  )
}


const styles = StyleSheet.create({
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1, 
    paddingLeft: 4, 
    paddingRight: 4, 
    paddingTop: 2, 
    paddingBottom: 2
  },
  searchInput: {
    padding: 0,
    flex: 1
  },

  // Camera icon style
  searchCamera: {
    maxWidth: 50,
    marginLeft: 5,
    padding: 0,
    alignSelf: 'center'
  }
});











